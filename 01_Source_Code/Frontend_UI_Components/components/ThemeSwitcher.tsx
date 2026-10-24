import { useState } from "react";
import { Sparkles, Palette } from "lucide-react";
import type { DesignTheme } from "../types/theme";
import ThemePreviewStudio, { THEME_PRESETS } from "./ThemePreviewStudio";

interface ThemeSwitcherProps {
  currentTheme: DesignTheme;
  onThemeChange: (theme: DesignTheme) => void;
  className?: string;
}

export default function ThemeSwitcher({
  currentTheme,
  onThemeChange,
  className = "",
}: ThemeSwitcherProps) {
  const [studioOpen, setStudioOpen] = useState(false);

  const activePreset = THEME_PRESETS.find((t) => t.id === currentTheme) || THEME_PRESETS[0];

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      {/* Visual Design Studio Trigger */}
      <button
        onClick={() => setStudioOpen(true)}
        className="group flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/15 bg-white/[0.04] text-xs font-mono text-slate-200 hover:text-white hover:border-white/30 transition-all backdrop-blur-xl shadow-sm hover:scale-[1.02]"
        title="Open Visual Design Studio"
      >
        <span
          className="w-2.5 h-2.5 rounded-full ring-2 ring-white/20 transition-transform group-hover:scale-110"
          style={{ background: activePreset.colors.accentPrimary }}
        />
        <span className="hidden sm:inline font-medium">Theme:</span>
        <span className="font-semibold text-white">
          {activePreset.title.split("·")[0].trim()}
        </span>
        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/10 text-slate-300 font-mono flex items-center gap-1">
          <Palette size={10} /> Preview
        </span>
      </button>

      {/* Full Visual Preview Studio Modal */}
      <ThemePreviewStudio
        currentTheme={currentTheme}
        onThemeChange={onThemeChange}
        isOpen={studioOpen}
        onClose={() => setStudioOpen(false)}
      />
    </div>
  );
}
