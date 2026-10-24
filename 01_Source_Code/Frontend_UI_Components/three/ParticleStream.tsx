import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ParticleStreamProps {
  points: [number, number, number][];
  color: string;
  speed?: number;
  width?: number;
}

// Luminous Liquid Energy Beam Shader
// Replaces chunky discrete dots with a continuous architectural glowing photon conduit
const EnergyBeamShader = {
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vNormal;
    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform vec3 uColor;
    uniform float uSpeed;
    varying vec2 vUv;
    varying vec3 vNormal;

    void main() {
      // Multiple flowing photon pulses along the conduit length
      float wave1 = sin((vUv.x * 12.0 - uTime * uSpeed * 4.0) * 3.14159);
      float wave2 = sin((vUv.x * 24.0 - uTime * uSpeed * 6.0) * 3.14159);
      
      float pulse = max(0.0, wave1) * 0.7 + max(0.0, wave2) * 0.3;
      pulse = pow(pulse, 2.2);

      // Radial fresnel falloff for a soft ethereal glass-glow edge
      float fresnel = 0.35 + 0.65 * pow(1.0 - abs(vNormal.z), 1.8);

      // Core luminance
      vec3 coreColor = mix(uColor, vec3(1.0, 0.96, 0.9), pulse * 0.6);
      vec3 finalColor = coreColor * (1.1 + pulse * 1.6);
      float alpha = (0.2 + pulse * 0.75) * fresnel;

      gl_FragColor = vec4(finalColor, alpha);
    }
  `,
};

export default function ParticleStream({
  points,
  color,
  speed = 0.28,
  width = 0.05,
}: ParticleStreamProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  // Smooth architectural spline curve
  const curve = useMemo(() => {
    const vecs = points.map(([x, y, z]) => new THREE.Vector3(x, y, z));
    return new THREE.CatmullRomCurve3(vecs, false, "catmullrom", 0.35);
  }, [points]);

  // High-fidelity smooth tube conduit
  const tubeGeom = useMemo(
    () => new THREE.TubeGeometry(curve, 96, width, 12, false),
    [curve, width]
  );

  // Outer ambient aura conduit
  const outerAuraGeom = useMemo(
    () => new THREE.TubeGeometry(curve, 64, width * 2.2, 8, false),
    [curve, width]
  );

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(color) },
      uSpeed: { value: speed },
    }),
    [color, speed]
  );

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <group>
      {/* Outer soft ambient energy aura */}
      <mesh geometry={outerAuraGeom}>
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.06}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Core flowing luminous photon beam */}
      <mesh geometry={tubeGeom}>
        <shaderMaterial
          ref={materialRef}
          vertexShader={EnergyBeamShader.vertexShader}
          fragmentShader={EnergyBeamShader.fragmentShader}
          uniforms={uniforms}
          transparent
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
