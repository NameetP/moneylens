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
      <nav className="flex items-center justify-between px-6 py-4 max-w-5xl mx-auto w-full">
        <Logo />
        <Link
          href="/analyze"
          className="text-sm text-zinc-400 hover:text-white transition-colors"
        >
          Get Started
        </Link>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center px-6 pt-16 sm:pt-24 pb-24">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-400 mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />
            Works with all major UAE banks
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-6"
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            Your money has a leak.{" "}
            <span className="text-[#22c55e]">Find it in 60 seconds.</span>
          </motion.h1>

          <motion.p
            className="text-lg text-zinc-400 mb-10 max-w-lg mx-auto"
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
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#22c55e] hover:bg-[#16a34a] text-black font-semibold rounded-xl transition-colors text-lg group"
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
              className="flex flex-col items-center text-center p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/50"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
              }}
            >
              <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center mb-4">
                <prop.icon className="w-5 h-5 text-[#22c55e]" />
              </div>
              <h3 className="font-semibold mb-2">{prop.title}</h3>
              <p className="text-sm text-zinc-500">{prop.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Trust bar */}
        <motion.div
          className="flex items-center gap-2 mt-16 text-sm text-zinc-600"
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
