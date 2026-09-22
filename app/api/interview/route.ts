import { NextResponse } from "next/server";
import { openai, OPENAI_MODEL } from "@/lib/openai";
import {
  MAX_TOTAL_QUESTIONS,
  MIN_TOTAL_QUESTIONS,
  type InterviewFinalResponse,
  type InterviewQuestionResponse,
  type InterviewRequest,
  type InterviewTurn,
  type QuestionFeedback,
} from "@/lib/interview-types";

export async function POST(request: Request) {
  let body: InterviewRequest;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "無效的請求內容" }, { status: 400 });
  }

  const jobDescription = body.jobDescription?.trim();
  const history: InterviewTurn[] = Array.isArray(body.history) ? body.history : [];
  const totalQuestions = Number(body.totalQuestions);

  if (!jobDescription) {
    return NextResponse.json({ error: "請提供職缺描述" }, { status: 400 });
  }

  if (
    !Number.isInteger(totalQuestions) ||
    totalQuestions < MIN_TOTAL_QUESTIONS ||
    totalQuestions > MAX_TOTAL_QUESTIONS
  ) {
    return NextResponse.json(
      { error: `題數需為 ${MIN_TOTAL_QUESTIONS} 到 ${MAX_TOTAL_QUESTIONS} 之間的整數` },
      { status: 400 }
    );
  }

  const questionsAsked = history.filter((t) => t.role === "interviewer").length;
  const answersGiven = history.filter((t) => t.role === "candidate").length;

  try {
    if (questionsAsked >= totalQuestions && answersGiven >= totalQuestions) {
      const result = await generateFinalEvaluation(jobDescription, history, totalQuestions);
      return NextResponse.json(result);
    }

    const nextQuestionNumber = questionsAsked + 1;
    const result = await generateQuestion(
      jobDescription,
      history,
      nextQuestionNumber,
      totalQuestions
    );
    return NextResponse.json(result);
  } catch (error) {
    console.error("[/api/interview] OpenAI request failed:", error);
    return NextResponse.json(
      { error: "呼叫 OpenAI API 時發生錯誤，請稍後再試" },
      { status: 502 }
    );
  }
}

function transcriptText(history: InterviewTurn[]): string {
  if (history.length === 0) return "（尚無對話紀錄）";
  return history
    .map((turn) =>
      turn.role === "interviewer"
        ? `面試官問題：${turn.content}`
        : `應徵者回答：${turn.content}`
    )
    .join("\n\n");
}

async function generateQuestion(
  jobDescription: string,
  history: InterviewTurn[],
  questionNumber: number,
  totalQuestions: number
): Promise<InterviewQuestionResponse> {
  const systemPrompt = `你是一位經驗豐富的技術／職務面試官，正在針對以下職缺描述面試一位應徵者：

職缺描述：
"""
${jobDescription}
"""

面試共會進行 ${totalQuestions} 題。這是第 ${questionNumber} 題。
規則：
- 每次只問「一個」問題，問題需切合職缺描述所需的技能或特質。
- 若已有先前的問答紀錄，請根據應徵者先前的回答調整或深入追問，避免重複問一樣的問題。
- 問題請使用繁體中文，語氣專業且友善，長度約 1-3 句話。
- 僅輸出 JSON，格式為 {"question": "問題內容"}，不要有其他文字。`;

  const completion = await openai.chat.completions.create({
    model: OPENAI_MODEL,
    temperature: 0.7,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: `目前為止的面試紀錄：\n${transcriptText(history)}\n\n請提出第 ${questionNumber} 題。`,
      },
    ],
  });

  const raw = completion.choices[0]?.message?.content ?? "{}";
  const parsed = JSON.parse(raw) as { question?: string };

  if (!parsed.question) {
    throw new Error("模型未回傳有效的問題內容");
  }

  return {
    type: "question",
    questionNumber,
    question: parsed.question,
  };
}

async function generateFinalEvaluation(
  jobDescription: string,
  history: InterviewTurn[],
  totalQuestions: number
): Promise<InterviewFinalResponse> {
  const questions = history.filter((t) => t.role === "interviewer");
  const answers = history.filter((t) => t.role === "candidate");

  const systemPrompt = `你是一位經驗豐富的技術／職務面試官，剛完成針對以下職缺的模擬面試：

職缺描述：
"""
${jobDescription}
"""

以下是完整的面試問答紀錄（共 ${totalQuestions} 題），請根據應徵者的回答品質、與職缺的契合度、表達清晰度等面向進行評分與建議。
請僅輸出 JSON，格式為：
{
  "score": 0 到 100 的整數,
  "summary": "整體表現總評，2-3 句話",
  "strengths": ["優點1", "優點2", ...],
  "improvements": ["整體建議1", "整體建議2", ...],
  "perQuestionFeedback": [
    { "comment": "針對第1題回答的簡短評語", "betterAnswer": "針對第1題，一個更好的回答範例" },
    ... 依序，長度需等於 ${totalQuestions}
  ]
}
內容請使用繁體中文，不要輸出 JSON 以外的文字。`;

  const completion = await openai.chat.completions.create({
    model: OPENAI_MODEL,
    temperature: 0.5,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: `完整面試紀錄：\n${transcriptText(history)}\n\n請給出評分與建議。`,
      },
    ],
  });

  const raw = completion.choices[0]?.message?.content ?? "{}";
  const parsed = JSON.parse(raw) as {
    score?: number;
    summary?: string;
    strengths?: string[];
    improvements?: string[];
    perQuestionFeedback?: { comment?: string; betterAnswer?: string }[];
  };

  const perQuestionFeedback = parsed.perQuestionFeedback ?? [];

  const questionFeedback: QuestionFeedback[] = questions.map((q, i) => ({
    questionNumber: i + 1,
    question: q.content,
    answer: answers[i]?.content ?? "",
    comment: perQuestionFeedback[i]?.comment ?? "",
    betterAnswer: perQuestionFeedback[i]?.betterAnswer ?? "",
  }));

  return {
    type: "final",
    score: typeof parsed.score === "number" ? parsed.score : 0,
    summary: parsed.summary ?? "",
    strengths: parsed.strengths ?? [],
    improvements: parsed.improvements ?? [],
    questionFeedback,
  };
}
