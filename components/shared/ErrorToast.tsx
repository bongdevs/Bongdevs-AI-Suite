
import React from 'react';
import { AlertCircle, X } from 'lucide-react';

interface ErrorToastProps {
  error: string | null;
  onClear: () => void;
}

export const ErrorToast: React.FC<ErrorToastProps> = ({ error, onClear }) => {
  if (!error) return null;

  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-4 bg-red-600 px-8 py-5 rounded-[2rem] shadow-2xl animate-in slide-in-from-bottom-10">
      <AlertCircle className="w-6 h-6 text-white" />
      <p className="font-bold text-sm">{error}</p>
      <button 
        onClick={onClear} 
        className="ml-4 p-2 bg-white/20 rounded-full hover:bg-white/30 transition-all"
      >
        <X className="w-4 h-4 text-white" />
      </button>
    </div>
  );
};
