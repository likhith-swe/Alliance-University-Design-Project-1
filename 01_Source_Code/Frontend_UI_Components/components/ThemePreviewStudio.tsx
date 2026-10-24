import { useState } from "react";
import { X, Check, Sliders, Volume2, Sparkles, ArrowRight, Eye } from "lucide-react";
import type { DesignTheme } from "../types/theme";

interface ThemePreviewStudioProps {
  currentTheme: DesignTheme;
  onThemeChange: (theme: DesignTheme) => void;
  isOpen: boolean;
  onClose: () => void;
}

export interface ThemeMeta {
  id: DesignTheme;
  title: string;
  tagline: string;
  fontHeadline: string;
  fontBody: string;
  fontClass: string;
  colors: {
    bg: string;
    surface: string;
    accentPrimary: string;
    accentSecondary: string;
    textPrimary: string;
    textMuted: string;
  };
  swatches: string[];
  vibe: string;
  recommended?: boolean;
}

export const THEME_PRESETS: ThemeMeta[] = [
  {
    id: "wispr",
    title: "Wispr Flow · Warm Obsidian",
    tagline: "Editorial Luxury & Warm Champagne (Inspired by Wispr Flow)",
    fontHeadline: "Newsreader (Italic Serif) + Plus Jakarta Sans",
    fontBody: "Warm, human-crafted typography with refined editorial italics.",
    fontClass: "font-serif italic",
    colors: {
      bg: "#090a0f",
      surface: "rgba(22, 24, 33, 0.75)",
      accentPrimary: "#e5b887", // Warm Champagne
      accentSecondary: "#e09f58", // Solar Amber
      textPrimary: "#faf7f2", // Warm Ivory
      textMuted: "#9ca3af",
    },
    swatches: ["#090a0f", "#181a24", "#e5b887", "#e09f58", "#faf7f2", "#86a397"],
    vibe: "Fluid pebble pills, ambient warm glow, zero rigid AI boxes, luxury hardware tactile controls.",
    recommended: true,
  },
  {
    id: "indigo",
    title: "Midnight Indigo & Luminous Pearl",
    tagline: "Deep Cosmic Velvet & High-Contrast Alabaster",
    fontHeadline: "Plus Jakarta Sans Display + JetBrains Mono",
    fontBody: "Clean, ultra-crisp modern sans with luminous specular highlights.",
    fontClass: "font-display font-semibold",
    colors: {
      bg: "#060814",
      surface: "rgba(15, 20, 42, 0.75)",
      accentPrimary: "#818cf8", // Electric Indigo
      accentSecondary: "#38bdf8", // Sky Cyan
      textPrimary: "#f8fafc",
      textMuted: "#94a3b8",
    },
    swatches: ["#060814", "#131836", "#818cf8", "#38bdf8", "#f8fafc", "#34d399"],
    vibe: "Deep space glassmorphism, luminous pearl typography, laser-smooth spring curves.",
  },
  {
    id: "kyoto",
    title: "Kyoto Evergreen & Brushed Gold",
    tagline: "Organic Dark Forest & Architectural Warmth",
    fontHeadline: "Playfair / Newsreader Serif + Inter Sans",
    fontBody: "Architectural stillness, organic botanical tones, matte metallic warmth.",
    fontClass: "font-serif",
    colors: {
      bg: "#050b09",
      surface: "rgba(12, 26, 20, 0.75)",
      accentPrimary: "#4ade80", // Sage Jade
      accentSecondary: "#d4af37", // Brushed Gold
      textPrimary: "#f4f1ea",
      textMuted: "#8da399",
    },
    swatches: ["#050b09", "#0e241c", "#4ade80", "#d4af37", "#f4f1ea", "#a7f3d0"],
    vibe: "Tactile mossy dark tones, soft brushed gold indicators, organic architectural calm.",
  },
];

