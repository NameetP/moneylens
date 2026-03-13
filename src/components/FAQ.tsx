"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "Is my bank statement data safe?",
    answer:
      "Yes. Your PDF is processed on our server and immediately deleted. We extract only transaction amounts and merchant names \u2014 we never see your card number, account number, or personal details. Nothing is stored after your analysis is complete.",
  },
  {
    question: "Do you need my bank login or credentials?",
    answer:
      "No. We never ask for your bank login, password, or any credentials. You simply upload the PDF statement that your bank sends you. That\u2019s it.",
  },
  {
    question: "Which banks are supported?",
    answer:
      "We currently support Emirates NBD credit card statements. Support for FAB, ADCB, HSBC, Mashreq, DIB, RAK Bank, CBD, and Standard Chartered is coming soon.",
  },
  {
    question: "How do you make money?",
    answer:
      "We earn affiliate commissions when you apply for a credit card through our links. This is at no extra cost to you. Our recommendations are ranked solely by your spending match \u2014 not by commission rates.",
  },
  {
    question: "Is this really free?",
    answer:
      "Yes, completely free. No hidden fees, no premium tier, no credit card required. Upload your statement and get your full analysis instantly.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <div className="w-full">
      <div className="text-center mb-10">
        <p className="text-sm font-semibold text-[#C2410C] tracking-wide uppercase mb-3">FAQ</p>
        <h2
          className="text-2xl sm:text-3xl font-extrabold tracking-[-0.03em] text-[#1C1917]"
          style={{ fontFamily: "var(--font-jakarta)" }}
        >
          Common questions
        </h2>
      </div>
      <div className="divide-y divide-[#E7E5E4] border-t border-b border-[#E7E5E4]">
        {faqs.map((faq, i) => (
          <div key={i}>
            <button
              onClick={() => toggle(i)}
              className="w-full py-5 flex items-center justify-between text-left cursor-pointer group"
            >
              <span className="text-[15px] font-semibold text-[#1C1917] pr-4 group-hover:text-[#C2410C] transition-colors">
                {faq.question}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-[#A8A29E] shrink-0 transition-transform duration-200 ${
                  openIndex === i ? "rotate-180 text-[#C2410C]" : ""
                }`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-200 ${
                openIndex === i ? "max-h-48 pb-5" : "max-h-0"
              }`}
            >
              <p className="text-sm text-[#78716C] leading-relaxed">
                {faq.answer}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
