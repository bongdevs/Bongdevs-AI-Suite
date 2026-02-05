
import React from 'react';
import { Maximize2, Video, CheckCircle, XCircle, Wand2, RefreshCcw } from 'lucide-react';
import { StoryScene } from '../../types';
import { AnimatedPreview } from '../AnimatedPreview';

interface SceneCardProps {
  scene: StoryScene;
  index: number;
  viewMode: 'timeline' | 'grid';
  isActive: boolean;
  aspectRatio: '16:9' | '9:16';
  onSelect: () => void;
  onFocus: () => void;
  onProduce: () => void;
  onFixContinuity: () => void;
}

export const SceneCard: React.FC<SceneCardProps> = ({
  scene,
  index,
  viewMode,
  isActive,
  aspectRatio,
  onSelect,
  onFocus,
  onProduce,
  onFixContinuity
}) => {
  const isTimeline = viewMode === 'timeline';

  return (
    <div 
      className={`group relative transition-all duration-500 cursor-pointer ${
        isTimeline 
          ? `p-6 md:p-8 bg-white/[0.02] border border-white/5 rounded-[2rem] md:rounded-[3rem] hover:bg-white/[0.04] ${isActive ? 'ring-2 ring-indigo-500/50 bg-indigo-500/5' : ''}` 
          : 'bg-white/[0.02] border border-white/5 rounded-[2.5rem] overflow-hidden h-full'
      }`} 
      onClick={onSelect}
    >
      <div className={isTimeline ? "flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start" : "flex flex-col h-full"}>
        <div className={`relative ${isTimeline ? 'w-full md:w-64 lg:w-80' : 'w-full aspect-video'} shrink-0 overflow-hidden rounded-2xl md:rounded-[2rem] border border-white/5 shadow-xl`}>
          {scene.videoUrl ? (
            <video src={scene.videoUrl} className="w-full h-full object-cover" muted autoPlay loop />
          ) : scene.previewImageUrl ? (
            <AnimatedPreview url={scene.previewImageUrl} aspectRatio={aspectRatio} />
          ) : (
            <div className="w-full aspect-video bg-neutral-900 flex flex-col items-center justify-center gap-3">
              <RefreshCcw className="w-6 h-6 animate-spin text-neutral-800" />
              <span className="text-[7px] font-black uppercase tracking-[0.4em] text-neutral-700">Refining...</span>
            </div>
          )}
          <div className="absolute top-3 left-3 md:top-4 md:left-4 z-10">
            <div className="px-2.5 py-1 bg-black/40 backdrop-blur-md border border-white/10 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest text-white/80">
              {index + 1}
            </div>
          </div>
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 md:gap-3 transition-all">
            <button 
              onClick={(e) => { e.stopPropagation(); onFocus(); }} 
              className="p-3 md:p-4 bg-white text-black rounded-full hover:scale-110 transition-all shadow-2xl"
              title="Focus View"
            >
              <Maximize2 className="w-5 h-5 md:w-6 md:h-6 text-black" />
            </button>
            {scene.previewImageUrl && (
              <button 
                onClick={(e) => { e.stopPropagation(); onProduce(); }} 
                className="p-3 md:p-4 bg-indigo-600 text-white rounded-full hover:scale-110 transition-all shadow-2xl"
                title="Render Scene"
              >
                <Video className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </button>
            )}
          </div>
        </div>
        
        <div className={`flex-1 space-y-3 md:space-y-4 ${!isTimeline ? 'p-6 md:p-8 flex flex-col' : ''}`}>
          <p className="text-base md:text-lg font-light italic text-neutral-300 leading-relaxed line-clamp-3">"{scene.visual_description}"</p>
          
          <div className="flex flex-wrap gap-2">
            <span className="text-[7px] md:text-[8px] font-black uppercase tracking-widest text-neutral-600 bg-white/5 px-2 md:px-2.5 py-1 rounded-full border border-white/10">
              In: {scene.entryTransition}
            </span>
            <span className="text-[7px] md:text-[8px] font-black uppercase tracking-widest text-neutral-600 bg-white/5 px-2 md:px-2.5 py-1 rounded-full border border-white/10">
              Out: {scene.exitTransition}
            </span>
          </div>

          <div className="flex-grow"></div>

          {scene.consistency && (
            <div className="pt-3 md:pt-4 border-t border-white/5 flex flex-wrap gap-3 items-center">
              <div className={`flex items-center gap-2 px-2.5 py-1 rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-widest ${
                scene.consistency.isConsistent ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
              }`}>
                {scene.consistency.isConsistent ? <CheckCircle className="w-3 md:w-3.5 h-3 md:h-3.5" /> : <XCircle className="w-3 md:w-3.5 h-3 md:h-3.5" />}
                <span className="hidden sm:inline">{scene.consistency.isConsistent ? 'DNA Verified' : 'DNA Deviation'}</span>
                <span className="sm:hidden">{scene.consistency.isConsistent ? 'Verified' : 'Error'}</span>
              </div>
              {!scene.consistency.isConsistent && (
                <button 
                  onClick={(e) => { e.stopPropagation(); onFixContinuity(); }} 
                  className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-indigo-400 hover:text-white transition-all flex items-center gap-1.5 md:gap-2 bg-indigo-500/10 px-2.5 md:px-3 py-1 rounded-full border border-indigo-500/20"
                >
                  <Wand2 className="w-2.5 md:w-3 h-2.5 md:h-3" /> <span className="hidden sm:inline">Auto-Fix DNA</span><span className="sm:hidden">Fix</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
