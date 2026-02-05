
import React from 'react';

interface ConfidenceBarProps {
  label: string;
  score: number;
  color: string;
}

export const ConfidenceBar: React.FC<ConfidenceBarProps> = ({ label, score, color }) => (
  <div className="space-y-1">
    <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-widest text-neutral-500">
      <span>{label}</span>
      <span className={score < 70 ? 'text-amber-500' : 'text-green-500'}>{score}%</span>
    </div>
    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
      <div 
        className={`h-full transition-all duration-1000 ${color}`} 
        style={{ width: `${score}%` }}
      />
    </div>
  </div>
);
