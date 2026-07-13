"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Copy, Check, X, Mail } from "lucide-react";

export function DraftMessageModal({
  message,
  onClose,
}: {
  message: string | null;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (!message) return;
    await navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <AnimatePresence>
      {message !== null && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0"
            style={{ background: "rgba(0,0,0,0.6)" }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="relative w-full max-w-[560px] rounded-2xl overflow-hidden"
            style={{
              background: "#181818",
              border: "1px solid rgba(255,77,0,0.3)",
              boxShadow: "0 0 48px rgba(255,77,0,0.12)",
            }}
          >
            {/* Header */}
            <div
              className="px-6 py-4 flex items-center justify-between gap-3"
              style={{ borderBottom: "1px solid rgba(255,77,0,0.15)" }}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(255,77,0,0.15)" }}
                >
                  <Mail size={15} className="text-[#FF7A35]" />
                </div>
                <p className="text-sm font-semibold text-[#F5F5F5]">Draft Message to Vendor</p>
              </div>
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-[#888888] hover:text-[#F5F5F5] transition-colors"
              >
                <X size={15} />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5">
              <pre
                className="whitespace-pre-wrap text-[13px] leading-relaxed rounded-lg p-4 max-h-[360px] overflow-y-auto"
                style={{ background: "#0D0D0D", color: "#D4D4D4", border: "1px solid rgba(255,77,0,0.12)" }}
              >
                {message}
              </pre>
            </div>

            {/* Footer */}
            <div
              className="px-6 py-4 flex items-center justify-end gap-3"
              style={{ borderTop: "1px solid rgba(255,77,0,0.15)" }}
            >
              <button
                onClick={onClose}
                className="h-9 px-4 rounded-lg text-sm font-medium text-[#888888] hover:text-[#F5F5F5] transition-colors"
              >
                Close
              </button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleCopy}
                className="flex items-center gap-2 h-9 px-4 rounded-lg text-sm font-semibold text-white"
                style={{ background: "linear-gradient(135deg, #FF4D00, #FF7A35)" }}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? "Copied" : "Copy message"}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
