import Link from "next/link";
import { Logo } from "@/components/Logo";

export function MarketingFooter() {
  return (
    <footer className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-black">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12 md:flex-row md:items-start md:justify-between">
        <div className="flex flex-col gap-3">
          <Logo />
          <p className="max-w-xs text-sm text-zinc-500 dark:text-zinc-400">
            用 AI 打造專屬的模擬面試官，讓你在正式面試前反覆練習、越戰越強。
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          <div className="flex flex-col gap-3">
            <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              產品
            </span>
            <a
              href="#features"
              className="text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
            >
              功能介紹
            </a>
            <a
              href="#how-it-works"
              className="text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
            >
              使用方式
            </a>
            <Link
              href="/interview"
              className="text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
            >
              開始模擬面試
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              資源
            </span>
            <a
              href="#faq"
              className="text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
            >
              常見問題
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-zinc-200 px-6 py-6 text-center text-xs text-zinc-400 dark:border-zinc-800 dark:text-zinc-600">
        © {new Date().getFullYear()} MockMate. 本產品為練習用途，回饋內容由 AI 生成，僅供參考。
      </div>
    </footer>
  );
}
