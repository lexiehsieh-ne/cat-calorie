import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createOpenAIClient, OPENAI_MODEL } from "@/lib/openai";
import { API_KEY_HEADER } from "@/lib/constants";
import {
  ENVIRONMENT_LABELS,
  MAX_FOLLOWUP_QUESTIONS,
  type CalorieRequest,
  type CalorieResponse,
  type CalorieResultResponse,
  type CalorieTurn,
  type CatProfile,
  type FoodSuggestion,
} from "@/lib/calorie-types";

export async function POST(request: Request) {
  const apiKey = request.headers.get(API_KEY_HEADER)?.trim();

  if (!apiKey) {
    return NextResponse.json(
      { error: "請先在設定頁面輸入你的 OpenAI API Key" },
      { status: 401 }
    );
  }

  let body: CalorieRequest;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "無效的請求內容" }, { status: 400 });
  }

  const profile = body.profile;
  const history: CalorieTurn[] = Array.isArray(body.history) ? body.history : [];

  if (!profile?.breed?.trim()) {
    return NextResponse.json({ error: "請提供貓咪品種" }, { status: 400 });
  }
  if (!Number.isFinite(profile.ageValue) || profile.ageValue <= 0) {
    return NextResponse.json({ error: "請提供有效的年齡" }, { status: 400 });
  }
  if (profile.ageUnit !== "years" && profile.ageUnit !== "months") {
    return NextResponse.json({ error: "年齡單位不正確" }, { status: 400 });
  }
  if (!ENVIRONMENT_LABELS[profile.environment]) {
    return NextResponse.json({ error: "飼養環境不正確" }, { status: 400 });
  }

  const openai = createOpenAIClient(apiKey);
  const questionsAsked = history.filter((t) => t.role === "assistant").length;

  try {
    if (questionsAsked >= MAX_FOLLOWUP_QUESTIONS) {
      const result = await generateFinalResult(openai, profile, history);
      return NextResponse.json(result);
    }

    const next = await generateNextStep(openai, profile, history);
    return NextResponse.json(next);
  } catch (error) {
    console.error("[/api/calories] OpenAI request failed:", error);

    if (error instanceof OpenAI.APIError && error.status === 401) {
      return NextResponse.json(
        { error: "OpenAI API Key 無效，請至設定頁面確認你的 Key" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "呼叫 OpenAI API 時發生錯誤，請稍後再試" },
      { status: 502 }
    );
  }
}

function profileSummary(profile: CatProfile): string {
  const age = `${profile.ageValue} ${profile.ageUnit === "years" ? "歲" : "個月"}`;
  return `- 品種：${profile.breed}\n- 年齡：${age}\n- 飼養環境：${ENVIRONMENT_LABELS[profile.environment]}`;
}

const BODY_CONDITION_INSTRUCTION = `貓咪體態（過瘦／理想／過重）的判斷方式：
絕對不要直接問使用者「你的貓咪體態是過胖、理想還是過瘦？」這類主觀自評問題，因為飼主自我評估通常不準確。
你應該改為詢問客觀的身體檢查描述，例如（擇一、依對話進度挑最需要的一項詢問）：
- 「從正上方看貓咪，牠的腰部兩側是否有明顯的腰身內縮？」
- 「用手輕壓貓咪的肋骨附近，能不能清楚摸到肋骨？摸起來是否有一層明顯脂肪覆蓋？」
- 「貓咪的腹部是否有下垂、明顯脂肪墊或鬆垮的情況？」
根據使用者對這些具體描述的回答，由你自行判斷貓咪的身體狀況評分（Body Condition Score），並將此判斷結果用於熱量計算與 basis 說明中，不要直接採用使用者自己認定的胖瘦標籤。`;

