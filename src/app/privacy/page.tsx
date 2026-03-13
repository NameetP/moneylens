import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Footer } from "@/components/Footer";

export default function PrivacyPage() {
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
          Privacy Policy
        </h1>

        <div className="prose prose-sm prose-neutral max-w-none space-y-6 text-[#525252]">
          <section>
            <h2 className="text-lg font-semibold text-[#0a0a0a]">
              How We Handle Your Data
            </h2>
            <p>
              MoneyLens is built with a privacy-first architecture. When you
              upload a credit card statement:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Your PDF is processed on our server to extract transaction data.
              </li>
              <li>
                The extracted data is returned to your browser and stored only in
                your browser&apos;s session storage.
              </li>
              <li>
                We do <strong>not</strong> store your statement PDF, transaction
                data, or any financial information on our servers.
              </li>
              <li>
                When you close the browser tab, all data is permanently deleted
                from your device.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#0a0a0a]">
              Loan Applications
            </h2>
            <p>
              If you choose to submit a loan application through MoneyLens, the
              information you provide (name, phone, email, employer, salary
              range, desired amount, tenure) will be shared with licensed UAE
              financial institutions for the purpose of loan comparison and
              contact. This data is shared only with your explicit consent.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#0a0a0a]">
              Affiliate Relationships
            </h2>
            <p>
              MoneyLens may earn commissions when you apply for credit cards
              through our affiliate links. This does not affect our
              recommendations — cards are ranked solely based on how well they
              match your spending pattern.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#0a0a0a]">
              No Accounts or Tracking
            </h2>
            <p>
              MoneyLens does not require you to create an account. We do not use
              cookies for tracking. We do not sell or share your data with third
              parties except as described in the Loan Applications section above.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#0a0a0a]">Contact</h2>
            <p>
              For questions about this privacy policy, contact us at{" "}
              <a
                href="mailto:hello@moneylens.ae"
                className="text-[#059669] hover:underline"
              >
                hello@moneylens.ae
              </a>
              .
            </p>
          </section>

          <p className="text-xs text-[#a3a3a3]">Last updated: March 2026</p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
