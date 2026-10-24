import { useMemo, useState } from "react";
import {
  X,
  Thermometer,
  Users,
  Zap,
  Layers,
  Sparkles,
  SlidersHorizontal,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
} from "lucide-react";
import type { BuildingDef } from "../data/campusData";
import { ROOM_TIMELINE } from "../data/campusData";

interface BuildingInspectionDrawerProps {
  building: BuildingDef | null;
  activeFloorIndex: number | null;
  onSelectFloor: (floor: number | null) => void;
  onClose: () => void;
}

export default function BuildingInspectionDrawer({
  building,
  activeFloorIndex,
  onSelectFloor,
  onClose,
}: BuildingInspectionDrawerProps) {
  const [localHvac, setLocalHvac] = useState<"auto" | "eco" | "boost">("auto");
  const [lightsActive, setLightsActive] = useState(true);

  // Filter associated rooms from timeline
  const buildingRooms = useMemo(() => {
    if (!building) return [];
    return ROOM_TIMELINE.filter(
      (r) => r.room.startsWith(building.code) || r.block.toLowerCase().includes(building.name.toLowerCase().slice(0, 5))
    );
  }, [building]);

  if (!building) return null;

  return (
    <aside
      aria-label="Facility Diagnostic Telemetry"
      className="fixed right-4 top-20 sm:top-24 z-30 w-[min(94vw,380px)] max-h-[calc(100vh-140px)] overflow-y-auto glass-panel rounded-2xl p-5 border border-white/10 shadow-2xl backdrop-blur-2xl animate-fade-in-up text-slate-100"
    >
      {/* Header */}
      <div className="flex items-start justify-between border-b border-white/10 pb-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] font-semibold text-[#e5b887] bg-[#e5b887]/10 border border-[#e5b887]/30 px-2 py-0.5 rounded-md">
              {building.code}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
              {building.type}
            </span>
          </div>
          <h3 className="font-display text-lg font-semibold text-white mt-1">{building.name}</h3>
          <p className="text-xs text-slate-400">{building.subtitle}</p>
        </div>
        <button
          onClick={onClose}
          aria-label="Close building inspection"
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
        >
          <X size={16} />
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-2 text-center mb-4">
        <div className="rounded-xl bg-white/[0.03] border border-white/5 p-2.5">
          <p className="font-mono text-sm font-semibold text-amber-400">
            {(18 + building.thermal * 14).toFixed(1)}°C
          </p>
          <p className="text-[10px] font-mono text-slate-400 flex items-center justify-center gap-1 mt-0.5">
            <Thermometer size={10} /> Temp
          </p>
        </div>
        <div className="rounded-xl bg-white/[0.03] border border-white/5 p-2.5">
          <p className="font-mono text-sm font-semibold text-emerald-400">
            {Math.round(building.occupancy * 100)}%
          </p>
          <p className="text-[10px] font-mono text-slate-400 flex items-center justify-center gap-1 mt-0.5">
            <Users size={10} /> Occupancy
          </p>
        </div>
        <div className="rounded-xl bg-white/[0.03] border border-white/5 p-2.5">
          <p className="font-mono text-sm font-semibold text-[#d99b5e]">
            {Math.round(building.energy * 50)} W/m²
          </p>
          <p className="text-[10px] font-mono text-slate-400 flex items-center justify-center gap-1 mt-0.5">
            <Zap size={10} /> Energy
          </p>
        </div>
      </div>

      {/* Floor Level Isolation Selector */}
      {building.floors > 1 && (
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs font-mono text-slate-300 mb-2">
            <span className="flex items-center gap-1.5">
              <Layers size={13} className="text-[#e5b887]" />
              Floor Isolation Level
            </span>
            {activeFloorIndex !== null && (
              <button
                onClick={() => onSelectFloor(null)}
                className="text-[10px] text-[#e5b887] hover:underline"
              >
                Show All
              </button>
            )}
          </div>
          <div className="grid grid-cols-5 gap-1.5">
            <button
              onClick={() => onSelectFloor(null)}
              className={`py-1.5 px-1 rounded-lg font-mono text-[10px] border transition ${
                activeFloorIndex === null
                  ? "border-[#e5b887] bg-[#e5b887]/20 text-[#e5b887] font-semibold"
                  : "border-white/5 bg-white/[0.02] text-slate-400 hover:bg-white/5"
              }`}
            >
              All
            </button>
            {Array.from({ length: building.floors }, (_, idx) => (
              <button
                key={idx}
                onClick={() => onSelectFloor(idx)}
                className={`py-1.5 px-1 rounded-lg font-mono text-[10px] border transition ${
                  activeFloorIndex === idx
                    ? "border-[#e5b887] bg-[#e5b887]/20 text-[#e5b887] font-semibold shadow-[0_0_8px_rgba(229,184,135,0.3)]"
                    : "border-white/5 bg-white/[0.02] text-slate-400 hover:bg-white/5"
                }`}
              >
                F{idx + 1}
              </button>
            ))}
          </div>
          <p className="text-[10px] font-mono text-slate-500 mt-1.5">
            {activeFloorIndex === null
              ? `Displaying all ${building.floors} architectural levels.`
              : `Floor ${activeFloorIndex + 1} isolated. Upper levels rendered in transparent x-ray.`}
          </p>
        </div>
      )}

      {/* Local Building Actuation */}
      <div className="mb-4 pt-3 border-t border-white/10 space-y-2.5">
        <span className="font-mono text-xs text-slate-300 flex items-center gap-1.5">
          <SlidersHorizontal size={13} className="text-[#d99b5e]" />
          Building Direct Overrides
        </span>
        <div className="grid grid-cols-3 gap-1.5">
          {(["auto", "eco", "boost"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setLocalHvac(mode)}
              className={`py-1.5 px-2 rounded-lg font-mono text-[11px] border capitalize transition ${
                localHvac === mode
                  ? mode === "eco"
                    ? "border-emerald-500 bg-emerald-500/20 text-emerald-300 font-semibold"
                    : mode === "boost"
                    ? "border-amber-500 bg-amber-500/20 text-amber-300 font-semibold"
                    : "border-[#e5b887] bg-[#e5b887]/20 text-[#e5b887] font-semibold"
                  : "border-white/5 bg-white/[0.02] text-slate-400 hover:bg-white/5"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
            <Lightbulb size={12} className={lightsActive ? "text-amber-400" : "text-slate-600"} />
            Corridor & Lab Lighting
          </span>
          <button
            onClick={() => setLightsActive(!lightsActive)}
            className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-medium border transition ${
              lightsActive
                ? "border-amber-500/40 bg-amber-500/10 text-amber-300"
                : "border-slate-700 bg-slate-800 text-slate-500"
            }`}
          >
            {lightsActive ? "ON (Auto-Dim)" : "FORCED OFF"}
          </button>
        </div>
      </div>

      {/* Associated Rooms & Timetable */}
      {buildingRooms.length > 0 && (
        <div className="pt-3 border-t border-white/10">
          <span className="font-mono text-[11px] uppercase tracking-wider text-slate-400 block mb-2">
            Rooms in this Block ({buildingRooms.length})
          </span>
          <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
            {buildingRooms.map((room) => (
              <div
                key={room.room}
                className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02] border border-white/5 text-xs font-mono"
              >
                <div>
                  <p className="font-semibold text-slate-200">{room.room}</p>
                  <p className="text-[10px] text-slate-400">{room.course || room.block}</p>
                </div>
                <span
                  className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border ${
                    room.status === "active"
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                      : room.status === "reclaimed"
                      ? "border-[#86a397]/30 bg-[#86a397]/10 text-[#86a397]"
                      : "border-red-500/30 bg-red-500/10 text-red-300"
                  }`}
                >
                  {room.status === "active" ? (
                    <CheckCircle2 size={10} />
                  ) : (
                    <AlertCircle size={10} />
                  )}
                  {room.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer Info */}
      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-slate-500">
        <span>{building.students?.toLocaleString() || 500} occupant slots</span>
        <span className="flex items-center gap-1 text-[#e5b887]">
          <Sparkles size={10} /> Syncing live
        </span>
      </div>
    </aside>
  );
}
