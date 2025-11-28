import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Grid } from '@react-three/drei';
import { InteractiveNode } from './InteractiveNode';
import { ActiveNodeState, NodeData } from '../types';

interface SceneProps {
  nodes: NodeData[];
  activeNode: ActiveNodeState;
  onNodeClick: (node: NodeData) => void;
  onNodeMove: (id: string, position: [number, number, number]) => void;
}

export const Scene: React.FC<SceneProps> = ({ nodes, activeNode, onNodeClick, onNodeMove }) => {
  return (
    <div className="absolute inset-0 z-0 bg-[#050505]">
      <Canvas camera={{ position: [0, 2, 12], fov: 45 }}>
        <fog attach="fog" args={['#050505', 10, 25]} />
        
        {/* Environment / Lighting */}
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#F5E148" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4c4c4c" />
        
        {/* Background Elements */}
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        
        {/* Floor Grid */}
        <Grid 
          position={[0, -4, 0]} 
          args={[20, 20]} 
          cellSize={1} 
          cellThickness={0.5} 
          cellColor="#333333" 
          sectionSize={5} 
          sectionThickness={1} 
          sectionColor="#F5E148" 
          fadeDistance={20}
        />

        {/* Nodes */}
        {nodes.map((node) => (
          <InteractiveNode
            key={node.id}
            data={node}
            isActive={activeNode?.id === node.id}
            onClick={onNodeClick}
            onMove={onNodeMove}
          />
        ))}

        <OrbitControls 
          enablePan={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.5}
          minDistance={5}
          maxDistance={18}
        />
      </Canvas>
    </div>
  );
};