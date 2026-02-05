
import React from 'react';
import { X, ShieldCheck, UserCheck, Eye, AlertTriangle, CheckCircle2, ScanFace, Database } from 'lucide-react';
import { StoryScene } from '../../types';
import { ConfidenceBar } from '../shared/ConfidenceBar';

interface AuditReportModalProps {
  scenes: StoryScene[];
  onClose: () => void;
  visualDna: string;
}

export const AuditReportModal: React.FC<AuditReportModalProps> = ({ scenes, onClose, visualDna }) => {
  const avgFacialScore = Math.round(
    scenes.reduce((acc, s) => acc + (s.consistency?.facialConfidence || 0), 0) / scenes.length
  );

  return (
    <div className="fixed inset-0 z-[260] flex items-center justify-center p-3 sm:p-6 overflow-hidden">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-2xl animate-in fade-in duration-500" onClick={onClose}></div>
      
      <div className="relative bg-[#080808] border border-white/10 rounded-2xl sm:rounded-[3rem] w-full max-w-4xl h-full sm:max-h-[85vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-500">
        <div className="p-6 sm:p-8 border-b border-white/5 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/40">
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black tracking-tighter uppercase italic">Production Audit</h2>
              <p className="text-[7px] sm:text-[9px] font-black tracking-[0.4em] text-neutral-500 uppercase">Verification Pipeline</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 sm:p-3 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-all">
            <X className="w-5 h-5 sm:w-6 sm:h-6 text-neutral-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 sm:p-10 space-y-8 sm:space-y-12">
          {/* Executive Summary */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl sm:rounded-3xl p-6 sm:p-8 space-y-4 sm:space-y-6">
              <div className="flex items-center gap-3">
                <ScanFace className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400" />
                <h3 className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-indigo-400">Facial Consistency</h3>
              </div>
              <div className="flex items-end gap-3 sm:gap-4">
                <span className="text-4xl sm:text-5xl font-black italic">{avgFacialScore}%</span>
                <span className={`text-[8px] sm:text-[10px] font-black uppercase mb-1 sm:mb-2 ${avgFacialScore > 85 ? 'text-green-500' : 'text-amber-500'}`}>
                  {avgFacialScore > 85 ? 'Precise' : 'Variance'}
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-neutral-500 italic leading-relaxed">
                Aggregated biometric validation using Gemini 3.1 analysis.
              </p>
            </div>

            <div className="bg-white/[0.02] border border-white/5 rounded-2xl sm:rounded-3xl p-6 sm:p-8 space-y-4 sm:space-y-6">
              <div className="flex items-center gap-3">
                <Database className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-400" />
                <h3 className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-neutral-400">Master DNA</h3>
              </div>
              <div className="p-3 sm:p-4 bg-black/40 rounded-xl border border-white/5">
                <p className="text-[9px] sm:text-[10px] font-mono text-neutral-400 leading-relaxed italic line-clamp-4">
                  "{visualDna}"
                </p>
              </div>
            </div>
          </section>

          {/* Scene Breakdown */}
          <section className="space-y-4 sm:space-y-6">
            <h3 className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.4em] text-neutral-600 px-1">Validation Breakdown</h3>
            <div className="space-y-4">
              {scenes.map((scene, idx) => (
                <div key={scene.id} className="bg-white/[0.02] border border-white/5 rounded-xl sm:rounded-2xl p-4 sm:p-6 flex flex-col md:flex-row gap-4 sm:gap-8">
                  <div className="w-full md:w-24 h-32 md:h-24 rounded-xl overflow-hidden shrink-0 border border-white/10">
                    <img src={scene.previewImageUrl} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] sm:text-[10px] font-black uppercase text-neutral-500">Scene {idx + 1}</span>
                      <div className={`flex items-center gap-2 text-[8px] sm:text-[9px] font-black uppercase ${scene.consistency?.isConsistent ? 'text-green-500' : 'text-red-500'}`}>
                        {scene.consistency?.isConsistent ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                        {scene.consistency?.isConsistent ? 'Verified' : 'Deviation'}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 sm:gap-y-4">
                      <ConfidenceBar label="Faces" score={scene.consistency?.facialConfidence || 0} color="bg-indigo-500" />
                      <ConfidenceBar label="Character" score={scene.consistency?.characterConfidence || 0} color="bg-blue-500" />
                    </div>

                    {!scene.consistency?.isConsistent && scene.consistency?.deviations.length && (
                      <div className="mt-2 p-3 sm:p-4 bg-red-500/5 border border-red-500/20 rounded-xl space-y-2">
                        <p className="text-[7px] sm:text-[8px] font-black uppercase text-red-400 flex items-center gap-2">
                          <Eye className="w-2.5 sm:w-3 h-2.5 sm:h-3" /> Visual Log
                        </p>
                        <ul className="list-disc list-inside space-y-1">
                          {scene.consistency.deviations.map((dev, i) => (
                            <li key={i} className="text-[9px] sm:text-[10px] text-red-300 italic">{dev}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="p-6 sm:p-8 border-t border-white/5 bg-white/[0.02] flex justify-end shrink-0">
          <button 
            onClick={onClose}
            className="w-full sm:w-auto px-10 py-3.5 sm:py-4 bg-white text-black rounded-xl sm:rounded-2xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-xl"
          >
            Confirm Report
          </button>
        </div>
      </div>
    </div>
  );
};
