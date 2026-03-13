"use client";

import { Lock } from "lucide-react";

export function TrustBadge() {
  return (
    <div className="flex items-center gap-1.5 text-xs text-[#737373]">
      <Lock className="w-3 h-3 text-[#059669]" />
      <span>256-bit encrypted</span>
    </div>
  );
}
