import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  ListChecks,
  MessagesSquare,
  Sparkles,
} from "lucide-react";
import { MarketingHeader } from "@/components/marketing/Header";
import { MarketingFooter } from "@/components/marketing/Footer";

const FEATURES = [
  {
    icon: ListChecks,
    title: "貼合職缺的題目",
    description: "貼上職缺描述，AI 會依據所需技能與經驗，量身設計面試問題。",
  },
  {
    icon: MessagesSquare,
    title: "追問式對話",
    description: "AI 面試官會根據你的回答持續追問，模擬真實面試的臨場感。",
  },
  {
    icon: BarChart3,
    title: "即時評分",
    description: "面試結束立即取得 0-100 分的整體評分與優缺點分析。",
  },
  {
    icon: Sparkles,
    title: "逐題優化建議",
    description: "針對每一題提供更好的回答範例，幫助你下次表現得更好。",
  },
];

const STEPS = [
  {
    number: "01",
    title: "輸入職缺描述",
    description: "貼上你要應徵的職缺內容，並選擇想練習的題數。",
  },
  {
    number: "02",
    title: "進行模擬問答",
    description: "AI 面試官逐題提問，你可以像真實面試一樣輸入回答。",
  },
  {
    number: "03",
    title: "取得評分與建議",
    description: "完成後立即獲得總評分、優缺點分析，以及逐題的改進建議。",
  },
];

const FAQS = [
  {
    question: "這個服務會用到我的履歷或個人資料嗎？",
    answer:
      "不會。你只需要輸入職缺描述，所有問答都在當次瀏覽器工作階段中進行，不會儲存個人資料。",
  },
  {
    question: "可以練習任何職缺類型嗎？",
    answer:
      "可以，只要輸入該職缺的描述內容，AI 會依據內容中的技能與職責自動調整問題方向。",
  },
  {
    question: "評分和建議是如何產生的？",
    answer:
      "系統會將完整的問答紀錄交給 AI 模型分析，依回答品質、與職缺的契合度與表達清晰度給出評分與建議，僅供參考。",
  },
];

export default function LandingPage() {
  return (
    <>
      <MarketingHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(99,102,241,0.15),transparent)]"
          />
          <div className="mx-auto grid max-w-6xl gap-12 px-6 py-24 md:grid-cols-2 md:items-center md:py-32">
            <div className="animate-fade-up flex flex-col gap-6">
              <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 dark:border-indigo-900 dark:bg-indigo-950 dark:text-indigo-300">
                <Sparkles size={14} />
                由 AI 驅動的面試教練
              </span>
              <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl dark:text-zinc-50">
                在正式面試前，
                <br />
                先跟 AI 練一輪。
              </h1>
              <p className="max-w-md text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
                貼上職缺描述，MockMate 會為你量身出題、追問、並在結束後給出評分與逐題優化建議。
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/interview"
                  className="group inline-flex items-center gap-2 rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-300"
                >
                  免費開始模擬面試
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </Link>
                <a
                  href="#how-it-works"
                  className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
                >
                  了解運作方式
                </a>
              </div>
            </div>

            <div className="animate-fade-up [animation-delay:150ms]">
              <div className="rounded-2xl border border-zinc-200 bg-white/80 p-4 shadow-xl shadow-indigo-100/50 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/80 dark:shadow-none">
                <div className="flex items-center gap-1.5 px-2 pb-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                </div>
                <div className="flex flex-col gap-3 p-2">
                  <div className="self-start rounded-2xl rounded-tl-sm bg-zinc-100 px-4 py-2.5 text-sm text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100">
                    請分享一次你在專案中排解重大技術問題的經驗。
                  </div>
                  <div className="self-end rounded-2xl rounded-tr-sm bg-zinc-900 px-4 py-2.5 text-sm text-white dark:bg-zinc-100 dark:text-zinc-900">
                    之前系統在高流量時出現延遲，我先透過監控找出瓶頸...
                  </div>
                  <div className="self-start rounded-2xl rounded-tl-sm bg-zinc-100 px-4 py-2.5 text-sm text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100">
                    很好，那你後來如何驗證問題已經解決？
                  </div>
                  <div className="mt-1 flex items-center gap-2 rounded-xl border border-dashed border-zinc-300 px-4 py-3 text-xs text-zinc-400 dark:border-zinc-700">
                    <BarChart3 size={14} />
                    面試結束後將產生評分與建議
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="border-t border-zinc-200 bg-zinc-50 py-24 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mx-auto max-w-xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                為你的面試量身打造
              </h2>
              <p className="mt-3 text-zinc-600 dark:text-zinc-400">
                不只是隨機題庫，MockMate 針對每個職缺與每次回答動態調整。
              </p>
            </div>

            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {FEATURES.map((feature) => (
                <div
                  key={feature.title}
                  className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white">
                    <feature.icon size={18} />
                  </span>
                  <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="py-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mx-auto max-w-xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                三個步驟，開始練習
              </h2>
              <p className="mt-3 text-zinc-600 dark:text-zinc-400">
                從輸入職缺到拿到回饋，全程只需幾分鐘。
              </p>
            </div>

            <div className="mt-14 grid gap-8 md:grid-cols-3">
              {STEPS.map((step) => (
                <div key={step.number} className="flex flex-col gap-3">
                  <span className="text-3xl font-bold text-transparent [-webkit-text-stroke:1.5px_theme(colors.indigo.400)] dark:[-webkit-text-stroke:1.5px_theme(colors.indigo.500)]">
                    {step.number}
                  </span>
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="border-t border-zinc-200 bg-zinc-50 py-24 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mx-auto max-w-3xl px-6">
            <h2 className="text-center text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              常見問題
            </h2>

            <div className="mt-10 flex flex-col divide-y divide-zinc-200 dark:divide-zinc-800">
              {FAQS.map((faq) => (
                <details key={faq.question} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between text-left font-medium text-zinc-900 dark:text-zinc-100">
                    {faq.question}
                    <span className="ml-4 shrink-0 text-zinc-400 transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 py-24">
          <div className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-700 px-8 py-16 text-center shadow-xl">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_60%)]"
            />
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              準備好接受挑戰了嗎？
            </h2>
            <p className="mx-auto mt-3 max-w-md text-indigo-100">
              現在就輸入你的目標職缺，讓 AI 面試官陪你練到有信心為止。
            </p>
            <Link
              href="/interview"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-indigo-700 transition-transform hover:scale-105"
            >
              免費開始模擬面試
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </>
  );
}
