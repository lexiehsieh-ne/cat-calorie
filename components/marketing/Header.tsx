import Link from "next/link";
import { Logo } from "@/components/Logo";

const NAV_LINKS = [
  { href: "#features", label: "功能" },
  { href: "#how-it-works", label: "使用方式" },
  { href: "#faq", label: "常見問題" },
];

export function MarketingHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/70 bg-white/70 backdrop-blur-md dark:border-zinc-800/70 dark:bg-black/70">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Logo />

        <nav className="hidden items-center gap-8 text-sm font-medium text-zinc-600 md:flex dark:text-zinc-400">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-50"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <Link
          href="/interview"
          className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          開始使用
        </Link>
      </div>
    </header>
  );
}
