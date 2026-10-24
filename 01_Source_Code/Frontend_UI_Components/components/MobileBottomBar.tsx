import { Box, Activity, Zap, Calendar, Sliders } from "lucide-react";

interface MobileBottomBarProps {
  activeSection: string;
  onSelectSection: (section: string) => void;
  onOpenManualControls: () => void;
}

export default function MobileBottomBar({
  activeSection,
  onSelectSection,
  onOpenManualControls,
}: MobileBottomBarProps) {
  const items = [
    { id: "twin", label: "3D Twin", icon: Box },
    { id: "insights", label: "Telemetry", icon: Activity },
    { id: "energy", label: "Energy", icon: Zap },
    { id: "spaces", label: "Rooms", icon: Calendar },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 inset-x-0 z-40 glass-panel border-t border-white/10 bg-[#070d18]/90 backdrop-blur-xl px-2 py-1.5 flex items-center justify-around"
    >
      {items.map((item) => {
        const Icon = item.icon;
        const active = activeSection === item.id;
        return (
          <button
            key={item.id}
            onClick={() => {
              onSelectSection(item.id);
              const el = document.getElementById(item.id);
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition ${
              active ? "text-[#e5b887] font-semibold" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Icon size={18} />
            <span className="text-[10px] font-mono">{item.label}</span>
          </button>
        );
      })}

      <button
        onClick={onOpenManualControls}
        className="flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl text-[#d99b5e] hover:text-[#e5b887] transition"
      >
        <Sliders size={18} />
        <span className="text-[10px] font-mono">Control</span>
      </button>
    </nav>
  );
}
