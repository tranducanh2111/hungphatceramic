"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture, Environment } from "@react-three/drei";
import * as THREE from "three";

// ─── Tile geometry ─────────────────────────────────────────────────────────────

interface TileProps {
  mouseX: number;
  mouseY: number;
  scrollProgress: number;
}

function CeramicTile({ mouseX, mouseY, scrollProgress }: TileProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useTexture("/images/tile-texture.jpg");

  // Ensure texture looks polished
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();

    // Subtle breathing on Z
    const breathZ = Math.sin(time * 0.6) * 0.04;

    // Auto-rotation + mouse tilt
    const targetRotY = time * 0.12 + mouseX * 0.14;
    const targetRotX = mouseY * 0.10;

    meshRef.current.rotation.x += (targetRotX - meshRef.current.rotation.x) * 0.04;
    meshRef.current.rotation.y += (targetRotY - meshRef.current.rotation.y) * 0.04;

    // Scroll exit: tile spins away backward
    const exitRotY = scrollProgress * Math.PI * 0.6;
    const exitZ = scrollProgress * -6;
    const exitOpacity = 1 - scrollProgress * 1.5;

    meshRef.current.rotation.y += exitRotY * 0.08;
    meshRef.current.position.z = breathZ + exitZ * 0.1;
    (meshRef.current.material as THREE.MeshPhysicalMaterial).opacity = Math.max(0, exitOpacity);
  });

  return (
    <mesh ref={meshRef} position={[1.2, 0.1, 0]}>
      {/* Large-format tile ratio: 60×120cm → 1.68 × 2.8 units */}
      <boxGeometry args={[2.8, 1.68, 0.045]} />
      <meshPhysicalMaterial
        map={texture}
        roughness={0.12}
        metalness={0.04}
        envMapIntensity={1.4}
        transparent
        opacity={1}
      />
    </mesh>
  );
}

// ─── Champagne dust particles ──────────────────────────────────────────────────

function DustParticles() {
  const pointsRef = useRef<THREE.Points>(null);
  const PARTICLE_COUNT = 70;

  const positions = useMemo(() => {
    const arr = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 9;
      arr[i * 3 + 1] = Math.random() * 8 - 4;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 5;
    }
    return arr;
  }, []);

  useFrame(() => {
    if (!pointsRef.current) return;
    const pos = pointsRef.current.geometry.attributes.position;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Float upward
      (pos.array as Float32Array)[i * 3 + 1] += 0.004;
      // Reset when out of view
      if ((pos.array as Float32Array)[i * 3 + 1] > 5) {
        (pos.array as Float32Array)[i * 3 + 1] = -5;
      }
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.028}
        color="#D4B886"
        transparent
        opacity={0.55}
        depthWrite={false}
      />
    </points>
  );
}

// ─── Scene wrapper ─────────────────────────────────────────────────────────────

interface CeramicTileSceneProps {
  mouseX: number;
  mouseY: number;
  scrollProgress: number;
}

/**
 * CeramicTileScene — React Three Fiber canvas for the hero 3D tile.
 *
 * Dynamically imported in LandingHero with ssr:false.
 * Hidden on mobile via parent CSS.
 */
export function CeramicTileScene({ mouseX, mouseY, scrollProgress }: CeramicTileSceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
      }}
      style={{ background: "transparent", display: "block" }}
    >
      {/* Lighting */}
      <ambientLight intensity={0.4} color="#1A3D5C" />
      <directionalLight position={[3, 4, 3]} intensity={1.8} color="#D4B886" />
      <directionalLight position={[-4, -2, 1]} intensity={0.5} color="#F4F4F6" />

      {/* HDRI environment for reflections */}
      <Environment preset="studio" />

      <CeramicTile mouseX={mouseX} mouseY={mouseY} scrollProgress={scrollProgress} />
      <DustParticles />
    </Canvas>
  );
}