export default function ThemePreviewStudio({
  currentTheme,
  onThemeChange,
  isOpen,
  onClose,
}: ThemePreviewStudioProps) {
  const [activeTabTheme, setActiveTabTheme] = useState<DesignTheme>(currentTheme);

  if (!isOpen) return null;

  const currentPreset = THEME_PRESETS.find((t) => t.id === activeTabTheme) || THEME_PRESETS[0];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Dimmed backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-2xl transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-4xl rounded-[2.5rem] border border-white/15 bg-[#090b12] text-slate-100 shadow-[0_25px_80px_rgba(0,0,0,0.85)] p-6 sm:p-8 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/10 pb-5 mb-6">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono tracking-wider bg-amber-500/10 text-amber-300 border border-amber-500/30 mb-2">
              <Sparkles size={12} /> VISUAL DESIGN STUDIO · CHOOSE PALETTE
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-semibold text-white tracking-tight">
              Interactive Design System Preview
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Inspect each aesthetic visually — examine the color swatches, editorial typography, and live tactile clickables before applying.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* 3 Theme Tabs with Visual Color Chips */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
          {THEME_PRESETS.map((t) => {
            const isSelected = activeTabTheme === t.id;
            const isApplied = currentTheme === t.id;

            return (
              <button
                key={t.id}
                onClick={() => setActiveTabTheme(t.id)}
                className={`text-left p-4 rounded-2xl border transition-all relative overflow-hidden ${
                  isSelected
                    ? "border-amber-400/60 bg-white/[0.06] shadow-xl ring-1 ring-amber-400/30"
                    : "border-white/10 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/20"
                }`}
              >
                {t.recommended && (
                  <span className="text-[9.5px] font-mono uppercase tracking-widest text-amber-400 font-bold mb-1 block">
                    ★ Wispr Flow Style
                  </span>
                )}
                <h4 className="font-semibold text-white text-base flex items-center justify-between">
                  {t.title.split("·")[0]}
                  {isApplied && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      LIVE
                    </span>
                  )}
                </h4>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">{t.tagline}</p>

                {/* Swatches strip */}
                <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-white/5">
                  {t.swatches.map((hex, i) => (
                    <span
                      key={i}
                      className="h-4 w-5 rounded-md border border-white/15 shadow-sm"
                      style={{ background: hex }}
                      title={hex}
                    />
                  ))}
                </div>
              </button>
            );
          })}
        </div>

        {/* Live Visual Showcase of Selected Theme */}
        <div
          className="rounded-3xl p-6 sm:p-8 border transition-all"
          style={{
            background: currentPreset.colors.bg,
            borderColor: "rgba(255, 255, 255, 0.12)",
            boxShadow: `0 0 40px ${currentPreset.colors.accentPrimary}15`,
          }}
        >
          {/* Headline & Typography Preview */}
          <div className="mb-6">
            <span
              className="text-xs font-mono tracking-widest uppercase block mb-2"
              style={{ color: currentPreset.colors.accentPrimary }}
            >
              TYPOGRAPHY PREVIEW · {currentPreset.fontHeadline}
            </span>
            <h3
              className={`text-2xl sm:text-4xl text-white tracking-tight leading-tight ${currentPreset.fontClass}`}
            >
              Alliance University,{" "}
              <span style={{ color: currentPreset.colors.accentPrimary }}>
                Rendered in Living Motion.
              </span>
            </h3>
            <p className="text-sm mt-3 leading-relaxed" style={{ color: currentPreset.colors.textMuted }}>
              {currentPreset.fontBody} Seamless cyber-physical intelligence without clunky AI boxes.
            </p>
          </div>

          {/* Color Palette Cards */}
          <div className="mb-6">
            <span
              className="text-xs font-mono tracking-widest uppercase block mb-3"
              style={{ color: currentPreset.colors.accentPrimary }}
            >
              COLOR SPECIFICATION
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { label: "Deep Canvas", val: currentPreset.colors.bg },
                { label: "Surface Glass", val: currentPreset.colors.surface },
                { label: "Primary Accent", val: currentPreset.colors.accentPrimary },
                { label: "Secondary Accent", val: currentPreset.colors.accentSecondary },
              ].map((c, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl border border-white/10 flex items-center gap-2.5"
                  style={{ background: "rgba(255, 255, 255, 0.03)" }}
                >
                  <span
                    className="w-7 h-7 rounded-lg shrink-0 border border-white/20 shadow-sm"
                    style={{ background: c.val }}
                  />
                  <div>
                    <p className="text-[10px] font-mono text-slate-400 uppercase">{c.label}</p>
                    <p className="text-xs font-mono font-semibold text-white truncate">{c.val}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Clickable UI Elements (No AI boxes!) */}
          <div className="mb-6">
            <span
              className="text-xs font-mono tracking-widest uppercase block mb-3"
              style={{ color: currentPreset.colors.accentPrimary }}
            >
              TACTILE CLICKABLE COMPONENTS (NO GENERIC BOXES)
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Sample 1: Pill Slider / Capsule Control */}
              <div
                className="p-4 rounded-[1.5rem] border border-white/10 flex flex-col justify-between"
                style={{ background: "rgba(255,255,255,0.02)" }}
              >
                <div className="flex justify-between items-center text-xs font-mono mb-2">
                  <span className="text-slate-300">HVAC Actuator</span>
                  <span style={{ color: currentPreset.colors.accentPrimary }}>22.5°C</span>
                </div>
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden p-0.5">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: "68%",
                      background: `linear-gradient(90deg, ${currentPreset.colors.accentPrimary}, ${currentPreset.colors.accentSecondary})`,
                    }}
                  />
                </div>
                <p className="text-[10px] font-mono text-slate-400 mt-2">Smooth fluid tactile capsule</p>
              </div>

              {/* Sample 2: Pill Segmented Switch */}
              <div
                className="p-4 rounded-[1.5rem] border border-white/10 flex flex-col justify-between"
                style={{ background: "rgba(255,255,255,0.02)" }}
              >
                <span className="text-xs font-mono text-slate-300 mb-2">Power Shaving Mode</span>
                <div className="flex items-center p-1 rounded-full bg-black/40 border border-white/10">
                  <button
                    className="flex-1 py-1 rounded-full text-[10px] font-mono font-semibold shadow-md transition"
                    style={{
                      background: currentPreset.colors.accentPrimary,
                      color: "#000",
                    }}
                  >
                    BESS AUTO
                  </button>
                  <button className="flex-1 py-1 rounded-full text-[10px] font-mono text-slate-400">
                    MANUAL
                  </button>
                </div>
                <p className="text-[10px] font-mono text-slate-400 mt-2">Milled capsule toggle</p>
              </div>

              {/* Sample 3: Fluid Action Button */}
              <div
                className="p-4 rounded-[1.5rem] border border-white/10 flex flex-col justify-between"
                style={{ background: "rgba(255,255,255,0.02)" }}
              >
                <span className="text-xs font-mono text-slate-300 mb-2">Facility Overrides</span>
                <button
                  className="w-full py-2 px-4 rounded-full font-mono text-xs font-semibold flex items-center justify-center gap-2 transition hover:scale-[1.02]"
                  style={{
                    background: `linear-gradient(135deg, ${currentPreset.colors.accentPrimary}, ${currentPreset.colors.accentSecondary})`,
                    color: "#090a0f",
                    boxShadow: `0 4px 20px ${currentPreset.colors.accentPrimary}44`,
                  }}
                >
                  <Sliders size={13} />
                  ACTUATE GRID
                </button>
                <p className="text-[10px] font-mono text-slate-400 mt-2">Glow pill clickable</p>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
            <p className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
              <Eye size={14} style={{ color: currentPreset.colors.accentPrimary }} />
              Theme applied immediately to 3D scene, navigation, and telemetry.
            </p>
            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                onClick={() => {
                  onThemeChange(activeTabTheme);
                  onClose();
                }}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full font-mono text-xs font-semibold flex items-center justify-center gap-2 transition hover:scale-[1.03]"
                style={{
                  background: currentPreset.colors.accentPrimary,
                  color: "#090a0f",
                  boxShadow: `0 0 25px ${currentPreset.colors.accentPrimary}55`,
                }}
              >
                <Check size={14} strokeWidth={3} />
                APPLY THIS DESIGN THEME
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
