import { useGLTF } from "@react-three/drei";
import { Suspense, useMemo } from "react";
import * as THREE from "three";

interface CustomModelRendererProps {
  url: string;
}

function Model({ url }: { url: string }) {
  const gltf = useGLTF(url);

  const centeredScene = useMemo(() => {
    const scene = gltf.scene.clone(true);
    const box = new THREE.Box3().setFromObject(scene);
    const center = new THREE.Vector3();
    box.getCenter(center);
    // Center X & Z, and rest bottom of model on Y=0
    scene.position.set(-center.x, -box.min.y, -center.z);

    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    return scene;
  }, [gltf.scene]);

  return <primitive object={centeredScene} />;
}

export default function CustomModelRenderer({ url }: CustomModelRendererProps) {
  return (
    <Suspense fallback={null}>
      <Model url={url} />
    </Suspense>
  );
}
