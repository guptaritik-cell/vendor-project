"use client";

import dynamic from "next/dynamic";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopBar } from "@/components/dashboard/TopBar";

/* Load Silk lazily — WebGL / Three.js must run client-side only */
const Silk = dynamic(() => import("@/components/Silk"), { ssr: false });

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex h-screen overflow-hidden" style={{ background: "#0D0D0D" }}>
      <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.35 }}>
        <Silk speed={2.2} scale={0.4} color="#3A1A0D" noiseIntensity={0.2} rotation={1.9} />
      </div>

      <div className="relative z-10 flex h-full w-full">
        <Sidebar />
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          <TopBar />
          <main className="flex-1 min-h-0 overflow-y-auto">{children}</main>
        </div>
      </div>
    </div>
  );
}
