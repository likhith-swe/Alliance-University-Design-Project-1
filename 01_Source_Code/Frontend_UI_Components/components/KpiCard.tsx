import { useRef } from "react";
import {
  Zap,
  Sun,
  Droplets,
  LayoutGrid,
  Leaf,
  RadioTower,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  zap: Zap,
  sun: Sun,
  droplets: Droplets,
  "layout-grid": LayoutGrid,
  leaf: Leaf,
  "radio-tower": RadioTower,
};

interface KpiCardProps {
  label: string;
  value: string;
  unit: string;
  sub: string;
  pct: number;
  color: string;
  icon: string;
  className?: string;
}

export default function KpiCard({ label, value, unit, sub, pct, color, icon, className = "" }: KpiCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const Icon = ICONS[icon] ?? Zap;

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--y", `${e.clientY - rect.top}px`);
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      className={`group relative flex flex-col justify-between overflow-hidden rounded-[2rem] border border-[rgba(229,184,135,0.12)] bg-[rgba(15,18,28,0.7)] backdrop-blur-2xl p-6 sm:p-7 shadow-[0_12px_36px_rgba(0,0,0,0.35)] transition-all duration-300 hover:-translate-y-1.5 hover:border-[rgba(229,184,135,0.3)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_24px_rgba(229,184,135,0.1)] ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(320px circle at var(--x,50%) var(--y,50%), ${color}22, transparent 65%)`,
        }}
      />
      <div className="relative flex items-start justify-between">
        <div
          className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 shadow-sm"
          style={{ background: `${color}18`, color }}
        >
          <Icon size={19} />
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-400 font-medium">{label}</span>
      </div>

      <div className="relative mt-6">
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-3xl font-semibold tracking-tight text-white sm:text-[36px]">{value}</span>
          <span className="font-mono text-xs text-[#e5b887] font-medium">{unit}</span>
        </div>
        <p className="mt-1.5 text-[13px] text-slate-300 leading-snug">{sub}</p>
      </div>

      <div className="relative mt-5 h-2 w-full overflow-hidden rounded-full bg-white/[0.04] p-0.5 border border-white/[0.06]">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}88, ${color})`, boxShadow: `0 0 12px ${color}66` }}
        />
      </div>
    </div>
  );
}
