import { useEffect, useState } from "react";
import { Command, Radar, Menu, X, Cpu, Brain } from "lucide-react";
import ThemeSwitcher from "./ThemeSwitcher";
import type { DesignTheme } from "../types/theme";

const LINKS = [
  { href: "#twin", label: "3D Twin" },
  { href: "#insights", label: "Telemetry" },
  { href: "#energy", label: "Energy Grid" },
  { href: "#spaces", label: "Space & Rooms" },
];

interface NavbarProps {
  currentTheme: DesignTheme;
  onThemeChange: (theme: DesignTheme) => void;
  onOpenPalette: () => void;
  onOpenBrain?: () => void;
}

export default function Navbar({
  currentTheme,
  onThemeChange,
  onOpenPalette,
  onOpenBrain,
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [now, setNow] = useState(new Date());
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearInterval(timer);
    };
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-white/10 bg-[#070d18]/85 backdrop-blur-2xl shadow-xl"
          : "bg-gradient-to-b from-[#070d18]/90 via-[#070d18]/40 to-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 sm:px-8">
        <a href="#top" className="flex items-center gap-3 group">
          <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#e5b887]/20 to-[#d99b5e]/20 ring-1 ring-[#e5b887]/40 shadow-[0_0_12px_rgba(229,184,135,0.25)] p-1 overflow-hidden">
            <img
              src="/Alliance_University_Icon.svg"
              alt="Alliance University Crest"
              className="h-full w-full object-contain filter drop-shadow group-hover:scale-110 transition-transform duration-300"
            />
            <span className="absolute inset-0 animate-pulse-ring rounded-xl border border-[#e5b887]/50 pointer-events-none" />
          </span>
          <div>
            <span className="font-display text-[15px] font-semibold tracking-tight text-white block leading-tight">
              ALLIANCE UNIVERSITY<span className="text-[#e5b887]">.</span>
            </span>
            <span className="hidden font-mono text-[9px] uppercase tracking-widest text-[#e5b887]/70 sm:block">
              Smart Campus Digital Twin
            </span>
          </div>
        </a>

        {/* Desktop Links */}
        <nav className="hidden items-center gap-1 lg:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-xl px-3.5 py-1.5 text-xs font-mono font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* Right Action Tools */}
        <div className="flex items-center gap-2.5">
          {/* Live Theme Switcher */}
          <ThemeSwitcher
            currentTheme={currentTheme}
            onThemeChange={onThemeChange}
          />

          {/* Time Display */}
          <div className="hidden font-mono text-[11px] text-slate-400 xl:flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/[0.02] border border-white/5">
            <Cpu size={11} className="text-emerald-400" />
            {now.toLocaleTimeString("en-IN", { hour12: false })} IST
          </div>

          {/* Campus Brain Trigger */}
          {onOpenBrain && (
            <button
              onClick={onOpenBrain}
              className="group flex items-center gap-1.5 rounded-xl border border-[#e5b887]/30 bg-[#e5b887]/10 px-3 py-1.5 text-xs font-mono text-[#e5b887] transition hover:border-[#e5b887]/60 hover:bg-[#e5b887]/20 shadow-sm cursor-pointer"
              title="Campus Brain · Autonomous Research & Model Training"
            >
              <Brain size={13} className="text-[#e5b887] group-hover:scale-110 transition-transform" />
              <span className="hidden md:inline font-medium">Campus Brain</span>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </button>
          )}

          {/* Copilot Trigger */}
          <button
            onClick={onOpenPalette}
            className="group flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-mono text-slate-300 transition hover:border-[#e5b887]/50 hover:bg-[#e5b887]/10 hover:text-white shadow-sm cursor-pointer"
          >
            <Command size={13} className="text-[#e5b887] group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline">Copilot</span>
            <span className="kbd hidden sm:inline text-[10px]">⌘K</span>
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            className="rounded-xl p-2 text-slate-400 hover:text-white hover:bg-white/5 lg:hidden"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileOpen && (
        <div className="border-t border-white/10 bg-[#070d18]/98 px-5 py-4 backdrop-blur-2xl lg:hidden animate-fade-in-down shadow-2xl">
          <div className="space-y-1">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="block rounded-xl px-4 py-2.5 font-mono text-sm text-slate-200 hover:bg-white/10 hover:text-[#e5b887] transition"
              >
                {l.label}
              </a>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Alliance University · Dept. of CSE</span>
            <span>Live Telemetry</span>
          </div>
        </div>
      )}
    </header>
  );
}
