
import React from 'react';

interface AnimatedPreviewProps {
  url: string;
  aspectRatio: '16:9' | '9:16';
}

export const AnimatedPreview: React.FC<AnimatedPreviewProps> = ({ url, aspectRatio }) => {
  const containerClass = aspectRatio === '9:16' 
    ? 'aspect-[9/16] max-w-[320px] mx-auto' 
    : 'aspect-video w-full';

  return (
    <div className={`${containerClass} bg-neutral-900 rounded-3xl overflow-hidden shadow-2xl border border-white/10 relative group`}>
      <style>{`
        @keyframes kenburns {
          0% { transform: scale(1) translate(0, 0); }
          100% { transform: scale(1.15) translate(-2%, -2%); }
        }
        .ken-burns {
          animation: kenburns 12s ease-in-out infinite alternate;
        }
      `}</style>
      <img 
        src={url} 
        alt="Cinematic Preview"
        className="w-full h-full object-cover ken-burns"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>
      <div className="absolute bottom-4 left-4 flex items-center gap-2">
        <div className="px-2 py-1 bg-indigo-600/80 backdrop-blur-md rounded text-[10px] font-bold tracking-widest text-white uppercase">
          Free Visual Preview
        </div>
      </div>
    </div>
  );
};
