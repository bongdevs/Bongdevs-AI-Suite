
import React from 'react';
import { User, Car } from 'lucide-react';

interface DNAAnchorCardProps {
  dna: string;
}

export const DNAAnchorCard: React.FC<DNAAnchorCardProps> = ({ dna }) => (
  <div className="bg-indigo-600/5 border border-indigo-500/20 rounded-3xl p-6 flex flex-col md:flex-row items-center gap-6 animate-in slide-in-from-top-4 duration-500 shadow-[0_0_50px_rgba(79,70,229,0.05)]">
    <div className="flex -space-x-3">
      <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center border-4 border-black shadow-lg">
        <User className="w-5 h-5" />
      </div>
      <div className="w-12 h-12 bg-neutral-800 rounded-full flex items-center justify-center border-4 border-black shadow-lg">
        <Car className="w-5 h-5" />
      </div>
    </div>
    <div className="flex-1">
      <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-1">Visual Continuity Anchor</h4>
      <p className="text-xs text-neutral-300 leading-relaxed italic">{dna}</p>
    </div>
  </div>
);
