import Link from "next/link";
import { Shield } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-[#E7E5E4] bg-[#FAF7F2]">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-[#A8A29E]">
            <Shield className="w-3.5 h-3.5 text-[#0F766E]" />
            <span>Your data is processed and never stored.</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-5 text-xs text-[#A8A29E]">
            <Link href="/privacy" className="hover:text-[#57534E] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-[#57534E] transition-colors">
              Terms of Service
            </Link>
            <span>© {new Date().getFullYear()} MoneyLens</span>
          </div>
        </div>

        <p className="text-[10px] text-[#D6D3D1] text-center mt-5 leading-relaxed max-w-2xl mx-auto">
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
