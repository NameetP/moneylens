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
                    ? "bg-[#059669] text-white"
                    : isActive
                    ? "bg-white text-[#059669] border-2 border-[#059669] shadow-sm"
                    : "bg-[#f5f5f4] text-[#a3a3a3] border border-[#e5e5e5]"
                }`}
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
                    ? "text-[#0a0a0a] font-medium"
                    : isCompleted
                    ? "text-[#525252]"
                    : "text-[#a3a3a3]"
                }`}
              >
                {step}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`w-8 sm:w-12 h-px ${
                  isCompleted ? "bg-[#059669]" : "bg-[#e5e5e5]"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
