"use client";

import { motion, type Variants } from "framer-motion";
import { ArrowRight, Clock, CreditCard, Percent, Shield } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/Logo";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

const valueProps = [
  {
    icon: Clock,
    title: "60-Second Analysis",
    description:
      "Upload your statement, get a complete breakdown of where every dirham goes.",
  },
  {
    icon: CreditCard,
    title: "Better Card Match",
    description:
      "See which UAE credit cards would save you more based on your actual spending.",
  },
  {
    icon: Percent,
    title: "See True Interest Cost",
    description:
      "Carrying a balance? See exactly what it costs you and how to reduce it.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-5xl mx-auto w-full border-b border-gray-100">
        <Logo />
        <Link
          href="/analyze"
          className="text-sm text-[#525252] hover:text-[#0a0a0a] transition-colors font-medium"
        >
          Get Started
        </Link>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center px-6 pt-16 sm:pt-24 pb-24 bg-gradient-to-b from-white to-[#fafafa]">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#f5f5f4] border border-[#e5e5e5] text-xs text-[#525252] mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-pulse" />
            Works with all major UAE banks
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-[-0.02em] leading-[1.1] mb-6 text-[#0a0a0a]"
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            Your money has a leak.{" "}
            <span className="text-[#059669]">Find it in 60 seconds.</span>
          </motion.h1>

          <motion.p
            className="text-lg text-[#525252] mb-10 max-w-lg mx-auto leading-relaxed"
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            Upload your UAE credit card statement. See where your money goes.
            Get matched to better cards.
          </motion.p>

          <motion.div
            custom={3}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            <Link
              href="/analyze"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#059669] hover:bg-[#047857] text-white font-semibold rounded-2xl transition-all text-lg group shadow-lg shadow-[#059669]/20 hover:shadow-xl hover:shadow-[#059669]/25"
            >
              Scan My Statement
              <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* Value Props */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto mt-24 w-full"
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.1, delayChildren: 0.5 } },
          }}
        >
          {valueProps.map((prop) => (
            <motion.div
              key={prop.title}
              className="flex flex-col items-center text-center p-6 rounded-2xl bg-white border border-[#e5e5e5] shadow-sm hover:shadow-md transition-shadow"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
              }}
            >
              <div className="w-10 h-10 rounded-xl bg-[#ecfdf5] flex items-center justify-center mb-4">
                <prop.icon className="w-5 h-5 text-[#059669]" />
              </div>
              <h3 className="font-semibold mb-2 text-[#0a0a0a]">{prop.title}</h3>
              <p className="text-sm text-[#737373]">{prop.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Trust bar */}
        <motion.div
          className="flex items-center gap-2 mt-16 text-sm text-[#a3a3a3] bg-[#f5f5f4] px-4 py-2 rounded-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <Shield className="w-4 h-4" />
          Your statement is processed and deleted. We never store your financial
          data.
        </motion.div>
      </main>
    </div>
  );
}
