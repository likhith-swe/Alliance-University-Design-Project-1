import { useEffect, useRef, useState } from "react";
import { Satellite, MapPin } from "lucide-react";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

// Alliance University Buildings
const ALLIANCE_BUILDINGS = [
  { id: "ab1", name: "Administrative Block", code: "ADMIN", position: [77.6841, 12.8451], accent: "#e5b887" },
  { id: "lib", name: "Central Library", code: "LIB", position: [77.6844, 12.8449], accent: "#86a397" },
  { id: "aced", name: "ACED (Engineering)", code: "ACED", position: [77.6835, 12.8455], accent: "#d99b5e" },
  { id: "asb", name: "ASB (Business School)", code: "ASB", position: [77.6848, 12.8456], accent: "#e5b887" },
  { id: "asl", name: "ASL (Law School)", code: "ASL", position: [77.6850, 12.8452], accent: "#c48b71" },
  { id: "hostels", name: "Hostels", code: "HST", position: [77.6830, 12.8440], accent: "#d99b5e" },
  { id: "sports", name: "Sports Complex", code: "SPT", position: [77.6855, 12.8445], accent: "#86a397" }
];

export default function MiniMapCard() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
      center: [77.684, 12.845],
      zoom: 16.5,
      pitch: 45,
      bearing: -17.6,
      attributionControl: false,
    });

    map.current.on('load', () => {
      // Add markers
      ALLIANCE_BUILDINGS.forEach((b) => {
        const el = document.createElement('div');
        el.className = 'w-3 h-3 rounded-full border-2 border-white cursor-pointer';
        el.style.backgroundColor = b.accent;
        el.style.boxShadow = `0 0 10px ${b.accent}`;
        
        el.addEventListener('mouseenter', () => setActiveId(b.id));
        el.addEventListener('mouseleave', () => setActiveId(null));

        new maplibregl.Marker({ element: el })
          .setLngLat(b.position as [number, number])
          .addTo(map.current!);
      });
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  const active = ALLIANCE_BUILDINGS.find((b) => b.id === activeId) ?? null;

  return (
    <div className="glass-panel relative flex h-full flex-col overflow-hidden rounded-2xl">
      <div className="flex items-center justify-between px-5 pt-5">
        <div>
          <h3 className="font-display text-base font-semibold text-white">Campus GIS Overlay</h3>
          <p className="text-xs text-slate-400">Georeferenced digital twin anchor</p>
        </div>
        <Satellite size={16} className="text-[#e5b887]" />
      </div>

      <div className="relative m-4 mt-3 flex-1 overflow-hidden rounded-xl border border-white/10 bg-[#060b16]" style={{ minHeight: 260 }}>
        <div ref={mapContainer} className="absolute inset-0 h-full w-full" />
        
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#070d18]/70 via-transparent to-transparent" />

        <div className="pointer-events-none absolute left-3 top-3 flex items-center gap-1.5 rounded-full border border-white/10 bg-black/60 px-2.5 py-1 font-mono text-[9px] text-slate-300 backdrop-blur z-10">
          <MapPin size={10} className="text-[#e5b887]" /> 12.845°N, 77.684°E
        </div>

        {active && (
          <div className="pointer-events-none absolute bottom-3 left-3 right-3 rounded-lg border border-white/10 bg-black/60 px-3 py-2 font-mono text-[10px] text-slate-300 backdrop-blur z-10">
            <span style={{ color: active.accent }}>{active.code}</span> — {active.name}
          </div>
        )}
      </div>
    </div>
  );
}
