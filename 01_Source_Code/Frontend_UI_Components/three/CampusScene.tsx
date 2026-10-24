import { Suspense, useMemo, useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Stars, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import {
  CAMPUS_BUILDINGS,
  SOLAR_SOURCE_IDS,
  SUBSTATION_ID,
  WATER_SOURCE_ID,
  WATER_TARGET_IDS,
  type BuildingDef,
} from "../data/campusData";
import { campusEvolution } from "../services/campusEvolutionAgent";
import Building from "./Building";
import ParticleStream from "./ParticleStream";
import WeatherEffects from "./WeatherEffects";
import type { HeatmapMode } from "./heatmapMaterial";
import type { WeatherType, CameraPreset } from "../types/theme";

function findBuilding(id: string) {
  return CAMPUS_BUILDINGS.find((b) => b.id === id)!;
}

// Low-poly architectural campus trees
function CampusTrees() {
  const treePositions: [number, number, number][] = [
    // Library quad trees
    [-4.5, 0, -4.5], [4.5, 0, -4.5], [-4.5, 0, 4.5], [4.5, 0, 4.5],
    [-6, 0, 0], [6, 0, 0], [0, 0, -8], [0, 0, 8],
    // Admin boulevard trees
    [-5, 0, -12], [5, 0, -12], [-5, 0, -23], [5, 0, -23],
    // ACED / ASB courtyard trees
    [-6, 0, -10], [6, 0, -10], [-17, 0, 1], [17, 0, 1],
    [-17, 0, 14], [17, 0, 14], [-12, 0, 14], [12, 0, 14],
    // Hostel garden green buffers
    [17, 0, -10], [17, 0, -2], [17, 0, 6], [17, 0, 18],
  ];

  return (
    <group>
      {treePositions.map(([x, y, z], i) => (
        <group key={i} position={[x, y, z]}>
          {/* Trunk */}
          <mesh position={[0, 0.4, 0]}>
            <cylinderGeometry args={[0.1, 0.14, 0.8, 6]} />
            <meshStandardMaterial color="#2d221c" roughness={0.9} />
          </mesh>
          {/* Foliage crown */}
          <mesh position={[0, 1.1, 0]}>
            <coneGeometry args={[0.55, 1.2, 7]} />
            <meshStandardMaterial color="#1a2e23" roughness={0.7} />
          </mesh>
          <mesh position={[0, 1.6, 0]}>
            <coneGeometry args={[0.42, 1.0, 7]} />
            <meshStandardMaterial color="#233d2f" roughness={0.65} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Ground() {
  return (
    <group>
      {/* Base Campus Terrain */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.04, 0]} receiveShadow>
        <planeGeometry args={[160, 160, 1, 1]} />
        <meshStandardMaterial color="#080c14" roughness={0.95} metalness={0.05} />
      </mesh>

      {/* Main Pedestrian Plazas & Central Academic Quadrangle */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <circleGeometry args={[26, 64]} />
        <meshStandardMaterial color="#111622" roughness={0.9} />
      </mesh>

      {/* Lush Botanical Lawns (Central Library & Department Quads) */}
      {[
        { pos: [-6, -0.015, -4], size: [8, 10] },
        { pos: [6, -0.015, -4], size: [8, 10] },
        { pos: [-6, -0.015, 6], size: [8, 8] },
        { pos: [6, -0.015, 6], size: [8, 8] },
        { pos: [0, -0.015, -11], size: [12, 5] },
        { pos: [18, -0.015, 4], size: [6, 22] }, // Hostel green buffer
      ].map((patch, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[patch.pos[0], patch.pos[1], patch.pos[2]]} receiveShadow>
          <planeGeometry args={[patch.size[0], patch.size[1]]} />
          <meshStandardMaterial color="#101d17" roughness={0.9} />
        </mesh>
      ))}

      {/* Stone Paved Walkway Ribbons Connecting Buildings */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[4, 46]} />
        <meshStandardMaterial color="#182030" roughness={0.85} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[46, 4]} />
        <meshStandardMaterial color="#182030" roughness={0.85} />
      </mesh>

      {/* Architectural Master Grid */}
      <gridHelper args={[120, 60, "#1f293d", "#111726"]} position={[0, 0, 0]} />

      {/* Campus boundary ring with subtle champagne pulse */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.005, 0]}>
        <ringGeometry args={[42, 42.5, 64]} />
        <meshBasicMaterial color="#e5b887" transparent opacity={0.22} />
      </mesh>

      {/* Architectural Campus Trees */}
      <CampusTrees />
    </group>
  );
}

// Preset camera coordinate mappings
const PRESET_COORDS: Record<CameraPreset, { pos: [number, number, number]; look: [number, number, number] }> = {
  overview: { pos: [26, 22, 32], look: [0, 0, 0] },
  admin: { pos: [2, 14, -6], look: [0, 2, -18] },
  library: { pos: [8, 12, 12], look: [0, 3, 0] },
  engineering: { pos: [-8, 12, -4], look: [-15, 2, -7] },
  hostels: { pos: [28, 16, 2], look: [18, 4, -4] },
  energy: { pos: [12, 10, -10], look: [4, 1, -16.5] },
};

function CameraController({
  selectedId,
  preset,
  reducedMotion,
  isCustomModel,
  zoomTrigger,
}: {
  selectedId: string | null;
  preset: CameraPreset;
  reducedMotion: boolean;
  isCustomModel?: boolean;
  zoomTrigger?: { dir: "in" | "out"; ts: number } | null;
}) {
  const controlsRef = useRef<any>(null);
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3(isCustomModel ? 55 : 26, isCustomModel ? 48 : 22, isCustomModel ? 65 : 32));
  const targetLook = useRef(new THREE.Vector3(0, isCustomModel ? 3 : 0, 0));
  const [modifierHeld, setModifierHeld] = useState(false);

  // Allow wheel zoom only when user holds Shift, Ctrl, or Meta so normal page scrolling is never blocked
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey || e.ctrlKey || e.metaKey) setModifierHeld(true);
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (!e.shiftKey && !e.ctrlKey && !e.metaKey) setModifierHeld(false);
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  // Programmatic HUD Zoom In / Out
  useEffect(() => {
    if (!zoomTrigger || !controlsRef.current) return;
    const target = controlsRef.current.target as THREE.Vector3;
    const factor = zoomTrigger.dir === "in" ? 0.78 : 1.28;
    const offset = new THREE.Vector3().subVectors(camera.position, target).multiplyScalar(factor);
    const dist = offset.length();
    if (dist < 6 && zoomTrigger.dir === "in") return;
    if (dist > 160 && zoomTrigger.dir === "out") return;
    targetPos.current.copy(target).add(offset);
    camera.position.copy(targetPos.current);
    controlsRef.current.update();
  }, [zoomTrigger, camera]);

  useEffect(() => {
    if (isCustomModel) {
      targetPos.current.set(55, 48, 65);
      targetLook.current.set(0, 3, 0);
    } else if (selectedId) {
      const b = findBuilding(selectedId);
      const height = b.floors * b.floorHeight;
      const dist = Math.max(b.footprint[0], b.footprint[1]) * 1.8 + 8;
      targetPos.current.set(b.position[0] + dist * 0.75, height * 0.7 + 6, b.position[1] + dist * 0.75);
      targetLook.current.set(b.position[0], height * 0.45, b.position[1]);
    } else {
      const p = PRESET_COORDS[preset] || PRESET_COORDS.overview;
      targetPos.current.set(...p.pos);
      targetLook.current.set(...p.look);
    }
  }, [selectedId, preset, isCustomModel]);

  useFrame((_, delta) => {
    camera.position.x = THREE.MathUtils.damp(camera.position.x, targetPos.current.x, 2.5, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, targetPos.current.y, 2.5, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, targetPos.current.z, 2.5, delta);
    if (controlsRef.current) {
      controlsRef.current.target.x = THREE.MathUtils.damp(controlsRef.current.target.x, targetLook.current.x, 2.5, delta);
      controlsRef.current.target.y = THREE.MathUtils.damp(controlsRef.current.target.y, targetLook.current.y, 2.5, delta);
      controlsRef.current.target.z = THREE.MathUtils.damp(controlsRef.current.target.z, targetLook.current.z, 2.5, delta);
      controlsRef.current.update();
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableZoom={modifierHeld}
      enablePan={true}
      panSpeed={0.8}
      minDistance={5}
      maxDistance={150}
      maxPolarAngle={Math.PI / 2.05}
      autoRotate={!selectedId && preset === "overview" && !reducedMotion}
      autoRotateSpeed={0.3}
      enableDamping
      dampingFactor={0.07}
    />
  );
}

import CustomModelRenderer from "./CustomModelRenderer";

export interface CampusSceneProps {
  mode: HeatmapMode;
  selectedId: string | null;
  activeFloorIndex?: number | null;
  explodeAmount?: number;
  timeOfDay?: number; // 6 to 22
  weather?: WeatherType;
  cameraPreset?: CameraPreset;
  reducedMotion?: boolean;
  customModelUrl?: string | null;
  zoomTrigger?: { dir: "in" | "out"; ts: number } | null;
  setSelectedId: (id: string | null) => void;
  onHoverChange?: (id: string | null) => void;
}

export default function CampusScene({
  mode,
  selectedId,
  activeFloorIndex = null,
  explodeAmount = 0,
  timeOfDay = 14,
  weather = "clear",
  cameraPreset = "overview",
  reducedMotion = false,
  customModelUrl = null,
  zoomTrigger = null,
  setSelectedId,
  onHoverChange = () => {},
}: CampusSceneProps) {
  // Real-time subscription to autonomous campus evolution agent
  const [evolvedElements, setEvolvedElements] = useState(() => campusEvolution.getApprovedElements());
  useEffect(() => {
    return campusEvolution.subscribe(() => {
      setEvolvedElements(campusEvolution.getApprovedElements());
    });
  }, []);

  const dynamicBuildings: BuildingDef[] = useMemo(() => {
    return evolvedElements.map((e) => ({
      id: e.id,
      code: e.name.slice(0, 4).toUpperCase(),
      name: e.name,
      subtitle: e.description,
      type: (e.category === "academic" ? "academic" : e.category === "solar" ? "solar" : "admin") as any,
      position: e.position,
      footprint: e.footprint,
      floors: e.floors,
      floorHeight: e.floorHeight,
      occupancy: 0.7,
      thermal: 0.45,
      energy: 0.55,
      accent: e.accent,
    }));
  }, [evolvedElements]);

  // Compute sun position and atmosphere based on timeOfDay (6h to 22h)
  const sunConfig = useMemo(() => {
    // Fraction of daylight between 6:00 and 18:00
    const norm = (timeOfDay - 6) / 12; // 0 at 6am, 0.5 at 12pm, 1.0 at 6pm
    const isNight = timeOfDay < 6.5 || timeOfDay > 18.5;
    const isGoldenHour = (timeOfDay >= 16.5 && timeOfDay <= 18.5) || (timeOfDay >= 6.5 && timeOfDay <= 8.0);

    const sunAngle = Math.PI * norm;
    const sunX = Math.cos(sunAngle) * 35;
    const sunY = Math.max(Math.sin(sunAngle) * 30, 2);
    const sunZ = 16;

    let sunColor = "#ffffff";
    let sunIntensity = 1.4;
    let ambientIntensity = 0.5;
    let bgColor = "#070d18";
    let fogColor = "#070d18";

    if (isNight) {
      sunColor = "#6366f1";
      sunIntensity = 0.35;
      ambientIntensity = 0.22;
      bgColor = "#030712";
      fogColor = "#030712";
    } else if (isGoldenHour) {
      sunColor = "#fb923c";
      sunIntensity = 1.6;
      ambientIntensity = 0.55;
      bgColor = "#0c1322";
      fogColor = "#0c1322";
    }

    if (weather === "rain") {
      ambientIntensity *= 0.7;
      fogColor = "#0b121f";
    } else if (weather === "fog") {
      ambientIntensity *= 0.65;
      fogColor = "#111827";
    }

    return { sunPos: [sunX, sunY, sunZ] as [number, number, number], sunColor, sunIntensity, ambientIntensity, bgColor, fogColor, isNight };
  }, [timeOfDay, weather]);

  const solarStreams = useMemo(() => {
    const sub = findBuilding(SUBSTATION_ID);
    return SOLAR_SOURCE_IDS.map((id) => {
      const src = findBuilding(id);
      const h = src.floors * src.floorHeight + 0.4;
      return [
        [src.position[0], h, src.position[1]],
        [(src.position[0] + sub.position[0]) / 2, h * 0.6 + 1.5, (src.position[1] + sub.position[1]) / 2],
        [sub.position[0], sub.floorHeight * 0.5, sub.position[1]],
      ] as [number, number, number][];
    });
  }, []);

  const waterStreams = useMemo(() => {
    const src = findBuilding(WATER_SOURCE_ID);
    return WATER_TARGET_IDS.map((id) => {
      const target = findBuilding(id);
      return [
        [src.position[0], src.floorHeight * 0.7, src.position[1]],
        [(src.position[0] + target.position[0]) / 2, 0.4, (src.position[1] + target.position[1]) / 2],
        [target.position[0], 0.3, target.position[1]],
      ] as [number, number, number][];
    });
  }, []);

  return (
    <Canvas
      camera={{ position: [26, 22, 32], fov: 42 }}
      shadows
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: false }}
      style={{ touchAction: "pan-y" }}
    >
      <color attach="background" args={[sunConfig.bgColor]} />
      <fog
        attach="fog"
        args={[
          sunConfig.fogColor,
          customModelUrl ? 160 : (weather === "fog" ? 18 : 34),
          customModelUrl ? 480 : (weather === "fog" ? 55 : 88),
        ]}
      />

      <ambientLight intensity={customModelUrl ? 0.85 : sunConfig.ambientIntensity} />
      <directionalLight
        position={customModelUrl ? [60, 80, 50] : sunConfig.sunPos}
        intensity={customModelUrl ? 1.6 : sunConfig.sunIntensity}
        castShadow
        color={sunConfig.sunColor}
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={customModelUrl ? -80 : -35}
        shadow-camera-right={customModelUrl ? 80 : 35}
        shadow-camera-top={customModelUrl ? 80 : 35}
        shadow-camera-bottom={customModelUrl ? -80 : -35}
      />
      <hemisphereLight args={["#1e293b", "#050a14", sunConfig.isNight ? 0.35 : (customModelUrl ? 0.7 : 0.5)]} />

      {/* Stars shine in night / dusk mode */}
      <Stars
        radius={95}
        depth={45}
        count={sunConfig.isNight ? 3200 : 800}
        factor={sunConfig.isNight ? 3 : 1.2}
        fade
        speed={0.4}
      />

      <CameraController
        selectedId={selectedId}
        preset={cameraPreset}
        reducedMotion={reducedMotion}
        isCustomModel={!!customModelUrl}
        zoomTrigger={zoomTrigger}
      />

      {!customModelUrl && <Ground />}
      <WeatherEffects weather={weather} />

      {!customModelUrl && (
        <ContactShadows
          position={[0, 0, 0]}
          opacity={sunConfig.isNight ? 0.3 : 0.6}
          scale={120}
          blur={2.5}
          far={14}
          color="#000000"
        />
      )}

      {customModelUrl ? (
        <CustomModelRenderer url={customModelUrl} />
      ) : (
        <>
          {CAMPUS_BUILDINGS.map((b) => (
            <Building
              key={b.id}
              def={b}
              mode={mode}
              isSelected={selectedId === b.id}
              activeFloorIndex={selectedId === b.id ? activeFloorIndex : null}
              explodeAmount={selectedId === b.id ? explodeAmount : 0}
              timeOfDay={timeOfDay}
              onSelect={setSelectedId}
              onHover={onHoverChange}
            />
          ))}

          {dynamicBuildings.map((b) => (
            <Building
              key={b.id}
              def={b}
              mode={mode}
              isSelected={selectedId === b.id}
              activeFloorIndex={selectedId === b.id ? activeFloorIndex : null}
              explodeAmount={selectedId === b.id ? explodeAmount : 0}
              timeOfDay={timeOfDay}
              onSelect={setSelectedId}
              onHover={onHoverChange}
            />
          ))}
        </>
      )}

      {!customModelUrl && solarStreams.map((pts, i) => (
        <ParticleStream
          key={`solar-${i}`}
          points={pts}
          color="#e5b887"
          speed={0.32}
          width={0.06}
        />
      ))}

      {!customModelUrl && waterStreams.map((pts, i) => (
        <ParticleStream
          key={`water-${i}`}
          points={pts}
          color="#d99b5e"
          speed={0.22}
          width={0.045}
        />
      ))}
    </Canvas>
  );
}
