"use client";

import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 group">
      <div className="w-8 h-8 rounded-full bg-[#C2410C] flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="8" cy="8" r="6" stroke="white" strokeWidth="1.5" fill="none" />
          <circle cx="8" cy="8" r="2.5" fill="white" />
          <line x1="12" y1="4" x2="14" y2="2" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
      <span
        className="text-lg font-bold tracking-[-0.02em]"
        style={{ fontFamily: "var(--font-jakarta)" }}
      >
        <span className="text-[#1C1917]">Money</span>
        <span className="text-[#C2410C]">Lens</span>
      </span>
    </Link>
  );
}
