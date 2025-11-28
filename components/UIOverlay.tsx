import React from 'react';
import { ActiveNodeState } from '../types';
import { X, Cpu, Shield, Zap, Lock, Users } from 'lucide-react';

interface UIOverlayProps {
  activeNode: ActiveNodeState;
  onClose: () => void;
}

export const UIOverlay: React.FC<UIOverlayProps> = ({ activeNode, onClose }) => {
  if (!activeNode) return null;

  const IconComponent = () => {
    switch (activeNode.icon) {
      case 'Shield': return <Shield className="w-6 h-6 text-black" />;
      case 'Lock': return <Lock className="w-6 h-6 text-black" />;
      case 'Cpu': return <Cpu className="w-6 h-6 text-black" />;
      case 'Zap': return <Zap className="w-6 h-6 text-black" />;
      case 'Users': return <Users className="w-6 h-6 text-black" />;
      default: return <Cpu className="w-6 h-6 text-black" />;
    }
  };

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-end p-0 md:p-10 pointer-events-none">
      {/* The Detail Panel */}
      <div 
        className="
          pointer-events-auto 
          w-full md:w-[500px] h-full md:h-auto md:max-h-[85vh] 
          bg-black/90 border-l-4 md:border-4 border-[#F5E148] 
          backdrop-blur-xl flex flex-col text-white shadow-[0_0_50px_rgba(245,225,72,0.1)]
          transition-all duration-300 transform translate-x-0
        "
      >
        {/* Header */}
        <div className="bg-[#F5E148] p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 border-2 border-black bg-[#F5E148]">
              <IconComponent />
            </div>
            <div>
              <h2 className="text-black font-bold text-xl uppercase tracking-tighter" style={{ fontFamily: 'Space Mono' }}>
                {activeNode.content.title}
              </h2>
              <p className="text-black/70 text-xs font-bold uppercase tracking-widest">
                System Node: {activeNode.id}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="group p-2 hover:bg-black transition-colors"
          >
            <X className="w-6 h-6 text-black group-hover:text-[#F5E148]" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-8 overflow-y-auto custom-scrollbar flex-1 font-sans">
          <h3 className="text-2xl font-bold mb-6 text-[#F5E148]" style={{ fontFamily: 'Space Mono' }}>
            {activeNode.content.subtitle}
          </h3>
          
          <div className="space-y-4 text-gray-300 leading-relaxed text-sm md:text-base">
            {activeNode.content.body.map((paragraph, idx) => (
              <p key={idx} className="border-l-2 border-[#333] pl-4 hover:border-[#F5E148] transition-colors duration-300">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Stats Grid if available */}
          {activeNode.content.stats && (
            <div className="mt-8 grid grid-cols-2 gap-4">
              {activeNode.content.stats.map((stat, idx) => (
                <div key={idx} className="bg-[#111] p-4 border border-[#333]">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{stat.label}</p>
                  <p className="text-[#F5E148] font-mono text-xl font-bold">{stat.value}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#333] bg-[#0a0a0a] flex justify-between items-center text-[10px] text-gray-500 font-mono uppercase">
          <span>SECURE CONNECTION</span>
          <span className="animate-pulse text-[#F5E148]">● LIVE</span>
        </div>
      </div>
    </div>
  );
};