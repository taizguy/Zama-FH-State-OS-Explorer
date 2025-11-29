
import React, { useState, useEffect, useRef } from 'react';
import { Scene } from './components/Scene';
import { UIOverlay } from './components/UIOverlay';
import { ActiveNodeState, NodeData } from './types';
import { APP_DATA, TOUR_STEPS } from './constants';
import { Play, Square, Loader2, Volume2, SkipForward } from 'lucide-react';
import { GoogleGenAI, Modality } from "@google/genai";

const STORAGE_KEY = 'zama-fhe-explorer-positions';

// --- AUDIO UTILS ---
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const App: React.FC = () => {
  // --- STATE ---
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
    } catch (e) {}
    return APP_DATA;
  });

  const [activeNode, setActiveNode] = useState<ActiveNodeState>(null);
  const [showIntro, setShowIntro] = useState(true);
  
  // Tour State
  const [isTouring, setIsTouring] = useState(false);
  const [tourStepIndex, setTourStepIndex] = useState(-1); // Logic pointer
  const [visibleStepIndex, setVisibleStepIndex] = useState(-1); // Visual pointer (Syncs with audio)
  const [isProcessingStep, setIsProcessingStep] = useState(false);
  const [cursorTarget, setCursorTarget] = useState<[number, number, number] | null>(null);

  // Audio State
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);

  const handleNodeClick = (node: NodeData) => {
    if (isTouring) stopTour();
    setActiveNode(node);
    setShowIntro(false);
  };

  const handleCloseOverlay = () => {
    if (isTouring) stopTour();
    setActiveNode(null);
  };

  const handleNodeMove = (id: string, newPosition: [number, number, number]) => {
    if (isTouring) return; 
    setNodes(prev => {
      const updated = prev.map(n => n.id === id ? { ...n, position: newPosition } : n);
      const positionsMap = updated.reduce((acc, curr) => ({
        ...acc,
        [curr.id]: curr.position
      }), {});
      localStorage.setItem(STORAGE_KEY, JSON.stringify(positionsMap));
      return updated;
    });
  };

  // --- AUDIO LOGIC ---
  const getAudioContext = async () => {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!audioContextRef.current) {
        audioContextRef.current = new AudioContextClass({ sampleRate: 24000 });
    }
    const ctx = audioContextRef.current;
    if (ctx.state === 'suspended') await ctx.resume();
    return ctx;
  };

  const generateAudioBuffer = async (text: string): Promise<AudioBuffer | null> => {
    if (!process.env.API_KEY) {
        console.error("API_KEY not found.");
        return null;
    }
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text: text }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Fenrir' },
                    },
                },
            },
        });

        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (!base64Audio) throw new Error("No audio data returned");

        const ctx = await getAudioContext();
        return await decodeAudioData(decode(base64Audio), ctx, 24000, 1);

    } catch (error) {
        console.error("Audio generation failed:", error);
        return null;
    }
  };

  const playAudioBuffer = (buffer: AudioBuffer): Promise<void> => {
    return new Promise((resolve) => {
        if (!audioContextRef.current) return resolve();
        const ctx = audioContextRef.current;
        
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);
        
        source.onended = () => {
            resolve();
        };
        
        source.start();
        audioSourceRef.current = source;
    });
  };

  const stopAudio = () => {
    if (audioSourceRef.current) {
      try { audioSourceRef.current.stop(); } catch (e) {}
    }
  };

  // --- TOUR MACHINE ---
  
  const startTour = async () => {
    setShowIntro(false);
    setIsTouring(true);
    setTourStepIndex(0);
    setVisibleStepIndex(-1);
    
    // Warm up audio context
    await getAudioContext();
  };

  const stopTour = () => {
    setIsTouring(false);
    setIsProcessingStep(false);
    setTourStepIndex(-1);
    setVisibleStepIndex(-1);
    setCursorTarget(null);
    setActiveNode(null);
    stopAudio();
  };

  // The Brain of the Tour
  useEffect(() => {
    if (!isTouring || tourStepIndex === -1) return;

    if (tourStepIndex >= TOUR_STEPS.length) {
        stopTour();
        return;
    }

    const executeStep = async () => {
        setIsProcessingStep(true);
        const step = TOUR_STEPS[tourStepIndex];
        const targetNode = nodes.find(n => n.id === step.targetNodeId);

        if (targetNode) {
            // 1. Start Physical Movement (Camera & Hand)
            setCursorTarget(targetNode.position);
            
            // 2. Start Generating Audio (Parallel Task)
            // We do NOT show the text yet. We wait for audio to be ready.
            const audioBufferPromise = generateAudioBuffer(step.text);
            
            // 3. Cinematic Movement Wait
            // Reduced to 600ms for snappier feel
            await new Promise(r => setTimeout(r, 600));
            
            // 4. Wait for Audio Generation to finish
            const audioBuffer = await audioBufferPromise;

            // 5. ATOMIC REVEAL: Show UI & Start Audio at same frame
            setActiveNode(targetNode);
            setVisibleStepIndex(tourStepIndex); // Triggers highlighting
            
            if (audioBuffer) {
                await playAudioBuffer(audioBuffer); 
            } else {
                // Fallback wait if audio failed
                await new Promise(r => setTimeout(r, 2000));
            }
            
            // 6. Very short pause after speaking (Reduced to 100ms)
            await new Promise(r => setTimeout(r, 100));
            
            // 7. Proceed to next step
            if (isTouring) { 
                setTourStepIndex(prev => prev + 1);
            }
        }
        setIsProcessingStep(false);
    };

    executeStep();

    return () => {
        stopAudio();
    }
  }, [tourStepIndex, isTouring]);

  return (
    <div className="relative w-full h-full bg-[#050505]">
      {/* 3D Scene */}
      <Scene 
        nodes={nodes}
        activeNode={activeNode} 
        onNodeClick={handleNodeClick} 
        onNodeMove={handleNodeMove}
        isTouring={isTouring}
        virtualCursorTarget={cursorTarget}
      />

      {/* Intro Overlay */}
      {showIntro && (
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
          <div className="text-center p-8 bg-black/80 backdrop-blur-md border border-[#F5E148]/50 max-w-2xl mx-4 animate-fade-in-up pointer-events-auto shadow-[0_0_50px_rgba(245,225,72,0.2)]">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-2" style={{ fontFamily: 'Space Mono' }}>
              ZAMA <span className="text-[#F5E148]">FHE STATE OS</span>
            </h1>
            <div className="h-1 w-24 bg-[#F5E148] mx-auto mb-6"></div>
            <p className="text-gray-300 mb-8 font-light text-sm md:text-base max-w-lg mx-auto leading-relaxed">
              Explore the future of encrypted digital governance. 
              <br />
              <span className="text-[#F5E148] font-bold">DRAG</span> nodes to rearrange.
              <br />
              <span className="text-[#F5E148] font-bold">CLICK</span> to inspect data.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
              <button 
                onClick={() => setShowIntro(false)}
                className="w-full md:w-auto px-8 py-3 bg-[#333] border border-[#F5E148] text-[#F5E148] font-bold uppercase tracking-widest text-xs hover:bg-[#F5E148] hover:text-black transition-colors"
              >
                Manual Explore
              </button>
              
              <button 
                onClick={startTour}
                className="w-full md:w-auto px-8 py-3 bg-[#F5E148] text-black font-bold uppercase tracking-widest text-xs hover:bg-white transition-colors flex items-center justify-center gap-2"
              >
                <Volume2 size={14} fill="black" /> START CINEMATIC TOUR
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Static HUD Elements */}
      <div className="absolute top-0 left-0 p-6 z-10 pointer-events-none">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${isTouring ? 'bg-red-500 animate-pulse' : 'bg-[#F5E148]'}`}></div>
          <span className="text-white font-mono text-xs tracking-[0.2em] opacity-80">
            {isTouring ? 'REC_MODE // AUTO_PILOT' : 'ZAMA.AI // VISUALIZER'}
          </span>
        </div>
      </div>

      {/* Tour Controls (Bottom Right) */}
      <div className="absolute bottom-6 right-6 z-20 pointer-events-auto">
        {!showIntro && (
           <div className="flex gap-2">
             {isTouring && isProcessingStep && (
                <div className="bg-black/80 px-4 py-2 text-[#F5E148] text-xs font-mono flex items-center gap-2 border border-[#F5E148]/30 rounded-md">
                    <Loader2 size={12} className="animate-spin" />
                    BUFFERING STREAM...
                </div>
             )}
             <button 
                onClick={isTouring ? stopTour : startTour}
                className="bg-black/50 hover:bg-black/80 backdrop-blur border border-[#F5E148] p-3 rounded-full text-[#F5E148] transition-all"
                title={isTouring ? "Stop Tour" : "Start Auto-Tour"}
            >
                {isTouring ? <Square size={20} fill="#F5E148" /> : <Play size={20} fill="#F5E148" />}
            </button>
           </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 p-6 z-10 pointer-events-none hidden md:block">
        <div className="text-[#333] font-mono text-[10px]">
          <p>LATENCY: 12ms</p>
          <p>ENCRYPTION: FHE-LATTICE-256</p>
          <p>VERSION: 0.9.4-SYNCED</p>
        </div>
      </div>

      <UIOverlay 
        activeNode={activeNode} 
        onClose={handleCloseOverlay}
        // Pass the VISIBLE index, not the logic index. This ensures UI highlights exactly when audio starts.
        highlightSectionIndex={isTouring && visibleStepIndex !== -1 ? TOUR_STEPS[visibleStepIndex]?.sectionIndex : null}
      />
    </div>
  );
};

export default App;
