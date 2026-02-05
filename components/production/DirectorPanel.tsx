
import React from 'react';
import { Maximize2, Copy, Video, ShieldCheck, Trash2, Cpu, Layers, ClipboardCheck } from 'lucide-react';
import { StoryScene, StoryboardConfig, TransitionType } from '../../types';
import { ConfidenceBar } from '../shared/ConfidenceBar';

interface DirectorPanelProps {
  activeScene: StoryScene | undefined;
  activeSceneIndex: number;
  storyboard: StoryboardConfig;
  setIsFocusMode: (val: boolean) => void;
  handleOpenGrok: () => void;
  handleProduceVeo: () => void;
  onTerminate: () => void;
  onUpdateTransition: (idx: number, t: TransitionType, type: 'entry' | 'exit') => void;
  onOpenAudit: () => void;
}

const TRANSITIONS: TransitionType[] = ['none', 'fade', 'wipe', 'dissolve', 'zoom', 'glitch'];

export const DirectorPanel: React.FC<DirectorPanelProps> = ({
  activeScene,
  activeSceneIndex,
  storyboard,
  setIsFocusMode,
  handleOpenGrok,
  handleProduceVeo,
  onTerminate,
  onUpdateTransition,
  onOpenAudit
}) => {
  return (
    <div className="xl:col-span-4 space-y-6 md:space-y-8">
      <div className="xl:sticky xl:top-12 space-y-6 md:space-y-8">
        {activeScene && (
          <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] md:rounded-[3rem] p-6 md:p-8 space-y-6 md:space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.5em] text-indigo-500">Active Stage</h3>
              <span className="text-[10px] font-mono text-neutral-600">Scene_{activeSceneIndex + 1}_V1</span>
            </div>

            <div className="space-y-6">
              <div className="aspect-video w-full rounded-2xl overflow-hidden border border-white/10 group relative shadow-2xl">
                {activeScene.previewImageUrl ? (
                  <img src={activeScene.previewImageUrl} className="w-full h-full object-cover" alt="Active Scene" />
                ) : (
                  <div className="w-full h-full bg-neutral-900 flex items-center justify-center">
                    <Cpu className="w-8 h-8 md:w-10 md:h-10 text-neutral-800 animate-pulse" />
                  </div>
                )}
                <div className="absolute bottom-4 right-4 flex gap-2">
                  <button onClick={() => setIsFocusMode(true)} className="p-2.5 md:p-3 bg-black/60 backdrop-blur-md rounded-xl hover:bg-indigo-600 transition-all border border-white/10">
                    <Maximize2 className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                <p className="text-lg md:text-xl font-light italic leading-relaxed text-white">"{activeScene.visual_description}"</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-6">
                  <div className="space-y-3">
                    <h4 className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-neutral-600 flex items-center gap-2 md:gap-3">
                      <Layers className="w-3.5 md:w-4 h-3.5 md:h-4" /> Entry
                    </h4>
                    <div className="grid grid-cols-3 gap-2">
                      {TRANSITIONS.map(t => (
                        <button 
                          key={t}
                          onClick={() => onUpdateTransition(activeSceneIndex, t, 'entry')}
                          className={`py-2 rounded-lg md:rounded-xl text-[7px] md:text-[8px] font-black uppercase tracking-widest transition-all border ${
                            activeScene.entryTransition === t 
                              ? 'bg-indigo-600 border-indigo-400 text-white shadow-md' 
                              : 'bg-white/5 border-white/10 text-neutral-600 hover:text-white'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-neutral-600 flex items-center gap-2 md:gap-3">
                      <Layers className="w-3.5 md:w-4 h-3.5 md:h-4" /> Exit
                    </h4>
                    <div className="grid grid-cols-3 gap-2">
                      {TRANSITIONS.map(t => (
                        <button 
                          key={t}
                          onClick={() => onUpdateTransition(activeSceneIndex, t, 'exit')}
                          className={`py-2 rounded-lg md:rounded-xl text-[7px] md:text-[8px] font-black uppercase tracking-widest transition-all border ${
                            activeScene.exitTransition === t 
                              ? 'bg-indigo-600 border-indigo-400 text-white shadow-md' 
                              : 'bg-white/5 border-white/10 text-neutral-600 hover:text-white'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {activeScene.consistency && (
                  <div className="space-y-4 p-5 md:p-6 bg-black/40 rounded-2xl md:rounded-3xl border border-white/5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-4">
                      <ConfidenceBar label="Character" score={activeScene.consistency.characterConfidence} color="bg-indigo-500" />
                      <ConfidenceBar label="Faces" score={activeScene.consistency.facialConfidence} color="bg-blue-500" />
                      <ConfidenceBar label="Environment" score={activeScene.consistency.environmentalConfidence} color="bg-emerald-500" />
                      <ConfidenceBar label="Assets" score={activeScene.consistency.assetConfidence} color="bg-amber-500" />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <button 
                    onClick={handleOpenGrok}
                    className="flex items-center justify-center gap-2 md:gap-3 bg-white/5 hover:bg-white/10 border border-white/10 py-4 md:py-5 rounded-xl md:rounded-2xl font-black uppercase text-[8px] md:text-[9px] tracking-widest transition-all"
                  >
                    <Copy className="w-3.5 md:w-4 h-3.5 md:h-4" /> <span>Hook</span>
                  </button>
                  <button 
                    onClick={handleProduceVeo}
                    className="flex items-center justify-center gap-2 md:gap-3 bg-indigo-600 hover:bg-indigo-500 py-4 md:py-5 rounded-xl md:rounded-2xl font-black uppercase text-[8px] md:text-[9px] tracking-widest transition-all shadow-xl shadow-indigo-600/20"
                  >
                    <Video className="w-3.5 md:w-4 h-3.5 md:h-4" /> <span>Veo</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] md:rounded-[3rem] p-6 md:p-8 space-y-6">
          <h3 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.5em] text-neutral-500 flex items-center gap-3">
            <ShieldCheck className="w-3.5 md:w-4 h-3.5 md:h-4" /> Production DNA
          </h3>
          <div className="space-y-4">
            <div className="p-4 bg-black/40 rounded-xl md:rounded-2xl border border-white/5 space-y-2">
              <p className="text-[7px] md:text-[8px] font-black uppercase text-indigo-400/50">Core Identity</p>
              <p className="text-[11px] md:text-xs text-neutral-400 leading-relaxed italic">{storyboard.visual_dna}</p>
            </div>
            <div className="p-4 bg-black/40 rounded-xl md:rounded-2xl border border-white/5 space-y-2">
              <p className="text-[7px] md:text-[8px] font-black uppercase text-blue-400/50">Intent</p>
              <p className="text-[11px] md:text-xs text-neutral-400 leading-relaxed italic">{storyboard.style_guide}</p>
            </div>
          </div>
          
          <div className="flex flex-col gap-3">
            <button 
              onClick={onOpenAudit}
              className="w-full py-3.5 md:py-4 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 rounded-xl md:rounded-2xl text-[8px] md:text-[9px] font-black uppercase tracking-widest text-indigo-400 transition-all flex items-center justify-center gap-2 md:gap-3"
            >
              <ClipboardCheck className="w-3.5 md:w-4 h-3.5 md:h-4" /> View Audit Report
            </button>

            <button 
              onClick={onTerminate}
              className="w-full py-3.5 md:py-4 bg-red-500/5 hover:bg-red-500/10 border border-red-500/20 rounded-xl md:rounded-2xl text-[8px] md:text-[9px] font-black uppercase tracking-widest text-red-500 transition-all flex items-center justify-center gap-2 md:gap-3"
            >
              <Trash2 className="w-3.5 md:w-4 h-3.5 md:h-4" /> Terminate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
