import React from 'react';
import { ActiveNodeState } from '../types';
import { X, Cpu, Shield, Zap, Lock, Users, Scale } from 'lucide-react';

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
      case 'Scale': return <Scale className="w-6 h-6 text-black" />;
      default: return <Cpu className="w-6 h-6 text-black" />;
    }
  };

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-end p-0 md:p-6 pointer-events-none">
      {/* The Detail Panel */}
      <div 
        className="
          pointer-events-auto 
          w-full md:w-[600px] h-full 
          bg-black/95 border-l-4 md:border-4 border-[#F5E148] 
          backdrop-blur-xl flex flex-col text-white shadow-[0_0_100px_rgba(245,225,72,0.15)]
          transition-all duration-300 transform translate-x-0
        "
      >
        {/* Header */}
        <div className="bg-[#F5E148] p-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="p-3 border-2 border-black bg-[#F5E148] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <IconComponent />
            </div>
            <div>
              <h2 className="text-black font-bold text-2xl uppercase tracking-tighter leading-none" style={{ fontFamily: 'Space Mono' }}>
                {activeNode.content.title}
              </h2>
              <p className="text-black/70 text-xs font-bold uppercase tracking-[0.2em] mt-1">
                REF_ID: {activeNode.id.toUpperCase()}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="group p-2 hover:bg-black transition-colors border-2 border-transparent hover:border-black"
          >
            <X className="w-8 h-8 text-black group-hover:text-[#F5E148]" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
          <h3 className="text-xl md:text-3xl font-bold mb-8 text-[#F5E148] leading-tight" style={{ fontFamily: 'Space Mono' }}>
            {activeNode.content.subtitle}
          </h3>
          
          {/* Intro Paragraph */}
          <div className="mb-10 text-base md:text-lg leading-relaxed font-light text-white/90 border-b border-[#333] pb-8">
            {activeNode.content.intro}
          </div>

          {/* Deep Dive Sections */}
          <div className="space-y-10">
            {activeNode.content.sections.map((section, idx) => (
              <div key={idx} className="group">
                <h4 className="text-[#F5E148] font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                  <span className="text-xs bg-[#F5E148] text-black px-1.5 py-0.5">0{idx + 1}</span>
                  {section.heading}
                </h4>
                <div className="space-y-4 text-gray-300 text-sm md:text-base leading-relaxed">
                  {section.body.map((paragraph, pIdx) => (
                    <p key={pIdx} className="pl-4 border-l-2 border-[#333] group-hover:border-[#F5E148]/50 transition-colors duration-300">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Stats Grid */}
          {activeNode.content.stats && (
            <div className="mt-12 grid grid-cols-2 gap-4">
              {activeNode.content.stats.map((stat, idx) => (
                <div key={idx} className="bg-[#111] p-5 border border-[#333] hover:border-[#F5E148] transition-colors">
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-2">{stat.label}</p>
                  <p className="text-[#F5E148] font-mono text-2xl font-bold">{stat.value}</p>
                </div>
              ))}
            </div>
          )}
          
          <div className="h-10"></div> {/* Spacer */}
        </div>

        {/* Footer */}
        <div className="shrink-0 p-4 border-t border-[#333] bg-[#0a0a0a] flex justify-between items-center text-[10px] text-gray-500 font-mono uppercase">
          <span>ENCRYPTION: TFHE-RS</span>
          <span className="flex items-center gap-2">
            STATUS: ACTIVE
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F5E148] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F5E148]"></span>
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};