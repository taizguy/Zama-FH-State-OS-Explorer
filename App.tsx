import React, { useState } from 'react';
import { Scene } from './components/Scene';
import { UIOverlay } from './components/UIOverlay';
import { ActiveNodeState, NodeData } from './types';
import { Menu } from 'lucide-react';

const App: React.FC = () => {
  const [activeNode, setActiveNode] = useState<ActiveNodeState>(null);
  const [showIntro, setShowIntro] = useState(true);

  const handleNodeClick = (node: NodeData) => {
    setActiveNode(node);
    setShowIntro(false);
  };

  const handleCloseOverlay = () => {
    setActiveNode(null);
  };

  return (
    <div className="relative w-full h-full bg-[#050505]">
      {/* 3D Scene Background */}
      <Scene activeNode={activeNode} onNodeClick={handleNodeClick} />

      {/* Intro Overlay (disappears on first interaction) */}
      {showIntro && !activeNode && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <div className="text-center p-8 bg-black/40 backdrop-blur-md border border-[#F5E148]/30 max-w-2xl mx-4 animate-fade-in-up">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-2" style={{ fontFamily: 'Space Mono' }}>
              ZAMA <span className="text-[#F5E148]">FHE STATE OS</span>
            </h1>
            <div className="h-1 w-24 bg-[#F5E148] mx-auto mb-6"></div>
            <p className="text-gray-300 mb-8 font-light text-sm md:text-base max-w-lg mx-auto leading-relaxed">
              Explore the future of encrypted digital governance. 
              Click on the floating nodes to access the classified data regarding the fhEVM, 
              Hybrid Scaling, and the vision for Network States.
            </p>
            <div className="inline-block px-4 py-2 bg-[#F5E148] text-black font-bold uppercase tracking-widest text-xs animate-pulse">
              Click a node to begin
            </div>
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
      <div className="md:hidden absolute bottom-8 left-0 w-full text-center pointer-events-none text-gray-500 text-xs uppercase animate-bounce">
        Tap objects to explore
      </div>
    </div>
  );
};

export default App;