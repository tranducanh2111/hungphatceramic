"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, useTexture } from "@react-three/drei";
import * as THREE from "three";

interface RoomSceneProps {
  scrollProgress: number; // 0 to 1
}

function RoomArchitecture({ scrollProgress }: RoomSceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const texture = useTexture("/images/tile-texture.jpg");
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);

  useFrame(() => {
    if (!groupRef.current) return;
    // Camera stays still, we move the room towards the camera based on scroll
    // scrollProgress 0 -> 1 means room moves from Z=0 to Z=8 (pushing camera through the door)
    groupRef.current.position.z = scrollProgress * 8;
  });

  return (
    <group ref={groupRef}>
      {/* Floor */}
      <mesh position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshPhysicalMaterial 
          map={texture} 
          roughness={0.1} 
          metalness={0.2} 
          clearcoat={1} 
          envMapIntensity={1.5} 
        />
      </mesh>

      {/* Walls */}
      {/* Back Wall */}
      <mesh position={[0, 0, -10]}>
        <planeGeometry args={[20, 10]} />
        <meshStandardMaterial color="#0E2A42" roughness={0.9} />
      </mesh>

      {/* Doorway Wall (we pass through this) */}
      <mesh position={[-4, 0, -2]}>
        <planeGeometry args={[8, 10]} />
        <meshStandardMaterial color="#071A2B" roughness={0.9} />
      </mesh>
      <mesh position={[4, 0, -2]}>
        <planeGeometry args={[8, 10]} />
        <meshStandardMaterial color="#071A2B" roughness={0.9} />
      </mesh>
      <mesh position={[0, 4, -2]}>
        <planeGeometry args={[4, 2]} />
        <meshStandardMaterial color="#071A2B" roughness={0.9} />
      </mesh>
      
      {/* Floating abstract decorative element to catch the eye */}
      <mesh position={[0, 0, -6]} rotation={[Math.PI / 4, Math.PI / 4, 0]}>
        <icosahedronGeometry args={[1, 0]} />
        <meshPhysicalMaterial color="#D4B886" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

export function VisualStoryRoomScene({ scrollProgress }: RoomSceneProps) {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 50 }} gl={{ antialias: true }}>
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 5, 2]} intensity={2} color="#D4B886" />
      <directionalLight position={[-5, 5, -5]} intensity={1} color="#1A3D5C" />
      <Environment preset="city" />
      
      {/* Fog to hide the horizon */}
      <fog attach="fog" args={["#071A2B", 5, 15]} />

      <RoomArchitecture scrollProgress={scrollProgress} />
    </Canvas>
  );
}
