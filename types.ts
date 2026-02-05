
export enum GenerationStatus {
  IDLE = 'idle',
  REFINING = 'refining',
  PREVIEWING = 'previewing',
  GENERATING = 'generating',
  READY = 'ready',
  ERROR = 'error'
}

export type TransitionType = 'none' | 'fade' | 'wipe' | 'dissolve' | 'zoom' | 'glitch';

export interface ConsistencyCheck {
  isConsistent: boolean;
  score: number; // 0 to 100
  deviations: string[];
  facialConfidence: number;
  environmentalConfidence: number;
  characterConfidence: number;
  assetConfidence: number;
}

export interface StoryScene {
  id: number;
  veo_prompt: string;
  grok_prompt: string;
  visual_description: string;
  entryTransition: TransitionType;
  exitTransition: TransitionType;
  previewImageUrl?: string;
  videoUrl?: string;
  status: 'idle' | 'loading' | 'done' | 'error';
  consistency?: ConsistencyCheck;
  referenceImages?: string[]; // base64 strings
  usePreviewAsStart?: boolean;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  prompt: string;
  title: string;
  scenesCount: number;
}

export interface SavedScene {
  id: string;
  title: string;
  timestamp: number;
  veo_prompt: string;
  grok_prompt: string;
  visual_description: string;
  entryTransition: TransitionType;
  exitTransition: TransitionType;
  referenceImages?: string[];
}

export interface SavedDNA {
  id: string;
  label: string;
  timestamp: number;
  dna: string;
  params: {
    character?: string;
    environment?: string;
    asset?: string;
  }
}

export interface StoryboardConfig {
  title: string;
  visual_dna: string; // The "Anchor" for consistency (Faces, Cars, Bikes)
  scenes: StoryScene[];
  style_guide: string;
  suggested_aspect_ratio: '16:9' | '9:16';
}

export interface GenerationState {
  status: GenerationStatus;
  progress: number;
  error: string | null;
  storyboard: StoryboardConfig | null;
  activeSceneIndex: number;
}
