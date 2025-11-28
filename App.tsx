import React, { useState, useEffect } from 'react';
import { Scene } from './components/Scene';
import { UIOverlay } from './components/UIOverlay';
import { ActiveNodeState, NodeData } from './types';
import { APP_DATA } from './constants';

const STORAGE_KEY = 'zama-fhe-explorer-positions';

const App: React.FC = () => {
  // Initialize nodes with positions merged from LocalStorage
  const [nodes, setNodes] = useState<NodeData[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return APP_DATA.map(node => ({
          ...node,
          position: parsed[node.id] ? parsed[node.id] : node.position
        }));
      }
    } catch (e) {
      console.warn("Failed to load positions from local storage", e);
    }
    return APP_DATA;
  });

  const [activeNode, setActiveNode] = useState<ActiveNodeState>(null);
  const [showIntro, setShowIntro] = useState(true);

  const handleNodeClick = (node: NodeData) => {
    setActiveNode(node);
    setShowIntro(false);
  };

  const handleCloseOverlay = () => {
    setActiveNode(null);
  };

  const handleNodeMove = (id: string, newPosition: [number, number, number]) => {
    setNodes(prev => {
      const updated = prev.map(n => n.id === id ? { ...n, position: newPosition } : n);
      
      // Persist to localStorage
      const positionsMap = updated.reduce((acc, curr) => ({
        ...acc,
        [curr.id]: curr.position
      }), {});
      localStorage.setItem(STORAGE_KEY, JSON.stringify(positionsMap));
      
      return updated;
    });
  };

  return (
    <div className="relative w-full h-full bg-[#050505]">
      {/* 3D Scene Background */}
      <Scene 
        nodes={nodes}
        activeNode={activeNode} 
        onNodeClick={handleNodeClick} 
        onNodeMove={handleNodeMove}
      />

      {/* Intro Overlay */}
      {showIntro && !activeNode && (
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
          {/* Card must be pointer-events-auto to capture clicks */}
          <div className="text-center p-8 bg-black/80 backdrop-blur-md border border-[#F5E148]/50 max-w-2xl mx-4 animate-fade-in-up pointer-events-auto shadow-[0_0_50px_rgba(245,225,72,0.2)]">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-2" style={{ fontFamily: 'Space Mono' }}>
              ZAMA <span className="text-[#F5E148]">FHE STATE OS</span>
            </h1>
            <div className="h-1 w-24 bg-[#F5E148] mx-auto mb-6"></div>
            <p className="text-gray-300 mb-8 font-light text-sm md:text-base max-w-lg mx-auto leading-relaxed">
              Explore the future of encrypted digital governance. 
              <br />
              <span className="text-[#F5E148] font-bold">DRAG</span> nodes to rearrange the system.
              <br />
              <span className="text-[#F5E148] font-bold">CLICK</span> to access classified data.
            </p>
            <button 
              onClick={() => setShowIntro(false)}
              className="inline-block px-8 py-3 bg-[#F5E148] text-black font-bold uppercase tracking-widest text-xs hover:bg-white transition-colors cursor-pointer"
            >
              Initialize System
            </button>
          </div>
        </div>
      )}

      {/* Static HUD Elements */}
      <div className="absolute top-0 left-0 p-6 z-10 pointer-events-none">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#F5E148] rounded-full"></div>
          <span className="text-white font-mono text-xs tracking-[0.2em] opacity-80">ZAMA.AI // VISUALIZER</span>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 p-6 z-10 pointer-events-none hidden md:block">
        <div className="text-[#333] font-mono text-[10px]">
          <p>LATENCY: 12ms</p>
          <p>ENCRYPTION: FHE-LATTICE-256</p>
          <p>VERSION: 0.9.1-BETA</p>
        </div>
      </div>

      {/* Info Overlay Panel */}
      <UIOverlay activeNode={activeNode} onClose={handleCloseOverlay} />
      
      {/* Mobile Hint */}
      {!showIntro && !activeNode && (
        <div className="md:hidden absolute bottom-8 left-0 w-full text-center pointer-events-none text-gray-500 text-xs uppercase animate-bounce">
          Tap to explore / Drag to move
        </div>
      )}
    </div>
  );
};

export default App;