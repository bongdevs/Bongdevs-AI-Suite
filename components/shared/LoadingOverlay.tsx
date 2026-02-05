
import React from 'react';
import { Film } from 'lucide-react';

interface LoadingOverlayProps {
  isVisible: boolean;
  title: string;
  subtitle: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isVisible, title, subtitle }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-3xl flex flex-col items-center justify-center gap-12 text-center p-6 animate-in fade-in duration-500">
      <div className="relative">
        <div className="w-40 h-40 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
        <Film className="absolute inset-0 m-auto w-12 h-12 text-indigo-500 animate-pulse" />
      </div>
      <div className="space-y-4">
        <h2 className="text-4xl font-black italic tracking-tighter uppercase">{title}</h2>
        <p className="text-neutral-500 max-w-md mx-auto">{subtitle}</p>
      </div>
    </div>
  );
};
