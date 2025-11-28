import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { NodeData } from '../types';

interface InteractiveNodeProps {
  data: NodeData;
  isActive: boolean;
  onClick: (data: NodeData) => void;
}

export const InteractiveNode: React.FC<InteractiveNodeProps> = ({ data, isActive, onClick }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      // Rotation
      meshRef.current.rotation.x += 0.005;
      meshRef.current.rotation.y += 0.005;

      // Floating animation
      const t = state.clock.getElapsedTime();
      meshRef.current.position.y = data.position[1] + Math.sin(t + data.position[0]) * 0.2;
    }
  });

  const renderGeometry = () => {
    switch (data.shape) {
      case 'sphere': return <icosahedronGeometry args={[0.8, 1]} />;
      case 'box': return <boxGeometry args={[1.2, 1.2, 1.2]} />;
      case 'torus': return <torusKnotGeometry args={[0.6, 0.2, 100, 16]} />;
      case 'octahedron': return <octahedronGeometry args={[1.5, 0]} />; // Executive summary is larger
      default: return <boxGeometry />;
    }
  };

  return (
    <group position={new THREE.Vector3(...data.position)}>
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onClick(data);
        }}
        onPointerOver={() => {
          document.body.style.cursor = 'pointer';
          setHovered(true);
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto';
          setHovered(false);
        }}
      >
        {renderGeometry()}
        <meshStandardMaterial
          color={isActive ? "#F5E148" : (hovered ? "#FFF" : data.color)}
          wireframe={true}
          emissive={isActive ? "#F5E148" : (hovered ? "#444" : "#000")}
          emissiveIntensity={isActive ? 0.8 : 0.2}
        />
      </mesh>

      {/* Connection Line to floor */}
      <mesh position={[0, -5, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 10]} />
        <meshBasicMaterial color="#333" transparent opacity={0.3} />
      </mesh>

      {/* Floating Label */}
      <Html distanceFactor={12} position={[0, 1.5, 0]}>
        <div 
          className={`
            pointer-events-none whitespace-nowrap px-3 py-1 text-sm font-bold uppercase tracking-widest backdrop-blur-md transition-all duration-300
            ${isActive ? 'bg-[#F5E148] text-black scale-110' : 'bg-black/50 text-[#F5E148] border border-[#F5E148]'}
          `}
          style={{ fontFamily: 'Space Mono' }}
        >
          {data.content.title}
        </div>
      </Html>
    </group>
  );
};