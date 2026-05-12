"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import * as THREE from "three";

const CATEGORY_COLORS: Record<string, string> = {
  inspire: "#2A4B6C",        // Muted blue
  travertine: "#8B7355",     // Travertine brown
  "orient-star": "#1E1810",  // Dark rich
  sunshine: "#4A5D23",       // Earthy green/gold
  architectural: "#2A2A35",  // Slate
};

function SpinningTile({ categoryId }: { categoryId: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const color = CATEGORY_COLORS[categoryId] ?? "#8B7355";

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    // Gentle continuous rotation
    meshRef.current.rotation.y = time * 0.4;
    meshRef.current.rotation.x = Math.sin(time * 0.5) * 0.2;
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[2, 2, 0.1]} />
      <meshPhysicalMaterial
        color={color}
        roughness={0.2}
        metalness={0.1}
        clearcoat={0.8}
        clearcoatRoughness={0.2}
      />
    </mesh>
  );
}

export function MaterialTilePreview({ categoryId }: { categoryId: string }) {
  return (
    <div className="absolute -right-12 -top-12 h-64 w-64 opacity-40 transition-opacity duration-700 group-hover:opacity-100 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 4], fov: 45 }} gl={{ alpha: true }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[2, 5, 2]} intensity={1} />
        <Environment preset="city" />
        <SpinningTile categoryId={categoryId} />
      </Canvas>
    </div>
  );
}
