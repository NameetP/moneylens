"use client";

import Link from "next/link";
import { Eye } from "lucide-react";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 group">
      <div className="w-8 h-8 rounded-lg bg-[#ecfdf5] flex items-center justify-center group-hover:bg-[#d1fae5] transition-colors">
        <Eye className="w-4 h-4 text-[#059669]" />
      </div>
      <span className="text-lg font-semibold tracking-tight text-[#0a0a0a]">
        Money<span className="text-[#059669]">Lens</span>
      </span>
    </Link>
  );
}
