
import React, { useState, useEffect, useMemo } from 'react';
import { geminiService } from './services/geminiService';
import { GenerationStatus, GenerationState, TransitionType, HistoryItem, StoryScene, SavedDNA, SavedScene } from './types';

// Components
import { FocusModeModal } from './components/FocusModeModal';
import { LandingScreen } from './components/landing/LandingScreen';
import { DirectorPanel } from './components/production/DirectorPanel';
import { FilmReelPlayer } from './components/FilmReelPlayer';
import { Navbar } from './components/layout/Navbar';
import { SceneCard } from './components/production/SceneCard';
import { LoadingOverlay } from './components/shared/LoadingOverlay';
import { ErrorToast } from './components/shared/ErrorToast';
import { AuditReportModal } from './components/production/AuditReportModal';
import { RefreshCcw } from 'lucide-react';

const TRANSITIONS: TransitionType[] = ['none', 'fade', 'wipe', 'dissolve', 'zoom', 'glitch'];
const INSPIRATIONS = [
  "A neon-noir cyberpunk heist in 2088 Tokyo.",
  "Medieval fantasy battle between ice dragons and obsidian golems.",
  "Space-opera dogfight near a dying neutron star.",
  "Noir detective thriller set in a rainy 1940s New York with robots."
];

const App: React.FC = () => {
  // --- STATE ---
  const [idea, setIdea] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [charDna, setCharDna] = useState('');
  const [envDna, setEnvDna] = useState('');
  const [assetDna, setAssetDna] = useState('');
  const [selectedDnaId, setSelectedDnaId] = useState<string | null>(null);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [isEditingScene, setIsEditingScene] = useState(false);
  const [editedDescription, setEditedDescription] = useState('');
  const [isRefreshingPreview, setIsRefreshingPreview] = useState(false);
  const [landingPreview, setLandingPreview] = useState<string | null>(null);
  const [isGeneratingLandingPreview, setIsGeneratingLandingPreview] = useState(false);
  const [isPreviewingFilm, setIsPreviewingFilm] = useState(false);
  const [isShowingAudit, setIsShowingAudit] = useState(false);
  
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'timeline' | 'grid'>('timeline');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [savedDNAs, setSavedDNAs] = useState<SavedDNA[]>([]);
  const [savedScenes, setSavedScenes] = useState<SavedScene[]>([]);
  const [state, setState] = useState<GenerationState>({
    status: GenerationStatus.IDLE,
    progress: 0,
    error: null,
    storyboard: null,
    activeSceneIndex: 0
  });

  // --- DERIVED STATE ---
  const continuityHealth = useMemo(() => {
    if (!state.storyboard) return null;
    const scores = state.storyboard.scenes
      .filter(s => s.consistency)
      .map(s => s.consistency!.score);
    if (scores.length === 0) return 0;
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  }, [state.storyboard]);

  const blueprintSummary = useMemo(() => {
    if (!idea.trim() && !charDna && !envDna && !assetDna) return null;
    return {
      concept: idea || "Awaiting vision...",
      dna: `${charDna ? `Character: ${charDna} | ` : ''}${envDna ? `Environment: ${envDna} | ` : ''}${assetDna ? `Assets: ${assetDna}` : ''}`.replace(/ \| $/, '') || "Standard Visual DNA Logic"
    };
  }, [idea, charDna, envDna, assetDna]);

  const filmProgress = useMemo(() => {
    if (!state.storyboard) return 0;
    const done = state.storyboard.scenes.filter(s => !!s.videoUrl).length;
    return (done / state.storyboard.scenes.length) * 100;
  }, [state.storyboard]);

  const isProcessing = state.status === GenerationStatus.REFINING || state.status === GenerationStatus.PREVIEWING || state.status === GenerationStatus.GENERATING;
  const activeScene = state.storyboard?.scenes[state.activeSceneIndex];

  // --- EFFECTS ---
  useEffect(() => {
    const savedH = localStorage.getItem('bongdevs_history');
    if (savedH) try { setHistory(JSON.parse(savedH)); } catch (e) {}

    const savedD = localStorage.getItem('bongdevs_dnas');
    if (savedD) try { setSavedDNAs(JSON.parse(savedD)); } catch (e) {}

    const savedS = localStorage.getItem('bongdevs_scenes');
    if (savedS) try { setSavedScenes(JSON.parse(savedS)); } catch (e) {}
  }, []);

  // --- HANDLERS ---
  const saveToHistory = (title: string, prompt: string, count: number) => {
    const newItem: HistoryItem = { id: Math.random().toString(36).substr(2, 9), timestamp: Date.now(), prompt, title, scenesCount: count };
    const updated = [newItem, ...history].slice(0, 10);
    setHistory(updated);
    localStorage.setItem('bongdevs_history', JSON.stringify(updated));
  };

  const deleteHistory = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = history.filter(item => item.id !== id);
    setHistory(updated);
    localStorage.setItem('bongdevs_history', JSON.stringify(updated));
  };

  const handleSaveDNA = (dna: string, label: string) => {
    const newId = Math.random().toString(36).substr(2, 9);
    const newDNA: SavedDNA = {
      id: newId,
      label,
      dna,
      timestamp: Date.now(),
      params: { 
        character: charDna.trim(), 
        environment: envDna.trim(), 
        asset: assetDna.trim() 
      }
    };
    const updated = [newDNA, ...savedDNAs];
    setSavedDNAs(updated);
    localStorage.setItem('bongdevs_dnas', JSON.stringify(updated));
    setSelectedDnaId(newId);
  };

  const handleDeleteDNA = (id: string) => {
    const updated = savedDNAs.filter(d => d.id !== id);
    setSavedDNAs(updated);
    localStorage.setItem('bongdevs_dnas', JSON.stringify(updated));
    if (selectedDnaId === id) setSelectedDnaId(null);
  };

  const handleApplyDNA = (dna: SavedDNA) => {
    if (dna.params) {
      setCharDna(dna.params.character || '');
      setEnvDna(dna.params.environment || '');
      setAssetDna(dna.params.asset || '');
    } else if (dna.dna) {
      setCharDna(dna.dna);
      setEnvDna('');
      setAssetDna('');
    }
    setSelectedDnaId(dna.id);
    setShowAdvanced(true);
    setTimeout(() => {
      document.getElementById('advanced-dna-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleManualDnaChange = (field: 'char' | 'env' | 'asset', value: string) => {
    setSelectedDnaId(null);
    if (field === 'char') setCharDna(value);
    if (field === 'env') setEnvDna(value);
    if (field === 'asset') setAssetDna(value);
  };

  const handleSaveSceneToLibrary = (scene: StoryScene) => {
    const newSaved: SavedScene = {
      id: Math.random().toString(36).substr(2, 9),
      title: `Bongdevs_Scene_${scene.id}`,
      timestamp: Date.now(),
      veo_prompt: scene.veo_prompt,
      grok_prompt: scene.grok_prompt,
      visual_description: scene.visual_description,
      entryTransition: scene.entryTransition,
      exitTransition: scene.exitTransition,
      referenceImages: scene.referenceImages
    };
    const updated = [newSaved, ...savedScenes];
    setSavedScenes(updated);
    localStorage.setItem('bongdevs_scenes', JSON.stringify(updated));
  };

  const handleDeleteSavedScene = (id: string) => {
    const updated = savedScenes.filter(s => s.id !== id);
    setSavedScenes(updated);
    localStorage.setItem('bongdevs_scenes', JSON.stringify(updated));
  };

  const handleApplySavedScene = (saved: SavedScene) => {
    setIdea(saved.visual_description);
    handleCreateStoryboard(undefined, saved.visual_description);
  };

  const handleCreateStoryboard = async (e?: React.FormEvent, overridePrompt?: string) => {
    if (e) e.preventDefault();
    const promptToUse = overridePrompt || idea;
    if (!promptToUse.trim()) return;

    try {
      setState(prev => ({ ...prev, status: GenerationStatus.REFINING, error: null, storyboard: null, activeSceneIndex: 0 }));
      const board = await geminiService.refineToStory(promptToUse, showAdvanced ? { characterDna: charDna, environmentDna: envDna, assetDna: assetDna } : undefined);
      saveToHistory(board.title, promptToUse, board.scenes.length);
      const initializedScenes = board.scenes.map(s => ({ ...s, status: 'idle' as const }));
      setState(prev => ({ ...prev, status: GenerationStatus.PREVIEWING, storyboard: { ...board, scenes: initializedScenes as any } }));

      geminiService.verifyConsistency(board.visual_dna, board.scenes).then(results => {
        setState(prev => {
          if (!prev.storyboard) return prev;
          const newScenes = prev.storyboard.scenes.map(s => ({ ...s, consistency: results[s.id] }));
          return { ...prev, storyboard: { ...prev.storyboard, scenes: newScenes } };
        });
      }).catch(console.error);

      for (let i = 0; i < initializedScenes.length; i++) {
        const scene = initializedScenes[i];
        setState(prev => {
          if (!prev.storyboard) return prev;
          const newScenes = [...prev.storyboard.scenes];
          newScenes[i] = { ...newScenes[i], status: 'loading' };
          return { ...prev, storyboard: { ...prev.storyboard, scenes: newScenes } };
        });
        try {
          if (i > 0) await new Promise(res => setTimeout(res, 800));
          const imgUrl = await geminiService.generateScenePreview(scene.visual_description, board.style_guide, board.visual_dna, board.suggested_aspect_ratio);
          setState(prev => {
            if (!prev.storyboard) return prev;
            const newScenes = [...prev.storyboard.scenes];
            newScenes[i] = { ...newScenes[i], previewImageUrl: imgUrl, status: 'done' };
            return { ...prev, storyboard: { ...prev.storyboard, scenes: newScenes } };
          });
        } catch (err) {
          setState(prev => {
            if (!prev.storyboard) return prev;
            const newScenes = [...prev.storyboard.scenes];
            newScenes[i] = { ...newScenes[i], status: 'error' };
            return { ...prev, storyboard: { ...prev.storyboard, scenes: newScenes } };
          });
        }
      }
      setState(prev => ({ ...prev, status: GenerationStatus.READY }));
    } catch (err: any) { setState(prev => ({ ...prev, status: GenerationStatus.ERROR, error: err.message })); }
  };

  const handleFixContinuity = async (idx: number) => {
    if (!state.storyboard) return;
    const scene = state.storyboard.scenes[idx];
    if (!scene.consistency || scene.consistency.isConsistent) return;
    try {
      setState(prev => {
        if (!prev.storyboard) return prev;
        const newScenes = [...prev.storyboard.scenes];
        newScenes[idx] = { ...newScenes[idx], status: 'loading' };
        return { ...prev, storyboard: { ...prev.storyboard, scenes: newScenes } };
      });
      const fixed = await geminiService.fixSceneConsistency(state.storyboard.visual_dna, scene, scene.consistency.deviations);
      const imgUrl = await geminiService.generateScenePreview(scene.visual_description, state.storyboard.style_guide, state.storyboard.visual_dna, state.storyboard.suggested_aspect_ratio);
      setState(prev => {
        if (!prev.storyboard) return prev;
        const newScenes = [...prev.storyboard.scenes];
        newScenes[idx] = { ...newScenes[idx], ...fixed, previewImageUrl: imgUrl, status: 'done', consistency: { ...scene.consistency!, isConsistent: true, score: 100, deviations: [] } };
        return { ...prev, storyboard: { ...prev.storyboard, scenes: newScenes } };
      });
    } catch (err: any) { setState(prev => ({ ...prev, error: `Correction failed: ${err.message}` })); }
  };

  const handleUpdateTransition = (sceneIndex: number, transition: TransitionType, type: 'entry' | 'exit') => {
    setState(prev => {
      if (!prev.storyboard) return prev;
      const newScenes = [...prev.storyboard.scenes];
      if (type === 'entry') {
        newScenes[sceneIndex] = { ...newScenes[sceneIndex], entryTransition: transition };
      } else {
        newScenes[sceneIndex] = { ...newScenes[sceneIndex], exitTransition: transition };
      }
      return { ...prev, storyboard: { ...prev.storyboard, scenes: newScenes } };
    });
  };

  const handleUpdateScene = (updatedScene: StoryScene) => {
    setState(prev => {
      if (!prev.storyboard) return prev;
      const newScenes = [...prev.storyboard.scenes];
      const idx = newScenes.findIndex(s => s.id === updatedScene.id);
      if (idx === -1) return prev;
      newScenes[idx] = updatedScene;
      return { ...prev, storyboard: { ...prev.storyboard, scenes: newScenes } };
    });
  };

  const handleOpenGrok = async () => {
    if (!activeScene) return;
    try {
      const clipboardData: Record<string, Blob> = { 'text/plain': new Blob([activeScene.grok_prompt], { type: 'text/plain' }) };
      if (activeScene.previewImageUrl?.startsWith('data:image')) {
        const response = await fetch(activeScene.previewImageUrl);
        clipboardData['image/png'] = await response.blob();
      }
      await navigator.clipboard.write([new ClipboardItem(clipboardData)]);
      setCopied(true); setTimeout(() => setCopied(false), 2000);
      const url = `https://grok.com/imagine?scene=${state.activeSceneIndex + 1}`;
      window.open(url, '_blank');
    } catch (err) { 
      navigator.clipboard.writeText(activeScene.grok_prompt); 
      const url = `https://grok.com/imagine?scene=${state.activeSceneIndex + 1}`;
      window.open(url, '_blank');
    }
  };

  const handleCopyPrompt = (text: string) => {
    navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  const handleRegenerateScenePreview = async () => {
    if (!state.storyboard || !activeScene) return;
    try {
      setIsRefreshingPreview(true);
      const newUrl = await geminiService.generateScenePreview(editedDescription || activeScene.visual_description, state.storyboard.style_guide, state.storyboard.visual_dna, state.storyboard.suggested_aspect_ratio);
      setState(prev => {
        if (!prev.storyboard) return prev;
        const newScenes = [...prev.storyboard.scenes];
        newScenes[state.activeSceneIndex] = { ...newScenes[state.activeSceneIndex], previewImageUrl: newUrl, visual_description: editedDescription || activeScene.visual_description };
        return { ...prev, storyboard: { ...prev.storyboard, scenes: newScenes } };
      });
      setIsEditingScene(false);
    } catch (err: any) { setState(prev => ({ ...prev, error: `Preview refresh failed: ${err.message}` })); } finally { setIsRefreshingPreview(false); }
  };

  const handleQuickConceptSnapshot = async () => {
    if (!idea.trim()) return;
    try {
      setIsGeneratingLandingPreview(true);
      const snapshot = await geminiService.generateScenePreview(idea, "High-fidelity cinematic photography, hyper-realistic", `${charDna} ${envDna} ${assetDna}`, "16:9");
      setLandingPreview(snapshot);
    } catch (err: any) { setState(prev => ({ ...prev, error: `Snapshot failed: ${err.message}` })); } finally { setIsGeneratingLandingPreview(false); }
  };

  const handleProduceVeo = async () => {
    if (!activeScene || !state.storyboard) return;
    const aistudio = (window as any).aistudio;
    if (aistudio && !(await aistudio.hasSelectedApiKey())) await aistudio.openSelectKey();
    try {
      setState(prev => {
        if (!prev.storyboard) return prev;
        const newScenes = [...prev.storyboard.scenes];
        newScenes[state.activeSceneIndex] = { ...newScenes[state.activeSceneIndex], status: 'loading' };
        return { ...prev, storyboard: { ...prev.storyboard, scenes: newScenes } };
      });
      const op = await geminiService.startVideoGeneration(activeScene, state.storyboard.suggested_aspect_ratio);
      const result = await geminiService.pollOperation(op);
      const videoUri = result.response?.generatedVideos?.[0]?.video?.uri;
      if (videoUri) {
        const localUrl = await geminiService.downloadVideo(videoUri);
        setState(prev => {
          if (!prev.storyboard) return prev;
          const newScenes = [...prev.storyboard.scenes];
          newScenes[state.activeSceneIndex] = { ...newScenes[state.activeSceneIndex], videoUrl: localUrl, status: 'done' };
          return { ...prev, storyboard: { ...prev.storyboard, scenes: newScenes } };
        });
      }
    } catch (err: any) { setState(prev => ({ ...prev, error: err.message })); }
  };

  return (
    <div className={`min-h-screen bg-[#020202] text-white selection:bg-indigo-500/30 font-sans ${isFocusMode || isPreviewingFilm || isShowingAudit ? 'overflow-hidden' : ''}`}>
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 left-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-indigo-600/30 blur-[100px] md:blur-[150px] rounded-full"></div>
        <div className="absolute bottom-0 right-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-blue-600/20 blur-[100px] md:blur-[150px] rounded-full"></div>
      </div>

      {/* Overlays/Modals */}
      {isPreviewingFilm && state.storyboard && (
        <FilmReelPlayer 
          scenes={state.storyboard.scenes} 
          aspectRatio={state.storyboard.suggested_aspect_ratio} 
          onClose={() => setIsPreviewingFilm(false)} 
        />
      )}

      {isShowingAudit && state.storyboard && (
        <AuditReportModal 
          scenes={state.storyboard.scenes}
          visualDna={state.storyboard.visual_dna}
          onClose={() => setIsShowingAudit(false)}
        />
      )}

      {isFocusMode && activeScene && state.storyboard && (
        <FocusModeModal 
          activeScene={activeScene} activeSceneIndex={state.activeSceneIndex} storyboard={state.storyboard}
          isEditingScene={isEditingScene} editedDescription={editedDescription} isRefreshingPreview={isRefreshingPreview}
          copied={copied} transitions={TRANSITIONS} onClose={() => setIsFocusMode(false)}
          onSetEditedDescription={setEditedDescription} onRegeneratePreview={handleRegenerateScenePreview}
          onStartEditing={() => { setEditedDescription(activeScene.visual_description); setIsEditingScene(true); }}
          onCancelEditing={() => setIsEditingScene(false)} onCopyPrompt={handleCopyPrompt}
          onUpdateTransition={handleUpdateTransition} onOpenGrok={handleOpenGrok} onProduceVeo={handleProduceVeo}
          onUpdateScene={handleUpdateScene} 
          onSaveSceneToLibrary={handleSaveSceneToLibrary}
          onSaveDNA={handleSaveDNA}
        />
      )}

      <LoadingOverlay 
        isVisible={state.status === GenerationStatus.REFINING} 
        title="Syncing Bongdevs Engine..." 
        subtitle="Gemini 3 Flash is weaving your vision into a cinematic masterpiece."
      />

      <ErrorToast error={state.error} onClear={() => setState(prev => ({ ...prev, error: null }))} />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 py-6 md:py-12 min-h-screen flex flex-col">
        <Navbar 
          hasStoryboard={!!state.storyboard}
          filmProgress={filmProgress}
          viewMode={viewMode}
          setViewMode={setViewMode}
          setIsPreviewingFilm={setIsPreviewingFilm}
          history={history}
          handleCreateStoryboard={handleCreateStoryboard}
          deleteHistory={deleteHistory}
        />

        {!state.storyboard ? (
          <LandingScreen 
            idea={idea} setIdea={setIdea} showAdvanced={showAdvanced} setShowAdvanced={setShowAdvanced}
            charDna={charDna} envDna={envDna} assetDna={assetDna}
            selectedDnaId={selectedDnaId}
            onManualDnaChange={handleManualDnaChange}
            isProcessing={isProcessing} isGeneratingLandingPreview={isGeneratingLandingPreview}
            landingPreview={landingPreview} setLandingPreview={setLandingPreview}
            handleCreateStoryboard={handleCreateStoryboard} handleQuickConceptSnapshot={handleQuickConceptSnapshot}
            blueprintSummary={blueprintSummary} inspirations={INSPIRATIONS}
            savedDNAs={savedDNAs} onDeleteDNA={handleDeleteDNA} onApplyDNA={handleApplyDNA} onSaveDNA={handleSaveDNA}
            savedScenes={savedScenes} onDeleteSavedScene={handleDeleteSavedScene} onApplySavedScene={handleApplySavedScene}
          />
        ) : (
          <div className="flex-1 flex flex-col gap-8 md:gap-12">
             <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 md:gap-8 border-b border-white/5 pb-8 md:pb-12">
                <div className="space-y-3 md:space-y-4 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-3 md:gap-4">
                    <div className="px-2.5 py-1 bg-indigo-600/10 border border-indigo-600/20 rounded-full text-indigo-400 text-[8px] md:text-[9px] font-black uppercase tracking-widest">
                      Production Live
                    </div>
                    <span className="text-neutral-600 font-mono text-[10px] md:text-xs">Project ID: {state.storyboard.title.substring(0,8).toUpperCase()}</span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl md:text-6xl font-black italic tracking-tighter leading-tight md:leading-[1.1]">{state.storyboard.title}</h2>
                  <p className="text-neutral-500 line-clamp-2 text-xs md:text-sm italic font-medium">"{idea}"</p>
                </div>
                <div className="flex flex-col items-end gap-4 md:gap-6 w-full lg:w-auto">
                  <div className="flex items-center gap-4 md:gap-6 bg-white/5 p-3 md:p-4 rounded-2xl md:rounded-3xl border border-white/5 w-full sm:w-auto justify-between sm:justify-end shadow-xl">
                    <div className="text-right">
                      <p className="text-[7px] md:text-[9px] font-black uppercase tracking-widest text-neutral-500 mb-0.5 md:mb-1">DNA Health</p>
                      <p className={`text-xl md:text-2xl font-black italic ${continuityHealth && continuityHealth < 70 ? 'text-amber-500' : 'text-indigo-400'}`}>
                        {continuityHealth || 0}%
                      </p>
                    </div>
                    <div className="h-10 md:h-12 w-[1.5px] bg-white/10"></div>
                    <div className="text-right">
                      <p className="text-[7px] md:text-[9px] font-black uppercase tracking-widest text-neutral-500 mb-0.5 md:mb-1">Progress</p>
                      <p className="text-xl md:text-2xl font-black italic text-white">
                        {state.storyboard.scenes.filter(s => s.status === 'done').length}/{state.storyboard.scenes.length}
                      </p>
                    </div>
                    <button 
                      onClick={() => handleCreateStoryboard()} 
                      className="ml-2 md:ml-4 p-3 md:p-4 bg-white/5 hover:bg-indigo-600 rounded-xl md:rounded-2xl border border-white/10 transition-all text-neutral-400 hover:text-white"
                      title="Regenerate"
                    >
                      <RefreshCcw className="w-4 md:w-5 h-4 md:h-5" />
                    </button>
                  </div>
                </div>
             </div>

             <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 md:gap-12">
                <div className={`xl:col-span-8 space-y-6 md:space-y-8 ${viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 space-y-0' : ''}`}>
                   {state.storyboard.scenes.map((scene, idx) => (
                      <SceneCard 
                        key={scene.id}
                        scene={scene}
                        index={idx}
                        viewMode={viewMode}
                        isActive={state.activeSceneIndex === idx}
                        aspectRatio={state.storyboard!.suggested_aspect_ratio}
                        onSelect={() => setState(prev => ({ ...prev, activeSceneIndex: idx }))}
                        onFocus={() => {
                          setIsFocusMode(true);
                          setState(prev => ({ ...prev, activeSceneIndex: idx }));
                        }}
                        onProduce={handleProduceVeo}
                        onFixContinuity={() => handleFixContinuity(idx)}
                      />
                   ))}
                </div>
                <DirectorPanel 
                  activeScene={activeScene} 
                  activeSceneIndex={state.activeSceneIndex} 
                  storyboard={state.storyboard}
                  setIsFocusMode={setIsFocusMode} 
                  handleOpenGrok={handleOpenGrok}
                  handleProduceVeo={handleProduceVeo} 
                  onTerminate={() => { setState(prev => ({ ...prev, storyboard: null })); setLandingPreview(null); }}
                  onUpdateTransition={handleUpdateTransition}
                  onOpenAudit={() => setIsShowingAudit(true)}
                />
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;