const TAIWAN_BRAND_REFERENCE = `台灣網購（momo購物網、PChome 24h 購物等）可購得，且官方網站明確標示配方符合美國 AAFCO 貓咪營養標準的品牌參考（飲食建議只能從以下品牌中選擇，不可推薦清單以外的品牌）：
1. Royal Canin 法國皇家（royalcanin.com 官網標示符合 AAFCO 貓咪營養標準）— 依生命階段與需求分幼貓/室內成貓/高齡貓等系列；乾糧熱量約落在 340-380 大卡/100克，主食濕糧餐包約 80-100 大卡/85克
2. Hill's Science Diet 希爾思（hillspet.com 官網標示符合 AAFCO 貓咪營養標準）— 依生命階段分幼貓/成貓/高齡貓系列；乾糧熱量約落在 370-400 大卡/100克，主食罐頭約 90-110 大卡/82克
3. ORIJEN 渴望（Champion Petfoods，orijenpetfoods.com 官網標示符合 AAFCO 貓咪營養標準）— 高蛋白無穀配方，乾糧熱量約落在 400-420 大卡/100克
4. Purina Pro Plan 冠能（purina.com 官網標示符合 AAFCO 貓咪營養標準）— 依生命階段分幼貓/成貓/絕育貓系列；乾糧熱量約落在 380-400 大卡/100克，主食餐包約 80-100 大卡/85克

請依貓咪的生命階段與需求，從上述品牌中挑選一款乾糧與一款濕糧（若適合），並依每日熱量需求換算出大約的每日餵食份量（克數，四捨五入到整數）。務必在 foodSuggestions 的 note 欄位提醒：實際熱量密度依產品配方而異，請以商品包裝標示的餵食建議為準。`;

function baseSystemPrompt(profile: CatProfile): string {
  return `你是一位專業的貓咪營養顧問，擅長依據美國飼料管理協會（AAFCO）貓咪營養標準，以及美國國家研究委員會（NRC）《Nutrient Requirements of Dogs and Cats》中的能量需求公式，為貓咪計算每日所需熱量並提供飲食建議。

貓咪基本資料：
${profileSummary(profile)}

為了準確計算靜止能量需求（RER，公式為 70 × 體重(kg)^0.75）並依生命階段、絕育狀態、活動量、體態調整為每日維持能量需求（MER），你通常還需要知道：體重（公斤）、是否已絕育、體態評估（見下方判斷方式）、活動量、目前飲食方式，以及是否有特殊健康狀況（如腎臟病、糖尿病、甲狀腺疾病等）。

${BODY_CONDITION_INSTRUCTION}`;
}

function resultJsonSchemaDescription(): string {
  return `{
  "type": "result",
  "dailyCalories": 每日所需熱量的整數（大卡 kcal）,
  "lifeStage": "生命階段，例如：幼貓成長期 / 成貓維持期 / 高齡貓",
  "basis": "簡短說明計算依據，2-3 句話，需提及 RER/MER 計算方式、你判斷出的體態評估，以及所依據的 NRC / AAFCO 標準",
  "activityRecommendation": "依生命階段、體態與飼養環境給出的具體活動量建議，例如每天玩耍次數、時長與方式",
  "feedingGuidelines": ["具體飲食建議1", "具體飲食建議2", ...],
  "nutrientNotes": ["依生命階段對應的 AAFCO 營養素重點1", "重點2", ...],
  "foodSuggestions": [
    { "brand": "品牌名稱", "productType": "產品系列/類型，例如：室內成貓乾糧", "form": "dry 或 wet", "dailyPortion": "約 XX 克/天", "note": "官網標示符合 AAFCO 標準等說明，並提醒以包裝標示為準" }
  ],
  "cautions": ["缺失資訊所採用的假設、注意事項，或建議諮詢獸醫的提醒", ...]
}`;
}

