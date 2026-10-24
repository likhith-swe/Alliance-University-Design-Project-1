import { Radar, Boxes, ShieldCheck, Cpu } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative border-t border-slate-800/60 bg-[#050910] px-5 py-12 sm:px-8">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-sm">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#e5b887]/20 to-[#d99b5e]/20 ring-1 ring-[#e5b887]/30">
              <Radar size={16} className="text-[#e5b887]" />
            </span>
            <span className="font-display text-[15px] font-semibold text-white">Alliance University · Smart Campus Digital Twin</span>
          </div>
          <p className="mt-3 text-[13px] leading-relaxed text-slate-500">
            CSE Department Capstone Project — a cyber-physical digital twin command center built
            for Alliance University's Department of Computer Science &amp; Engineering.
          </p>
          <div className="mt-4 flex items-center gap-2 font-mono text-[10px] text-slate-600">
            <ShieldCheck size={12} /> CSE Department Capstone Project · 2026
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 text-sm sm:grid-cols-3">
          <div>
            <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-slate-500">System</p>
            <ul className="space-y-2 text-slate-400">
              <li>Digital Twin Engine</li>
              <li>Copilot Orchestrator</li>
              <li>IoT Telemetry Mesh</li>
            </ul>
          </div>
          <div>
            <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-slate-500">Stack</p>
            <ul className="space-y-2 text-slate-400">
              <li>React 19 + TypeScript</li>
              <li>Three.js / R3F</li>
              <li>Tailwind CSS</li>
            </ul>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-slate-500">Department</p>
            <ul className="space-y-2 text-slate-400">
              <li>Department of Computer Science &amp; Engineering</li>
              <li>Alliance University</li>
              <li>Chandapura-Anekal Road, Bengaluru 562106</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 flex max-w-[1440px] flex-col items-center justify-between gap-3 border-t border-white/5 pt-6 font-mono text-[10px] text-slate-600 sm:flex-row">
        <span className="flex items-center gap-1.5">
          <Cpu size={11} /> Rendering {new Date().getFullYear()} campus digital twin · 60fps target
        </span>
        <span className="flex items-center gap-1.5">
          <Boxes size={11} /> Developed by CSE Capstone Project Team
        </span>
      </div>
    </footer>
  );
}
