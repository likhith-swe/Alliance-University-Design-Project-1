import { useState, useEffect } from "react";
import {
  Sun,
  Moon,
  CloudRain,
  Cloud,
  Compass,
  Zap,
  Droplets,
  Thermometer,
  Sliders,
  Maximize2,
  ChevronDown,
  Layers,
  Boxes,
} from "lucide-react";
import type { ManualControlState, WeatherType, CameraPreset } from "../types/theme";

interface ManualControlDockProps {
  state: ManualControlState;
  onChange: (updater: (prev: ManualControlState) => ManualControlState) => void;
  onResetCamera: () => void;
  onOpenImporter?: () => void;
  className?: string;
}

export default function ManualControlDock({
  state,
  onChange,
  onResetCamera,
  onOpenImporter,
  className = "",
}: ManualControlDockProps) {
  const [activeTab, setActiveTab] = useState<"env" | "actuators" | "camera" | "layers" | null>(null);
  const [minimized, setMinimized] = useState(false);
  const [scrolledPast, setScrolledPast] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolledPast(window.scrollY > 80);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function formatTime(hours: number) {
    const h = Math.floor(hours);
    const m = Math.floor((hours - h) * 60);
    const ampm = h >= 12 ? "PM" : "AM";
    const displayH = h % 12 === 0 ? 12 : h % 12;
    return `${displayH}:${m.toString().padStart(2, "0")} ${ampm}`;
  }

  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 transition-all duration-500 ${
        scrolledPast ? "opacity-0 translate-y-28 pointer-events-none" : "opacity-100 translate-y-0"
      } ${className}`}
    >
      {/* Expanded Control Card */}
      {!minimized && activeTab && (
        <div className="glass-panel w-[min(94vw,560px)] rounded-2xl p-4 sm:p-5 shadow-2xl animate-fade-in-up border border-white/10 backdrop-blur-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
            <span className="font-mono text-xs uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Sliders size={13} className="text-[#e5b887]" />
              Manual Facility Actuators
            </span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] text-[#e5b887] bg-[#e5b887]/10 border border-[#e5b887]/30 px-2 py-0.5 rounded-full">
                LIVE OVERRIDE
              </span>
              <button
                onClick={() => setActiveTab(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition"
              >
                <ChevronDown size={15} />
              </button>
            </div>
          </div>

          {/* Tab 1: Environment (Time of Day & Weather) */}
          {activeTab === "env" && (
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center text-xs mb-1.5 font-mono">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    {state.timeOfDay >= 18 || state.timeOfDay < 7 ? (
                      <Moon size={13} className="text-indigo-400" />
                    ) : (
                      <Sun size={13} className="text-amber-400" />
                    )}
                    Solar Time of Day
                  </span>
                  <span className="text-amber-400 font-semibold">{formatTime(state.timeOfDay)}</span>
                </div>
                <input
                  type="range"
                  min={6}
                  max={22}
                  step={0.25}
                  value={state.timeOfDay}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    onChange((p) => ({ ...p, timeOfDay: val }));
                  }}
                  className="w-full accent-amber-400 h-1.5 bg-slate-700/60 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                  <span>06:00 Dawn</span>
                  <span>12:00 Midday</span>
                  <span>17:30 Sunset</span>
                  <span>22:00 Night</span>
                </div>
              </div>

              {/* Weather selector */}
              <div>
                <span className="text-xs font-mono text-slate-300 block mb-2">Simulated Weather Dynamics</span>
                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      { id: "clear", label: "Clear Sky", icon: Sun },
                      { id: "rain", label: "Precipitation", icon: CloudRain },
                      { id: "fog", label: "Atmospheric Mist", icon: Cloud },
                    ] as { id: WeatherType; label: string; icon: typeof Sun }[]
                  ).map((w) => {
                    const Icon = w.icon;
                    const active = state.weather === w.id;
                    return (
                      <button
                        key={w.id}
                        onClick={() => onChange((p) => ({ ...p, weather: w.id }))}
                        className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-mono transition-all ${
                          active
                            ? "border-[#e5b887] bg-[#e5b887]/15 text-[#e5b887] shadow-[0_0_12px_rgba(229,184,135,0.3)]"
                            : "border-white/5 bg-white/[0.02] text-slate-400 hover:text-slate-200 hover:bg-white/5"
                        }`}
                      >
                        <Icon size={13} />
                        {w.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Grid & Facility Actuators */}
          {activeTab === "actuators" && (
            <div className="space-y-3.5">
              {/* BESS Mode */}
              <div>
                <div className="flex justify-between items-center text-xs mb-2 font-mono">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <Zap size={13} className="text-amber-400" />
                    1.2 MWh BESS Battery Mode
                  </span>
                  <span className="text-amber-400 uppercase font-semibold">{state.bessMode}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {(["auto", "discharge", "charge"] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => onChange((p) => ({ ...p, bessMode: mode }))}
                      className={`py-1.5 px-3 rounded-xl border text-xs font-mono uppercase transition-all ${
                        state.bessMode === mode
                          ? "border-amber-500 bg-amber-500/15 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.3)]"
                          : "border-white/5 bg-white/[0.02] text-slate-400 hover:bg-white/5"
                      }`}
                    >
                      {mode === "discharge" ? "Discharge (310kW)" : mode}
                    </button>
                  ))}
                </div>
              </div>

              {/* Water distribution pumps */}
              <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Droplets size={14} className="text-[#86a397]" />
                  <div>
                    <p className="text-xs text-slate-200 font-mono">Main STP Sump Lift Pump</p>
                    <p className="text-[10px] text-slate-500 font-mono">421 kL reserve level</p>
                  </div>
                </div>
                <button
                  onClick={() => onChange((p) => ({ ...p, waterPumpActive: !p.waterPumpActive }))}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-semibold transition ${
                    state.waterPumpActive
                      ? "border-emerald-500 bg-emerald-500/20 text-emerald-300"
                      : "border-red-500/40 bg-red-500/10 text-red-400"
                  }`}
                >
                  {state.waterPumpActive ? "PUMP ACTIVE" : "PUMP STOPPED"}
                </button>
              </div>

              {/* Global HVAC Setpoint */}
              <div className="pt-2 border-t border-white/5">
                <div className="flex justify-between items-center text-xs mb-1.5 font-mono">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <Thermometer size={13} className="text-[#d99b5e]" />
                    Campus Chiller Setpoint
                  </span>
                  <span className="text-[#d99b5e] font-semibold">{state.globalTempSetpoint.toFixed(1)}°C</span>
                </div>
                <input
                  type="range"
                  min={19}
                  max={26}
                  step={0.5}
                  value={state.globalTempSetpoint}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    onChange((p) => ({ ...p, globalTempSetpoint: val }));
                  }}
                  className="w-full accent-[#d99b5e] h-1.5 bg-slate-700/60 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* Tab 3: Camera Presets */}
          {activeTab === "camera" && (
            <div className="space-y-2">
              <span className="text-xs font-mono text-slate-400 block mb-1">Architectural Waypoints</span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {(
                  [
                    { id: "overview", label: "Campus Aerial" },
                    { id: "admin", label: "Admin Dome" },
                    { id: "library", label: "Central Library" },
                    { id: "engineering", label: "ACED Labs" },
                    { id: "hostels", label: "Hostels Wing" },
                    { id: "energy", label: "Substation & Solar" },
                  ] as { id: CameraPreset; label: string }[]
                ).map((cam) => (
                  <button
                    key={cam.id}
                    onClick={() => {
                      onChange((p) => ({ ...p, cameraPreset: cam.id }));
                      if (cam.id === "overview") onResetCamera();
                    }}
                    className={`p-2.5 rounded-xl border text-xs font-mono text-left transition ${
                      state.cameraPreset === cam.id
                        ? "border-[#e5b887] bg-[#e5b887]/15 text-[#e5b887]"
                        : "border-white/5 bg-white/[0.02] text-slate-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <Compass size={12} className="inline mr-1.5 text-slate-500" />
                    {cam.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tab 4: 3D Layers & Bounded Floor Separation */}
          {activeTab === "layers" && (
            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center text-xs mb-1.5 font-mono">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <Layers size={13} className="text-[#e5b887]" />
                    Floor Separation Degree
                  </span>
                  <span className="text-[#e5b887] font-semibold">{Math.round(state.explodeAmount * 100)}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={state.explodeAmount}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    onChange((p) => ({ ...p, explodeAmount: val }));
                  }}
                  className="w-full accent-[#e5b887] h-1.5 bg-slate-700/60 rounded-lg cursor-pointer"
                />
                <p className="text-[10px] font-mono text-slate-500 mt-1">
                  Bounded micro-separation — allows inspecting floor plates without dislocating building geometry.
                </p>
              </div>

              {state.activeFloorIndex !== null && (
                <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-300">
                    Active Inspection: Floor {state.activeFloorIndex + 1}
                  </span>
                  <button
                    onClick={() => onChange((p) => ({ ...p, activeFloorIndex: null }))}
                    className="text-[11px] font-mono text-[#e5b887] hover:underline"
                  >
                    Reset to All Floors
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Floating Dock Bar */}
      <div className="glass-panel flex items-center gap-1.5 p-1.5 rounded-2xl border border-white/15 backdrop-blur-2xl shadow-xl">
        <button
          onClick={() => setActiveTab(activeTab === "env" ? null : "env")}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl font-mono text-xs transition-all ${
            activeTab === "env"
              ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
              : "text-slate-300 hover:bg-white/10 hover:text-white"
          }`}
        >
          <Sun size={14} className="text-amber-400" />
          <span className="hidden sm:inline">Atmosphere</span>
        </button>

        <button
          onClick={() => setActiveTab(activeTab === "actuators" ? null : "actuators")}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl font-mono text-xs transition-all ${
            activeTab === "actuators"
              ? "bg-[#d99b5e]/20 text-[#d99b5e] border border-[#d99b5e]/40"
              : "text-slate-300 hover:bg-white/10 hover:text-white"
          }`}
        >
          <Sliders size={14} className="text-[#d99b5e]" />
          <span className="hidden sm:inline">Manual Control</span>
        </button>

        <button
          onClick={() => setActiveTab(activeTab === "camera" ? null : "camera")}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl font-mono text-xs transition-all ${
            activeTab === "camera"
              ? "bg-[#e5b887]/20 text-[#e5b887] border border-[#e5b887]/40"
              : "text-slate-300 hover:bg-white/10 hover:text-white"
          }`}
        >
          <Compass size={14} className="text-[#e5b887]" />
          <span className="hidden sm:inline">Waypoints</span>
        </button>

        <button
          onClick={() => setActiveTab(activeTab === "layers" ? null : "layers")}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl font-mono text-xs transition-all ${
            activeTab === "layers"
              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
              : "text-slate-300 hover:bg-white/10 hover:text-white"
          }`}
        >
          <Layers size={14} className="text-emerald-400" />
          <span className="hidden sm:inline">Floors</span>
        </button>

        {onOpenImporter && (
          <button
            onClick={onOpenImporter}
            className="flex items-center gap-2 px-3 py-2 rounded-xl font-mono text-xs transition-all bg-[#e5b887]/15 text-[#e5b887] border border-[#e5b887]/30 hover:bg-[#e5b887]/25"
            title="Import 3D Model / Blender Guide"
          >
            <Boxes size={14} className="text-[#e5b887]" />
            <span className="hidden sm:inline">3D Studio &amp; CAD</span>
          </button>
        )}

        <div className="w-px h-5 bg-white/10 mx-0.5" />

        <button
          onClick={onResetCamera}
          title="Reset Camera"
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition"
        >
          <Maximize2 size={13} />
        </button>
      </div>
    </div>
  );
}
