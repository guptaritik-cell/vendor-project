"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ClipboardList, FilePlus2, ChevronLeft, ChevronRight } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const SURFACE = "#181818";
const BORDER_CLR = "rgba(255,77,0,0.15)";
const ACTIVE_BG = "rgba(255,77,0,0.12)";
const HOVER_BG = "rgba(255,255,255,0.04)";

const NAV_ITEMS = [
  { label: "Submissions", href: "/dashboard", Icon: ClipboardList },
  { label: "New Submission", href: "/onboard", Icon: FilePlus2 },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 240 }}
      transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
      className="flex-shrink-0 flex flex-col h-screen overflow-hidden"
      style={{ background: SURFACE, borderRight: `1px solid ${BORDER_CLR}` }}
    >
      {/* Top: logo + collapse toggle */}
      <div
        className="flex items-center h-16 px-3 flex-shrink-0"
        style={{ borderBottom: `1px solid ${BORDER_CLR}` }}
      >
        <Link href="/dashboard" className="flex items-center gap-3 min-w-0">
          <Image
            src="/POP.png"
            alt="POP logo"
            width={32}
            height={32}
            className="flex-shrink-0 rounded-full select-none"
          />
          <AnimatePresence initial={false}>
            {!collapsed && (
              <motion.span
                key="logo-text"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.15 }}
                className="text-white font-bold text-sm whitespace-nowrap"
              >
                Vendor Review
              </motion.span>
            )}
          </AnimatePresence>
        </Link>

        <button
          onClick={() => setCollapsed((c) => !c)}
          className="ml-auto flex-shrink-0 w-6 h-6 rounded flex items-center justify-center transition-colors"
          style={{ color: "#888888" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#F5F5F5")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#888888")}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Nav items */}
      <nav className="flex-1 py-3 overflow-hidden">
        {NAV_ITEMS.map(({ label, href, Icon }) => {
          const isActive = pathname === href;
          const item = (
            <Link
              key={href}
              href={href}
              className="relative flex items-center gap-3 mx-2 my-0.5 rounded-lg transition-colors"
              style={{
                padding: collapsed ? "10px 0" : "10px 12px",
                justifyContent: collapsed ? "center" : "flex-start",
                background: isActive ? ACTIVE_BG : "transparent",
                color: isActive ? "#F5F5F5" : "#888888",
              }}
              onMouseEnter={(e) => {
                if (!isActive) (e.currentTarget as HTMLElement).style.background = HOVER_BG;
              }}
              onMouseLeave={(e) => {
                if (!isActive) (e.currentTarget as HTMLElement).style.background = "transparent";
              }}
            >
              {isActive && (
                <span
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] rounded-r-full"
                  style={{ height: 20, background: "linear-gradient(180deg, #FF4D00, #FF7A35)" }}
                />
              )}
              <Icon size={16} className="flex-shrink-0" />
              <AnimatePresence initial={false}>
                {!collapsed && (
                  <motion.span
                    key={`label-${href}`}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: 0.14 }}
                    className="text-sm font-medium whitespace-nowrap"
                  >
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );

          return collapsed ? (
            <Tooltip key={href}>
              <TooltipTrigger asChild>{item}</TooltipTrigger>
              <TooltipContent side="right">
                <p>{label}</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            item
          );
        })}
      </nav>

      {/* Bottom: brand tag */}
      <div
        className="flex-shrink-0 py-3 px-3"
        style={{ borderTop: `1px solid ${BORDER_CLR}` }}
      >
        <div
          className="flex items-center gap-3 rounded-lg p-2 overflow-hidden"
          style={{ justifyContent: collapsed ? "center" : "flex-start" }}
        >
          <div
            className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
            style={{ background: "linear-gradient(135deg, #FF4D00, #FF7A35)" }}
          >
            PC
          </div>
          <AnimatePresence initial={false}>
            {!collapsed && (
              <motion.div
                key="brand-info"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.14 }}
                className="min-w-0"
              >
                <p className="text-xs font-medium text-[#F5F5F5] truncate">Procurement Team</p>
                <p className="text-[10px] text-[#888888]">POP Private Limited</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.aside>
  );
}
