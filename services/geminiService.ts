

import { GoogleGenAI, Modality, Type } from '@google/genai';
import { ContentType, GeneratedContent, LibraryHadith, Ayah, Surah, QuizQuestion, Scene } from '../types';
import { CONTENT_TYPE_DETAILS } from '../constants';
import { blobToBase64 } from '../utils';

const TEXT_MODEL = 'gemini-2.5-pro';
const FAST_TEXT_MODEL = 'gemini-2.5-flash'; // For quicker, interactive tasks
const HIGH_QUALITY_IMAGE_MODEL = 'imagen-4.0-generate-001';
const EDIT_IMAGE_MODEL = 'gemini-2.5-flash-image';
const TTS_MODEL = 'gemini-2.5-flash-preview-tts';


const createAiClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

// Robust helper to clean JSON string from Markdown code blocks or conversational text
const cleanJsonText = (text: string): string => {
    if (!text) return '{}';
    
    // 1. Try to match a Markdown code block with json tag
    const jsonBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
    if (jsonBlockMatch) {
        return jsonBlockMatch[1].trim();
    }
    
    // 2. Fallback: Find the first '{' and the last '}' to extract the object
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        return text.substring(firstBrace, lastBrace + 1);
    }

    // 3. Return as is (trimmed) if no patterns match
    return text.trim();
};

const handleError = (error: any, defaultMessageKey: string): never => {
    console.error("Gemini API Error:", error);
    const msg = error.message?.toLowerCase() || '';
    
    if (msg.includes('429') || msg.includes('quota') || msg.includes('exhausted')) {
        throw new Error('apiErrors.quotaExceeded');
    }
    if (msg.includes('403') || msg.includes('key') || msg.includes('permission')) {
        throw new Error('apiErrors.invalidKey');
    }
    if (msg.includes('503') || msg.includes('overloaded')) {
        throw new Error('apiErrors.serverOverloaded');
    }
    
    throw new Error(defaultMessageKey);
};

const sceneSchema = {
    type: Type.OBJECT,
    properties: {
        id: { 
            type: Type.STRING,
            description: 'Unique identifier for the scene (e.g., "scene_1").'
        },
        text: { 
            type: Type.STRING, 
            description: 'A concise segment of the script, ideal for a 5-10 second video clip.' 
        },
        visualSuggestion: { 
            type: Type.STRING, 
            description: 'A highly artistic, cinematic description for an AI image generator. Focus on lighting, mood, atmosphere, and composition. Avoid text in the image.' 
        },
    },
    required: ['id', 'text', 'visualSuggestion'],
};

const contentSchema = {
    type: Type.OBJECT,
    properties: {
        title: {
            type: Type.STRING,
            description: 'A catchy, viral-worthy, and modern title. Under 70 chars.',
        },
        scenes: {
            type: Type.ARRAY,
            description: 'Array of 3-5 scenes comprising the video content.',
            items: sceneSchema,
        },
        youtubeTips: {
            type: Type.STRING,
            description: '3 pro tips for viral growth and engagement.',
        },
        hashtags: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: '5 trending global and local hashtags.',
        },
    },
    required: ['title', 'scenes', 'youtubeTips', 'hashtags'],
};


const quizSchema = {
    type: Type.OBJECT,
    properties: {
        question: {
            type: Type.STRING,
            description: 'An engaging multiple-choice question.',
        },
        options: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'Array of 3 distinct options.',
        },
        correctAnswerIndex: {
            type: Type.INTEGER,
            description: 'Index of the correct answer (0, 1, or 2).',
        },
    },
    required: ['question', 'options', 'correctAnswerIndex'],
};


