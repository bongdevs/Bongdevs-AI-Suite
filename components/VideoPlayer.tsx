
import React from 'react';
import { Download, Maximize2 } from 'lucide-react';

interface VideoPlayerProps {
  url: string;
  aspectRatio: '16:9' | '9:16';
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ url, aspectRatio }) => {
  const containerClass = aspectRatio === '9:16' 
    ? 'aspect-[9/16] max-w-[350px] mx-auto' 
    : 'aspect-video w-full';

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = url;
    a.download = `cinematic-video-${Date.now()}.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="relative group">
      <div className={`${containerClass} bg-neutral-900 rounded-2xl overflow-hidden shadow-2xl border border-white/10`}>
        <video 
          src={url} 
          controls 
          className="w-full h-full object-cover"
          autoPlay
          loop
        />
        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button 
            onClick={handleDownload}
            className="p-2 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-colors"
          >
            <Download className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};
