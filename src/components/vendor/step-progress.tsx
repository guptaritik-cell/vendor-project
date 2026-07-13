"use client";

import { motion } from "framer-motion";
import { Check, type LucideIcon } from "lucide-react";

export interface StepDef {
  key: string;
  label: string;
  icon: LucideIcon;
}

export function StepProgress({
  steps,
  current,
}: {
  steps: StepDef[];
  current: number;
}) {
  return (
    <div className="flex items-center w-full">
      {steps.map((step, i) => {
        const Icon = step.icon;
        const isDone = i < current;
        const isActive = i === current;

        return (
          <div key={step.key} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <motion.div
                animate={{
                  scale: isActive ? 1.08 : 1,
                  boxShadow: isActive
                    ? "0 0 0 4px rgba(255,77,0,0.15), 0 0 20px rgba(255,77,0,0.35)"
                    : "0 0 0 0px rgba(255,77,0,0)",
                }}
                transition={{ duration: 0.25 }}
                className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  background: isDone || isActive
                    ? "linear-gradient(135deg, #FF4D00, #FF7A35)"
                    : "#1E1E1E",
                  border: isDone || isActive ? "none" : "1px solid rgba(255,77,0,0.25)",
                }}
              >
                {isDone ? (
                  <Check size={15} className="text-white" />
                ) : (
                  <Icon size={15} className={isActive ? "text-white" : "text-[#666666]"} />
                )}
              </motion.div>
              <span
                className="text-[11px] font-medium whitespace-nowrap hidden sm:block"
                style={{ color: isActive ? "#FF7A35" : isDone ? "#F5F5F5" : "#666666" }}
              >
                {step.label}
              </span>
            </div>

            {i < steps.length - 1 && (
              <div className="flex-1 h-[2px] mx-2 rounded-full overflow-hidden bg-[rgba(255,77,0,0.12)] -mt-5 sm:-mt-5">
                <motion.div
                  className="h-full"
                  style={{ background: "linear-gradient(90deg, #FF4D00, #FF7A35)" }}
                  initial={false}
                  animate={{ width: i < current ? "100%" : "0%" }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