export const generateDailyContent = async (contentType: ContentType, customPrompt?: string): Promise<GeneratedContent> => {
    const ai = createAiClient();
    const details = CONTENT_TYPE_DETAILS[contentType];

    let specificInstruction = '';
    if (contentType === ContentType.EducationalVideoScript && customPrompt) {
        specificInstruction = `Context: Educational content for level: "${customPrompt}". Keep language simple and engaging.`;
    } else if (contentType === ContentType.GlobalCultureBridge) {
        specificInstruction = `
            **MISSION:** You are a Global Cultural Architect.
            **TASK:** Explain the Islamic concept of "${customPrompt || 'Shared Human Values'}" through the lens of universal ethics, modern urban life, and shared humanity.
            **STRATEGY:** 
            1. Use metaphors from nature, technology, or city life.
            2. AVOID purely theological jargon. Use terms like "Mindfulness" for Khushu, "Social Justice" for Zakat, "Inner Peace" for Iman.
            3. Connect the concept to a global challenge (e.g., Sustainability, Mental Health, Community).
            **TONE:** Sophisticated, Inclusive, Philosophical, and Warm.
            **VISUALS:** Cosmopolitan, diverse, abstract art, futuristic but grounded.
        `;
    } else if (contentType === ContentType.AppTutorial) {
        specificInstruction = `
            **MISSION:** You are a high-end Video Director creating a "Product Launch" promo for "Zad AI Studio".
            **TONE:** Exciting, Futuristic, Empowering, Fast-paced.
            **SCRIPT STRUCTURE:**
            1. **Scene 1 (The Problem):** Creators are tired of switching between 5 apps (writing, editing, stock photos). Visual: Chaotic desk or glitchy screens.
            2. **Scene 2 (The Solution):** Reveal "Zad AI Studio". The All-in-One AI Studio. Visual: A glowing, sleek dashboard interface appearing in a high-tech studio.
            3. **Scene 3 (Features - Generator):** Show the "Smart Generator" creating a script in seconds. Visual: AI brain connecting directly to a script document.
            4. **Scene 4 (Features - Global & Community):** Highlight the "Global Culture Bridge" and "Community Gallery". Visual: A rotating globe connecting diverse people with light beams.
            5. **Scene 5 (Features - Live & Badges):** Mention "Live Streaming" and "Gamification/Badges". Visual: A "Live" recording indicator and a golden achievement badge unlocking.
            6. **Scene 6 (Call to Action):** Join the future of content creation today. Visual: The Zad AI Studio logo on a cinematic sunrise background.
            
            **IMPORTANT:** The text MUST be in the requested language (Arabic usually). Make it sound professional and inspiring.
        `;
    } else if (customPrompt) {
        specificInstruction = `Focus strictly on the topic: "${customPrompt}".`;
    } else {
        specificInstruction = `Generate content based on the category: "${details.promptName}".`;
    }

    const prompt = `
        You are a world-class content strategist for "Zad AI Studio", a premium global media brand.
        Brand Voice: Modern, Enlightened, Universal, High-Quality.
        
        ${specificInstruction}

        Requirements:
        1.  **Title**: Click-worthy but dignified.
        2.  **Script**: 3-5 powerful scenes. Deep meaning, simple words.
        3.  **Visuals**: Suggest mostly atmospheric, cinematic, nature-based, or abstract visuals. Avoid depicting prophets or holy figures directly.
        4.  **Output**: Pure JSON.
    `;

    try {
        const response = await ai.models.generateContent({
            model: TEXT_MODEL,
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: contentSchema,
            },
        });
        
        const jsonString = cleanJsonText(response.text);
        return JSON.parse(jsonString);

    } catch (error: any) {
        handleError(error, 'apiErrors.contentGeneration');
    }
    return {} as GeneratedContent; // Unreachable due to throw, but satisfies TS
};

