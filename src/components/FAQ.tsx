"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "Is my bank statement data safe?",
    answer:
      "Yes. Your PDF is processed on our server and immediately deleted. We extract only transaction amounts and merchant names — we never see your card number, account number, or personal details. Nothing is stored after your analysis is complete.",
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
      "We earn affiliate commissions when you apply for a credit card through our links. This is at no extra cost to you. Our recommendations are ranked solely by your spending match — not by commission rates.",
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
    <div className="max-w-2xl mx-auto mt-24 w-full">
      <h2 className="text-2xl font-bold text-center mb-8 tracking-[-0.02em] text-[#0a0a0a]">
        Common questions
      </h2>
      <div className="divide-y divide-[#e5e5e5]">
        {faqs.map((faq, i) => (
          <div key={i}>
            <button
              onClick={() => toggle(i)}
              className="w-full py-4 flex items-center justify-between text-left cursor-pointer group"
            >
              <span className="text-[15px] font-medium text-[#0a0a0a] pr-4 group-hover:text-[#059669] transition-colors">
                {faq.question}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-[#a3a3a3] shrink-0 transition-transform duration-200 ${
                  openIndex === i ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-200 ${
                openIndex === i ? "max-h-48 pb-4" : "max-h-0"
              }`}
            >
              <p className="text-sm text-[#737373] leading-relaxed">
                {faq.answer}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
