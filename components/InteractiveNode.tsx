import React, { useRef, useState, useMemo } from 'react';
import { useFrame, useThree, ThreeEvent } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { NodeData } from '../types';

interface InteractiveNodeProps {
  data: NodeData;
  isActive: boolean;
  onClick: (data: NodeData) => void;
  onMove: (id: string, position: [number, number, number]) => void;
}

export const InteractiveNode: React.FC<InteractiveNodeProps> = ({ data, isActive, onClick, onMove }) => {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  
  const [hovered, setHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  // Logic Refs (avoid state for high-frequency physics/event logic)
  const dragStartPos = useRef<{ x: number, y: number } | null>(null);
  const isDraggingRef = useRef(false);
  
  // Drag utilities
  const dragPlane = useMemo(() => new THREE.Plane(), []);
  const dragOffset = useMemo(() => new THREE.Vector3(), []);
  
  const { camera, raycaster } = useThree();

  useFrame((state) => {
    // 1. Handle Floating Animation (Only applies to inner mesh)
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.005;
      meshRef.current.rotation.y += 0.005;

      // Floating - relative to group
      const t = state.clock.getElapsedTime();
      meshRef.current.position.y = Math.sin(t + data.position[0]) * 0.2;
    }

    // 2. Sync group position to prop when not dragging
    if (groupRef.current && !isDraggingRef.current) {
      groupRef.current.position.lerp(new THREE.Vector3(...data.position), 0.1);
    }
  });

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    
    // Store screen coordinates to check for "click" vs "drag" later
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    
    isDraggingRef.current = true;
    setIsDragging(true); // Trigger render for visual feedback

    if (groupRef.current) {
      // Setup drag plane
      const normal = new THREE.Vector3();
      camera.getWorldDirection(normal).negate(); 
      dragPlane.setFromNormalAndCoplanarPoint(normal, groupRef.current.position);

      const intersection = new THREE.Vector3();
      raycaster.ray.intersectPlane(dragPlane, intersection);
      
      if (intersection) {
        dragOffset.subVectors(groupRef.current.position, intersection);
      }
    }
  };

  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (isDraggingRef.current && groupRef.current) {
      e.stopPropagation();
      
      const intersection = new THREE.Vector3();
      raycaster.ray.intersectPlane(dragPlane, intersection);
      
      if (intersection) {
        const newPos = intersection.add(dragOffset);
        groupRef.current.position.copy(newPos);
      }
    }
  };

  const handlePointerUp = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);

    isDraggingRef.current = false;
    setIsDragging(false);

    // Calculate Movement Distance
    if (dragStartPos.current) {
      const dx = e.clientX - dragStartPos.current.x;
      const dy = e.clientY - dragStartPos.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // If moved less than 4 pixels, treat as CLICK
      if (dist < 4) {
        onClick(data);
      } else {
        // Otherwise, treat as MOVE (Drop)
        if (groupRef.current) {
          onMove(data.id, [
            groupRef.current.position.x,
            groupRef.current.position.y,
            groupRef.current.position.z
          ]);
        }
      }
    }
    
    dragStartPos.current = null;
  };

  const renderGeometry = () => {
    switch (data.shape) {
      case 'sphere': return <icosahedronGeometry args={[0.8, 1]} />;
      case 'box': return <boxGeometry args={[1.2, 1.2, 1.2]} />;
      case 'torus': return <torusKnotGeometry args={[0.6, 0.2, 100, 16]} />;
      case 'octahedron': return <octahedronGeometry args={[1.5, 0]} />; 
      case 'icosahedron': return <icosahedronGeometry args={[1.2, 0]} />;
      case 'dodecahedron': return <dodecahedronGeometry args={[1.2, 0]} />;
      default: return <boxGeometry />;
    }
  };

  return (
    <group ref={groupRef} position={new THREE.Vector3(...data.position)}>
      <mesh
        ref={meshRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerOver={() => {
          document.body.style.cursor = isDragging ? 'grabbing' : 'grab';
          setHovered(true);
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto';
          setHovered(false);
        }}
      >
        {renderGeometry()}
        <meshStandardMaterial
          color={isActive ? "#F5E148" : (isDragging ? "#FFF" : (hovered ? "#FFF" : data.color))}
          wireframe={true}
          emissive={isActive ? "#F5E148" : (hovered || isDragging ? "#444" : "#000")}
          emissiveIntensity={isActive ? 0.8 : 0.2}
          transparent
          opacity={isDragging ? 0.8 : 1}
        />
      </mesh>

      {/* Connection Line to floor */}
      <mesh position={[0, -5, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 10]} />
        <meshBasicMaterial color="#333" transparent opacity={isDragging ? 0.8 : 0.3} />
      </mesh>

      {/* Floating Label */}
      <Html distanceFactor={12} position={[0, 1.5, 0]} style={{ pointerEvents: 'none' }}>
        <div 
          className={`
            whitespace-nowrap px-3 py-1 text-sm font-bold uppercase tracking-widest backdrop-blur-md transition-all duration-300 select-none
            ${isActive ? 'bg-[#F5E148] text-black scale-110' : 'bg-black/50 text-[#F5E148] border border-[#F5E148]'}
            ${isDragging ? 'opacity-50' : 'opacity-100'}
          `}
          style={{ fontFamily: 'Space Mono' }}
        >
          {data.content.title}
        </div>
      </Html>
    </group>
  );
};