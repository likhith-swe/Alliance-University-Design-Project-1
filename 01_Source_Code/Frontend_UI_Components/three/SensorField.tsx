import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const tmpObj = new THREE.Object3D();
const tmpColor = new THREE.Color();

interface SensorFieldProps {
  count?: number;
  bounds?: number;
}

export default function SensorField({ count = 1024, bounds = 30 }: SensorFieldProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const data = useMemo(() => {
    const arr = new Float32Array(count * 4); // x, z, phase, speed
    for (let i = 0; i < count; i++) {
      arr[i * 4 + 0] = (Math.random() - 0.5) * bounds * 2;
      arr[i * 4 + 1] = (Math.random() - 0.5) * bounds * 2;
      arr[i * 4 + 2] = Math.random() * Math.PI * 2;
      arr[i * 4 + 3] = 0.5 + Math.random() * 1.5;
    }
    return arr;
  }, [count, bounds]);

  useFrame((state) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < count; i++) {
      const x = data[i * 4 + 0];
      const z = data[i * 4 + 1];
      const phase = data[i * 4 + 2];
      const speed = data[i * 4 + 3];
      const pulse = 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(t * speed + phase));
      tmpObj.position.set(x, 0.12 + Math.sin(t * 0.5 + phase) * 0.05, z);
      const s = 0.045 * pulse + 0.02;
      tmpObj.scale.setScalar(s);
      tmpObj.updateMatrix();
      mesh.setMatrixAt(i, tmpObj.matrix);
      tmpColor.setHSL(0.5 + 0.1 * Math.sin(phase), 0.9, 0.4 + pulse * 0.3);
      mesh.setColorAt(i, tmpColor);
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} frustumCulled={false}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial toneMapped={false} />
    </instancedMesh>
  );
}
