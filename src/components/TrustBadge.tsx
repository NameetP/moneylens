import { Lock } from "lucide-react";

export function TrustBadge() {
  return (
    <div className="flex items-center gap-1.5 text-xs text-[#A1A1AA]">
      <Lock className="w-3 h-3 text-[#0A6E3F]" />
      <span>256-bit encrypted</span>
    </div>
  );
}
