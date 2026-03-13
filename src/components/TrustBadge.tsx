import { Lock } from "lucide-react";

export function TrustBadge() {
  return (
    <div className="flex items-center gap-1.5 text-xs text-[#A8A29E]">
      <Lock className="w-3 h-3 text-[#0F766E]" />
      <span>256-bit encrypted</span>
    </div>
  );
}
