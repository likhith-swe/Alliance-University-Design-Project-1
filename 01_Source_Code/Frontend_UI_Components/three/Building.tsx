import { useMemo, useRef, useState, useEffect } from "react";
import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import type { BuildingDef } from "../data/campusData";
import type { HeatmapMode } from "./heatmapMaterial";
import "./heatmapMaterial";

const MODE_INDEX: Record<HeatmapMode, number> = { thermal: 0, occupancy: 1, energy: 2 };

interface BuildingProps {
  def: BuildingDef;
  mode: HeatmapMode;
  isSelected: boolean;
  activeFloorIndex?: number | null;
  explodeAmount?: number; // 0 to 1
  timeOfDay?: number; // 6 to 22
  onSelect: (id: string | null) => void;
  onHover: (id: string | null) => void;
}

function metricFor(def: BuildingDef, mode: HeatmapMode) {
  if (mode === "thermal") return def.thermal;
  if (mode === "occupancy") return def.occupancy;
  return def.energy;
}

export default function Building({
  def,
  mode,
  isSelected,
  activeFloorIndex = null,
  explodeAmount = 0,
  timeOfDay = 14,
  onSelect,
  onHover,
}: BuildingProps) {
  const groupRef = useRef<THREE.Group>(null);
  const roofGroupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const floorRefs = useRef<(THREE.Mesh | null)[]>([]);
  const matRefs = useRef<any[]>([]);
  const hoverProgress = useRef(0);
  const selectedProgress = useRef(0);

  const [w, d] = def.footprint;
  const isTank = def.type === "watertank";
  const isSolar = def.type === "solar";
  const floors = def.floors;
  const fh = def.floorHeight;
  const metric = metricFor(def, mode);
  const isNight = timeOfDay < 6.8 || timeOfDay > 18.2;

  // Floor base coordinates
  const floorData = useMemo(
    () =>
      Array.from({ length: floors }, (_, i) => ({
        baseY: i * fh + fh / 2,
        idx: i,
      })),
    [floors, fh]
  );

  // Bounded smooth animation: max 0.22 units per floor separation
  useEffect(() => {
    const targets = floorRefs.current.filter(Boolean) as THREE.Mesh[];
    gsap.killTweensOf(targets.map((m) => m.position));

    // Controlled micro-separation only when isSelected AND explodeAmount > 0
    const separation = isSelected ? Math.min(explodeAmount, 1.0) * 0.22 : 0;

    targets.forEach((mesh, i) => {
      const targetY = floorData[i].baseY + i * separation;
      gsap.to(mesh.position, {
        y: targetY,
        duration: 0.5,
        ease: "power2.out",
      });
    });

    // Rooftop moves synchronously with the top floor
    if (roofGroupRef.current && targets.length > 0) {
      const topFloorY = floorData[floors - 1].baseY + (floors - 1) * separation + fh * 0.5;
      gsap.to(roofGroupRef.current.position, {
        y: topFloorY,
        duration: 0.5,
        ease: "power2.out",
      });
    }
  }, [isSelected, explodeAmount, floorData, floors, fh]);

  useFrame((state, delta) => {
    hoverProgress.current = THREE.MathUtils.damp(hoverProgress.current, hovered ? 1 : 0, 8, delta);
    selectedProgress.current = THREE.MathUtils.damp(selectedProgress.current, isSelected ? 1 : 0, 6, delta);

    matRefs.current.forEach((mat, idx) => {
      if (!mat) return;
      mat.uTime = state.clock.elapsedTime;
      mat.uMode = MODE_INDEX[mode];
      mat.uHover = hoverProgress.current;
      mat.uSelected = selectedProgress.current;

      // Floor isolation opacity
      if (activeFloorIndex !== null && isSelected) {
        if (idx === activeFloorIndex) {
          mat.uHover = 1.0;
        } else if (idx > activeFloorIndex) {
          // Upper floors become ghost translucent
          mat.uSelected = 0.15;
        }
      }
    });

    if (groupRef.current && isSelected) {
      groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, 0.0, 4, delta);
    }
  });

  return (
    <group
      ref={groupRef}
      position={[def.position[0], 0, def.position[1]]}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        onHover(def.id);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(false);
        onHover(null);
        document.body.style.cursor = "auto";
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(isSelected ? null : def.id);
      }}
    >
      {floorData.map(({ baseY, idx }) => {
        const isIsolatedFloor = activeFloorIndex === idx;
        const isGhosted = activeFloorIndex !== null && idx > activeFloorIndex && isSelected;

        return (
          <mesh
            key={idx}
            ref={(m) => {
              floorRefs.current[idx] = m;
            }}
            position={[0, baseY, 0]}
            castShadow={!isGhosted}
            receiveShadow
          >
            {isTank ? (
              <cylinderGeometry args={[w / 2, w / 2.6, fh * 0.94, 16]} />
            ) : isSolar ? (
              <boxGeometry args={[w, fh * 0.6, d]} />
            ) : def.type === "library" ? (
              <cylinderGeometry args={[Math.min(w, d) / 2, Math.min(w, d) / 2, fh * 0.94, 32]} />
            ) : (
              <boxGeometry args={[w, fh * 0.94, d]} />
            )}

            <heatmapMaterialImpl
              ref={(m: any) => {
                matRefs.current[idx] = m;
              }}
              uIntensity={metric}
              uAccent={new THREE.Color(def.accent)}
              uFloorSpan={floors}
              transparent={isGhosted}
              opacity={isGhosted ? 0.22 : 1.0}
            />

            {/* Architectural structural wireframe edges */}
            <lineSegments position={[0, 0, 0]}>
              <edgesGeometry args={[new THREE.BoxGeometry(w, fh * 0.94, d)]} />
              <lineBasicMaterial
                color={isSelected ? "#e5b887" : "#475569"}
                transparent
                opacity={isSelected ? 0.85 : 0.22}
              />
            </lineSegments>

            {/* In-place floor focus ring */}
            {isIsolatedFloor && (
              <lineSegments position={[0, 0, 0]}>
                <edgesGeometry args={[new THREE.BoxGeometry(w * 1.03, fh * 0.98, d * 1.03)]} />
                <lineBasicMaterial color="#e5b887" linewidth={2} />
              </lineSegments>
            )}

            {/* Night mode window lights */}
            {isNight && !isTank && !isSolar && !isGhosted && (
              <mesh position={[0, 0, 0]}>
                <boxGeometry args={[w * 1.008, fh * 0.45, d * 1.008]} />
                <meshBasicMaterial
                  color="#ffd8a8"
                  transparent
                  opacity={0.32}
                />
              </mesh>
            )}
          </mesh>
        );
      })}

      {/* Rooftop group — realistic architectural roof decks, HVAC units, solar arrays */}
      {!isTank && (
        <group ref={roofGroupRef} position={[0, floors * fh, 0]}>
          {/* Dark Architectural Parapet Deck */}
          <mesh position={[0, 0.04, 0]} receiveShadow>
            <boxGeometry args={[w * 1.01, 0.08, d * 1.01]} />
            <meshStandardMaterial color="#1a202c" roughness={0.9} metalness={0.1} />
          </mesh>

          {/* Rooftop perimeter rim in warm champagne */}
          <lineSegments position={[0, 0.08, 0]}>
            <edgesGeometry args={[new THREE.BoxGeometry(w * 1.01, 0.02, d * 1.01)]} />
            <lineBasicMaterial color="#e5b887" transparent opacity={0.35} />
          </lineSegments>

          {/* Admin Block: Neoclassical Cupola & Pediment */}
          {def.type === "admin" && (
            <group position={[0, 0.08, 0]}>
              {/* Classical Portico Base */}
              <mesh position={[0, 0.35, 0]}>
                <boxGeometry args={[w * 0.5, 0.6, d * 0.5]} />
                <meshStandardMaterial color="#222b3d" roughness={0.7} metalness={0.15} />
              </mesh>
              {/* Cupola Dome in Warm Sandstone & Bronze */}
              <mesh position={[0, 0.75, 0]}>
                <sphereGeometry args={[w * 0.22, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
                <meshStandardMaterial color="#b38758" roughness={0.4} metalness={0.55} />
              </mesh>
              {/* Spire */}
              <mesh position={[0, 1.15, 0]}>
                <cylinderGeometry args={[0.08, 0.14, 0.6, 12]} />
                <meshStandardMaterial color="#e5b887" metalness={0.8} roughness={0.2} />
              </mesh>
            </group>
          )}

          {/* Central Library: Neoclassical Rotunda & Champagne Bronze Dome */}
          {def.type === "library" && (
            <group position={[0, 0.08, 0]}>
              {/* Drum with architectural louvers */}
              <mesh position={[0, 0.35, 0]}>
                <cylinderGeometry args={[w * 0.34, w * 0.36, 0.65, 32]} />
                <meshStandardMaterial color="#1f2838" roughness={0.6} metalness={0.2} />
              </mesh>
              {/* Ribbed Neoclassical Dome */}
              <mesh position={[0, 0.75, 0]}>
                <sphereGeometry args={[w * 0.34, 32, 20, 0, Math.PI * 2, 0, Math.PI / 2]} />
                <meshStandardMaterial
                  color="#9c7a52"
                  roughness={0.38}
                  metalness={0.58}
                  emissive="#755026"
                  emissiveIntensity={isNight ? 0.4 : 0.12}
                />
              </mesh>
              {/* Lantern Finial */}
              <mesh position={[0, 1.25, 0]}>
                <cylinderGeometry args={[0.22, 0.26, 0.35, 16]} />
                <meshStandardMaterial color="#e5b887" metalness={0.7} roughness={0.3} />
              </mesh>
            </group>
          )}

          {/* Engineering (ACED): Modern Rooftop Solar PV Farm + HVAC Units */}
          {def.type === "academic" && def.id === "aced" && (
            <group position={[0, 0.1, 0]}>
              {/* Rooftop Solar Array (Photovoltaic Panels) */}
              {[-1.8, 0, 1.8].map((offsetZ, i) => (
                <mesh key={i} position={[0, 0.18, offsetZ]} rotation={[-0.22, 0, 0]}>
                  <boxGeometry args={[w * 0.75, 0.04, 1.2]} />
                  <meshStandardMaterial color="#13233b" roughness={0.2} metalness={0.8} />
                </mesh>
              ))}
              {/* HVAC Chiller Enclosure */}
              <mesh position={[w * 0.3, 0.28, -d * 0.25]}>
                <boxGeometry args={[1.6, 0.5, 1.6]} />
                <meshStandardMaterial color="#334155" roughness={0.8} />
              </mesh>
            </group>
          )}

          {/* General Academic & Business: Modern Atrium Skylight & Rooftop Utilities */}
          {def.type === "academic" && def.id !== "aced" && (
            <group position={[0, 0.08, 0]}>
              {/* Central Glass Atrium Skylight */}
              <mesh position={[0, 0.18, 0]}>
                <boxGeometry args={[w * 0.42, 0.25, d * 0.42]} />
                <meshStandardMaterial color="#1e293b" roughness={0.1} metalness={0.9} transparent opacity={0.8} />
              </mesh>
              {/* HVAC Units */}
              <mesh position={[-w * 0.28, 0.22, d * 0.22]}>
                <boxGeometry args={[1.4, 0.4, 1.2]} />
                <meshStandardMaterial color="#334155" roughness={0.8} />
              </mesh>
            </group>
          )}

          {/* Sports Complex: Architectural Curved Barrel Roof */}
          {def.type === "sports" && (
            <group position={[0, 0.08, 0]}>
              <mesh position={[0, 0.45, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[d * 0.42, d * 0.42, w * 0.98, 32, 1, false, 0, Math.PI]} />
                <meshStandardMaterial color="#222b3b" roughness={0.4} metalness={0.4} />
              </mesh>
              {/* Skylight Ribbon */}
              <mesh position={[0, 0.88, 0]}>
                <boxGeometry args={[w * 0.94, 0.04, 1.2]} />
                <meshStandardMaterial color="#e5b887" emissive="#e5b887" emissiveIntensity={0.25} roughness={0.1} />
              </mesh>
            </group>
          )}

          {/* Hostels: Residential Rooftop Tanks and Elevator Overrun */}
          {def.type === "hostel" && (
            <group position={[0, 0.08, 0]}>
              <mesh position={[0, 0.4, 0]}>
                <boxGeometry args={[2.2, 0.75, 2.2]} />
                <meshStandardMaterial color="#242e40" roughness={0.7} />
              </mesh>
              <mesh position={[w * 0.25, 0.35, d * 0.25]}>
                <cylinderGeometry args={[0.55, 0.55, 0.65, 16]} />
                <meshStandardMaterial color="#334155" metalness={0.6} roughness={0.4} />
              </mesh>
            </group>
          )}
        </group>
      )}

      {/* Ground anchor ring — subtle warm champagne footprint halo */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[Math.max(w, d) * 0.56, Math.max(w, d) * 0.62, 48]} />
        <meshBasicMaterial
          color="#e5b887"
          transparent
          opacity={hovered || isSelected ? 0.75 : 0.15}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Building Header Pin — ONLY visible on active hover or selection to keep campus clean and pristine */}
      {(hovered || isSelected) && (
        <Html
          position={[0, floors * fh + 1.2, 0]}
          center
          distanceFactor={18}
          occlude
          style={{ pointerEvents: "none", transition: "opacity .2s" }}
        >
          <div
            className="whitespace-nowrap rounded-full border px-3.5 py-1.5 font-mono text-[11px] tracking-wider backdrop-blur-xl shadow-2xl animate-fade-in"
            style={{
              background: "rgba(9, 10, 15, 0.92)",
              borderColor: "#e5b887",
              color: "#faf7f2",
              boxShadow: "0 0 24px rgba(229,184,135,0.45)",
            }}
          >
            <span className="font-semibold text-[#e5b887]">{def.code}</span> · {def.name}
          </div>
        </Html>
      )}
    </group>
  );
}
