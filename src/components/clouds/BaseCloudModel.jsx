// App.jsx
import React, { Suspense, useMemo, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, Sphere, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import Hdri from "../Hdri";

function Model({ url = "/test-clouds-1.4-1.9-test.glb", ...props }) {
  const { scene } = useGLTF(url);

  const base = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        metalness: 0,
        transparent: true, // keep false for alphaHash
        depthWrite: false,    // or use alphaTest instead
        side: THREE.DoubleSide,
      }),
    []
  );

  useEffect(() => {
    scene.traverse((o) => {
      if (!o.isMesh) return;

      const old = o.material;

      const mat = base.clone();

      // preserve maps (important!)
      if (old?.map) {
        mat.map = old.map;
        mat.map.colorSpace = THREE.SRGBColorSpace; // color textures = sRGB
      }
      if (old?.alphaMap) mat.alphaMap = old.alphaMap; // alpha maps stay linear
      if (old?.normalMap) mat.normalMap = old.normalMap;
      if (old?.roughnessMap) mat.roughnessMap = old.roughnessMap;
      if (old?.metalnessMap) mat.metalnessMap = old.metalnessMap;

      if (old?.color) mat.color.copy(old.color);

      o.material = mat;
      o.material.roughness = 1;
      o.material.metalness = 0; 
      o.material.needsUpdate = true;
      o.material.depthWrite = false;
      o.material.side = THREE.DoubleSide;
      o.material.transparent = false;
      o.material.alphaTest = 0.01; // better for foliage than dithering
    });
  }, [scene, base]);

  return <primitive object={scene} {...props} />;
}


useGLTF.preload("/test-clouds-1.4-1.9-test.glb");

export default function App() {
  return (
    <Canvas shadows camera={{ position: [0, 1.5, 4], fov: 45 }} gl={{
      outputColorSpace: THREE.SRGBColorSpace,
    }}>
      <color attach="background" args={["#000"]} />
      <Environment preset="studio" intensity={2.3} />
      <Suspense fallback={null}>
        <Model />
      </Suspense>
      <Sphere args={[4.0, 32, 32]} position={[0, 0, 0]} />

      <OrbitControls makeDefault />
    </Canvas>
  );
}
