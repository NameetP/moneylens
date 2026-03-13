"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Loader2, Send } from "lucide-react";

interface Props {
  defaultAmount: number;
}

const salaryRanges = [
  "AED 5,000 – 10,000",
  "AED 10,000 – 20,000",
  "AED 20,000 – 35,000",
  "AED 35,000 – 50,000",
  "AED 50,000+",
];

const tenures = ["12 months", "24 months", "36 months", "48 months", "60 months"];

export function LoanForm({ defaultAmount }: Props) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [refId, setRefId] = useState("");
  const [consent, setConsent] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    employer: "",
    salaryRange: salaryRanges[1],
    desiredAmount: defaultAmount.toString(),
    tenure: tenures[2],
  });

  const update = (field: string, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) return;
    setSubmitting(true);

    const res = await fetch("/api/submit-loan-lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setRefId(data.referenceId);
    setSubmitted(true);
    setSubmitting(false);
  };

  if (submitted) {
    return (
      <motion.div
        className="text-center py-16"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <CheckCircle className="w-16 h-16 text-[#0F766E] mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2 text-[#1C1917]" style={{ fontFamily: "var(--font-jakarta)" }}>
          🎉 Application Submitted!
        </h2>
        <p className="text-[#57534E] mb-4">
          A personal loan specialist will contact you within 24 hours.
        </p>
        <p className="text-sm text-[#A8A29E]">Reference: {refId}</p>
      </motion.div>
    );
  }

  const inputClasses =
    "w-full px-4 py-2.5 bg-white border-2 border-[#E7E5E4] rounded-2xl text-sm text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none focus:ring-2 focus:ring-[#C2410C]/10 focus:border-[#C2410C] transition-all";

  return (
    <div>
      <h2 className="text-2xl font-extrabold mb-1 tracking-[-0.03em] text-[#1C1917]" style={{ fontFamily: "var(--font-jakarta)" }}>
        📝 Get a Better Rate
      </h2>
      <p className="text-[#78716C] text-sm mb-8">
        Fill in your details and we&apos;ll connect you with the best personal loan offers.
      </p>

      <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-[#57534E] mb-1.5 font-medium">Full Name</label>
            <input type="text" required value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Ahmed Al Maktoum" className={inputClasses} />
          </div>
          <div>
            <label className="block text-xs text-[#57534E] mb-1.5 font-medium">Phone</label>
            <input type="tel" required value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+971 50 123 4567" className={inputClasses} />
          </div>
        </div>

        <div>
          <label className="block text-xs text-[#57534E] mb-1.5 font-medium">Email</label>
          <input type="email" required value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="ahmed@email.com" className={inputClasses} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-[#57534E] mb-1.5 font-medium">Employer</label>
            <input type="text" required value={form.employer} onChange={(e) => update("employer", e.target.value)} placeholder="Company name" className={inputClasses} />
          </div>
          <div>
            <label className="block text-xs text-[#57534E] mb-1.5 font-medium">Salary Range</label>
            <select value={form.salaryRange} onChange={(e) => update("salaryRange", e.target.value)} className={`${inputClasses} appearance-none`}>
              {salaryRanges.map((r) => (<option key={r} value={r}>{r}</option>))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-[#57534E] mb-1.5 font-medium">Desired Amount (AED)</label>
            <input type="number" required value={form.desiredAmount} onChange={(e) => update("desiredAmount", e.target.value)} className={inputClasses} />
          </div>
          <div>
            <label className="block text-xs text-[#57534E] mb-1.5 font-medium">Tenure</label>
            <select value={form.tenure} onChange={(e) => update("tenure", e.target.value)} className={`${inputClasses} appearance-none`}>
              {tenures.map((t) => (<option key={t} value={t}>{t}</option>))}
            </select>
          </div>
        </div>

        <label className="flex items-start gap-3 pt-2 cursor-pointer">
          <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 w-4 h-4 rounded border-[#D6D3D1] text-[#0F766E] focus:ring-[#0F766E] accent-[#0F766E]" />
          <span className="text-xs text-[#78716C] leading-relaxed">
            I consent to being contacted by personal loan providers. My information will be shared with licensed UAE financial institutions for the purpose of loan comparison.
          </span>
        </label>

        <button
          type="submit"
          disabled={!consent || submitting}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#C2410C] hover:bg-[#9A3412] text-white font-semibold rounded-full transition-colors disabled:opacity-50 disabled:pointer-events-none"
          style={{ boxShadow: "var(--shadow-terra)" }}
        >
          {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Send className="w-4 h-4" />Submit Application</>}
        </button>
      </form>
    </div>
  );
}
