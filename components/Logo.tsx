import Link from "next/link";
import { CatMark } from "@/components/CatMark";

export function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="flex items-center gap-2">
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-soft text-gold">
        <CatMark className="h-5 w-5" />
      </span>
      <span className="font-display text-lg font-black text-foreground">
        PawCal
      </span>
    </Link>
  );
}
