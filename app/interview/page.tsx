"use client";

import { useState } from "react";
import { ArrowRight, RotateCcw, Sparkles } from "lucide-react";
import { Logo } from "@/components/Logo";
import type {
  InterviewFinalResponse,
  InterviewResponse,
  InterviewTurn,
} from "@/lib/interview-types";
import {
  DEFAULT_TOTAL_QUESTIONS,
  MAX_TOTAL_QUESTIONS,
  MIN_TOTAL_QUESTIONS,
} from "@/lib/interview-types";

type Stage = "setup" | "interviewing" | "finished";

export default function InterviewPage() {
  const [jobDescription, setJobDescription] = useState("");
  const [totalQuestions, setTotalQuestions] = useState(DEFAULT_TOTAL_QUESTIONS);
  const [stage, setStage] = useState<Stage>("setup");
  const [history, setHistory] = useState<InterviewTurn[]>([]);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<InterviewFinalResponse | null>(null);

  const questionsAsked = history.filter((t) => t.role === "interviewer").length;
  const progressPercent = Math.min(100, (questionsAsked / totalQuestions) * 100);

  async function callInterviewApi(nextHistory: InterviewTurn[]) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription, totalQuestions, history: nextHistory }),
      });
      const data = (await res.json()) as InterviewResponse | { error: string };

      if (!res.ok || "error" in data) {
        setError("error" in data ? data.error : "發生未知錯誤");
        return;
      }

      if (data.type === "question") {
        setHistory([...nextHistory, { role: "interviewer", content: data.question }]);
        setStage("interviewing");
      } else {
        setHistory(nextHistory);
        setResult(data);
        setStage("finished");
      }
    } catch {
      setError("網路錯誤，請確認伺服器是否正常運作");
    } finally {
      setLoading(false);
    }
  }

  function handleStart() {
    if (!jobDescription.trim()) {
      setError("請先輸入職缺描述");
      return;
    }
    if (
      !Number.isInteger(totalQuestions) ||
      totalQuestions < MIN_TOTAL_QUESTIONS ||
      totalQuestions > MAX_TOTAL_QUESTIONS
    ) {
      setError(`題數需為 ${MIN_TOTAL_QUESTIONS} 到 ${MAX_TOTAL_QUESTIONS} 之間的整數`);
      return;
    }
    callInterviewApi([]);
  }

  function handleSubmitAnswer() {
    if (!answer.trim()) {
      setError("請輸入回答內容");
      return;
    }
    const nextHistory: InterviewTurn[] = [
      ...history,
      { role: "candidate", content: answer.trim() },
    ];
    setAnswer("");
    callInterviewApi(nextHistory);
  }

  function handleRestart() {
    setJobDescription("");
    setTotalQuestions(DEFAULT_TOTAL_QUESTIONS);
    setStage("setup");
    setHistory([]);
    setAnswer("");
    setError(null);
    setResult(null);
  }

  return (
    <div className="flex min-h-full flex-1 flex-col bg-zinc-50 dark:bg-black">
      <header className="border-b border-zinc-200 bg-white/70 backdrop-blur-md dark:border-zinc-800 dark:bg-black/70">
        <div className="mx-auto flex h-16 max-w-3xl items-center px-6">
          <Logo />
        </div>
      </header>

      <main className="flex flex-1 justify-center px-4 py-12">
        <div className="w-full max-w-2xl">
          <div className="mb-8 flex flex-col items-center gap-2 text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 dark:border-indigo-900 dark:bg-indigo-950 dark:text-indigo-300">
              <Sparkles size={14} />
              AI 模擬面試
            </span>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              開始你的模擬面試
            </h1>
          </div>

          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
              {error}
            </div>
          )}

          {stage === "setup" && (
            <section className="flex flex-col gap-5 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  請輸入職缺描述
                </label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  rows={6}
                  placeholder="例如：我們正在招募一位前端工程師，需熟悉 React、TypeScript，並具備 3 年以上開發經驗..."
                  className="w-full resize-none rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:ring-indigo-950"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  面試題數（{MIN_TOTAL_QUESTIONS}-{MAX_TOTAL_QUESTIONS} 題）
                </label>
                <input
                  type="number"
                  min={MIN_TOTAL_QUESTIONS}
                  max={MAX_TOTAL_QUESTIONS}
                  value={totalQuestions}
                  onChange={(e) => setTotalQuestions(Number(e.target.value))}
                  className="w-28 rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:ring-indigo-950"
                />
              </div>

              <button
                onClick={handleStart}
                disabled={loading}
                className="group mt-1 inline-flex items-center justify-center gap-2 self-start rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-transform hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
              >
                {loading ? "產生題目中..." : "開始面試"}
                {!loading && (
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                )}
              </button>
            </section>
          )}

          {stage === "interviewing" && (
            <section className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-sm text-zinc-500 dark:text-zinc-400">
                  <span>
                    第 {questionsAsked} / {totalQuestions} 題
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-600 transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                {history.map((turn, i) => (
                  <div
                    key={i}
                    className={
                      turn.role === "interviewer"
                        ? "self-start rounded-2xl rounded-tl-sm bg-zinc-100 px-4 py-2.5 text-sm text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
                        : "self-end rounded-2xl rounded-tr-sm bg-gradient-to-br from-indigo-500 to-violet-600 px-4 py-2.5 text-sm text-white"
                    }
                  >
                    {turn.content}
                  </div>
                ))}
              </div>

              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                rows={4}
                placeholder="請輸入你的回答..."
                className="w-full resize-none rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:ring-indigo-950"
              />
              <button
                onClick={handleSubmitAnswer}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 self-start rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-transform hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
              >
                {loading ? "處理中..." : "送出回答"}
              </button>
            </section>
          )}

          {stage === "finished" && result && (
            <section className="flex flex-col gap-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex flex-col items-center gap-1">
                <span className="text-sm text-zinc-500 dark:text-zinc-400">總體評分</span>
                <span className="bg-gradient-to-br from-indigo-500 to-violet-600 bg-clip-text text-5xl font-bold text-transparent">
                  {result.score}
                  <span className="text-xl text-zinc-400"> / 100</span>
                </span>
              </div>

              <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                {result.summary}
              </p>

              <div>
                <h2 className="mb-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  優點
                </h2>
                <ul className="list-inside list-disc space-y-1 text-sm text-zinc-700 dark:text-zinc-300">
                  {result.strengths.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="mb-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  整體建議
                </h2>
                <ul className="list-inside list-disc space-y-1 text-sm text-zinc-700 dark:text-zinc-300">
                  {result.improvements.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  逐題回顧與建議回答
                </h2>
                <div className="flex flex-col gap-4">
                  {result.questionFeedback.map((qf) => (
                    <div
                      key={qf.questionNumber}
                      className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800"
                    >
                      <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                        第 {qf.questionNumber} 題：{qf.question}
                      </p>
                      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                        你的回答：{qf.answer}
                      </p>
                      {qf.comment && (
                        <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">
                          評語：{qf.comment}
                        </p>
                      )}
                      {qf.betterAnswer && (
                        <p className="mt-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          建議回答方式：{qf.betterAnswer}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={handleRestart}
                className="inline-flex items-center gap-2 self-start rounded-full border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-800"
              >
                <RotateCcw size={14} />
                重新開始
              </button>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
