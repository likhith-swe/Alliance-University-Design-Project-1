import { useMemo, useState } from "react";
import { ENERGY_TREND } from "../data/campusData";

const WIDTH = 520;
const HEIGHT = 220;
const PAD = { top: 12, right: 10, bottom: 24, left: 34 };

function buildPath(values: number[], max: number, smooth = true) {
  const innerW = WIDTH - PAD.left - PAD.right;
  const innerH = HEIGHT - PAD.top - PAD.bottom;
  const pts = values.map((v, i) => {
    const x = PAD.left + (i / (values.length - 1)) * innerW;
    const y = PAD.top + innerH - (v / max) * innerH;
    return [x, y] as [number, number];
  });

  if (!smooth) return { line: `M${pts.map((p) => p.join(",")).join("L")}`, pts };

  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, y0] = pts[i];
    const [x1, y1] = pts[i + 1];
    const mx = (x0 + x1) / 2;
    d += ` C${mx},${y0} ${mx},${y1} ${x1},${y1}`;
  }
  return { line: d, pts };
}

export default function EnergyTrendChart() {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const max = 1600;

  const demand = useMemo(() => buildPath(ENERGY_TREND.demand, max), []);
  const solar = useMemo(() => buildPath(ENERGY_TREND.solar, max), []);

  const innerH = HEIGHT - PAD.top - PAD.bottom;
  const innerW = WIDTH - PAD.left - PAD.right;

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full overflow-visible">
        <defs>
          <linearGradient id="demandFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#d99b5e" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#d99b5e" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="solarFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#86a397" stopOpacity={0.45} />
            <stop offset="100%" stopColor="#86a397" stopOpacity={0} />
          </linearGradient>
        </defs>

        {/* gridlines */}
        {[0, 0.25, 0.5, 0.75, 1].map((f) => (
          <line
            key={f}
            x1={PAD.left}
            x2={WIDTH - PAD.right}
            y1={PAD.top + innerH * f}
            y2={PAD.top + innerH * f}
            stroke="rgba(148,163,184,0.08)"
          />
        ))}

        {/* y axis labels */}
        {[0, 800, 1600].map((v) => (
          <text
            key={v}
            x={PAD.left - 8}
            y={PAD.top + innerH - (v / max) * innerH + 3}
            textAnchor="end"
            className="fill-slate-500 font-mono text-[8px]"
          >
            {v}
          </text>
        ))}

        {/* x axis labels */}
        {[0, 6, 12, 18, 23].map((h) => (
          <text
            key={h}
            x={PAD.left + (h / 23) * innerW}
            y={HEIGHT - 6}
            textAnchor="middle"
            className="fill-slate-500 font-mono text-[8px]"
          >
            {String(h).padStart(2, "0")}:00
          </text>
        ))}

        <path d={`${demand.line} L${PAD.left + innerW},${PAD.top + innerH} L${PAD.left},${PAD.top + innerH} Z`} fill="url(#demandFill)" />
        <path d={`${solar.line} L${PAD.left + innerW},${PAD.top + innerH} L${PAD.left},${PAD.top + innerH} Z`} fill="url(#solarFill)" />

        <path d={demand.line} fill="none" stroke="#d99b5e" strokeWidth={2} strokeLinecap="round" />
        <path d={solar.line} fill="none" stroke="#86a397" strokeWidth={2} strokeLinecap="round" />

        {/* hover targets */}
        {demand.pts.map((p, i) => (
          <g key={i}>
            <rect
              x={PAD.left + (i / (demand.pts.length - 1)) * innerW - (innerW / demand.pts.length) / 2}
              y={PAD.top}
              width={innerW / demand.pts.length}
              height={innerH}
              fill="transparent"
              onMouseEnter={() => setHoverIdx(i)}
              onMouseLeave={() => setHoverIdx(null)}
            />
            {hoverIdx === i && (
              <>
                <line x1={p[0]} x2={p[0]} y1={PAD.top} y2={PAD.top + innerH} stroke="rgba(148,163,184,0.3)" strokeDasharray="3 3" />
                <circle cx={p[0]} cy={p[1]} r={3.5} fill="#d99b5e" stroke="#070d18" strokeWidth={1.5} />
                <circle cx={solar.pts[i][0]} cy={solar.pts[i][1]} r={3.5} fill="#86a397" stroke="#070d18" strokeWidth={1.5} />
              </>
            )}
          </g>
        ))}
      </svg>

      <div className="mt-1 flex items-center justify-between font-mono text-[10px] text-slate-400">
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[#d99b5e]" /> Demand
        </span>
        {hoverIdx !== null ? (
          <span className="text-slate-200">
            {String(hoverIdx).padStart(2, "0")}:00 — {ENERGY_TREND.demand[hoverIdx]}kW demand ·{" "}
            {ENERGY_TREND.solar[hoverIdx]}kW solar
          </span>
        ) : (
          <span>Hover chart for interval detail</span>
        )}
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[#86a397]" /> Solar
        </span>
      </div>
    </div>
  );
}
