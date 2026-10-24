import { useEffect, useState } from "react";
import { ArrowDown, Radar, Sparkles, ShieldCheck, GraduationCap } from "lucide-react";
import Navbar from "./components/Navbar";
import CommandPalette from "./components/CommandPalette";
import DigitalTwinPanel from "./components/DigitalTwinPanel";
import BentoStats from "./components/BentoStats";
import SankeyEnergyFlow from "./components/SankeyEnergyFlow";
import RoomTimeline from "./components/RoomTimeline";
import MiniMapCard from "./components/MiniMapCard";
import EnergyTrendChart from "./components/EnergyTrendChart";
import Footer from "./components/Footer";
import MobileBottomBar from "./components/MobileBottomBar";
import CampusBrainModal from "./components/CampusBrainModal";
import type { DesignTheme, ManualControlState } from "./types/theme";
import { DEFAULT_MANUAL_STATE } from "./types/theme";

function BootScreen({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setProgress((p) => {
        const next = Math.min(p + Math.random() * 20 + 8, 100);
        if (next >= 100) {
          clearInterval(id);
          setTimeout(onDone, 380);
        }
        return next;
      });
    }, 140);
    return () => clearInterval(id);
  }, [onDone]);

  return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center gap-6 bg-[#070d18]">
      <div className="bg-grid absolute inset-0 opacity-20" />
      <div className="relative flex flex-col items-center gap-4">
        <div className="relative flex h-24 w-24 items-center justify-center mb-2">
          <span className="absolute inset-0 animate-pulse-ring rounded-full border border-[#e5b887]/40" />
          <span className="absolute inset-4 animate-pulse-ring rounded-full border border-[#d99b5e]/30" style={{ animationDelay: "0.5s" }} />
          <img
            src="/Alliance_University_Icon.svg"
            alt="Alliance University Emblem"
            className="h-16 w-16 object-contain filter drop-shadow-[0_0_16px_rgba(229,184,135,0.4)]"
          />
        </div>
        <p className="font-display text-base font-semibold tracking-[0.25em] text-slate-100">ALLIANCE UNIVERSITY</p>
        <p className="font-mono text-[10px] tracking-widest text-[#e5b887]/80 mb-2">
          SMART CAMPUS DIGITAL TWIN · ANEKAL CAMPUS
        </p>
        <div className="h-[3px] w-64 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#e5b887] via-[#d99b5e] to-[#86a397] transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="font-mono text-[10px] tracking-widest text-slate-400">
          CONNECTING IOT TELEMETRY · {Math.floor(progress)}%
        </p>
      </div>
    </div>
  );
}

