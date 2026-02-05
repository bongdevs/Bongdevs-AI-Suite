
import React, { useState } from 'react';
import { Rocket, Wand2, RefreshCcw, Image as ImageIcon, User, MapPin, Package, Cpu, X, Database, Trash2, ClipboardPaste, Save, CheckCircle2 } from 'lucide-react';
import { SavedDNA, SavedScene } from '../../types';

interface LandingScreenProps {
  idea: string;
  setIdea: (val: string) => void;
  showAdvanced: boolean;
  setShowAdvanced: (val: boolean) => void;
  charDna: string;
  envDna: string;
  assetDna: string;
  selectedDnaId: string | null;
  onManualDnaChange: (field: 'char' | 'env' | 'asset', val: string) => void;
  isProcessing: boolean;
  isGeneratingLandingPreview: boolean;
  landingPreview: string | null;
  setLandingPreview: (val: string | null) => void;
  handleCreateStoryboard: (e?: React.FormEvent) => void;
  handleQuickConceptSnapshot: () => void;
  blueprintSummary: { concept: string; dna: string } | null;
  inspirations: string[];
  savedDNAs: SavedDNA[];
  onDeleteDNA: (id: string) => void;
  onApplyDNA: (dna: SavedDNA) => void;
  onSaveDNA: (dna: string, label: string) => void;
  savedScenes: SavedScene[];
  onDeleteSavedScene: (id: string) => void;
  onApplySavedScene: (scene: SavedScene) => void;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({
  idea, setIdea, showAdvanced, setShowAdvanced,
  charDna, envDna, assetDna,
  selectedDnaId, onManualDnaChange,
  isProcessing, isGeneratingLandingPreview, landingPreview, setLandingPreview,
  handleCreateStoryboard, handleQuickConceptSnapshot,
  blueprintSummary, inspirations,
  savedDNAs, onDeleteDNA, onApplyDNA, onSaveDNA,
  savedScenes, onDeleteSavedScene, onApplySavedScene
}) => {
  const [dnaLabel, setDnaLabel] = useState('');
  const [isSavingDNA, setIsSavingDNA] = useState(false);

  const handleManualSaveDNA = () => {
    if (!dnaLabel.trim()) return;
    const summary = `${charDna} ${envDna} ${assetDna}`.trim();
    onSaveDNA(summary, dnaLabel);
    setDnaLabel('');
    setIsSavingDNA(false);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center max-w-5xl mx-auto w-full space-y-10 md:space-y-12 py-6 md:py-12">
      <div className="text-center space-y-4 md:space-y-6 px-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-600/10 border border-indigo-500/20 rounded-full text-indigo-400 text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] animate-in fade-in slide-in-from-bottom-4">
          <Rocket className="w-3 md:w-3.5 h-3 md:h-3.5" /> Next-Gen AI Cinema Engine
        </div>
        <h2 className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tight leading-[1] md:leading-[0.9] text-white italic">
          BONGDEVS <span className="text-indigo-500">DIRECTOR.</span>
        </h2>
        <p className="text-neutral-500 text-sm md:text-xl font-medium max-w-2xl mx-auto px-2">
          Transform a single spark of imagination into a fully storyboarded cinematic epic with Bongdevs Visual DNA.
        </p>
      </div>

      <form onSubmit={handleCreateStoryboard} className="w-full space-y-6 md:space-y-8 px-2 sm:px-4">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-[1.5rem] md:rounded-[2.5rem] blur opacity-10 group-focus-within:opacity-20 transition duration-1000"></div>
          <div className="relative bg-[#0a0a0a] border border-white/10 rounded-[1.5rem] md:rounded-[2.5rem] p-1 shadow-2xl overflow-hidden">
            <textarea 
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="Describe your vision..."
              className="w-full h-40 md:h-44 bg-transparent focus:outline-none p-6 md:p-8 text-lg md:text-2xl font-light italic custom-scrollbar resize-none border-b border-white/5 pb-28 md:pb-20"
              disabled={isProcessing}
            />
            
            <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:right-8 flex flex-wrap items-center justify-center md:justify-end gap-2 md:gap-4">
               <button 
                type="button"
                onClick={handleQuickConceptSnapshot}
                disabled={!idea.trim() || isGeneratingLandingPreview}
                className="flex items-center gap-2 px-4 md:px-6 py-2.5 md:py-3 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 rounded-xl md:rounded-2xl text-[8px] md:text-[10px] font-black uppercase tracking-widest text-indigo-400 transition-all disabled:opacity-20"
              >
                {isGeneratingLandingPreview ? <RefreshCcw className="w-3 md:w-4 h-3 md:h-4 animate-spin" /> : <ImageIcon className="w-3 md:w-4 h-3 md:h-4" />}
                {isGeneratingLandingPreview ? 'Drafting...' : 'Snapshot'}
              </button>
              
              <button 
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className={`px-4 md:px-6 py-2.5 md:py-3 rounded-xl md:rounded-2xl text-[8px] md:text-[10px] font-black uppercase tracking-widest transition-all ${showAdvanced ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white/5 text-neutral-400 border border-white/10'}`}
              >
                DNA Tools
              </button>

              <button 
                type="submit"
                disabled={!idea.trim() || isProcessing}
                className="px-6 md:px-10 py-2.5 md:py-3 bg-white text-black rounded-xl md:rounded-2xl text-[8px] md:text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all disabled:opacity-50 flex items-center gap-2 md:gap-3 shadow-xl"
              >
                {isProcessing ? <RefreshCcw className="w-3 md:w-4 h-3 md:h-4 animate-spin" /> : <Wand2 className="w-3 md:w-4 h-3 md:h-4" />} <span className="hidden sm:inline">Produce Now</span><span className="sm:hidden">Produce</span>
              </button>
            </div>
          </div>
        </div>

        {landingPreview && (
          <div className="animate-in slide-in-from-top-4 duration-500">
            <div className="relative aspect-video rounded-xl md:rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
              <img src={landingPreview} className="w-full h-full object-cover" alt="Concept Preview" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4 md:p-8">
                <p className="text-[7px] md:text-[10px] font-black text-indigo-400 uppercase tracking-widest bg-black/40 backdrop-blur-md px-3 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl border border-indigo-500/20">Initial Blueprint Concept</p>
              </div>
              <button 
                onClick={() => setLandingPreview(null)}
                className="absolute top-4 right-4 md:top-6 md:right-6 p-2 md:p-3 bg-black/60 hover:bg-red-500/20 hover:text-red-500 rounded-full border border-white/10 transition-all"
              >
                <X className="w-4 md:w-5 h-4 md:h-5" />
              </button>
            </div>
          </div>
        )}

        <div id="advanced-dna-section" className={`${showAdvanced ? 'block' : 'hidden'} space-y-6 md:space-y-8 animate-in slide-in-from-top-4 duration-300`}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-2">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-indigo-400 flex items-center gap-2">
              <Cpu className="w-4 h-4" /> Visual Identity (DNA)
            </h3>
            {(charDna || envDna || assetDna) && !isSavingDNA && (
              <button 
                type="button"
                onClick={() => setIsSavingDNA(true)}
                className="text-[9px] font-black uppercase tracking-widest text-indigo-400 hover:text-white flex items-center gap-2 transition-all"
              >
                <Save className="w-3.5 h-3.5" /> Save Profile
              </button>
            )}
          </div>

          {isSavingDNA && (
            <div className="p-4 md:p-6 bg-indigo-500/5 border border-indigo-500/20 rounded-2xl md:rounded-3xl flex flex-col sm:flex-row items-center gap-4 animate-in zoom-in-95">
              <input 
                type="text" 
                value={dnaLabel} 
                onChange={(e) => setDnaLabel(e.target.value)}
                placeholder="Profile Name..."
                className="w-full sm:flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-indigo-500/50"
                autoFocus
              />
              <div className="flex gap-2 w-full sm:w-auto">
                <button 
                  type="button"
                  onClick={handleManualSaveDNA}
                  disabled={!dnaLabel.trim()}
                  className="flex-1 sm:flex-none px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-20 shadow-lg shadow-indigo-600/20"
                >
                  Confirm
                </button>
                <button 
                  type="button"
                  onClick={() => setIsSavingDNA(false)}
                  className="p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10"
                >
                  <X className="w-4 h-4 text-neutral-500" />
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-neutral-500 flex items-center gap-2 px-2"><User className="w-3 md:w-3.5 h-3 md:h-3.5" /> Character</label>
              <input type="text" value={charDna} onChange={(e) => onManualDnaChange('char', e.target.value)} placeholder="Physical traits..." className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl px-5 md:px-6 py-3 md:py-4 text-sm focus:outline-none focus:border-indigo-500/50" />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-neutral-500 flex items-center gap-2 px-2"><MapPin className="w-3 md:w-3.5 h-3 md:h-3.5" /> Environment</label>
              <input type="text" value={envDna} onChange={(e) => onManualDnaChange('env', e.target.value)} placeholder="Architecture, atmosphere..." className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl px-5 md:px-6 py-3 md:py-4 text-sm focus:outline-none focus:border-indigo-500/50" />
            </div>
            <div className="space-y-2 sm:col-span-2 lg:col-span-1">
              <label className="text-[9px] font-black uppercase tracking-widest text-neutral-500 flex items-center gap-2 px-2"><Package className="w-3 md:w-3.5 h-3 md:h-3.5" /> Key Assets</label>
              <input type="text" value={assetDna} onChange={(e) => onManualDnaChange('asset', e.target.value)} placeholder="Props, gadgets..." className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl px-5 md:px-6 py-3 md:py-4 text-sm focus:outline-none focus:border-indigo-500/50" />
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 flex items-center gap-2">
              <Database className="w-4 h-4" /> DNA Vault ({savedDNAs.length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedDNAs.map(dna => {
                const isSelected = selectedDnaId === dna.id;
                return (
                  <div 
                    key={dna.id} 
                    onClick={() => !isSelected && onApplyDNA(dna)}
                    className={`group relative border rounded-xl md:rounded-2xl p-4 transition-all cursor-pointer ${
                      isSelected 
                        ? 'bg-indigo-500/15 border-indigo-500/60 ring-2 ring-indigo-500/20 shadow-xl scale-[1.02]' 
                        : 'bg-white/[0.02] hover:bg-white/[0.04] border-white/5'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <p className={`text-[10px] md:text-xs font-bold ${isSelected ? 'text-indigo-400' : 'text-neutral-300'}`}>{dna.label}</p>
                        {isSelected && <CheckCircle2 className="w-3 md:w-3.5 h-3 md:h-3.5 text-indigo-500 animate-in zoom-in" />}
                      </div>
                      <button 
                        type="button"
                        onClick={(e) => { e.stopPropagation(); onDeleteDNA(dna.id); }}
                        className="p-1 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all"
                      >
                        <Trash2 className="w-3 md:w-3.5 h-3 md:h-3.5" />
                      </button>
                    </div>
                    <p className="text-[8px] md:text-[10px] text-neutral-600 line-clamp-2 italic mb-3">"{dna.dna}"</p>
                    <button 
                      type="button"
                      disabled={isSelected}
                      className={`w-full py-1.5 md:py-2 text-[8px] md:text-[9px] font-black uppercase tracking-widest rounded-lg transition-all ${
                        isSelected 
                          ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 cursor-default' 
                          : 'bg-indigo-500/10 hover:bg-indigo-500/30 text-indigo-400'
                      }`}
                    >
                      {isSelected ? 'Applied' : 'Apply DNA'}
                    </button>
                  </div>
                );
              })}
              {savedDNAs.length === 0 && (
                <div className="col-span-full py-8 border border-dashed border-white/5 rounded-2xl flex items-center justify-center">
                  <p className="text-[9px] font-black uppercase tracking-widest text-neutral-800">Vault empty</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {blueprintSummary && (
          <div className="p-6 md:p-8 bg-black/40 border border-indigo-500/20 rounded-[1.5rem] md:rounded-[2.5rem] animate-in zoom-in-95 duration-500 shadow-inner">
            <div className="flex items-center gap-2 mb-3 md:mb-4">
              <Cpu className="w-3 md:w-4 h-3 md:h-4 text-indigo-500" />
              <p className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-neutral-500">Bongdevs Synthesis Pipeline</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm md:text-base text-neutral-200 font-bold italic line-clamp-1">"{blueprintSummary.concept}"</p>
              <p className="text-[8px] md:text-xs text-neutral-500 font-mono tracking-tight break-all line-clamp-2 leading-relaxed">{blueprintSummary.dna}</p>
            </div>
          </div>
        )}

        <div className="flex flex-wrap justify-center gap-2 md:gap-3 pt-4 md:pt-6 px-2">
          {inspirations.map(insp => (
            <button 
              key={insp} type="button" onClick={() => setIdea(insp)}
              className="px-4 md:px-6 py-2 md:py-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl md:rounded-2xl text-[8px] md:text-[10px] font-bold text-neutral-600 hover:text-white transition-all whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]"
            >
              {insp}
            </button>
          ))}
        </div>

        <div className="pt-8 md:pt-12 border-t border-white/5 space-y-6">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400 flex items-center gap-2">
            <ClipboardPaste className="w-4 h-4" /> Scene Archive ({savedScenes.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {savedScenes.map(scene => (
              <div key={scene.id} className="group relative bg-white/[0.02] border border-white/5 rounded-2xl md:rounded-3xl p-5 md:p-6 transition-all hover:bg-white/[0.04]">
                <div className="flex justify-between items-start mb-3 md:mb-4">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-white">{scene.title}</p>
                    <p className="text-[8px] text-neutral-600 uppercase tracking-widest">{new Date(scene.timestamp).toLocaleDateString()}</p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => onDeleteSavedScene(scene.id)}
                    className="p-1.5 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all"
                  >
                    <Trash2 className="w-3.5 md:w-4 h-3.5 md:h-4" />
                  </button>
                </div>
                <p className="text-[10px] text-neutral-500 line-clamp-3 italic mb-4 md:mb-6">"{scene.visual_description}"</p>
                <button 
                  type="button"
                  onClick={() => onApplySavedScene(scene)}
                  className="w-full py-2.5 md:py-3 bg-white/5 hover:bg-indigo-600 text-[8px] md:text-[9px] font-black uppercase tracking-widest text-neutral-400 hover:text-white rounded-xl border border-white/10 transition-all"
                >
                  Recall Blueprint
                </button>
              </div>
            ))}
            {savedScenes.length === 0 && (
              <div className="col-span-full py-12 md:py-16 border border-dashed border-white/5 rounded-[2rem] md:rounded-[3rem] flex items-center justify-center">
                <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-neutral-800 italic">No blueprints in archive</p>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};
