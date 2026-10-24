import { useState, useMemo, Suspense, lazy } from "react";
import { Thermometer, Users, Zap, Volume2, VolumeX, RotateCcw, Boxes, Sparkles, Plus, Minus } from "lucide-react";
import { CAMPUS_BUILDINGS } from "../data/campusData";
import type { HeatmapMode } from "../three/heatmapMaterial";
import type { ManualControlState } from "../types/theme";
import { DEFAULT_MANUAL_STATE } from "../types/theme";
import { useSonar } from "../hooks/useSonar";
import ManualControlDock from "./ManualControlDock";
import BuildingInspectionDrawer from "./BuildingInspectionDrawer";
import ModelImporterModal from "./ModelImporterModal";

const CampusScene = lazy(() => import("../three/CampusScene"));

const MODES: { id: HeatmapMode; label: string; icon: typeof Thermometer; color: string; desc: string }[] = [
  { id: "thermal", label: "Thermal", icon: Thermometer, color: "#f59e0b", desc: "18°C → 32°C" },
  { id: "occupancy", label: "Occupancy", icon: Users, color: "#86a397", desc: "0% → 100%" },
  { id: "energy", label: "Energy", icon: Zap, color: "#d99b5e", desc: "0 → 50 W/m²" },
];

interface DigitalTwinPanelProps {
  manualState?: ManualControlState;
  onManualStateChange?: (updater: (prev: ManualControlState) => ManualControlState) => void;
}

