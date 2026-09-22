import Link from "next/link";
import { Mic } from "lucide-react";

export function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="flex items-center gap-2">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-sm">
        <Mic size={16} strokeWidth={2.5} />
      </span>
      <span className="text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        MockMate
      </span>
    </Link>
  );
}
