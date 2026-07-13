"use client";

import { AnimatePresence, motion } from "framer-motion";
import { FileText, Upload, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { UploadedDocument } from "@/types/vendor";

export const inputClass =
  "h-9 text-sm bg-[#1E1E1E] border-[rgba(255,77,0,0.25)] text-[#F5F5F5] placeholder:text-[#555] focus:border-[#FF4D00] focus:ring-1 focus:ring-[#FF4D00]";

export function Label({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="block text-xs font-medium text-[#888888] mb-1.5">
      {children}
      {required && <span className="text-[#FF4D00] ml-0.5">*</span>}
    </label>
  );
}

export function FieldError({ msg }: { msg: string | undefined }) {
  return (
    <AnimatePresence>
      {msg && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.15 }}
          className="text-[11px] text-[#f87171] mt-1"
        >
          {msg}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

/* Wraps a field in a subtle scale-up micro-animation on focus */
export function FieldFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="transition-transform duration-150 focus-within:scale-[1.015]">
      {children}
    </div>
  );
}

export function TextField({
  label,
  required,
  error,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  required?: boolean;
  error?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <Label required={required}>{label}</Label>
      <FieldFrame>
        <Input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={inputClass}
          style={error ? { borderColor: "rgba(239,68,68,0.6)" } : {}}
        />
      </FieldFrame>
      <FieldError msg={error} />
    </div>
  );
}

export function DarkSelect({
  label,
  required,
  error,
  value,
  onChange,
  options,
  placeholder,
}: {
  label: string;
  required?: boolean;
  error?: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
}) {
  return (
    <div>
      <Label required={required}>{label}</Label>
      <FieldFrame>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: "100%",
            height: 36,
            background: "#1E1E1E",
            border: `1px solid ${error ? "rgba(239,68,68,0.6)" : "rgba(255,77,0,0.25)"}`,
            borderRadius: 6,
            color: value ? "#F5F5F5" : "#555",
            fontSize: 14,
            padding: "0 10px",
            outline: "none",
            cursor: "pointer",
            appearance: "none",
            WebkitAppearance: "none",
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23888888' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 10px center",
            paddingRight: 32,
          }}
        >
          <option value="" disabled style={{ background: "#1E1E1E", color: "#555" }}>
            {placeholder ?? "Select..."}
          </option>
          {options.map((o) => (
            <option key={o} value={o} style={{ background: "#1E1E1E" }}>
              {o}
            </option>
          ))}
        </select>
      </FieldFrame>
      <FieldError msg={error} />
    </div>
  );
}

export function FileUploadField({
  label,
  required,
  error,
  value,
  onChange,
}: {
  label: string;
  required?: boolean;
  error?: string;
  value: UploadedDocument | null;
  onChange: (v: UploadedDocument | null) => void;
}) {
  const inputId = `file-${label.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <div>
      <Label required={required}>{label}</Label>
      {value ? (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 h-9 px-3 rounded-md"
          style={{
            background: "#1E1E1E",
            border: "1px solid rgba(255,77,0,0.25)",
          }}
        >
          <FileText size={14} className="text-[#FF7A35] flex-shrink-0" />
          <span className="text-sm text-[#F5F5F5] truncate flex-1">{value.fileName}</span>
          <button
            type="button"
            onClick={() => onChange(null)}
            className="text-[#888888] hover:text-[#f87171] transition-colors flex-shrink-0"
          >
            <X size={14} />
          </button>
        </motion.div>
      ) : (
        <label
          htmlFor={inputId}
          className="flex items-center gap-3 h-9 px-3 rounded-md cursor-pointer transition-colors"
          style={{
            background: "#1E1E1E",
            border: `1px dashed ${error ? "rgba(239,68,68,0.6)" : "rgba(255,77,0,0.3)"}`,
            color: "#888888",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLLabelElement).style.borderColor = "#FF4D00";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLLabelElement).style.borderColor = error
              ? "rgba(239,68,68,0.6)"
              : "rgba(255,77,0,0.3)";
          }}
        >
          <Upload size={14} className="flex-shrink-0" />
          <span className="text-sm">Click to upload (PDF, PNG, JPG)</span>
          <input
            id={inputId}
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onChange({ fileName: file.name, fileType: file.type || "application/octet-stream" });
              e.target.value = "";
            }}
          />
        </label>
      )}
      <FieldError msg={error} />
    </div>
  );
}
