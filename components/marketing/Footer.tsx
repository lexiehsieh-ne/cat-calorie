import Link from "next/link";
import { KeyRound, Utensils } from "lucide-react";
import { CatMark } from "@/components/CatMark";

const NAV_LINKS = [
  { href: "#features", label: "功能介紹" },
  { href: "#how-it-works", label: "使用方式" },
  { href: "#faq", label: "常見問題" },
];

export function MarketingFooter() {
  return (
    <footer className="bg-foreground text-background">
      <div className="mx-auto grid max-w-5xl gap-10 px-6 py-14 sm:grid-cols-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-background/10 text-gold-soft">
              <CatMark className="h-5 w-5" />
            </span>
            <span className="font-display text-lg font-black">PawCal</span>
          </div>
          <p className="mt-3 max-w-xs text-sm leading-6 text-background/70">
            用 AI 為你的貓咪計算每日所需熱量，並提供符合 AAFCO 與 NRC 標準的飲食建議。
          </p>
        </div>

        <div>
          <h3 className="text-sm font-bold text-background/50">網站導覽</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-background/80 transition-colors hover:text-background"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <Link
                href="/calculator"
                className="flex items-center gap-2 text-background/80 transition-colors hover:text-background"
              >
                <Utensils className="h-4 w-4" />
                開始計算熱量
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold text-background/50">帳號設定</h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link
                href="/settings"
                className="flex items-center gap-2 text-background/80 transition-colors hover:text-background"
              >
                <KeyRound className="h-4 w-4" />
                API Key 設定
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-background/10 px-6 py-5 text-center text-xs text-background/50">
        © {new Date().getFullYear()} PawCal．熱量與飲食建議僅供參考，並非獸醫診斷或處方。
      </div>
    </footer>
  );
}
