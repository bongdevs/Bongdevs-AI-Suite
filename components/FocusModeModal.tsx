
import React, { useState, useRef } from 'react';
import { X, Maximize2, Edit3, Save, Copy, CheckCircle, Terminal, Layers, ExternalLink, Video, RefreshCcw, ClipboardCheck, Image as ImageIcon, Plus, Trash2, Play, Database, Bookmark } from 'lucide-react';
import { StoryScene, StoryboardConfig, TransitionType } from '../types';
import { VideoPlayer } from './VideoPlayer';

interface FocusModeModalProps {
  activeScene: StoryScene;
  activeSceneIndex: number;
  storyboard: StoryboardConfig;
  isEditingScene: boolean;
  editedDescription: string;
  isRefreshingPreview: boolean;
  copied: boolean;
  transitions: TransitionType[];
  onClose: () => void;
  onSetEditedDescription: (val: string) => void;
  onStartEditing: () => void;
  onCancelEditing: () => void;
  onRegeneratePreview: () => void;
  onCopyPrompt: (text: string) => void;
  onUpdateTransition: (idx: number, t: TransitionType, type: 'entry' | 'exit') => void;
  onOpenGrok: () => void;
  onProduceVeo: () => void;
  onUpdateScene: (scene: StoryScene) => void;
  onSaveSceneToLibrary: (scene: StoryScene) => void;
  onSaveDNA: (dna: string, label: string) => void;
}

