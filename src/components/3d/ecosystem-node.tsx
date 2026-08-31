"use client";

import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls, Sphere, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";
import { SceneContainer } from "./scene-container";

function InteractiveCoreMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireframeRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.2;
      meshRef.current.rotation.y += delta * 0.3;
    }
    if (wireframeRef.current) {
      wireframeRef.current.rotation.x -= delta * 0.15;
      wireframeRef.current.rotation.y -= delta * 0.25;
    }
  });

  return (
    <group>
      {/* Inner Glowing Organic Core */}
      <Float speed={2} rotationIntensity={1} floatIntensity={1.5}>
        <Sphere
          ref={meshRef}
          args={[1, 64, 64]}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          scale={hovered ? 1.15 : 1}
        >
          <MeshDistortMaterial
            color={hovered ? "#00f0ff" : "#8b5cf6"}
            attach="material"
            distort={0.4}
            speed={2}
            roughness={0.2}
            metalness={0.8}
            wireframe={false}
          />
        </Sphere>

        {/* Outer Geometric Wireframe Cage */}
        <mesh ref={wireframeRef} scale={1.55}>
          <icosahedronGeometry args={[1, 1]} />
          <meshStandardMaterial
            color="#06b6d4"
            wireframe
            transparent
            opacity={0.35}
            emissive="#00f0ff"
            emissiveIntensity={0.4}
          />
        </mesh>
      </Float>

      {/* Orbiting Tech Particles */}
      <ParticleRing />
    </group>
  );
}

function ParticleRing() {
  const particlesRef = useRef<THREE.Points>(null);
  const count = 70;

  const positions = React.useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 2.2 + (Math.random() - 0.5) * 0.6;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.8;
      pos[i * 3 + 2] = Math.sin(angle) * radius;
    }
    return pos;
  }, [count]);

  useFrame((_, delta) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += delta * 0.15;
      particlesRef.current.rotation.x += delta * 0.05;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#00f0ff"
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export function EcosystemVisualizerCanvas({ height = "420px" }: { height?: string }) {
  return (
    <SceneContainer height={height} className="relative group">
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 pointer-events-none">
        <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#00f0ff]" />
        <span className="text-[11px] font-mono uppercase tracking-widest text-cyan-300/80 bg-slate-950/80 px-2 py-0.5 rounded border border-cyan-500/20">
          3D Ecosystem Matrix Engine
        </span>
      </div>
      <div className="absolute bottom-4 right-4 z-10 pointer-events-none">
        <span className="text-[10px] font-mono text-muted-foreground/60 bg-black/40 px-2 py-0.5 rounded">
          Drag to orbit • Hover to interact
        </span>
      </div>

      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#00f0ff" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#8b5cf6" />
        <InteractiveCoreMesh />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.8}
          maxPolarAngle={Math.PI / 1.5}
          minPolarAngle={Math.PI / 3}
        />
      </Canvas>
    </SceneContainer>
  );
}
