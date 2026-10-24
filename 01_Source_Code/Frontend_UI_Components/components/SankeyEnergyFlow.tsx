import { useMemo, useRef, useState } from "react";
import { sankey, sankeyLinkHorizontal, type SankeyNode, type SankeyLink } from "d3-sankey";
import { SANKEY_NODES, SANKEY_LINKS } from "../data/campusData";

interface NodeExtra {
  id: string;
  label: string;
  color: string;
  column: 0 | 1 | 2;
}
interface LinkExtra {
  value: number;
}

type N = SankeyNode<NodeExtra, LinkExtra>;
type L = SankeyLink<NodeExtra, LinkExtra>;

const WIDTH = 760;
const HEIGHT = 420;

export default function SankeyEnergyFlow() {
  const [hoverLink, setHoverLink] = useState<number | null>(null);
  const idRef = useRef(0);

  const { nodes, links } = useMemo(() => {
    const gen = sankey<NodeExtra, LinkExtra>()
      .nodeId((d) => d.id)
      .nodeWidth(14)
      .nodePadding(26)
      .extent([
        [8, 20],
        [WIDTH - 8, HEIGHT - 20],
      ]);

    const graph = {
      nodes: SANKEY_NODES.map((n) => ({ ...n })),
      links: SANKEY_LINKS.map((l) => ({ source: l.source, target: l.target, value: Math.max(l.value, 0.5) })),
    };

    return gen(graph as never) as unknown as { nodes: N[]; links: L[] };
  }, []);

  const pathGen = sankeyLinkHorizontal<NodeExtra, LinkExtra>();

  return (
    <div className="glass-panel rounded-2xl p-5 sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="font-display text-lg font-semibold text-white">Campus Energy Flow</h3>
          <p className="text-xs text-slate-400">Live generation, import & consumption balance — updated every 15 min</p>
        </div>
        <div className="flex items-center gap-3 font-mono text-[10px] text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#86a397]" /> Renewable
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#e5b887]" /> Grid / Peak
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#d99b5e]" /> Compute
          </span>
        </div>
      </div>

      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full" role="img" aria-label="Energy sankey diagram">
        <defs>
          {links.map((l, i) => {
            const gid = `sankey-grad-${idRef.current}-${i}`;
            const src = l.source as N;
            const tgt = l.target as N;
            return (
              <linearGradient id={gid} key={gid} x1="0" x2="1">
                <stop offset="0%" stopColor={src.color} stopOpacity={0.75} />
                <stop offset="100%" stopColor={tgt.color} stopOpacity={0.75} />
              </linearGradient>
            );
          })}
        </defs>

        {links.map((l, i) => {
          const src = l.source as N;
          const tgt = l.target as N;
          const gid = `sankey-grad-${idRef.current}-${i}`;
          const isBess = src.id === "bess";
          return (
            <g key={i} onMouseEnter={() => setHoverLink(i)} onMouseLeave={() => setHoverLink(null)}>
              <path
                d={pathGen(l) ?? undefined}
                fill="none"
                stroke={`url(#${gid})`}
                strokeWidth={Math.max(l.width ?? 1, 1.5)}
                strokeOpacity={hoverLink === null || hoverLink === i ? (isBess ? 0.25 : 0.55) : 0.15}
                strokeDasharray={isBess ? "2 6" : undefined}
                style={{ transition: "stroke-opacity .25s" }}
              />
              {hoverLink === i && (
                <text
                  x={((src.x1 ?? 0) + (tgt.x0 ?? 0)) / 2}
                  y={((l.y0 ?? 0) + (l.y1 ?? 0)) / 2 - 8}
                  textAnchor="middle"
                  className="fill-white font-mono text-[11px]"
                >
                  {Math.round(l.value)} kW
                </text>
              )}
            </g>
          );
        })}

        {nodes.map((n) => (
          <g key={n.id}>
            <rect
              x={n.x0}
              y={n.y0}
              width={(n.x1 ?? 0) - (n.x0 ?? 0)}
              height={Math.max((n.y1 ?? 0) - (n.y0 ?? 0), 2)}
              rx={3}
              fill={n.color}
              fillOpacity={0.9}
              style={{ filter: `drop-shadow(0 0 6px ${n.color}77)` }}
            />
            <text
              x={n.column === 2 ? (n.x0 ?? 0) - 10 : (n.x1 ?? 0) + 10}
              y={((n.y0 ?? 0) + (n.y1 ?? 0)) / 2}
              dy="0.32em"
              textAnchor={n.column === 2 ? "end" : "start"}
              className="fill-slate-300 font-mono text-[11px]"
            >
              {n.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
