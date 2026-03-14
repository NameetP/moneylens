"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowRight, Check, CreditCard, TrendingDown, Shield, Lock, ChevronRight, Sparkles, Eye } from "lucide-react";

/* ═══════════════════════════════════════════════════════════════
   OPTION A — MIDNIGHT SAPPHIRE
   Dark navy + electric blue + gold accents
   Revolut × Linear × Mercury
   ═══════════════════════════════════════════════════════════════ */

function MidnightSapphire() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [counts, setCounts] = useState({ statements: 0, savings: 0, cards: 0 });

  useEffect(() => {
    const duration = 2000;
    const start = Date.now();
    const targets = { statements: 2800, savings: 4200, cards: 32 };
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCounts({
        statements: Math.round(targets.statements * ease),
        savings: Math.round(targets.savings * ease),
        cards: Math.round(targets.cards * ease),
      });
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, []);

  return (
    <div className="relative overflow-hidden" style={{ background: "#0B1120" }}>
      {/* Gradient mesh */}
      <div className="absolute inset-0 opacity-40" style={{
        background: `radial-gradient(ellipse 60% 50% at ${mousePos.x}% ${mousePos.y}%, #3B82F620, transparent), radial-gradient(ellipse 40% 40% at 80% 20%, #F59E0B15, transparent), radial-gradient(ellipse 50% 60% at 20% 80%, #3B82F610, transparent)`,
      }} />

      <div
        ref={heroRef}
        className="relative max-w-6xl mx-auto px-6 pt-6 pb-20"
        onMouseMove={(e) => {
          if (!heroRef.current) return;
          const rect = heroRef.current.getBoundingClientRect();
          setMousePos({ x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100 });
        }}
      >
        {/* Nav */}
        <nav className="flex items-center justify-between py-4 mb-16">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#3B82F6] to-[#1D4ED8] flex items-center justify-center">
              <Eye className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">
              Money<span className="text-[#3B82F6]">Lens</span>
            </span>
          </div>
          <button className="px-5 py-2 bg-[#3B82F6] hover:bg-[#2563EB] text-white text-sm font-semibold rounded-lg transition-all" style={{ boxShadow: "0 0 20px rgba(59, 130, 246, 0.3)" }}>
            Get Started
          </button>
        </nav>

        {/* Hero content */}
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#1E293B] bg-[#0F172A] text-xs text-[#94A3B8] mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] animate-pulse" />
              Free for UAE cardholders
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-[-0.04em] leading-[1.05] mb-6">
              <span className="text-white">Your money has</span><br />
              <span className="text-white">a leak. </span>
              <span className="relative">
                <span className="text-[#F59E0B]">Find it.</span>
                <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 200 8">
                  <path d="M0 6 Q50 0 100 4 Q150 8 200 2" stroke="#F59E0B" fill="none" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </span>
            </h1>

            <p className="text-lg text-[#94A3B8] mb-8 max-w-md leading-relaxed">
              Upload your UAE credit card statement. See where every dirham goes. Get matched to better cards.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3 mb-6">
              <button className="px-8 py-4 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-semibold rounded-xl text-base flex items-center gap-2 transition-all" style={{ boxShadow: "0 0 30px rgba(59, 130, 246, 0.4)" }}>
                Analyze My Statement — Free
                <ArrowRight className="w-4 h-4" />
              </button>
              <button className="text-sm text-[#64748B] hover:text-[#3B82F6] transition-colors flex items-center gap-1">
                Try with sample data <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <div className="flex flex-wrap justify-center lg:justify-start gap-4 text-xs text-[#64748B]">
              {["No bank login", "256-bit encrypted", "Nothing stored"].map(t => (
                <span key={t} className="flex items-center gap-1.5"><Check className="w-3 h-3 text-[#3B82F6]" />{t}</span>
              ))}
            </div>
          </div>

          {/* Floating card mockup */}
          <div className="flex-1 relative" style={{ perspective: "1000px" }}>
            <div className="relative w-80 mx-auto" style={{ transform: `rotateY(${(mousePos.x - 50) * 0.08}deg) rotateX(${(50 - mousePos.y) * 0.05}deg)`, transition: "transform 0.3s ease-out" }}>
              {/* Glass card */}
              <div className="p-6 rounded-2xl border border-white/10" style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(20px)" }}>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xs text-[#94A3B8] font-medium">February 2026</span>
                  <span className="text-xs text-[#64748B]">Emirates NBD</span>
                </div>
                <p className="text-3xl font-bold text-white mb-1 tabular-nums">AED 14,850</p>
                <p className="text-xs text-[#64748B] mb-6">Total spend this month</p>
                <div className="space-y-3">
                  {[
                    { name: "Dining", pct: 28, color: "#F59E0B", amount: "4,200" },
                    { name: "Groceries", pct: 21, color: "#3B82F6", amount: "3,100" },
                    { name: "Shopping", pct: 19, color: "#8B5CF6", amount: "2,800" },
                    { name: "Transport", pct: 13, color: "#10B981", amount: "1,950" },
                  ].map(c => (
                    <div key={c.name} className="flex items-center gap-3">
                      <span className="text-xs text-[#94A3B8] w-16">{c.name}</span>
                      <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${c.pct * 3}%`, background: c.color, transition: "width 1.5s ease-out" }} />
                      </div>
                      <span className="text-xs text-white tabular-nums">{c.amount}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -right-4 -top-3 px-3 py-1.5 rounded-full bg-[#10B981] text-xs font-bold text-white" style={{ boxShadow: "0 4px 12px rgba(16, 185, 129, 0.4)" }}>
                Save AED 2,160/yr
              </div>
            </div>
          </div>
        </div>

        {/* Animated counters */}
        <div className="mt-16 grid grid-cols-3 gap-6 max-w-lg mx-auto lg:mx-0">
          {[
            { value: `${counts.statements.toLocaleString()}+`, label: "Statements analyzed" },
            { value: `AED ${(counts.savings / 1000).toFixed(1)}K`, label: "Avg savings found" },
            { value: counts.cards.toString(), label: "UAE cards compared" },
          ].map(s => (
            <div key={s.label} className="text-center">
              <p className="text-2xl font-bold text-white tabular-nums">{s.value}</p>
              <p className="text-xs text-[#64748B]">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   OPTION B — WARM SAND
   Cream + terracotta + teal
   Monzo × family.co × Cleo
   ═══════════════════════════════════════════════════════════════ */

function WarmSand() {
  return (
    <div className="relative overflow-hidden" style={{ background: "#FAF7F2" }}>
      {/* Organic blob bg */}
      <svg className="absolute top-[-100px] right-[-100px] w-[500px] h-[500px] opacity-20" viewBox="0 0 500 500">
        <path d="M426,295Q411,390,321,411Q231,432,157,389Q83,346,73,253Q63,160,140,104Q217,48,310,62Q403,76,423,188Q443,300,426,295Z" fill="#C2410C" />
      </svg>
      <svg className="absolute bottom-[-80px] left-[-80px] w-[400px] h-[400px] opacity-15" viewBox="0 0 500 500">
        <path d="M432,314Q408,378,342,401Q276,424,211,402Q146,380,107,318Q68,256,85,183Q102,110,170,75Q238,40,312,61Q386,82,419,166Q452,250,432,314Z" fill="#0F766E" />
      </svg>

      <div className="relative max-w-6xl mx-auto px-6 pt-6 pb-20">
        {/* Nav */}
        <nav className="flex items-center justify-between py-4 mb-16">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#C2410C] flex items-center justify-center">
              <Eye className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-[#1C1917] tracking-tight">
              Money<span className="text-[#C2410C]">Lens</span>
            </span>
          </div>
          <button className="px-5 py-2 bg-[#C2410C] hover:bg-[#9A3412] text-white text-sm font-semibold rounded-full transition-all">
            Get Started
          </button>
        </nav>

        {/* Hero */}
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FEF3C7] text-xs font-semibold text-[#92400E] mb-8 border border-[#FDE68A]">
              <Sparkles className="w-3.5 h-3.5" />
              Free for all UAE cardholders
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold tracking-[-0.04em] leading-[1.08] mb-6 text-[#1C1917]">
              Every dirham,<br />
              <span className="text-[#C2410C]">accounted for.</span>
            </h1>

            <p className="text-lg text-[#78716C] mb-8 max-w-md leading-relaxed">
              Upload your credit card statement and see exactly where your money goes. No login. No drama. Just clarity.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3 mb-8">
              <button className="px-8 py-4 bg-[#C2410C] hover:bg-[#9A3412] text-white font-semibold rounded-full text-base flex items-center gap-2 transition-all shadow-lg">
                See My Spending
                <ArrowRight className="w-4 h-4" />
              </button>
              <button className="text-sm text-[#0F766E] font-medium hover:underline flex items-center gap-1">
                Try demo data <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="flex flex-wrap justify-center lg:justify-start gap-5 text-xs text-[#A8A29E]">
              {["No bank login needed", "Your data stays private", "Completely free"].map(t => (
                <span key={t} className="flex items-center gap-1.5"><Check className="w-3 h-3 text-[#0F766E]" />{t}</span>
              ))}
            </div>
          </div>

          {/* Illustration area — warm card stack */}
          <div className="flex-1 relative">
            <div className="w-72 mx-auto relative">
              {/* Back card */}
              <div className="absolute top-4 left-4 right-[-8px] h-48 rounded-3xl bg-[#0F766E]/10 border-2 border-dashed border-[#0F766E]/20" style={{ transform: "rotate(3deg)" }} />
              {/* Front card */}
              <div className="relative p-6 rounded-3xl bg-white border-2 border-[#E7E5E4] shadow-xl">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-full bg-[#FEF3C7] flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-[#D97706]" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#1C1917]">Emirates NBD</p>
                    <p className="text-xs text-[#A8A29E]">Visa Platinum</p>
                  </div>
                </div>
                <p className="text-3xl font-extrabold text-[#1C1917] mb-1">AED 14,850</p>
                <p className="text-xs text-[#A8A29E] mb-5">February 2026</p>
                <div className="space-y-2.5">
                  {[
                    { name: "🍽️ Dining", pct: 28, color: "#C2410C" },
                    { name: "🛒 Groceries", pct: 21, color: "#0F766E" },
                    { name: "🛍️ Shopping", pct: 19, color: "#D97706" },
                  ].map(c => (
                    <div key={c.name}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-[#57534E]">{c.name}</span>
                        <span className="font-semibold text-[#1C1917]">{c.pct}%</span>
                      </div>
                      <div className="h-2 bg-[#F5F5F4] rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${c.pct * 3}%`, background: c.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Floating savings badge */}
              <div className="absolute -bottom-3 -right-3 px-4 py-2 rounded-2xl bg-[#0F766E] text-white text-xs font-bold shadow-lg" style={{ transform: "rotate(-3deg)" }}>
                💰 Save AED 2,160/yr
              </div>
            </div>
          </div>
        </div>

        {/* Wavy divider */}
        <svg className="w-full mt-16" height="40" viewBox="0 0 1200 40" preserveAspectRatio="none">
          <path d="M0 20 Q300 0 600 20 Q900 40 1200 20 L1200 40 L0 40 Z" fill="#F5F5F0" />
        </svg>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   OPTION C — ELECTRIC NOIR
   Near-black + neon mint + violet
   CRED × Stripe × Linear
   ═══════════════════════════════════════════════════════════════ */

function ElectricNoir() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden"
      style={{ background: "#09090B" }}
      onMouseMove={(e) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      }}
    >
      {/* Grain texture overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      }} />

      {/* Spotlight follower */}
      <div className="absolute pointer-events-none" style={{
        left: mousePos.x - 200,
        top: mousePos.y - 200,
        width: 400,
        height: 400,
        background: "radial-gradient(circle, rgba(74, 222, 128, 0.06) 0%, transparent 70%)",
        transition: "left 0.3s ease-out, top 0.3s ease-out",
      }} />

      <div className="relative max-w-6xl mx-auto px-6 pt-6 pb-20">
        {/* Nav */}
        <nav className="flex items-center justify-between py-4 mb-20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4ADE80] to-[#8B5CF6] flex items-center justify-center">
              <Eye className="w-4 h-4 text-black" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">
              Money<span className="bg-gradient-to-r from-[#4ADE80] to-[#8B5CF6] bg-clip-text text-transparent">Lens</span>
            </span>
          </div>
          <button className="px-5 py-2 rounded-lg text-sm font-semibold text-black bg-[#4ADE80] hover:bg-[#22C55E] transition-all" style={{ boxShadow: "0 0 20px rgba(74, 222, 128, 0.3)" }}>
            Get Started
          </button>
        </nav>

        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto">
          {/* Glass card preview */}
          <div className="mx-auto mb-12 w-72 p-5 rounded-2xl border border-white/[0.08]" style={{ background: "rgba(255,255,255,0.03)", backdropFilter: "blur(20px)" }}>
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] text-white/40 uppercase tracking-wider font-medium">Feb 2026</span>
              <span className="text-[10px] text-white/30">Emirates NBD</span>
            </div>
            <p className="text-2xl font-bold text-white mb-3 tabular-nums">AED 14,850</p>
            <div className="flex gap-1 h-2 rounded-full overflow-hidden">
              <div className="rounded-full" style={{ width: "28%", background: "#F59E0B" }} />
              <div className="rounded-full" style={{ width: "21%", background: "#4ADE80" }} />
              <div className="rounded-full" style={{ width: "19%", background: "#8B5CF6" }} />
              <div className="rounded-full" style={{ width: "13%", background: "#3B82F6" }} />
              <div className="rounded-full" style={{ width: "19%", background: "#525252" }} />
            </div>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-[-0.04em] leading-[1.05] mb-6">
            <span className="text-white">Find the </span>
            <span className="bg-gradient-to-r from-[#4ADE80] via-[#2DD4BF] to-[#8B5CF6] bg-clip-text text-transparent">leak.</span>
          </h1>

          <p className="text-lg text-white/40 mb-10 max-w-lg mx-auto leading-relaxed">
            Upload your credit card statement. See where every dirham goes. Get matched to cards that actually save you money.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <button className="relative px-8 py-4 bg-[#4ADE80] hover:bg-[#22C55E] text-black font-bold rounded-xl text-base flex items-center gap-2 transition-all" style={{ boxShadow: "0 0 40px rgba(74, 222, 128, 0.3)" }}>
              <span className="absolute inset-0 rounded-xl border border-[#4ADE80]/50 animate-ping opacity-20" />
              Analyze My Statement — Free
              <ArrowRight className="w-4 h-4" />
            </button>
            <button className="text-sm text-white/30 hover:text-[#4ADE80] transition-colors flex items-center gap-1">
              Try sample data <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-xs text-white/20">
            {["No credentials", "Encrypted", "Nothing stored"].map(t => (
              <span key={t} className="flex items-center gap-1.5"><Lock className="w-3 h-3 text-[#4ADE80]/60" />{t}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   OPTION D — OCEAN GRADIENT
   White + deep indigo + cyan-teal gradient
   Wise × N26 × Wealthfront
   ═══════════════════════════════════════════════════════════════ */

function OceanGradient() {
  return (
    <div className="relative overflow-hidden">
      {/* Indigo gradient hero bg */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #312E81 0%, #1E1B4B 40%, #0F172A 100%)" }} />
      {/* Subtle orbs */}
      <div className="absolute top-20 right-20 w-96 h-96 rounded-full opacity-20" style={{ background: "radial-gradient(circle, #06B6D4, transparent)" }} />
      <div className="absolute bottom-0 left-20 w-80 h-80 rounded-full opacity-15" style={{ background: "radial-gradient(circle, #14B8A6, transparent)" }} />

      <div className="relative max-w-6xl mx-auto px-6 pt-6 pb-24">
        {/* Nav */}
        <nav className="flex items-center justify-between py-4 mb-16">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur flex items-center justify-center border border-white/20">
              <Eye className="w-4 h-4 text-[#06B6D4]" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">
              Money<span className="text-[#06B6D4]">Lens</span>
            </span>
          </div>
          <button className="px-5 py-2 bg-gradient-to-r from-[#06B6D4] to-[#14B8A6] text-white text-sm font-semibold rounded-lg transition-all hover:opacity-90">
            Get Started
          </button>
        </nav>

        {/* Hero */}
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs text-white/60 mb-8 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#06B6D4] animate-pulse" />
              Free for UAE cardholders · No signup
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-[-0.04em] leading-[1.08] mb-6">
              <span className="text-white">Know exactly where</span><br />
              <span className="bg-gradient-to-r from-[#06B6D4] to-[#14B8A6] bg-clip-text text-transparent">every dirham goes.</span>
            </h1>

            <p className="text-lg text-white/50 mb-10 max-w-md leading-relaxed">
              Upload your credit card statement. Get instant spending insights and better card matches based on how you actually spend.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3 mb-6">
              <button className="px-8 py-4 bg-gradient-to-r from-[#06B6D4] to-[#14B8A6] hover:from-[#0891B2] hover:to-[#0D9488] text-white font-semibold rounded-xl text-base flex items-center gap-2 transition-all shadow-lg">
                Analyze My Statement — Free
                <ArrowRight className="w-4 h-4" />
              </button>
              <button className="text-sm text-white/40 hover:text-[#06B6D4] transition-colors flex items-center gap-1">
                Try with sample data <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="flex flex-wrap justify-center lg:justify-start gap-4 text-xs text-white/30">
              {["No bank login", "256-bit encrypted", "Nothing stored"].map(t => (
                <span key={t} className="flex items-center gap-1.5"><Check className="w-3 h-3 text-[#14B8A6]" />{t}</span>
              ))}
            </div>
          </div>

          {/* Isometric-style UI mockup */}
          <div className="flex-1 relative">
            <div className="w-80 mx-auto relative" style={{ transform: "perspective(1000px) rotateY(-8deg) rotateX(5deg)" }}>
              {/* Main card */}
              <div className="p-6 rounded-2xl bg-white/[0.07] border border-white/10 backdrop-blur-md shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#06B6D4] to-[#14B8A6] flex items-center justify-center">
                      <CreditCard className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white">Emirates NBD</p>
                      <p className="text-[10px] text-white/40">Visa Platinum</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-white/30">Feb 2026</span>
                </div>
                <p className="text-3xl font-bold text-white mb-4 tabular-nums">AED 14,850</p>
                <div className="space-y-3">
                  {[
                    { name: "Dining", amount: "4,200", pct: 28, color: "from-[#F59E0B] to-[#EF4444]" },
                    { name: "Groceries", amount: "3,100", pct: 21, color: "from-[#06B6D4] to-[#14B8A6]" },
                    { name: "Shopping", amount: "2,800", pct: 19, color: "from-[#8B5CF6] to-[#EC4899]" },
                  ].map(c => (
                    <div key={c.name} className="flex items-center gap-3">
                      <span className="text-xs text-white/50 w-16">{c.name}</span>
                      <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full bg-gradient-to-r ${c.color}`} style={{ width: `${c.pct * 3}%` }} />
                      </div>
                      <span className="text-xs text-white/70 tabular-nums">{c.amount}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating savings card */}
              <div className="absolute -bottom-4 -left-6 px-4 py-3 rounded-xl bg-gradient-to-r from-[#06B6D4] to-[#14B8A6] shadow-xl" style={{ transform: "rotate(-3deg)" }}>
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-white" />
                  <span className="text-xs font-bold text-white">Save AED 2,160/yr with a better card</span>
                </div>
              </div>

              {/* Floating shield */}
              <div className="absolute -top-3 -right-3 w-10 h-10 rounded-xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center">
                <Shield className="w-5 h-5 text-[#14B8A6]" />
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-3 gap-6 max-w-lg mx-auto lg:mx-0">
          {[
            { value: "2,800+", label: "Statements analyzed" },
            { value: "AED 4.2K", label: "Avg savings found" },
            { value: "32", label: "UAE cards compared" },
          ].map(s => (
            <div key={s.label} className="text-center">
              <p className="text-2xl font-bold text-white tabular-nums">{s.value}</p>
              <p className="text-xs text-white/30">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PREVIEW PAGE — ALL 4 OPTIONS
   ═══════════════════════════════════════════════════════════════ */

export default function PreviewPage() {
  const [active, setActive] = useState<"A" | "B" | "C" | "D">("A");

  const options = [
    { id: "A" as const, name: "Midnight Sapphire", desc: "Dark navy + blue + gold", vibe: "Revolut × Linear" },
    { id: "B" as const, name: "Warm Sand", desc: "Cream + terracotta + teal", vibe: "Monzo × family.co" },
    { id: "C" as const, name: "Electric Noir", desc: "Black + neon mint + violet", vibe: "CRED × Stripe" },
    { id: "D" as const, name: "Ocean Gradient", desc: "Indigo + cyan + teal", vibe: "Wise × N26" },
  ];

  return (
    <div className="min-h-screen bg-[#09090B]">
      {/* Sticky switcher */}
      <div className="sticky top-0 z-50 bg-[#09090B]/90 backdrop-blur-md border-b border-white/10 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center gap-3 overflow-x-auto">
          <span className="text-xs text-white/40 shrink-0 font-medium">PICK A DIRECTION:</span>
          {options.map(o => (
            <button
              key={o.id}
              onClick={() => setActive(o.id)}
              className={`shrink-0 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                active === o.id
                  ? "bg-white text-black"
                  : "bg-white/5 text-white/60 hover:bg-white/10 border border-white/10"
              }`}
            >
              {o.id}. {o.name}
              <span className="block text-[10px] font-normal opacity-60">{o.vibe}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Render active option */}
      <div>
        {active === "A" && <MidnightSapphire />}
        {active === "B" && <WarmSand />}
        {active === "C" && <ElectricNoir />}
        {active === "D" && <OceanGradient />}
      </div>

      {/* All 4 thumbnails */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-xl font-bold text-white mb-8 text-center">All options at a glance</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {options.map(o => (
            <button
              key={o.id}
              onClick={() => { setActive(o.id); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              className={`p-5 rounded-2xl border text-left transition-all ${
                active === o.id
                  ? "border-white/30 bg-white/5"
                  : "border-white/10 bg-white/[0.02] hover:bg-white/5"
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-sm font-bold text-white">{o.id}</span>
                <div>
                  <p className="text-sm font-bold text-white">{o.name}</p>
                  <p className="text-xs text-white/40">{o.desc}</p>
                </div>
              </div>
              <p className="text-[10px] text-white/30">{o.vibe}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
