
import React, { useState, useEffect, useRef } from 'react';
// Added missing Video icon to the lucide-react import
import { X, Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Maximize2, Clapperboard, Video } from 'lucide-react';
import { StoryScene, TransitionType } from '../types';

interface FilmReelPlayerProps {
  scenes: StoryScene[];
  aspectRatio: '16:9' | '9:16';
  onClose: () => void;
}

export const FilmReelPlayer: React.FC<FilmReelPlayerProps> = ({ scenes, aspectRatio, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const currentScene = scenes[currentIndex];

  const handleEnded = () => {
    if (currentIndex < scenes.length - 1) {
      triggerTransition(currentIndex + 1);
    } else {
      setIsPlaying(false);
    }
  };

  const triggerTransition = (nextIdx: number) => {
    setTransitioning(true);
    // Short delay to allow CSS transition to play (Exit transition of current + Entry of next)
    setTimeout(() => {
      setCurrentIndex(nextIdx);
      setTransitioning(false);
    }, 600);
  };

  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.play().catch(() => setIsPlaying(false));
      else videoRef.current.pause();
    }
  }, [isPlaying, currentIndex]);

  const getEntryClass = (type: TransitionType) => {
    switch (type) {
      case 'fade': return 'opacity-100 scale-100 transition-all duration-700';
      case 'wipe': return 'translate-x-0 transition-all duration-700';
      case 'dissolve': return 'opacity-100 blur-0 transition-all duration-700';
      case 'zoom': return 'scale-100 opacity-100 transition-all duration-700';
      case 'glitch': return 'skew-x-0 opacity-100 transition-all duration-700';
      default: return 'opacity-100 transition-none';
    }
  };

  const getExitClass = (type: TransitionType) => {
    switch (type) {
      case 'fade': return 'opacity-0 scale-95 transition-all duration-500';
      case 'wipe': return '-translate-x-full transition-all duration-500';
      case 'dissolve': return 'opacity-0 blur-md transition-all duration-500';
      case 'zoom': return 'scale-150 opacity-0 transition-all duration-500';
      case 'glitch': return 'skew-x-12 opacity-50 contrast-150 transition-all duration-500';
      default: return 'opacity-0 transition-none';
    }
  };

  const containerClass = aspectRatio === '9:16' 
    ? 'aspect-[9/16] h-[85vh]' 
    : 'aspect-video w-full max-w-6xl';

  return (
    <div className="fixed inset-0 z-[250] bg-black/98 backdrop-blur-2xl flex items-center justify-center p-6 animate-in fade-in duration-500">
      <div className="absolute top-8 left-10 flex items-center gap-4">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
          <Clapperboard className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-sm font-black uppercase tracking-widest text-white italic">Master Film Reel</h2>
          <p className="text-[10px] text-neutral-500 font-mono">
            SCENE {currentIndex + 1} OF {scenes.length} • 
            {currentScene.entryTransition.toUpperCase()} IN / {currentScene.exitTransition.toUpperCase()} OUT
          </p>
        </div>
      </div>

      <button onClick={onClose} className="absolute top-8 right-10 p-4 bg-white/5 hover:bg-white/10 rounded-full transition-all border border-white/10 group">
        <X className="w-6 h-6 text-neutral-400 group-hover:text-white" />
      </button>

      <div className="relative flex flex-col items-center gap-8 w-full max-w-7xl">
        <div className={`${containerClass} bg-neutral-900 rounded-[3rem] overflow-hidden border border-white/10 shadow-[0_0_100px_rgba(79,70,229,0.15)] relative`}>
          <div className={`w-full h-full ${transitioning ? getExitClass(currentScene.exitTransition) : getEntryClass(currentScene.entryTransition)}`}>
            {currentScene.videoUrl ? (
              <video
                ref={videoRef}
                src={currentScene.videoUrl}
                className="w-full h-full object-cover"
                onEnded={handleEnded}
                muted={isMuted}
                playsInline
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-neutral-900/50 backdrop-blur-sm">
                <img src={currentScene.previewImageUrl} className="absolute inset-0 w-full h-full object-cover opacity-20 blur-xl" />
                <div className="relative z-10 flex flex-col items-center gap-4">
                  <div className="p-6 bg-white/5 rounded-full border border-white/10">
                    <Video className="w-12 h-12 text-neutral-700" />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-500 italic">Scene not rendered yet</p>
                  <button onClick={handleEnded} className="px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-[9px] font-black uppercase tracking-widest text-neutral-400">Skip Scene</button>
                </div>
              </div>
            )}
          </div>

          {/* Player Controls Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-10 bg-gradient-to-t from-black/80 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <button onClick={() => setIsPlaying(!isPlaying)} className="p-3 bg-white text-black rounded-full hover:scale-110 transition-all">
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </button>
              <div className="flex items-center gap-4">
                <button onClick={() => currentIndex > 0 && triggerTransition(currentIndex - 1)} disabled={currentIndex === 0} className="p-2 text-white/60 hover:text-white disabled:opacity-20">
                  <SkipBack className="w-5 h-5" />
                </button>
                <button onClick={() => currentIndex < scenes.length - 1 && triggerTransition(currentIndex + 1)} disabled={currentIndex === scenes.length - 1} className="p-2 text-white/60 hover:text-white disabled:opacity-20">
                  <SkipForward className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 px-12">
              <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-500 transition-all duration-300" 
                  style={{ width: `${((currentIndex + 1) / scenes.length) * 100}%` }}
                />
              </div>
            </div>

            <div className="flex items-center gap-6">
              <button onClick={() => setIsMuted(!isMuted)} className="p-2 text-white/60 hover:text-white">
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <button className="p-2 text-white/60 hover:text-white">
                <Maximize2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-4 overflow-x-auto no-scrollbar w-full max-w-4xl px-4 py-2">
          {scenes.map((scene, idx) => (
            <button
              key={scene.id}
              onClick={() => triggerTransition(idx)}
              className={`shrink-0 w-32 aspect-video rounded-xl overflow-hidden border-2 transition-all ${
                currentIndex === idx ? 'border-indigo-500 scale-110 shadow-lg' : 'border-white/5 opacity-40 hover:opacity-100'
              }`}
            >
              <img src={scene.previewImageUrl} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
