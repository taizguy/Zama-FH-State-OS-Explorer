
import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, Grid } from '@react-three/drei';
import * as THREE from 'three';
import { InteractiveNode } from './InteractiveNode';
import { ActiveNodeState, NodeData } from '../types';

interface SceneProps {
  nodes: NodeData[];
  activeNode: ActiveNodeState;
  onNodeClick: (node: NodeData) => void;
  onNodeMove: (id: string, position: [number, number, number]) => void;
  isTouring: boolean;
  virtualCursorTarget: [number, number, number] | null; // New prop for hand movement
}

// Controls camera movement smoothly
const CameraRig = ({ activeNode, isTouring }: { activeNode: ActiveNodeState, isTouring: boolean }) => {
  const { camera } = useThree();
  const vec = new THREE.Vector3();

  useFrame((state) => {
    if (isTouring && activeNode) {
      const [x, y, z] = activeNode.position;
      const targetPos = new THREE.Vector3(x, y + 1, z + 8);
      const lookAtPos = new THREE.Vector3(x, y, z);
      state.camera.position.lerp(targetPos, 0.03); // Slightly faster for snap
      state.camera.lookAt(lookAtPos);
    } else if (isTouring && !activeNode) {
        state.camera.position.lerp(new THREE.Vector3(0, 2, 14), 0.02);
        state.camera.lookAt(0,0,0);
    }
  });
  return null;
}

// 3D Hand Cursor
const VirtualCursor = ({ targetPos }: { targetPos: [number, number, number] | null }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current && targetPos) {
      // Lerp to target
      groupRef.current.position.lerp(new THREE.Vector3(...targetPos), 0.1);
      
      // Bobbing effect
      const t = state.clock.getElapsedTime();
      groupRef.current.position.y += Math.sin(t * 10) * 0.005;
      
      // Look at camera slightly? No, just point down
      groupRef.current.lookAt(targetPos[0], targetPos[1] - 5, targetPos[2]);
    } else if (groupRef.current) {
        // Return to rest position
        groupRef.current.position.lerp(new THREE.Vector3(0, -10, 0), 0.05);
    }
  });

  return (
    <group ref={groupRef} position={[0, -10, 0]}>
        {/* Simple Hand/Pointer Geometry */}
        <mesh rotation={[Math.PI, 0, 0]}>
            <coneGeometry args={[0.3, 1, 4]} />
            <meshStandardMaterial color="#F5E148" emissive="#F5E148" emissiveIntensity={0.5} />
        </mesh>
        {/* Glow */}
        <pointLight intensity={0.5} color="#F5E148" distance={2} />
    </group>
  );
}

export const Scene: React.FC<SceneProps> = ({ nodes, activeNode, onNodeClick, onNodeMove, isTouring, virtualCursorTarget }) => {
  return (
    <div className="absolute inset-0 z-0 bg-[#050505]">
      <Canvas camera={{ position: [0, 2, 12], fov: 45 }}>
        <fog attach="fog" args={['#050505', 10, 30]} />
        
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#F5E148" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4c4c4c" />
        
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        
        <Grid 
          position={[0, -4, 0]} 
          args={[30, 30]} 
          cellSize={1} 
          cellThickness={0.5} 
          cellColor="#333333" 
          sectionSize={5} 
          sectionThickness={1} 
          sectionColor="#F5E148" 
          fadeDistance={25}
        />

        {nodes.map((node) => (
          <InteractiveNode
            key={node.id}
            data={node}
            isActive={activeNode?.id === node.id}
            onClick={onNodeClick}
            onMove={onNodeMove}
          />
        ))}

        <VirtualCursor targetPos={virtualCursorTarget} />
        <CameraRig activeNode={activeNode} isTouring={isTouring} />

        {!isTouring && (
          <OrbitControls 
            enablePan={false}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 1.5}
            minDistance={5}
            maxDistance={18}
          />
        )}
      </Canvas>
    </div>
  );
};
