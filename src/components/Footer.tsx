import Link from "next/link";
import { Shield } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-[#e5e5e5] bg-[#fafafa]">
      <div className="max-w-5xl mx-auto px-6 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-[#a3a3a3]">
            <Shield className="w-3.5 h-3.5" />
            <span>Your data is processed and never stored.</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-[#a3a3a3]">
            <Link
              href="/privacy"
              className="hover:text-[#525252] transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="hover:text-[#525252] transition-colors"
            >
              Terms of Service
            </Link>
            <span>© {new Date().getFullYear()} MoneyLens</span>
          </div>
        </div>

        <p className="text-[10px] text-[#d4d4d4] text-center mt-4 leading-relaxed max-w-2xl mx-auto">
          MoneyLens is not a licensed financial advisor. Card recommendations
          and debt calculations are for informational purposes only. Always
          consult a qualified financial advisor before making financial
          decisions. We may earn commissions from affiliate partnerships.
          Compliant with UAE Personal Data Protection Law (Federal Decree-Law No. 45 of 2021).
        </p>
      </div>
    </footer>
  );
}
