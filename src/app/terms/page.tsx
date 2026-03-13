import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Footer } from "@/components/Footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-[#fafafa]">
      <nav className="flex items-center justify-between px-6 py-4 max-w-5xl mx-auto w-full border-b border-[#e5e5e5]">
        <Logo />
        <Link
          href="/"
          className="flex items-center gap-1 text-sm text-[#525252] hover:text-[#0a0a0a] transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
      </nav>

      <main className="flex-1 px-6 py-12 max-w-2xl mx-auto w-full">
        <h1 className="text-3xl font-bold tracking-[-0.02em] text-[#0a0a0a] mb-8">
          Terms of Service
        </h1>

        <div className="prose prose-sm prose-neutral max-w-none space-y-6 text-[#525252]">
          <section>
            <h2 className="text-lg font-semibold text-[#0a0a0a]">
              Service Description
            </h2>
            <p>
              MoneyLens is a free credit card statement analysis tool that helps
              UAE residents understand their spending patterns, compare credit
              cards, and evaluate debt consolidation options.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#0a0a0a]">
              Not Financial Advice
            </h2>
            <p>
              MoneyLens is <strong>not</strong> a licensed financial advisor. All
              spending analysis, card recommendations, and debt calculations are
              provided for informational purposes only. They should not be
              considered as financial advice. Always consult a qualified
              financial advisor before making financial decisions.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#0a0a0a]">
              Accuracy
            </h2>
            <p>
              While we strive for accuracy, transaction categorization is
              automated and may not be 100% correct. Credit card reward rates and
              terms are subject to change by the issuing banks. We recommend
              verifying all information directly with the bank before applying
              for any financial product.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#0a0a0a]">
              Supported Banks
            </h2>
            <p>
              MoneyLens currently supports statement parsing for Emirates NBD
              credit card statements. Support for additional UAE banks is being
              developed. Unsupported statement formats will display sample data
              with a clear notice.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#0a0a0a]">
              Liability
            </h2>
            <p>
              MoneyLens is provided &quot;as is&quot; without warranty. We are
              not liable for any decisions made based on the analysis provided by
              this tool. Use at your own discretion.
            </p>
          </section>

          <p className="text-xs text-[#a3a3a3]">Last updated: March 2026</p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