export default function App() {
  const [booted, setBooted] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [brainOpen, setBrainOpen] = useState(false);
  const [theme, setTheme] = useState<DesignTheme>("wispr");
  const [manualState, setManualState] = useState<ManualControlState>(DEFAULT_MANUAL_STATE);
  const [activeSection, setActiveSection] = useState("twin");
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 74;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div
      id="top"
      className={`relative min-h-screen bg-[#090a0f] text-slate-100 theme-${theme} pb-16 md:pb-0`}
    >
      {!booted && <BootScreen onDone={() => setBooted(true)} />}
      <div className="noise-overlay" />

      {/* Navigation Header with Live Theme Selector */}
      <Navbar
        currentTheme={theme}
        onThemeChange={setTheme}
        onOpenPalette={() => setPaletteOpen(true)}
        onOpenBrain={() => setBrainOpen(true)}
      />

      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onOpenBrain={() => setBrainOpen(true)}
      />

      <CampusBrainModal
        open={brainOpen}
        onClose={() => setBrainOpen(false)}
      />

      {/* HERO + 3D DIGITAL TWIN VIEWPORT */}
      <section id="twin" className="relative">
        <DigitalTwinPanel
          manualState={manualState}
          onManualStateChange={setManualState}
        />

        {/* Hero Title Overlay — Clean top-left floating HUD card, leaving the 3D campus completely unobstructed */}
        <div className="pointer-events-none absolute top-20 left-4 sm:top-24 sm:left-8 z-10 max-w-[420px] text-left">
          <div className="pointer-events-auto rounded-[1.75rem] border border-[rgba(229,184,135,0.18)] bg-[rgba(10,14,23,0.82)] p-5 sm:p-6 backdrop-blur-2xl shadow-[0_16px_50px_rgba(0,0,0,0.6)] animate-fade-in-up">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#e5b887]/30 bg-[#e5b887]/10 px-3 py-1 font-mono text-[10px] tracking-wider text-[#e5b887] mb-2.5">
              <Sparkles size={11} className="text-[#e5b887]" /> ALLIANCE UNIVERSITY · CSE CAPSTONE 2026
            </span>
            <h1 className="font-display text-2xl font-semibold leading-tight text-white sm:text-3xl">
              Alliance University
            </h1>
            <p className="font-serif italic text-base text-[#e5b887] mt-0.5">
              Rendered in Living Motion
            </p>
            <p className="mt-2.5 text-xs text-slate-300 leading-relaxed font-sans">
              Cyber-physical spatial twin of the 60-acre Anekal campus. Live IoT telemetry, rooftop solar, and manual facility controls.
            </p>
            <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-2">
              <button
                onClick={() => scrollTo("insights")}
                className="group inline-flex items-center gap-2 rounded-xl bg-[#e5b887]/15 border border-[#e5b887]/35 px-3.5 py-1.5 font-mono text-[11px] font-medium text-[#e5b887] hover:bg-[#e5b887]/25 hover:border-[#e5b887]/60 transition cursor-pointer"
              >
                <ArrowDown size={12} className="text-[#e5b887] group-hover:translate-y-0.5 transition-transform" />
                Explore Telemetry &amp; Energy Grid
              </button>
            </div>
          </div>
        </div>

        {/* Floating Scroll Component — cleanly anchored at bottom-right, symmetrical with Telemetry Legend */}
        <div
          className={`pointer-events-none absolute bottom-24 right-4 sm:right-8 z-20 flex items-center transition-all duration-500 ${
            hasScrolled ? "opacity-0 translate-y-4 pointer-events-none" : "opacity-100 translate-y-0"
          }`}
        >
          <button
            onClick={() => scrollTo("insights")}
            className="pointer-events-auto group flex animate-float items-center gap-2 rounded-2xl border border-[#e5b887]/35 bg-[#090e1a]/92 px-4 py-2.5 font-mono text-[11px] font-medium text-[#e5b887] backdrop-blur-2xl transition-all hover:bg-[#e5b887]/20 hover:border-[#e5b887]/60 cursor-pointer shadow-[0_12px_36px_rgba(0,0,0,0.6)]"
            title="Jump to Telemetry & Energy Grid"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#e5b887]/20 text-[#e5b887] group-hover:translate-y-0.5 transition-transform">
              <ArrowDown size={11} />
            </span>
            <span className="hidden sm:inline">Explore Telemetry &amp; Live Grid</span>
            <span className="sm:hidden">Explore Telemetry</span>
          </button>
        </div>
      </section>

      {/* KPI BENTO GRID */}
      <section id="insights" className="scroll-mt-20 relative mx-auto max-w-[1440px] px-4 py-20 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
          <SectionHeading
            eyebrow="Campus Operations"
            title="Real-Time Campus Telemetry"
            desc="High-density KPI matrix streaming from 1,000+ IoT sensor beacons deployed across academic blocks, labs, and residential zones."
          />
        </div>
        <BentoStats />
      </section>

      {/* ENERGY GRID & FLOW */}
      <section id="energy" className="scroll-mt-20 relative mx-auto max-w-[1440px] px-4 py-16 sm:px-8 border-t border-white/5 bg-gradient-to-b from-transparent to-amber-950/10">
        <SectionHeading
          eyebrow="Grid Intelligence"
          title="Power Distribution & Solar Generation"
          desc="Real-time energy routing between the 480 kWp rooftop solar arrays, 1.2 MWh BESS battery, and campus distribution grid."
        />
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-5 mt-8">
          <div className="xl:col-span-3 rounded-2xl bg-black/20 p-3 border border-white/5 shadow-xl">
            <SankeyEnergyFlow />
          </div>
          <div className="flex flex-col gap-6 xl:col-span-2">
            <div className="glass-panel flex-1 rounded-2xl p-6 flex flex-col shadow-xl">
              <h3 className="font-display text-lg font-semibold text-white">24-Hour Demand vs. Solar Yield</h3>
              <p className="mb-4 text-xs text-slate-400">
                Predictive load forecasting contrasting solar generation against chiller, GPU lab, and hostel loads.
              </p>
              <div className="flex-1 min-h-[240px]">
                <EnergyTrendChart />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SPACE UTILIZATION & TIMELINE */}
      <section id="spaces" className="scroll-mt-20 relative mx-auto max-w-[1440px] px-4 py-20 sm:px-8">
        <SectionHeading
          eyebrow="Space Intelligence"
          title="Classroom Scheduling & Spatial Allocation"
          desc="Live occupancy mapping with ghost-booking reclamation across engineering blocks, business school, and research commons."
        />
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-5 mt-8">
          <div className="xl:col-span-3 rounded-2xl border border-white/5 bg-[#0a1120] p-4 shadow-xl">
            <RoomTimeline />
          </div>
          <div className="xl:col-span-2 flex">
            <MiniMapCard />
          </div>
        </div>
      </section>

      {/* CAPSTONE BAND */}
      <section className="relative mx-auto max-w-[1440px] px-4 pb-20 pt-6 sm:px-8">
        <div className="glass-panel relative overflow-hidden rounded-3xl px-6 py-14 text-center sm:px-16 border border-[#e5b887]/20 bg-gradient-to-b from-amber-950/20 via-[#0d1527]/40 to-transparent shadow-2xl">
          <div className="pointer-events-none absolute -top-32 left-1/2 h-72 w-[130%] -translate-x-1/2 rounded-full bg-[#e5b887]/15 blur-[100px]" />
          <GraduationCap size={28} className="relative mx-auto mb-3 text-[#e5b887]" />
          <h2 className="relative font-display text-2xl font-semibold text-white sm:text-3xl">
            Alliance University · Department of Computer Science & Engineering
          </h2>
          <p className="relative mx-auto mt-3 max-w-xl text-sm text-slate-300 leading-relaxed font-serif italic">
            "Flagship Engineering Capstone — demonstrating applied Three.js WebGL simulation, IoT telemetry streaming,
            predictive ML forecasting, and autonomous facility control at campus scale."
          </p>
          <div className="relative mt-6 flex flex-wrap items-center justify-center gap-3 font-mono text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5 rounded-full border border-white/10 px-3.5 py-1.5 bg-white/[0.02]">
              <ShieldCheck size={13} className="text-[#86a397]" /> Dept. of CSE Capstone
            </span>
            <span className="rounded-full border border-white/10 px-3.5 py-1.5 bg-white/[0.02]">
              Anekal Campus · 60 Acres
            </span>
            <span className="rounded-full border border-white/10 px-3.5 py-1.5 bg-white/[0.02]">
              Class of 2026
            </span>
          </div>
        </div>
      </section>

      <Footer />

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomBar
        activeSection={activeSection}
        onSelectSection={setActiveSection}
        onOpenManualControls={() => {
          const el = document.getElementById("twin");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }}
      />
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  desc,
  className = "",
}: {
  eyebrow: string;
  title: string;
  desc: string;
  className?: string;
}) {
  return (
    <div className={`max-w-2xl ${className}`}>
      <span className="font-mono text-[10.5px] uppercase tracking-[0.25em] text-amber-400/90 font-semibold">{eyebrow}</span>
      <h2 className="mt-2 font-display text-2xl font-semibold text-white sm:text-3xl tracking-tight">{title}</h2>
      <p className="mt-2 text-sm text-slate-300 leading-relaxed font-sans">{desc}</p>
    </div>
  );
}