export const FocusModeModal: React.FC<FocusModeModalProps> = ({
  activeScene,
  activeSceneIndex,
  storyboard,
  isEditingScene,
  editedDescription,
  isRefreshingPreview,
  copied,
  transitions,
  onClose,
  onSetEditedDescription,
  onStartEditing,
  onCancelEditing,
  onRegeneratePreview,
  onCopyPrompt,
  onUpdateTransition,
  onOpenGrok,
  onProduceVeo,
  onUpdateScene,
  onSaveSceneToLibrary,
  onSaveDNA
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dnaLabel, setDnaLabel] = useState(`DNA_${Date.now().toString(36)}`);
  const [showSaveDna, setShowSaveDna] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newRefs = [...(activeScene.referenceImages || [])];
    for (let i = 0; i < files.length; i++) {
      if (newRefs.length >= 3) break;
      const file = files[i];
      const reader = new FileReader();
      const b64 = await new Promise<string>((resolve) => {
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
      newRefs.push(b64);
    }

    onUpdateScene({
      ...activeScene,
      referenceImages: newRefs
    });
  };

  const removeRef = (idx: number) => {
    const newRefs = [...(activeScene.referenceImages || [])];
    newRefs.splice(idx, 1);
    onUpdateScene({
      ...activeScene,
      referenceImages: newRefs
    });
  };

  const togglePreviewAsStart = () => {
    onUpdateScene({
      ...activeScene,
      usePreviewAsStart: !activeScene.usePreviewAsStart
    });
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-2 sm:p-4 md:p-8 overflow-hidden">
      <div 
        className="absolute inset-0 bg-black/95 backdrop-blur-3xl animate-in fade-in duration-500"
        onClick={onClose}
      ></div>
      
      <div className="relative bg-[#080808] border border-white/10 rounded-2xl sm:rounded-3xl md:rounded-[4rem] w-full max-w-7xl h-full md:max-h-[95vh] overflow-hidden flex flex-col md:flex-row shadow-2xl animate-in zoom-in-95 duration-500">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 md:top-10 md:right-10 z-[160] p-2 md:p-4 bg-black/60 hover:bg-white/10 rounded-full text-white border border-white/10 transition-all"
        >
          <X className="w-6 h-6 md:w-8 md:h-8" />
        </button>

        {/* Viewport Area */}
        <div className="h-2/5 md:h-auto md:flex-1 bg-black flex flex-col items-center justify-center p-4 md:p-10 border-b md:border-b-0 md:border-r border-white/5 relative group overflow-hidden">
          {activeScene.videoUrl ? (
            <div className="w-full h-full flex items-center justify-center">
               <VideoPlayer url={activeScene.videoUrl} aspectRatio={storyboard.suggested_aspect_ratio} />
            </div>
          ) : activeScene.previewImageUrl ? (
            <div className="w-full h-full flex flex-col items-center justify-center relative">
               <div className={`w-full h-full flex items-center justify-center transition-all duration-1000 ${isRefreshingPreview ? 'opacity-20 scale-90 blur-xl' : 'opacity-100 scale-100 blur-0'}`}>
                  <img 
                    src={activeScene.previewImageUrl} 
                    className="max-w-full max-h-full rounded-2xl md:rounded-[3rem] object-contain shadow-2xl border border-white/10" 
                    alt="Focused Scene Preview"
                  />
               </div>
               {isRefreshingPreview && (
                 <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                    <RefreshCcw className="w-12 h-12 md:w-20 md:h-20 animate-spin text-indigo-500" />
                    <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.5em] text-indigo-400">Re-Drafting...</p>
                 </div>
               )}
               <div className="absolute bottom-4 md:bottom-10 flex gap-4">
                  <button 
                    onClick={onRegeneratePreview}
                    disabled={isRefreshingPreview}
                    className="px-4 md:px-8 py-2 md:py-4 bg-indigo-600/90 md:bg-indigo-600 border border-indigo-400/30 rounded-xl md:rounded-2xl opacity-100 md:opacity-0 group-hover:opacity-100 transition-all hover:bg-indigo-500 flex items-center gap-2 text-[8px] md:text-xs font-black uppercase tracking-widest shadow-2xl"
                  >
                    <RefreshCcw className={`w-3.5 h-3.5 md:w-4 md:h-4 ${isRefreshingPreview ? 'animate-spin' : ''}`} /> <span className="hidden sm:inline">Update Preview</span><span className="sm:hidden">Refresh</span>
                  </button>
               </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-6 text-neutral-700">
               <RefreshCcw className="w-10 h-10 md:w-16 md:h-16 animate-spin" />
               <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.5em] italic">Synthesizing...</p>
            </div>
          )}
        </div>

        {/* Sidebar Controls Area */}
        <div className="flex-1 md:w-[480px] lg:w-[550px] flex flex-col p-6 sm:p-10 md:p-12 lg:p-16 overflow-y-auto custom-scrollbar space-y-8 md:space-y-12">
           <div className="space-y-4">
              <div className="flex flex-wrap justify-between items-center gap-4">
                <h3 className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.6em] text-indigo-500 flex items-center gap-3">
                  <Maximize2 className="w-3 md:w-4 h-3 md:h-4" /> Focus: Scene {activeSceneIndex + 1}
                </h3>
                <button 
                  onClick={() => onSaveSceneToLibrary(activeScene)}
                  className="flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[8px] md:text-[9px] font-black uppercase tracking-widest text-neutral-400 transition-all"
                >
                  <Bookmark className="w-3 md:w-3.5 h-3 md:h-3.5" /> Archive
                </button>
              </div>
              
              {isEditingScene ? (
                <div className="space-y-4 md:space-y-6 animate-in slide-in-from-right-4 duration-300">
                   <textarea 
                    value={editedDescription}
                    onChange={(e) => onSetEditedDescription(e.target.value)}
                    className="w-full h-32 md:h-44 bg-white/5 border border-indigo-500/40 rounded-2xl md:rounded-[2.5rem] p-5 md:p-8 text-lg md:text-2xl italic text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none shadow-inner"
                    placeholder="Refine the director's script..."
                   />
                   <div className="flex gap-3 md:gap-4">
                      <button 
                        onClick={onRegeneratePreview}
                        className="flex-1 bg-indigo-600 py-3.5 md:py-5 rounded-xl md:rounded-3xl font-black uppercase text-[9px] md:text-[10px] tracking-[0.2em] flex items-center justify-center gap-2 md:gap-3 shadow-xl"
                      >
                        <Save className="w-4 md:w-5 h-4 md:h-5" /> Save
                      </button>
                      <button 
                        onClick={onCancelEditing}
                        className="px-6 md:px-8 bg-white/5 py-3.5 md:py-5 rounded-xl md:rounded-3xl font-black uppercase text-[9px] md:text-[10px] tracking-widest border border-white/5"
                      >
                        Cancel
                      </button>
                   </div>
                </div>
              ) : (
                <div className="group/script relative p-1">
                  <p className="text-xl md:text-3xl font-light leading-relaxed italic text-white/90 pr-10 md:pr-12">"{activeScene.visual_description}"</p>
                  <div className="absolute top-0 right-0 flex flex-col gap-2 md:gap-3">
                    <button 
                      onClick={onStartEditing}
                      className="p-2.5 md:p-3.5 bg-white/5 hover:bg-indigo-600 rounded-xl md:rounded-2xl border border-white/10 transition-all group/edit"
                    >
                      <Edit3 className="w-4 md:w-5 h-4 md:h-5 text-neutral-400 group-hover/edit:text-white" />
                    </button>
                    <button 
                      onClick={() => onCopyPrompt(activeScene.visual_description)}
                      className="p-2.5 md:p-3.5 bg-white/5 hover:bg-white/10 rounded-xl md:rounded-2xl border border-white/10 transition-all"
                    >
                      {copied ? <CheckCircle className="w-4 md:w-5 h-4 md:h-5 text-green-500" /> : <Copy className="w-4 md:w-5 h-4 md:h-5 text-neutral-400" />}
                    </button>
                  </div>
                </div>
              )}
           </div>

           <div className="space-y-4 md:space-y-6">
              <div className="flex justify-between items-center">
                <h4 className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-neutral-600 flex items-center gap-3">
                  <Database className="w-3.5 md:w-4 h-3.5 md:h-4" /> Production DNA
                </h4>
                <button 
                  onClick={() => setShowSaveDna(!showSaveDna)}
                  className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-indigo-400 hover:text-white transition-all"
                >
                  {showSaveDna ? 'Cancel' : 'Save Profile'}
                </button>
              </div>

              {showSaveDna ? (
                <div className="p-4 md:p-6 bg-white/5 border border-indigo-500/20 rounded-2xl md:rounded-[2rem] space-y-3 md:space-y-4 animate-in zoom-in-95">
                  <input 
                    type="text" 
                    value={dnaLabel} 
                    onChange={(e) => setDnaLabel(e.target.value)}
                    placeholder="Profile Label..."
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-[10px] md:text-xs focus:outline-none focus:border-indigo-500/50"
                  />
                  <button 
                    onClick={() => { onSaveDNA(storyboard.visual_dna, dnaLabel); setShowSaveDna(false); }}
                    className="w-full py-2.5 md:py-3 bg-indigo-600 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-600/20"
                  >
                    Lock Profile
                  </button>
                </div>
              ) : (
                <div className="p-4 md:p-6 bg-white/[0.03] border border-white/5 rounded-2xl md:rounded-[2rem]">
                  <p className="text-[9px] md:text-[10px] text-neutral-500 font-mono leading-relaxed line-clamp-3 italic">"{storyboard.visual_dna}"</p>
                </div>
              )}
           </div>

           <div className="space-y-4 md:space-y-6">
              <h4 className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-neutral-600 flex items-center gap-3">
                <ImageIcon className="w-3.5 md:w-4 h-3.5 md:h-4" /> Reference Assets
              </h4>
              <div className="flex gap-3 md:gap-4 flex-wrap">
                {(activeScene.referenceImages || []).map((img, idx) => (
                  <div key={idx} className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-xl md:rounded-2xl overflow-hidden border border-white/10 group/ref shadow-lg">
                    <img src={img} className="w-full h-full object-cover" alt="Reference" />
                    <button 
                      onClick={() => removeRef(idx)}
                      className="absolute inset-0 bg-red-600/60 opacity-0 group-hover/ref:opacity-100 transition-opacity flex items-center justify-center"
                    >
                      <Trash2 className="w-4 md:w-5 h-4 md:h-5 text-white" />
                    </button>
                  </div>
                ))}
                {(activeScene.referenceImages?.length || 0) < 3 && (
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-xl md:rounded-2xl border-2 border-dashed border-white/10 hover:border-indigo-500/50 hover:bg-white/5 transition-all flex flex-col items-center justify-center gap-1 md:gap-2 text-neutral-600 hover:text-indigo-400"
                  >
                    <Plus className="w-4 md:w-6 h-4 md:h-6" />
                    <span className="text-[7px] md:text-[8px] font-black uppercase">Add</span>
                  </button>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  multiple 
                  onChange={handleFileChange}
                />
              </div>
           </div>

           <div className="space-y-6">
              <h4 className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-neutral-600 flex items-center gap-3">
                <Layers className="w-3.5 md:w-4 h-3.5 md:h-4" /> Kinetic Transitions
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <p className="text-[8px] font-black uppercase text-neutral-500 tracking-widest">Entry</p>
                  <div className="flex flex-wrap gap-2">
                    {transitions.map((t) => (
                      <button
                        key={t}
                        onClick={() => onUpdateTransition(activeSceneIndex, t, 'entry')}
                        className={`px-3 py-2 rounded-lg text-[8px] font-black uppercase tracking-widest border transition-all ${
                          activeScene.entryTransition === t 
                            ? 'bg-indigo-600 border-indigo-400 text-white' 
                            : 'bg-white/5 border-white/10 text-neutral-700 hover:text-white'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="text-[8px] font-black uppercase text-neutral-500 tracking-widest">Exit</p>
                  <div className="flex flex-wrap gap-2">
                    {transitions.map((t) => (
                      <button
                        key={t}
                        onClick={() => onUpdateTransition(activeSceneIndex, t, 'exit')}
                        className={`px-3 py-2 rounded-lg text-[8px] font-black uppercase tracking-widest border transition-all ${
                          activeScene.exitTransition === t 
                            ? 'bg-indigo-600 border-indigo-400 text-white' 
                            : 'bg-white/5 border-white/10 text-neutral-700 hover:text-white'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
           </div>

           <div className="pt-8 md:pt-12 border-t border-white/5 grid grid-cols-1 gap-4 md:gap-5">
              <button 
                onClick={onOpenGrok}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-5 md:py-7 rounded-2xl md:rounded-[2.5rem] flex items-center justify-center gap-3 md:gap-4 transition-all active:scale-95 shadow-xl shadow-indigo-600/20 text-xs md:text-sm"
              >
                {copied ? <ClipboardCheck className="w-5 md:w-6 h-5 md:h-6" /> : <Copy className="w-5 md:w-6 h-5 md:h-6" />} 
                <span>{copied ? 'Copied' : 'Copy Hook'}</span>
              </button>
              <button 
                onClick={onProduceVeo}
                disabled={activeScene.status === 'loading'}
                className="w-full bg-white/5 hover:bg-white/10 text-white font-black py-5 md:py-7 rounded-2xl md:rounded-[2.5rem] flex items-center justify-center gap-3 md:gap-4 border border-white/10 transition-all active:scale-95 text-xs md:text-sm"
              >
                {activeScene.status === 'loading' ? <RefreshCcw className="w-5 md:w-6 h-5 md:h-6 animate-spin text-indigo-500" /> : <Video className="w-5 md:w-6 h-5 md:h-6" />} 
                <span>Start Render</span>
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};
