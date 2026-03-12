"use client";

import Link from "next/link";
import { Eye } from "lucide-react";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 group">
      <div className="w-8 h-8 rounded-lg bg-[#22c55e]/10 flex items-center justify-center group-hover:bg-[#22c55e]/20 transition-colors">
        <Eye className="w-4 h-4 text-[#22c55e]" />
      </div>
      <span className="text-lg font-semibold tracking-tight">
        Money<span className="text-[#22c55e]">Lens</span>
      </span>
    </Link>
  );
}
