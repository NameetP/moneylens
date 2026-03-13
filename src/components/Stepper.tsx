"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface StepperProps {
  steps: string[];
  currentStep: number;
}

export function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {steps.map((step, i) => {
        const isActive = i === currentStep;
        const isCompleted = i < currentStep;

        return (
          <div key={step} className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <motion.div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  isCompleted
                    ? "bg-[#0F766E] text-white"
                    : isActive
                    ? "bg-white text-[#C2410C] border-2 border-[#C2410C]"
                    : "bg-[#F5F5F4] text-[#A8A29E] border border-[#E7E5E4]"
                }`}
                style={{ boxShadow: isActive ? "0 0 0 4px rgba(194, 65, 12, 0.1)" : "none" }}
                initial={false}
                animate={{
                  scale: isActive ? 1.1 : 1,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : i + 1}
              </motion.div>
              <span
                className={`text-sm hidden sm:inline ${
                  isActive
                    ? "text-[#1C1917] font-semibold"
                    : isCompleted
                    ? "text-[#57534E] font-medium"
                    : "text-[#A8A29E]"
                }`}
              >
                {step}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`w-8 sm:w-12 h-px ${
                  isCompleted ? "bg-[#0F766E]" : "bg-[#E7E5E4]"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
