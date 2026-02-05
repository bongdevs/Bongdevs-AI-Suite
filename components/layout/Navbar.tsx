
import React from 'react';
import { Film, Clapperboard, Play, Grid, List, History, Trash2 } from 'lucide-react';
import { HistoryItem } from '../../types';

interface NavbarProps {
  hasStoryboard: boolean;
  filmProgress: number;
  viewMode: 'timeline' | 'grid';
  setViewMode: (mode: 'timeline' | 'grid') => void;
  setIsPreviewingFilm: (val: boolean) => void;
  history: HistoryItem[];
  handleCreateStoryboard: (e?: React.FormEvent, overridePrompt?: string) => void;
  deleteHistory: (e: React.MouseEvent, id: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  hasStoryboard,
  filmProgress,
  viewMode,
  setViewMode,
  setIsPreviewingFilm,
  history,
  handleCreateStoryboard,
  deleteHistory
}) => {
  return (
    <nav className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8 md:mb-20">
      <div className="flex items-center gap-4 self-start">
        <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-600 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/40">
          <Film className="w-5 h-5 md:w-6 md:h-6 text-white" />
        </div>
        <div>
          <h1 className="text-lg md:text-xl font-black tracking-tighter uppercase italic">
            Bongdevs <span className="text-indigo-500">AI Suite</span>
          </h1>
          <p className="text-[7px] md:text-[8px] font-black tracking-[0.4em] text-neutral-500 uppercase">
            Professional Cinema Pipeline
          </p>
        </div>
      </div>
      
      <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 md:gap-4 w-full md:w-auto">
        {hasStoryboard && (
          <div className="flex items-center gap-2 px-3 md:px-4 py-2 bg-white/5 rounded-xl md:rounded-2xl border border-white/10">
            <Clapperboard className="w-3.5 h-3.5 md:w-4 md:h-4 text-indigo-400" />
            <div className="w-16 sm:w-20 md:w-32 h-1 md:h-1.5 bg-neutral-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-500 transition-all duration-1000" 
                style={{ width: `${filmProgress}%` }}
              ></div>
            </div>
            <span className="text-[8px] md:text-[10px] font-black text-neutral-500 whitespace-nowrap">{Math.round(filmProgress)}%</span>
          </div>
        )}
        
        {hasStoryboard && filmProgress > 0 && (
          <button 
            onClick={() => setIsPreviewingFilm(true)}
            className="px-4 md:px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg"
          >
            <Play className="w-3 h-3 md:w-3.5 md:h-3.5 fill-current" /> <span className="hidden sm:inline">Play Reel</span><span className="sm:hidden">Play</span>
          </button>
        )}
        
        {hasStoryboard && (
          <button 
            onClick={() => setViewMode(viewMode === 'timeline' ? 'grid' : 'timeline')} 
            className="p-2.5 md:p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all"
          >
            {viewMode === 'timeline' ? <Grid className="w-4 h-4 md:w-5 md:h-5" /> : <List className="w-4 h-4 md:w-5 md:h-5" />}
          </button>
        )}
        
        <div className="relative group">
          <button className="p-2.5 md:p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all relative">
            <History className="w-4 h-4 md:w-5 md:h-5" />
            {history.length > 0 && <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>}
          </button>
          
          <div className="absolute top-full right-0 mt-4 w-72 md:w-80 bg-neutral-900 border border-white/10 rounded-2xl p-4 hidden group-hover:block z-50 shadow-2xl animate-in fade-in slide-in-from-top-2">
            <h4 className="text-[9px] md:text-[10px] font-black uppercase tracking-widest mb-4">Archives</h4>
            <div className="space-y-2 max-h-[60vh] overflow-y-auto custom-scrollbar">
              {history.map(item => (
                <div 
                  key={item.id} 
                  className="p-3 hover:bg-white/5 rounded-lg flex justify-between items-center group/item transition-all cursor-pointer" 
                  onClick={() => handleCreateStoryboard(undefined, item.prompt)}
                >
                  <div className="overflow-hidden pr-2">
                    <p className="text-xs font-bold truncate">{item.title}</p>
                    <p className="text-[8px] text-neutral-500 uppercase tracking-widest">
                      {item.scenesCount} Scenes • {new Date(item.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                  <Trash2 
                    className="w-3.5 h-3.5 shrink-0 text-neutral-700 hover:text-red-500 opacity-0 group-hover/item:opacity-100 transition-all" 
                    onClick={(e) => deleteHistory(e, item.id)} 
                  />
                </div>
              ))}
              {history.length === 0 && (
                <p className="text-[9px] text-neutral-600 uppercase tracking-widest text-center py-4">Vault empty</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};