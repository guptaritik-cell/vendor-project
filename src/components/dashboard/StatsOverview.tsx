"use client";

import { motion } from "framer-motion";
import { ClipboardList, CheckCircle2, Clock, XCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.32, ease: [0.4, 0, 0.2, 1] as const } },
};

const TOOLTIP_STYLE = {
  background: "#222222",
  border: "1px solid rgba(255,77,0,0.3)",
  borderRadius: 8,
  color: "#F5F5F5",
  fontSize: 12,
};

interface StatCounts {
  total: number;
  approved: number;
  pending: number;
  rejected: number;
}

function MetricCard({
  label,
  value,
  icon,
  iconBg,
  color,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  iconBg: string;
  color?: string;
}) {
  return (
    <motion.div
      variants={fadeUp}
      className="rounded-xl p-5 flex items-center gap-4"
      style={{ background: "#181818", border: "1px solid rgba(255,77,0,0.15)", height: 92 }}
    >
      <div
        className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
        style={{ background: iconBg }}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[26px] font-semibold leading-none" style={{ color: color ?? "#F5F5F5" }}>
          {value}
        </p>
        <p className="text-[12px] text-[#888888] mt-1.5 leading-snug">{label}</p>
      </div>
    </motion.div>
  );
}

export function StatsOverview({ counts }: { counts: StatCounts }) {
  const chartData = [
    { name: "Approved", value: counts.approved, color: "#4ade80" },
    { name: "Pending", value: counts.pending, color: "#FFA500" },
    { name: "Rejected", value: counts.rejected, color: "#f87171" },
  ];

  return (
    <div className="space-y-4">
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-4 gap-4"
      >
        <MetricCard
          label="Total Submissions"
          value={counts.total}
          icon={<ClipboardList size={18} className="text-white" />}
          iconBg="linear-gradient(135deg,#FF4D00,#FF7A35)"
        />
        <MetricCard
          label="Approved"
          value={counts.approved}
          icon={<CheckCircle2 size={18} className="text-white" />}
          iconBg="linear-gradient(135deg,#10b981,#34d399)"
          color="#4ade80"
        />
        <MetricCard
          label="Pending Review"
          value={counts.pending}
          icon={<Clock size={18} className="text-white" />}
          iconBg="linear-gradient(135deg,#FFA500,#FF7A35)"
          color="#FFA500"
        />
        <MetricCard
          label="Rejected"
          value={counts.rejected}
          icon={<XCircle size={18} className="text-white" />}
          iconBg="linear-gradient(135deg,#ef4444,#dc2626)"
          color="#f87171"
        />
      </motion.div>

      <div className="rounded-xl p-5" style={{ background: "#181818", border: "1px solid rgba(255,77,0,0.2)" }}>
        <p className="text-sm font-medium text-[#F5F5F5] mb-1">Status Distribution</p>
        <p className="text-xs text-[#888888] mb-3">Submission count by decision status</p>
        <ResponsiveContainer width="100%" height={140}>
          <BarChart data={chartData} barSize={40}>
            <XAxis dataKey="name" tick={{ fill: "#888888", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#888888", fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} width={28} />
            <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: "rgba(255,77,0,0.06)" }} />
            <Bar dataKey="value" radius={[4, 4, 0, 0]} isAnimationActive animationDuration={700}>
              {chartData.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
