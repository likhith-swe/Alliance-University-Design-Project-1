import { useState } from "react";
import { CheckCircle2, Ghost, Clock, PlayCircle } from "lucide-react";
import { ROOM_TIMELINE, type RoomBooking } from "../data/campusData";

const START = 8;
const END = 21;
const SPAN = END - START;

const STATUS_STYLE: Record<RoomBooking["status"], { bg: string; label: string; icon: typeof CheckCircle2 }> = {
  active: { bg: "#86a397", label: "Active", icon: PlayCircle },
  reclaimed: { bg: "#d99b5e", label: "AI-Reclaimed", icon: Ghost },
  scheduled: { bg: "#e5b887", label: "Scheduled", icon: Clock },
  ghost: { bg: "#ef4444", label: "Ghost booking", icon: Ghost },
};

function pct(hour: number) {
  return Math.min(Math.max(((hour - START) / SPAN) * 100, 0), 100);
}

export default function RoomTimeline() {
  const [hovered, setHovered] = useState<string | null>(null);
  const now = 14.6; // simulated "current time" marker

  return (
    <div className="glass-panel rounded-2xl p-5 sm:p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-semibold text-white">Spatial-Temporal Room Timeline</h3>
          <p className="text-xs text-slate-400">Scheduled vs. actual occupancy · AI ghost-booking auto-reclaim engine</p>
        </div>
        <div className="flex flex-wrap gap-3 font-mono text-[10px] text-slate-400">
          {Object.entries(STATUS_STYLE).map(([key, s]) => (
            <span key={key} className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: s.bg }} />
              {s.label}
            </span>
          ))}
        </div>
      </div>

      {/* hour ruler */}
      <div className="relative mb-2 ml-[104px] flex justify-between font-mono text-[10px] text-slate-500 sm:ml-[140px]">
        {Array.from({ length: SPAN + 1 }, (_, i) => START + i)
          .filter((h) => h % 2 === 0)
          .map((h) => (
            <span key={h}>{h}:00</span>
          ))}
      </div>

      <div className="relative rounded-xl border border-white/5 bg-black/20 p-3">
        {/* now line */}
        <div
          className="absolute top-3 bottom-3 z-10 w-px bg-amber-400/70"
          style={{ left: `calc(104px + ${pct(now)}% * (100% - 104px) / 100)` }}
        >
          <span className="absolute -top-2.5 -translate-x-1/2 rounded bg-amber-400 px-1.5 py-0.5 font-mono text-[9px] font-bold text-black">
            NOW
          </span>
        </div>

        <div className="flex flex-col gap-2.5">
          {ROOM_TIMELINE.map((r) => {
            const style = STATUS_STYLE[r.status];
            const Icon = style.icon;
            const schedLeft = pct(r.scheduled[0]);
            const schedWidth = pct(r.scheduled[1]) - schedLeft;
            const actual = r.actual;
            return (
              <div
                key={r.room}
                className="flex items-center gap-3"
                onMouseEnter={() => setHovered(r.room)}
                onMouseLeave={() => setHovered(null)}
              >
                <div className="w-[92px] shrink-0 sm:w-[128px]">
                  <p className="truncate font-mono text-[11px] font-semibold text-slate-200">{r.room}</p>
                  <p className="truncate text-[10px] text-slate-500">{r.block}</p>
                </div>
                <div className="relative h-7 flex-1 rounded-md bg-white/[0.03]">
                  <div
                    className="absolute top-0.5 h-6 rounded-md border border-dashed opacity-60"
                    style={{ left: `${schedLeft}%`, width: `${schedWidth}%`, borderColor: style.bg }}
                  />
                  {actual && (
                    <div
                      className="absolute top-0.5 h-6 rounded-md transition-all"
                      style={{
                        left: `${pct(actual[0])}%`,
                        width: `${Math.max(pct(actual[1]) - pct(actual[0]), 1.5)}%`,
                        background: `${style.bg}33`,
                        boxShadow: hovered === r.room ? `0 0 14px ${style.bg}77` : "none",
                        borderLeft: `2px solid ${style.bg}`,
                      }}
                    />
                  )}
                  {r.status === "ghost" && (
                    <div
                      className="absolute top-0.5 flex h-6 items-center gap-1 rounded-md border border-dashed border-red-500/60 bg-red-500/10 px-2 font-mono text-[9px] text-red-300"
                      style={{ left: `${schedLeft}%`, width: `${Math.max(schedWidth, 8)}%` }}
                    >
                      <Ghost size={10} /> no-show
                    </div>
                  )}
                </div>
                <div
                  className="hidden w-[112px] shrink-0 items-center gap-1.5 font-mono text-[10px] sm:flex"
                  style={{ color: style.bg }}
                >
                  <Icon size={12} />
                  {style.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <p className="mt-4 text-[11px] text-slate-500">
        Rooms unoccupied for <span className="text-slate-300">15+ minutes</span> past their scheduled start are
        auto-flagged, HVAC switches to <span className="text-emerald-400">Eco-Standby (26°C)</span>, and availability
        updates campus-wide in real time.
      </p>
    </div>
  );
}
