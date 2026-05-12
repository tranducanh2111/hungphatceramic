"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function OrbitalRing() {
  const torusRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (torusRef.current) {
      torusRef.current.rotation.x = Math.sin(time * 0.3) * 0.2 + 1.2;
      torusRef.current.rotation.y = time * 0.15;
    }
    if (particlesRef.current) {
      particlesRef.current.rotation.y = time * -0.05;
      particlesRef.current.rotation.z = time * 0.05;
    }
  });

  // Create some dust particles for the orbit
  const particleCount = 200;
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    const radius = 3.5 + Math.random() * 1.5;
    const theta = Math.random() * Math.PI * 2;
    const y = (Math.random() - 0.5) * 1.5;
    positions[i * 3] = Math.cos(theta) * radius;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = Math.sin(theta) * radius;
  }

  return (
    <>
      <mesh ref={torusRef}>
        <torusGeometry args={[3.5, 0.008, 16, 100]} />
        <meshBasicMaterial color="#D4B886" transparent opacity={0.3} />
      </mesh>
      
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.03} color="#D4B886" transparent opacity={0.4} />
      </points>
    </>
  );
}

export function OrbitalRingScene() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none opacity-50">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }} gl={{ alpha: true }}>
        <OrbitalRing />
      </Canvas>
    </div>
  );
}
