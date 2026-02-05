
import { GoogleGenAI, Type, VideoGenerationReferenceImage, VideoGenerationReferenceType } from "@google/genai";
import { StoryboardConfig, StoryScene, TransitionType, ConsistencyCheck } from "../types";

export const BRAIN_MODEL = 'gemini-3-flash-preview';
export const PREVIEW_MODEL = 'gemini-2.5-flash-image';
export const MAKER_MODEL_FAST = 'veo-3.1-fast-generate-preview';
export const MAKER_MODEL_HQ = 'veo-3.1-generate-preview';

export interface ProductionParams {
  characterDna?: string;
  environmentDna?: string;
  assetDna?: string;
}

export class GeminiService {
  private getAI() {
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  private async sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async withRetry<T>(fn: () => Promise<T>, maxRetries = 4, initialDelay = 3000): Promise<T> {
    let lastError: any;
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (err: any) {
        lastError = err;
        const errorMessage = err.message || "";
        const isRateLimit = errorMessage.includes("429") || errorMessage.includes("RESOURCE_EXHAUSTED") || errorMessage.includes("quota");
        
        if (isRateLimit && i < maxRetries - 1) {
          const delay = initialDelay * Math.pow(2, i);
          console.warn(`Rate limit hit. Retrying in ${delay}ms... (Attempt ${i + 1}/${maxRetries})`);
          await this.sleep(delay);
          continue;
        }
        throw err;
      }
    }
    throw lastError;
  }