async function generateNextStep(
  openai: OpenAI,
  profile: CatProfile,
  history: CalorieTurn[]
): Promise<CalorieResponse> {
  const systemPrompt = `${baseSystemPrompt(profile)}

你的任務分兩階段：
1. 收集資訊：若上述關鍵資訊尚未透過對話取得，請「每次只問一個」最關鍵、最需要優先確認的問題（type: "question"）。
2. 完成計算：一旦你認為資訊已足夠計算每日熱量需求與飲食建議，請直接給出最終結果（type: "result"）。若仍有次要資訊缺失，可採用該情境下合理保守的假設，並在 cautions 中說明。

規則：
- 最多可以問 ${MAX_FOLLOWUP_QUESTIONS} 個問題，請把握機會優先詢問對計算影響最大的資訊（尤其是體重）。
- 問題須簡短明確、易於使用者回答，使用繁體中文。
- 僅輸出 JSON，不要有其他文字，格式為以下兩者之一：
  { "type": "question", "question": "問題內容" }
  或
  ${resultJsonSchemaDescription()}

${TAIWAN_BRAND_REFERENCE}`;

  const completion = await openai.chat.completions.create({
    model: OPENAI_MODEL,
    temperature: 0.4,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: systemPrompt },
      ...history.map((turn) => ({ role: turn.role, content: turn.content })),
      {
        role: "user",
        content:
          history.length === 0
            ? "請根據以上貓咪基本資料，決定下一步：提出第一個問題，或直接給出結果。"
            : "請根據以上對話紀錄，決定下一步：提出下一個問題，或直接給出結果。",
      },
    ],
  });

  return parseCalorieResponse(completion.choices[0]?.message?.content ?? "{}");
}

async function generateFinalResult(
  openai: OpenAI,
  profile: CatProfile,
  history: CalorieTurn[]
): Promise<CalorieResultResponse> {
  const systemPrompt = `${baseSystemPrompt(profile)}

已經詢問足夠次數的問題，現在無論資訊是否完整，你都必須直接計算並給出最終結果，不可以再提出問題。若有資訊缺失，請採用該情境下合理保守的假設，並在 cautions 中明確說明。

僅輸出 JSON，不要有其他文字，格式為：
${resultJsonSchemaDescription()}

${TAIWAN_BRAND_REFERENCE}`;

  const completion = await openai.chat.completions.create({
    model: OPENAI_MODEL,
    temperature: 0.4,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: systemPrompt },
      ...history.map((turn) => ({ role: turn.role, content: turn.content })),
      { role: "user", content: "請直接給出最終的每日熱量與飲食建議結果。" },
    ],
  });

  const parsed = parseCalorieResponse(completion.choices[0]?.message?.content ?? "{}");
  return parsed.type === "result" ? parsed : toFallbackResult(parsed.question);
}

function toFallbackResult(note?: string): CalorieResultResponse {
  return {
    type: "result",
    dailyCalories: 0,
    lifeStage: "",
    basis: "模型未能提供完整的計算結果，請重新嘗試。",
    activityRecommendation: "",
    feedingGuidelines: [],
    nutrientNotes: [],
    foodSuggestions: [],
    cautions: note ? [note] : [],
  };
}

type RawCalorieJson = {
  type?: string;
  question?: string;
  dailyCalories?: number;
  lifeStage?: string;
  basis?: string;
  activityRecommendation?: string;
  feedingGuidelines?: string[];
  nutrientNotes?: string[];
  foodSuggestions?: Partial<FoodSuggestion>[];
  cautions?: string[];
};

function parseCalorieResponse(raw: string): CalorieResponse {
  const parsed = JSON.parse(raw) as RawCalorieJson;

  if (parsed.type === "question" && parsed.question) {
    return { type: "question", question: parsed.question };
  }

  const foodSuggestions: FoodSuggestion[] = (parsed.foodSuggestions ?? []).map((s) => ({
    brand: s.brand ?? "",
    productType: s.productType ?? "",
    form: s.form === "wet" ? "wet" : "dry",
    dailyPortion: s.dailyPortion ?? "",
    note: s.note ?? "",
  }));

  return {
    type: "result",
    dailyCalories: typeof parsed.dailyCalories === "number" ? parsed.dailyCalories : 0,
    lifeStage: parsed.lifeStage ?? "",
    basis: parsed.basis ?? "",
    activityRecommendation: parsed.activityRecommendation ?? "",
    feedingGuidelines: parsed.feedingGuidelines ?? [],
    nutrientNotes: parsed.nutrientNotes ?? [],
    foodSuggestions,
    cautions: parsed.cautions ?? [],
  };
}
