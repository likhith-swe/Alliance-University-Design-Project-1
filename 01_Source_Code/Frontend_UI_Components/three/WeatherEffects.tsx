import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { WeatherType } from "../types/theme";

interface WeatherEffectsProps {
  weather: WeatherType;
}

export default function WeatherEffects({ weather }: WeatherEffectsProps) {
  const rainRef = useRef<THREE.Points>(null);
  const count = 1200;

  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 70;
      pos[i * 3 + 1] = Math.random() * 35;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 70;
      vel[i] = 18 + Math.random() * 12;
    }
    return [pos, vel];
  }, [count]);

  useFrame((_, delta) => {
    if (weather !== "rain" || !rainRef.current) return;
    const posAttr = rainRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const array = posAttr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      array[i * 3 + 1] -= velocities[i] * delta;
      if (array[i * 3 + 1] < 0) {
        array[i * 3 + 1] = 30 + Math.random() * 5;
      }
    }
    posAttr.needsUpdate = true;
  });

  if (weather === "clear") return null;

  return (
    <group>
      {weather === "rain" && (
        <points ref={rainRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[positions, 3]}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.14}
            color="#93c5fd"
            transparent
            opacity={0.65}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </points>
      )}
    </group>
  );
}