  async refineToStory(userIdea: string, params?: ProductionParams): Promise<StoryboardConfig> {
    const ai = this.getAI();
    
    const constraintSection = params ? `
      STRICT PRODUCTION DNA CONSTRAINTS:
      - Character DNA: ${params.characterDna || 'Use creative discretion'}
      - Environment DNA: ${params.environmentDna || 'Use creative discretion'}
      - Key Assets DNA: ${params.assetDna || 'Use creative discretion'}
    ` : '';

    const response = await ai.models.generateContent({
      model: BRAIN_MODEL,
      contents: `Develop a cinematic multi-scene epic based on this vision: ${userIdea}. 
      ${constraintSection}
      
      The story must be a cohesive sequence of 10-15 scenes.`,
      config: {
        systemInstruction: `You are an Executive Production Director and Master Prompt Engineer for high-end AI cinema. 
        
        TASK:
        1. Break the concept into a sequence of narrative scenes.
        2. Synthesize a 'visual_dna' block: This is the "Anchor" for the whole project. It must define specific, un-changing features (e.g., "The protagonist has a distinct glowing blue scar on their left cheek", "Every scene features heavy volumetric orange fog", "All vehicles are matte-black and hover-based").
        3. INTEGRATION RULES:
           - In EVERY scene, the 'veo_prompt' and 'grok_prompt' MUST explicitly restate the specific Character DNA features, the Environment DNA setting, and any Asset DNA that should be present.
           - Pro-Tip: Instead of just saying "the character", say "the [Character DNA description] character". Instead of "the room", say "the [Environment DNA description] room".
           - GROK PROMPTS: Specifically tailor 'grok_prompt' for high-engagement social media platforms. Think vibrant colors, trending digital art aesthetics, high energy, and clear, bold focal points.
           - This ensures the image/video generators maintain 100% consistency across the sequence.
        4. Return the output as JSON according to the schema provided.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            visual_dna: { type: Type.STRING, description: "The master visual anchors for characters, environments, and assets." },
            style_guide: { type: Type.STRING, description: "The overall cinematic lighting, color grade, and camera style." },
            suggested_aspect_ratio: { type: Type.STRING, enum: ['16:9', '9:16'] },
            scenes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.NUMBER },
                  visual_description: { type: Type.STRING },
                  veo_prompt: { type: Type.STRING, description: "Hyper-detailed video prompt weaving in all DNA elements." },
                  grok_prompt: { type: Type.STRING, description: "High-energy, social-media optimized image prompt weaving in all DNA elements for a key frame." },
                  entryTransition: { type: Type.STRING, enum: ['none', 'fade', 'wipe', 'dissolve', 'zoom', 'glitch'] },
                  exitTransition: { type: Type.STRING, enum: ['none', 'fade', 'wipe', 'dissolve', 'zoom', 'glitch'] }
                },
                required: ['id', 'visual_description', 'veo_prompt', 'grok_prompt', 'entryTransition', 'exitTransition']
              }
            }
          },
          required: ['title', 'visual_dna', 'style_guide', 'suggested_aspect_ratio', 'scenes']
        }
      }
    });

    if (!response.text) throw new Error("Epic Scriptwriting failed.");
    return JSON.parse(response.text.trim()) as StoryboardConfig;
  }

  async verifyConsistency(dna: string, scenes: StoryScene[]): Promise<Record<number, ConsistencyCheck>> {
    const ai = this.getAI();
    const sceneData = scenes.map(s => ({ 
      id: s.id, 
      description: s.visual_description, 
      veo_prompt: s.veo_prompt, 
      grok_prompt: s.grok_prompt 
    }));
    
    const response = await ai.models.generateContent({
      model: BRAIN_MODEL,
      contents: `Visual DNA Anchor: ${dna}\n\nProduction Scenes to audit:\n${JSON.stringify(sceneData)}`,
      config: {
        systemInstruction: `Perform a rigorous frame-by-frame script audit. 
        Focus heavily on FACIAL FEATURE CONSISTENCY. 
        Verify if specific character traits (eye color, scars, hair texture, facial structure) are explicitly preserved in every scene's prompts.
        
        Check if Environment and Asset DNA is also explicitly represented.
        
        Return JSON with a results array. Each result should have:
        - id: number
        - isConsistent: boolean
        - score: number (0-100)
        - facialConfidence: number (0-100)
        - environmentalConfidence: number (0-100)
        - characterConfidence: number (0-100)
        - assetConfidence: number (0-100)
        - deviations: string[] (specifically naming facial landmark errors if any)
        
        Return ONLY JSON.`,
        responseMimeType: "application/json",
      }
    });

    if (!response.text) throw new Error("Consistency check failed.");
    const data = JSON.parse(response.text.trim());
    const results: Record<number, ConsistencyCheck> = {};
    const resultArray = Array.isArray(data.results) ? data.results : [];
    resultArray.forEach((res: any) => {
      results[res.id] = {
        isConsistent: res.isConsistent,
        score: res.score,
        facialConfidence: res.facialConfidence,
        environmentalConfidence: res.environmentalConfidence,
        characterConfidence: res.characterConfidence,
        assetConfidence: res.assetConfidence,
        deviations: res.deviations
      };
    });
    return results;
  }

  async fixSceneConsistency(dna: string, scene: StoryScene, deviations: string[]): Promise<{ grok_prompt: string, veo_prompt: string }> {
    const ai = this.getAI();
    const response = await ai.models.generateContent({
      model: BRAIN_MODEL,
      contents: `MASTER VISUAL DNA: ${dna}\nDEVIATIONS FOUND: ${deviations.join(", ")}\nORIGINAL SCENE: ${scene.visual_description}`,
      config: {
        systemInstruction: `Rewrite the veo_prompt and grok_prompt for this scene to strictly adhere to the Master Visual DNA and correct the listed deviations. Ensure the DNA is woven naturally but explicitly into the prompts. Return ONLY JSON.`,
        responseMimeType: "application/json",
      }
    });

    if (!response.text) throw new Error("Correction failed.");
    return JSON.parse(response.text.trim());
  }

  async generateScenePreview(prompt: string, style: string, dna: string, aspectRatio: string): Promise<string> {
    return this.withRetry(async () => {
      const ai = this.getAI();
      const response = await ai.models.generateContent({
        model: PREVIEW_MODEL,
        contents: { 
          parts: [{ text: `CINEMATIC STYLE: ${style}. MASTER VISUAL DNA: ${dna}. ACTION DESCRIPTION: ${prompt}.` }] 
        },
        config: {
          imageConfig: {
            aspectRatio: aspectRatio as any || "16:9"
          }
        }
      });

      const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
      if (!part?.inlineData) throw new Error("Visual board failed.");
      
      return `data:image/png;base64,${part.inlineData.data}`;
    });
  }

  async startVideoGeneration(scene: StoryScene, aspectRatio: string) {
    const ai = this.getAI();
    
    const base64ToData = (b64: string) => b64.includes('base64,') ? b64.split('base64,')[1] : b64;

    // Use HQ model if we have multiple reference images
    const hasMultipleRefs = (scene.referenceImages?.length || 0) > 0;
    const model = hasMultipleRefs ? MAKER_MODEL_HQ : MAKER_MODEL_FAST;

    const config: any = {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: aspectRatio as any
    };

    const payload: any = {
      model,
      prompt: scene.veo_prompt,
      config
    };

    // Add starting image if requested
    if (scene.usePreviewAsStart && scene.previewImageUrl) {
      payload.image = {
        imageBytes: base64ToData(scene.previewImageUrl),
        mimeType: 'image/png'
      };
    }

    // Add reference images (max 3 for HQ model)
    if (hasMultipleRefs) {
      const refPayload: VideoGenerationReferenceImage[] = (scene.referenceImages || []).slice(0, 3).map(img => ({
        image: {
          imageBytes: base64ToData(img),
          mimeType: 'image/png'
        },
        referenceType: VideoGenerationReferenceType.ASSET
      }));
      config.referenceImages = refPayload;
    }

    return await ai.models.generateVideos(payload);
  }

  async pollOperation(operation: any) {
    const ai = this.getAI();
    let currentOp = operation;
    while (!currentOp.done) {
      await this.sleep(10000);
      currentOp = await ai.operations.getVideosOperation({ operation: currentOp });
    }
    return currentOp;
  }

  async downloadVideo(uri: string): Promise<string> {
    const response = await fetch(`${uri}&key=${process.env.API_KEY}`);
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  }
}

export const geminiService = new GeminiService();