export default function DigitalTwinPanel({
  manualState: extManualState,
  onManualStateChange: extOnChange,
}: DigitalTwinPanelProps) {
  const [internalManualState, setInternalManualState] = useState<ManualControlState>(DEFAULT_MANUAL_STATE);
  const manualState = extManualState || internalManualState;
  const setManualState = extOnChange || setInternalManualState;

  const [mode, setMode] = useState<HeatmapMode>("occupancy");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [importerOpen, setImporterOpen] = useState(false);
  const [customModelUrl, setCustomModelUrl] = useState<string | null>("/alliance_university_campus.glb");
  const [zoomTrigger, setZoomTrigger] = useState<{ dir: "in" | "out"; ts: number } | null>(null);
  const { play, enabled, setEnabled } = useSonar();

  function handleZoom(dir: "in" | "out") {
    setZoomTrigger({ dir, ts: Date.now() });
    play("click");
  }

  const activeBuilding = useMemo(
    () => CAMPUS_BUILDINGS.find((b) => b.id === (selectedId || hoveredId)) ?? null,
    [selectedId, hoveredId]
  );

  const selectedBuilding = useMemo(
    () => CAMPUS_BUILDINGS.find((b) => b.id === selectedId) ?? null,
    [selectedId]
  );

  function handleSelectBuilding(id: string | null) {
    setSelectedId(id);
    setManualState((prev) => ({ ...prev, activeFloorIndex: null }));
    play(id ? "open" : "click");
  }

  function handleResetCamera() {
    setSelectedId(null);
    setManualState((prev) => ({
      ...prev,
      cameraPreset: "overview",
      activeFloorIndex: null,
      explodeAmount: 0,
    }));
    play("click");
  }

  return (
    <div className="relative h-[100vh] w-full overflow-hidden bg-[#070d18]">
      <Suspense
        fallback={
          <div className="flex h-full w-full items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="h-12 w-12 animate-spin-slow rounded-full border-2 border-[#e5b887]/30 border-t-[#e5b887]" />
              <p className="font-mono text-xs tracking-widest text-[#e5b887]/80">INITIALIZING 3D SPATIAL TWIN…</p>
            </div>
          </div>
        }
      >
        <CampusScene
          mode={mode}
          selectedId={selectedId}
          activeFloorIndex={manualState.activeFloorIndex}
          explodeAmount={manualState.explodeAmount}
          timeOfDay={manualState.timeOfDay}
          weather={manualState.weather}
          cameraPreset={manualState.cameraPreset}
          customModelUrl={customModelUrl}
          zoomTrigger={zoomTrigger}
          setSelectedId={handleSelectBuilding}
          onHoverChange={setHoveredId}
        />
      </Suspense>

      {/* Cinematic Vignette & Edge Shadowing */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(7,13,24,0.88)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#070d18] to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#070d18] to-transparent" />

      {/* Top Controls Bar (Cleanly aligned beneath Navbar at top-24, keeping the center sky 100% open and never colliding with the header) */}
      <div className="absolute right-4 top-24 z-20 flex flex-wrap items-center justify-end gap-2 sm:top-24 sm:right-8">
        {/* Mode Switcher HUD */}
        <div className="flex items-center gap-1 rounded-2xl border border-white/10 bg-[#090a0f]/85 p-1.5 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
          <span className="hidden font-mono text-[9px] uppercase tracking-wider text-slate-400 px-2 lg:inline">
            Heatmap Layer
          </span>
          {MODES.map((m) => {
            const Icon = m.icon;
            const active = mode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => {
                  setMode(m.id);
                  play("click");
                }}
                className="group relative flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-mono font-medium transition-all cursor-pointer"
                style={{
                  background: active ? `${m.color}22` : "transparent",
                  color: active ? m.color : "#94a3b8",
                }}
              >
                {active && (
                  <span
                    className="absolute inset-0 rounded-xl border"
                    style={{ borderColor: `${m.color}55`, boxShadow: `0 0 16px ${m.color}33` }}
                  />
                )}
                <Icon size={13} className="relative" />
                <span className="relative hidden sm:inline">{m.label}</span>
              </button>
            );
          })}
        </div>

        {/* Realistic 3D Model vs IoT Twin Switcher */}
        <button
          onClick={() => {
            setCustomModelUrl((curr) => (curr ? null : "/alliance_university_campus.glb"));
            play("click");
          }}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl border text-xs font-mono backdrop-blur-2xl transition shadow-[0_8px_32px_rgba(0,0,0,0.5)] cursor-pointer ${
            customModelUrl
              ? "border-[#e5b887] bg-[#e5b887]/20 text-[#e5b887] font-semibold"
              : "border-white/10 bg-[#090a0f]/85 text-slate-300 hover:text-white"
          }`}
          title="Toggle between Blender Realistic 3D Campus and IoT Telemetry Twin"
        >
          <Sparkles size={13} className={customModelUrl ? "text-[#e5b887]" : "text-slate-400"} />
          <span>{customModelUrl ? "Realistic 3D" : "Telemetry Twin"}</span>
        </button>

        {/* 3D Importer & Studio Trigger */}
        <button
          onClick={() => setImporterOpen(true)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-2xl border border-[#e5b887]/30 bg-[#090a0f]/85 text-xs font-mono text-[#e5b887] backdrop-blur-2xl hover:bg-[#e5b887]/20 transition shadow-[0_8px_32px_rgba(0,0,0,0.5)] cursor-pointer"
          title="3D Campus Studio & Blender Importer"
        >
          <Boxes size={14} />
          <span className="hidden md:inline">3D Studio</span>
        </button>

        {selectedId && (
          <button
            onClick={handleResetCamera}
            className="flex items-center gap-1.5 px-3 py-2 rounded-2xl border border-white/10 bg-[#090a0f]/85 text-xs font-mono text-slate-300 backdrop-blur-2xl hover:text-white transition shadow-[0_8px_32px_rgba(0,0,0,0.5)] cursor-pointer"
          >
            <RotateCcw size={13} />
            <span className="hidden sm:inline">Overview</span>
          </button>
        )}

        {/* Camera Zoom In / Out Controls */}
        <div className="flex items-center gap-0.5 rounded-2xl border border-white/10 bg-[#090a0f]/85 p-1 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
          <button
            onClick={() => handleZoom("in")}
            className="flex h-7 w-7 items-center justify-center rounded-xl text-slate-300 hover:text-[#e5b887] hover:bg-white/10 transition cursor-pointer"
            title="Zoom In (or hold Shift + scroll)"
            aria-label="Zoom In"
          >
            <Plus size={14} />
          </button>
          <div className="h-3.5 w-px bg-white/10" />
          <button
            onClick={() => handleZoom("out")}
            className="flex h-7 w-7 items-center justify-center rounded-xl text-slate-300 hover:text-[#e5b887] hover:bg-white/10 transition cursor-pointer"
            title="Zoom Out (or hold Shift + scroll)"
            aria-label="Zoom Out"
          >
            <Minus size={14} />
          </button>
        </div>

        <button
          onClick={() => setEnabled(!enabled)}
          className="flex h-9 w-9 items-center justify-center rounded-2xl border border-white/10 bg-[#090a0f]/85 text-slate-400 backdrop-blur-2xl transition hover:text-[#e5b887] shadow-[0_8px_32px_rgba(0,0,0,0.5)] cursor-pointer"
          aria-label="Toggle sound"
        >
          {enabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
        </button>
      </div>

      {/* Live HUD Telemetry Legend (Bottom Left) */}
      <div className="absolute bottom-24 left-6 z-20 hidden flex-col gap-1.5 rounded-2xl border border-white/10 bg-[#0d1527]/80 px-4 py-3 font-mono text-[10px] text-slate-400 backdrop-blur-xl shadow-xl lg:flex">
        <div className="flex items-center justify-between mb-0.5">
          <span className="tracking-widest text-slate-500 uppercase">
            HEATMAP: {MODES.find((m) => m.id === mode)?.desc}
          </span>
          <span className="text-[#e5b887] font-semibold">{manualState.timeOfDay.toFixed(1)}h</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-7 rounded-full bg-gradient-to-r from-[#2a3042] via-[#e5b887] to-[#d99b5e]" />
          <span>Low → Critical load</span>
        </div>
        <div className="mt-1 flex items-center gap-2">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#86a397] shadow-[0_0_8px_#86a397]" />
          <span>Solar PV → Substation feed</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#e5b887] shadow-[0_0_8px_#e5b887]" />
          <span>STP Recirculation loop</span>
        </div>
      </div>

      {/* Building Inspection Drawer (When selected) */}
      <BuildingInspectionDrawer
        building={selectedBuilding}
        activeFloorIndex={manualState.activeFloorIndex}
        onSelectFloor={(floor) => setManualState((p) => ({ ...p, activeFloorIndex: floor }))}
        onClose={() => handleSelectBuilding(null)}
      />

      {/* Hover Tooltip (When hovered but not selected) */}
      {!selectedId && activeBuilding && (
        <div className="pointer-events-none absolute right-6 top-24 z-20 w-72 glass-panel rounded-2xl p-4 border border-white/10 backdrop-blur-xl shadow-2xl animate-fade-in-up">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] font-semibold text-[#e5b887] bg-[#e5b887]/10 px-2 py-0.5 rounded border border-[#e5b887]/30">
              {activeBuilding.code}
            </span>
            <span className="font-mono text-[10px] uppercase text-slate-400">{activeBuilding.type}</span>
          </div>
          <h4 className="font-display text-base font-semibold text-white mt-1">{activeBuilding.name}</h4>
          <p className="text-xs text-slate-400">{activeBuilding.subtitle}</p>
          <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-slate-300 bg-white/[0.02] p-2 rounded-lg border border-white/5">
            <span>{activeBuilding.floors} Floors</span>
            <span className="text-[#e5b887] font-semibold">Click to inspect</span>
          </div>
        </div>
      )}

      {/* macOS Manual Control Dock */}
      <ManualControlDock
        state={manualState}
        onChange={setManualState}
        onResetCamera={handleResetCamera}
        onOpenImporter={() => setImporterOpen(true)}
      />

      {/* 3D Campus Creator & Model Importer Modal */}
      <ModelImporterModal
        open={importerOpen}
        onClose={() => setImporterOpen(false)}
        onCustomModelLoaded={(url) => setCustomModelUrl(url)}
      />
    </div>
  );
}