export const generateImageFromSuggestion = async (title: string, sceneText: string, visualSuggestion: string, aspectRatio: string): Promise<string> => {
    const ai = createAiClient();
    
    // Enhanced prompt for cinematic, world-class visuals
    const artisticPrompt = `
        Concept: ${visualSuggestion}
        Context: "${sceneText.substring(0, 80)}..."
        
        Art Direction:
        - **Style:** Cinematic 8k, Photorealistic or High-End Digital Art (depending on context), Award-winning composition.
        - **Lighting:** Volumetric lighting, golden hour, or dramatic moody lighting.
        - **Color Palette:** Rich, deep colors (Emerald, Gold, Navy) or soft, ethereal pastels.
        - **Composition:** Rule of thirds, depth of field, center mostly clear for text overlay.
        - **Restrictions:** NO TEXT, NO WATERMARKS, NO BLURRY FACES.
    `;
    
    try {
        const response = await ai.models.generateImages({
            model: HIGH_QUALITY_IMAGE_MODEL, 
            prompt: artisticPrompt,
            config: {
                numberOfImages: 1,
                aspectRatio: aspectRatio,
                outputMimeType: 'image/png',
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
            return `data:image/png;base64,${base64ImageBytes}`;
        }
        
        throw new Error('No image data found.');

    } catch (error: any) {
        handleError(error, 'apiErrors.imageGeneration');
    }
    return '';
};

export const generateAvatarImage = async (prompt: string): Promise<string> => {
    const ai = createAiClient();
    
    const artisticPrompt = `
        Character Design: 3D Pixar/Disney Style Character.
        Description: "${prompt}".
        
        Details:
        - **Expression:** Friendly, wise, inviting.
        - **Lighting:** Soft studio lighting, rim light.
        - **Background:** Solid neutral color (grey or white) for easy removal.
        - **Pose:** Facing forward, talking to camera.
        - **Quality:** 8k render, highly detailed texture.
    `;
    
    try {
        const response = await ai.models.generateImages({
            model: HIGH_QUALITY_IMAGE_MODEL,
            prompt: artisticPrompt,
            config: {
                numberOfImages: 1,
                aspectRatio: '1:1',
                outputMimeType: 'image/png',
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
            return `data:image/png;base64,${base64ImageBytes}`;
        }
        
        throw new Error('No image data found in response.');

    } catch (error: any) {
        handleError(error, 'apiErrors.avatarGeneration');
    }
    return '';
};

export const removeImageBackground = async (base64Image: string): Promise<string> => {
    const ai = createAiClient();
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");

    try {
        const imageBlob = await (await fetch(base64Image)).blob();
        const mimeType = imageBlob.type || 'image/png';

        const response = await ai.models.generateContent({
            model: EDIT_IMAGE_MODEL,
            contents: {
                parts: [
                    {
                        inlineData: {
                            data: base64Data,
                            mimeType: mimeType,
                        },
                    },
                    {
                        text: 'Remove the background. Output transparent PNG. Keep the main subject crisp.',
                    },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                return `data:image/png;base64,${part.inlineData.data}`;
            }
        }
        throw new Error('No image data found in response.');
    } catch (error: any) {
        handleError(error, 'apiErrors.avatarBackgroundRemoval');
    }
    return '';
};

export const generateBackgroundImage = async (title: string, customPrompt: string | undefined, aspectRatio: string): Promise<string> => {
    const ai = createAiClient();
    
    const artisticPrompt = `
        Environment Design: High-end virtual studio or serene nature background.
        Topic: "${title}".
        ${customPrompt ? `Specifics: "${customPrompt}".` : ''}

        Style:
        - **Aesthetic:** Modern Islamic Architecture (subtle arches, geometric patterns) OR breathtaking nature (mountains, rivers).
        - **Lighting:** Soft, atmospheric, depth of field (bokeh).
        - **Color:** Harmonious, calming, premium.
        - **Note:** No people, no text.
    `;
    
    try {
        const response = await ai.models.generateImages({
            model: HIGH_QUALITY_IMAGE_MODEL,
            prompt: artisticPrompt,
            config: {
                numberOfImages: 1,
                aspectRatio: aspectRatio,
                outputMimeType: 'image/png',
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            return `data:image/png;base64,${response.generatedImages[0].image.imageBytes}`;
        }

        throw new Error('No image data found in response.');

    } catch (error: any) {
        handleError(error, 'apiErrors.imageGeneration');
    }
    return '';
};


export const generateSpeechFromText = async (text: string): Promise<string> => {
    const ai = createAiClient();
    try {
        // Note: Using a prompt to guide the tone is not directly supported in the API config for TTS yet, 
        // but we can select the voice.
        const response = await ai.models.generateContent({
            model: TTS_MODEL,
            contents: [{ parts: [{ text: text }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Fenrir' }, // Deep, calm male voice
                    },
                },
            },
        });

        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (base64Audio) {
            return base64Audio;
        }

        throw new Error('No audio data found in response.');

    } catch (error: any) {
        handleError(error, 'apiErrors.speechGeneration');
    }
    return '';
};


export const translateContent = async (
    content: GeneratedContent,
    targetLanguage: string
): Promise<GeneratedContent> => {
    const ai = createAiClient();
    
    const prompt = `
        You are an expert cultural translator.
        Translate the 'title' and 'text' fields from Arabic to ${targetLanguage}.
        Ensure the translation captures the *spirit* and *emotion* of the original, not just a literal translation.
        Keep 'id', 'visualSuggestion', 'youtubeTips', 'hashtags' unchanged.
        Output JSON.

        Content:
        ${JSON.stringify(content, null, 2)}
    `;

    try {
        const response = await ai.models.generateContent({
            model: TEXT_MODEL,
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: contentSchema,
            },
        });
        
        const jsonString = cleanJsonText(response.text);
        return JSON.parse(jsonString);

    } catch (error: any) {
        handleError(error, 'apiErrors.translation');
    }
    return {} as GeneratedContent;
};

export const generateSupplementaryContentForHadith = async (hadith: LibraryHadith): Promise<GeneratedContent> => {
    const ai = createAiClient();
    const prompt = `
        Act as a content producer for a global Islamic channel.
        Based on Hadith: "${hadith.title}"
        Text: "${hadith.script}"
        Explanation: "${hadith.explanation}"

        Create a video script (JSON).
        Focus on the practical application of this wisdom in modern life.
    `;

     try {
        const response = await ai.models.generateContent({
            model: TEXT_MODEL,
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: contentSchema,
            },
        });
        
        const jsonString = cleanJsonText(response.text);
        return JSON.parse(jsonString);

    } catch (error: any) {
        handleError(error, 'apiErrors.supplementaryContent');
    }
    return {} as GeneratedContent;
};

export const generateContentFromQuranVerses = async (verses: Ayah[], surah: Surah): Promise<GeneratedContent> => {
     const ai = createAiClient();
    
    const fullScript = verses.map(v => `${v.text} (${v.numberInSurah})`).join(' ');

    const prompt = `
        Modern Tafsir (Interpretation) for verses from Surah ${surah.name}:
        "${fullScript}"
        
        Create a video script (JSON) that explains these verses in a way that touches the heart and mind, connecting their meaning to contemporary challenges.
    `;

    try {
        const response = await ai.models.generateContent({
            model: TEXT_MODEL,
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: contentSchema,
            },
        });
        
        const jsonString = cleanJsonText(response.text);
        const parsed = JSON.parse(jsonString);
        if (parsed.scenes && parsed.scenes.length > 0) {
            parsed.scenes[0].text = fullScript;
        }
        
        return parsed;

    } catch (error: any) {
        handleError(error, 'apiErrors.contentFromVerses');
    }
    return {} as GeneratedContent;
}

export const processUserFeedback = async (feedback: string): Promise<string> => {
    const ai = createAiClient();
    const prompt = `
        Reply to a user suggestion for the "Zad AI Studio" app.
        Suggestion: "${feedback}"
        Reply: A warm, encouraging, and short thank you message in Arabic.
    `;

    try {
        const response = await ai.models.generateContent({
            model: FAST_TEXT_MODEL,
            contents: prompt,
        });
        return response.text;
    } catch (error: any) {
        handleError(error, 'apiErrors.unexpected');
    }
    return '';
};

export const generateQuizFromContent = async (content: GeneratedContent): Promise<QuizQuestion> => {
    const ai = createAiClient();
    const fullText = content.scenes.map(s => s.text).join(' ');
    
    const prompt = `
        Create one smart, interactive quiz question (JSON) based on the text:
        "${fullText}"
        The question should test deep understanding, not just memory.
    `;
    
    try {
        const response = await ai.models.generateContent({
            model: FAST_TEXT_MODEL,
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: quizSchema,
            },
        });
        
        const jsonString = cleanJsonText(response.text);
        return JSON.parse(jsonString);

    } catch (error: any) {
        handleError(error, 'apiErrors.quizGeneration');
    }
    return {} as QuizQuestion;
};

export const generateBackgroundMusic = async (prompt: string): Promise<string> => {
    console.log('Generating background music with prompt:', prompt);
    return new Promise((resolve) => {
        setTimeout(() => {
            const musicUrl = 'https://cdn.pixabay.com/download/audio/2022/08/04/audio_29b289067e.mp3';
            resolve(musicUrl);
        }, 2000);
    });
};