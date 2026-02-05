
import React from 'react';
import { Sparkles, Video, CheckCircle2, Loader2 } from 'lucide-react';
import { GenerationStatus } from '../types';

interface StatusTimelineProps {
  status: GenerationStatus;
}

export const StatusTimeline: React.FC<StatusTimelineProps> = ({ status }) => {
  const steps = [
    { key: GenerationStatus.REFINING, icon: Sparkles, label: 'Brain: Prompt Refining' },
    { key: GenerationStatus.GENERATING, icon: Video, label: 'Maker: Video Rendering' },
    { key: GenerationStatus.READY, icon: CheckCircle2, label: 'Ready for Review' },
  ];

  const getStepIndex = (s: GenerationStatus) => {
    if (s === GenerationStatus.IDLE) return -1;
    if (s === GenerationStatus.REFINING) return 0;
    if (s === GenerationStatus.GENERATING) return 1;
    if (s === GenerationStatus.READY) return 2;
    return -1;
  };

  const currentIndex = getStepIndex(status);

  return (
    <div className="flex flex-col gap-6 py-8">
      {steps.map((step, idx) => {
        const isActive = idx === currentIndex;
        const isCompleted = idx < currentIndex;
        const isPending = idx > currentIndex;

        return (
          <div key={step.key} className="flex items-center gap-4 group">
            <div className={`
              flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-500
              ${isCompleted ? 'bg-green-500 border-green-500 text-black' : 
                isActive ? 'bg-indigo-600 border-indigo-600 animate-pulse text-white' : 
                'bg-neutral-900 border-neutral-800 text-neutral-500'}
            `}>
              {isActive ? <Loader2 className="w-5 h-5 animate-spin" /> : <step.icon className="w-5 h-5" />}
            </div>
            <div className="flex flex-col">
              <span className={`text-sm font-semibold tracking-wide uppercase ${
                isActive ? 'text-white' : isCompleted ? 'text-green-500' : 'text-neutral-600'
              }`}>
                {step.label}
              </span>
              {isActive && (
                <span className="text-xs text-neutral-400 mt-1 animate-pulse-slow">
                  {status === GenerationStatus.REFINING ? 'Expanding your creative spark...' : 'Cooking 4K frames with Veo 3.1...'}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
