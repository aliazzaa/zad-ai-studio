









import React, { createContext, useState, useCallback, useEffect, useContext, ReactNode, useRef } from 'react';
import { ContentType, GeneratedContent, AppContextType, LibraryHadith, Ayah, Surah, VideoSettings, ScheduledJob, PanelMode, User, QuizQuestion, Theme, Scene, Project, VideoStyle, WatermarkSettings, CommunityProject, UserStats, PlanTier, AvatarConfig } from '../types';
import { generateDailyContent, generateImageFromSuggestion, generateSpeechFromText, translateContent, generateSupplementaryContentForHadith, generateContentFromQuranVerses, processUserFeedback, generateQuizFromContent, generateAvatarImage, removeImageBackground, generateBackgroundImage, generateBackgroundMusic } from '../services/geminiService';
import { pcmToWavBlob, blobToBase64 } from '../utils';
import { ACHIEVEMENTS, SUBSCRIPTION_PLANS } from '../constants';


const PROJECTS_STORAGE_KEY = 'dailyIslamicContentGenerator_projects';
const JOBS_STORAGE_KEY = 'dailyIslamicContentGenerator_scheduledJobs';
const USER_STORAGE_KEY = 'dailyIslamicContentGenerator_user';
const THEME_STORAGE_KEY = 'dailyIslamicContentGenerator_theme';
const AVATAR_LIBRARY_KEY = 'dailyIslamicContentGenerator_avatarLibrary';
const USER_STATS_KEY = 'dailyIslamicContentGenerator_userStats';


const AppContext = createContext<AppContextType | undefined>(undefined);

// Helper to wrap text on a canvas
const wrapAndDrawText = (context: CanvasRenderingContext2D, text: string, x: number, maxWidth: number, lineHeight: number, startY: number) => {
    const words = text.split(' ');
    let line = '';
    const lines = [];

    for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = context.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
            lines.push(line);
            line = words[n] + ' ';
        } else {
            line = testLine;
        }
    }
    lines.push(line);
    
    const totalTextHeight = (lines.length * lineHeight);
    let y = startY;
    if (startY > context.canvas.height / 2) { // Position from bottom
        y = startY - totalTextHeight;
    }


    // Draw semi-transparent background
    context.fillStyle = 'rgba(0, 0, 0, 0.6)';
    const bgY = (startY > context.canvas.height / 2) ? y - (lineHeight / 2) : y;
    context.fillRect(0, bgY, context.canvas.width, totalTextHeight + (lineHeight));

    // Draw the text lines
    context.fillStyle = 'white';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    
    lines.forEach((line, index) => {
        context.fillText(line.trim(), x, y + (index * lineHeight) + (lineHeight / 2));
    });
};


export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Active work state
    const [contentType, setContentType] = useState<ContentType | null>(null);
    const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
    const [translatedContent, setTranslatedContent] = useState<GeneratedContent | null>(null);
    const [audioUrl, setAudioUrl] = useState<string | null>(null); // For dedicated audio stories
    const [videoAudioUrl, setVideoAudioUrl] = useState<string | null>(null); // For video voiceover
    const [backgroundMusicUrl, setBackgroundMusicUrl] = useState<string | null>(null);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [quizQuestion, setQuizQuestion] = useState<QuizQuestion | null>(null);
    
    // Project Management State
    const [projects, setProjects] = useState<Project[]>([]);
    const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
    
    // UI & Loading State
    const [isVideoPreview, setIsVideoPreview] = useState(false);
    const [videoGenerationProgress, setVideoGenerationProgress] = useState(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isTranslating, setIsTranslating] = useState<boolean>(false);
    const [isGeneratingAudio, setIsGeneratingAudio] = useState<boolean>(false);
    const [isGeneratingVideoAudio, setIsGeneratingVideoAudio] = useState<boolean>(false);
    const [isGeneratingBackgroundMusic, setIsGeneratingBackgroundMusic] = useState<boolean>(false);
    const [isPreviewLoading, setIsPreviewLoading] = useState<boolean>(false);
    const [isGeneratingVideo, setIsGeneratingVideo] = useState<boolean>(false);
    const [isGeneratingQuiz, setIsGeneratingQuiz] = useState<boolean>(false);
    const [loadingMessage, setLoadingMessage] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [theme, setTheme] = useState<Theme>('light');
    const [videoStyle, setVideoStyleState] = useState<VideoStyle>('slideshow');
    const [avatarImageUrl, setAvatarImageUrl] = useState<string | null>(null);
    const [isGeneratingAvatar, setIsGeneratingAvatar] = useState<boolean>(false);
    const [isRemovingAvatarBackground, setIsRemovingAvatarBackground] = useState<boolean>(false);
    const [avatarBackgroundUrl, setAvatarBackgroundUrl] = useState<string | null>(null);
    const [isGeneratingAvatarBackground, setIsGeneratingAvatarBackground] = useState<boolean>(false);
    const [avatarCombinedPreviewUrl, setAvatarCombinedPreviewUrl] = useState<string | null>(null);
    const [isGeneratingAvatarPreview, setIsGeneratingAvatarPreview] = useState<boolean>(false);
    const [avatarConfig, setAvatarConfig] = useState<AvatarConfig>({ scale: 1, x: 0, y: 0 });

    // Watermark State - Default to App Icon
    const [watermarkImageUrl, setWatermarkImageUrl] = useState<string | null>('/icon.svg');
    const [watermarkSettings, setWatermarkSettings] = useState<WatermarkSettings>({
        position: 'bottom-right',
        opacity: 0.5, // Medium opacity
        size: 0.15, // Medium size
    });
    
    // Gamification State
    const [userStats, setUserStats] = useState<UserStats>({
        totalGenerations: 0,
        level: 1,
        xp: 0,
        nextLevelXp: 100,
        achievements: ACHIEVEMENTS
    });

    // Avatar Library
    const [avatarLibrary, setAvatarLibrary] = useState<string[]>([]);

    // Scheduler State
    const [scheduledJobs, setScheduledJobs] = useState<ScheduledJob[]>([]);
    
    // Modal & Panel State
    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
    const [contentTypeToSchedule, setContentTypeToSchedule] = useState<ContentType | null>(null);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
    const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
    const [isTutorialModalOpen, setIsTutorialModalOpen] = useState(false);
    const [isDocsModalOpen, setIsDocsModalOpen] = useState(false);
    const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
    const [isInstallGuideOpen, setIsInstallGuideOpen] = useState(false);

    const [isWelcomeScreenVisible, setIsWelcomeScreenVisible] = useState(false);
    const [activePanel, _setActivePanel] = useState<PanelMode>('dashboard');
    const [panelHistory, setPanelHistory] = useState<PanelMode[]>(['dashboard']);
    
    // Other State
    const [user, setUser] = useState<User | null>(null);
    const [installPromptEvent, setInstallPromptEvent] = useState<Event | null>(null);


     // --- UPLOAD ACTIONS ---
    const uploadSceneImage = useCallback(async (sceneId: string, file: File) => {
        if (!generatedContent) return;
        try {
            const base64 = await blobToBase64(file);
            const updatedScenes = generatedContent.scenes.map(scene =>
                scene.id === sceneId ? { ...scene, imageUrl: base64 } : scene
            );
            updateGeneratedContent({ scenes: updatedScenes });
        } catch (error) {
            console.error("Error reading scene image file:", error);
            setError('apiErrors.unexpected');
        }
    }, [generatedContent, activeProjectId]);

    const uploadAvatarBackground = useCallback(async (file: File) => {
        try {
            const base64 = await blobToBase64(file);
            setAvatarBackgroundUrl(base64);
            updateActiveProjectState({ avatarBackgroundUrl: base64 });
        } catch (error) {
            console.error("Error reading background image file:", error);
            setError('apiErrors.unexpected');
        }
    }, [activeProjectId]);

    const uploadVideoAudio = useCallback(async (file: File) => {
        try {
            if (videoAudioUrl && !videoAudioUrl.startsWith('http')) {
                URL.revokeObjectURL(videoAudioUrl);
            }
            const newAudioUrl = URL.createObjectURL(file);
            setVideoAudioUrl(newAudioUrl);
            updateActiveProjectState({ videoAudioUrl: newAudioUrl });
        } catch (error) {
            console.error("Error reading audio file:", error);
            setError('apiErrors.unexpected');
        }
    }, [videoAudioUrl, activeProjectId]);
    
    const uploadWatermarkImage = useCallback(async (file: File) => {
        try {
            const base64 = await blobToBase64(file);
            setWatermarkImageUrl(base64);
            updateActiveProjectState({ watermarkImageUrl: base64 });
        } catch (error) {
            console.error("Error reading watermark image file:", error);
            setError('apiErrors.unexpected');
        }
    }, [activeProjectId]);

    const removeWatermark = useCallback(() => {
        setWatermarkImageUrl(null);
        updateActiveProjectState({ watermarkImageUrl: null });
    }, [activeProjectId]);


    // --- Effects for Initialization and Persistence ---
    useEffect(() => {
        try {
            // Theme logic
            const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme;
            const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (savedTheme) setTheme(savedTheme);
            else if (prefersDark) setTheme('dark');

            // Welcome screen logic
            if (!sessionStorage.getItem('welcomeScreenShown')) setIsWelcomeScreenVisible(true);
            
            // Load persisted data
            const savedProjectsJSON = localStorage.getItem(PROJECTS_STORAGE_KEY);
            if (savedProjectsJSON) setProjects(JSON.parse(savedProjectsJSON));
            
            const savedJobsJSON = localStorage.getItem(JOBS_STORAGE_KEY);
            if (savedJobsJSON) setScheduledJobs(JSON.parse(savedJobsJSON));
            
            const savedUserJSON = localStorage.getItem(USER_STORAGE_KEY);
            if (savedUserJSON) {
                setUser(JSON.parse(savedUserJSON));
            } else {
                // Initialize Guest User
                const guestUser: User = { email: 'guest@zad.app', plan: 'free', credits: 5, maxCredits: 5 };
                setUser(guestUser);
            }

            const savedAvatarLibraryJSON = localStorage.getItem(AVATAR_LIBRARY_KEY);
            if (savedAvatarLibraryJSON) setAvatarLibrary(JSON.parse(savedAvatarLibraryJSON));
            
            const savedStatsJSON = localStorage.getItem(USER_STATS_KEY);
            if (savedStatsJSON) {
                 setUserStats(JSON.parse(savedStatsJSON));
            }

        } catch (err) {
            console.error("Failed to load state from local storage:", err);
        }
    }, []);

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(theme);
        localStorage.setItem(THEME_STORAGE_KEY, theme);
    }, [theme]);
    
    useEffect(() => {
        localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
    }, [projects]);
    
    useEffect(() => {
        localStorage.setItem(AVATAR_LIBRARY_KEY, JSON.stringify(avatarLibrary));
    }, [avatarLibrary]);
    
    useEffect(() => {
        localStorage.setItem(USER_STATS_KEY, JSON.stringify(userStats));
    }, [userStats]);

    // Persist user credits
    useEffect(() => {
        if (user) {
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
        }
    }, [user]);


    // --- Navigation ---
    const setActivePanel = useCallback((panel: PanelMode) => {
        _setActivePanel(panel);
        setPanelHistory(prevHistory => {
            if (panel === 'dashboard') {
                return ['dashboard'];
            }
            if (prevHistory[prevHistory.length - 1] === panel) {
                return prevHistory;
            }
            return [...prevHistory, panel];
        });
    }, []);

    const goBack = useCallback(() => {
        setPanelHistory(prevHistory => {
            if (prevHistory.length > 1) {
                const newHistory = prevHistory.slice(0, -1);
                const prevPanel = newHistory[newHistory.length - 1];
                _setActivePanel(prevPanel);
                return newHistory;
            }
            return prevHistory;
        });
    }, []);

    // --- Utility Functions ---
    const updateActiveProjectState = (updates: Partial<Project>) => {
        if (!activeProjectId) return;
        setProjects(prevProjects => 
            prevProjects.map(p => p.id === activeProjectId ? { ...p, ...updates } : p)
        );
    };

    const resetStateForNewContent = (clearActiveId = true) => {
        if (clearActiveId) setActiveProjectId(null);
        
        if (videoUrl) URL.revokeObjectURL(videoUrl);
        if (audioUrl) URL.revokeObjectURL(audioUrl);
        if (videoAudioUrl && !videoAudioUrl.startsWith('http')) URL.revokeObjectURL(videoAudioUrl);
        if (backgroundMusicUrl && !backgroundMusicUrl.startsWith('http')) URL.revokeObjectURL(backgroundMusicUrl);

        setAudioUrl(null);
        setVideoAudioUrl(null);
        setBackgroundMusicUrl(null);
        setVideoUrl(null);
        setGeneratedContent(null);
        setTranslatedContent(null);
        setQuizQuestion(null);
        setError(null);
        setAvatarImageUrl(null);
        setAvatarBackgroundUrl(null);
        setAvatarCombinedPreviewUrl(null);
        setIsVideoPreview(false);
        setVideoGenerationProgress(0);
        setAvatarConfig({ scale: 1, x: 0, y: 0 });
        
        // Reset Watermark to default for new content
        setWatermarkImageUrl('/icon.svg');
        setWatermarkSettings({ position: 'bottom-right', opacity: 0.5, size: 0.15 });
    };

    const saveCurrentProject = (newContent: GeneratedContent) => {
        const newProject: Project = {
            id: Date.now().toString(),
            title: newContent.title,
            createdAt: new Date().toISOString(),
            contentType: contentType!,
            generatedContent: newContent,
            translatedContent: null,
            videoAudioUrl: null,
            backgroundMusicUrl: null,
            videoUrl: null,
            quizQuestion: null,
            videoStyle: 'slideshow',
            avatarImageUrl: null,
            avatarBackgroundUrl: null,
            avatarCombinedPreviewUrl: null,
            avatarConfig: { scale: 1, x: 0, y: 0 },
            watermarkImageUrl: '/icon.svg', // Default app logo
            watermarkSettings: { position: 'bottom-right', opacity: 0.5, size: 0.15 }
        };
        setProjects(prev => [newProject, ...prev]);
        setActiveProjectId(newProject.id);
    };
    
    // --- Credit System Logic ---
    const checkAndDeductCredit = (): boolean => {
        if (!user) return false;
        if (user.credits <= 0) {
            setIsSubscriptionModalOpen(true);
            return false;
        }
        setUser(prev => prev ? { ...prev, credits: prev.credits - 1 } : null);
        return true;
    };
    
    // --- Gamification Logic ---
    const checkAchievements = (type: ContentType) => {
        setUserStats(prev => {
            const newTotal = prev.totalGenerations + 1;
            const xpGain = 20;
            let newXp = prev.xp + xpGain;
            let newLevel = prev.level;
            let newNextLevelXp = prev.nextLevelXp;
            
            if (newXp >= prev.nextLevelXp) {
                newLevel += 1;
                newXp = newXp - prev.nextLevelXp;
                newNextLevelXp = Math.floor(prev.nextLevelXp * 1.5);
            }

            const newAchievements = prev.achievements.map(ach => {
                if (ach.unlocked) return ach;
                
                // Unlock Logic
                if (ach.id === 'creator_lvl1' && newTotal >= 5) return { ...ach, unlocked: true };
                if (ach.id === 'global_voice' && type === ContentType.GlobalCultureBridge) return { ...ach, unlocked: true };
                if (ach.id === 'peace_builder' && (type === ContentType.RespondToMisconceptions || type === ContentType.ComparativeReligion)) return { ...ach, unlocked: true };

                return ach;
            });

            return {
                totalGenerations: newTotal,
                level: newLevel,
                xp: newXp,
                nextLevelXp: newNextLevelXp,
                achievements: newAchievements
            };
        });
    };

    // --- Core Actions ---
    const generateContent = useCallback(async (type: ContentType, customPrompt?: string) => {
        if (!checkAndDeductCredit()) return; // Check credits first

        setIsLoading(true);
        setContentType(type);
        resetStateForNewContent();
        
        try {
            const content = await generateDailyContent(type, customPrompt);
            setGeneratedContent(content);
            saveCurrentProject(content);
            checkAchievements(type); // Trigger achievement check
        } catch (err: any) {
            setError(err.message || 'apiErrors.contentGeneration');
        } finally {
            setIsLoading(false);
        }
    }, [projects, user]); // Added user dependency for credit check

    const selectHadith = useCallback(async (hadith: LibraryHadith) => {
        if (!checkAndDeductCredit()) return;

        setIsLoading(true);
        setContentType(hadith.type);
        resetStateForNewContent();

        try {
            const content = await generateSupplementaryContentForHadith(hadith);
            setGeneratedContent(content);
            saveCurrentProject(content);
            setActivePanel('generator');
            checkAchievements(hadith.type);
        } catch (err: any) {
            setError(err.message || 'apiErrors.supplementaryContent');
        } finally {
            setIsLoading(false);
        }
    }, [projects, user]);

    const selectVerses = useCallback(async (verses: Ayah[], surah: Surah) => {
         if (!checkAndDeductCredit()) return;

        setIsLoading(true);
        setContentType(ContentType.QuranVerse);
        resetStateForNewContent();

        try {
            const content = await generateContentFromQuranVerses(verses, surah);
            setGeneratedContent(content);
            saveCurrentProject(content);
            setActivePanel('generator');
            checkAchievements(ContentType.QuranVerse);
        } catch (err: any) {
             setError(err.message || 'apiErrors.contentFromVerses');
        } finally {
            setIsLoading(false);
        }
    }, [projects, user]);

    const updateGeneratedContent = (newContent: Partial<GeneratedContent>) => {
        if (generatedContent) {
            const updated = { ...generatedContent, ...newContent };
            setGeneratedContent(updated);
            updateActiveProjectState({ generatedContent: updated });
        }
    };

    const translateContentAction = async (targetLanguage: string) => {
        if (!generatedContent) return;
        setIsTranslating(true);
        try {
            const translated = await translateContent(generatedContent, targetLanguage);
            setTranslatedContent(translated);
            updateActiveProjectState({ translatedContent: translated });
        } catch (err: any) {
            setError(err.message || 'apiErrors.translation');
        } finally {
            setIsTranslating(false);
        }
    };

    const generateAudio = async () => {
         if (!generatedContent) return;
         setIsGeneratingAudio(true);
         try {
             const fullText = generatedContent.scenes.map(s => s.text).join(' ');
             const base64Audio = await generateSpeechFromText(fullText);
             const blob = pcmToWavBlob(base64Audio);
             const url = URL.createObjectURL(blob);
             setAudioUrl(url);
             // We don't save this specific audio in project state for now as it's for "audio stories"
         } catch (err: any) {
             setError(err.message || 'apiErrors.audioGeneration');
         } finally {
             setIsGeneratingAudio(false);
         }
    };

    const generateVideoAudio = async (text: string): Promise<string | undefined> => {
        setIsGeneratingVideoAudio(true);
        try {
            const base64Audio = await generateSpeechFromText(text);
            const blob = pcmToWavBlob(base64Audio);
            const url = URL.createObjectURL(blob);
            setVideoAudioUrl(url);
            updateActiveProjectState({ videoAudioUrl: url });
            return url;
        } catch (err: any) {
             setError(err.message || 'apiErrors.speechGeneration');
        } finally {
            setIsGeneratingVideoAudio(false);
        }
        return undefined;
    };
    
    const generateBackgroundMusicAction = async (prompt: string) => {
        setIsGeneratingBackgroundMusic(true);
        try {
            const url = await generateBackgroundMusic(prompt);
            setBackgroundMusicUrl(url);
            updateActiveProjectState({ backgroundMusicUrl: url });
        } catch (err: any) {
            setError('apiErrors.unexpected');
        } finally {
            setIsGeneratingBackgroundMusic(false);
        }
    }

    const generateSceneImage = async (sceneId: string, aspectRatio: string, customPrompt: string) => {
        if (!generatedContent) return;
        setIsPreviewLoading(true);
        try {
            const scene = generatedContent.scenes.find(s => s.id === sceneId);
            if (scene) {
                const imageUrl = await generateImageFromSuggestion(generatedContent.title, scene.text, customPrompt, aspectRatio);
                const updatedScenes = generatedContent.scenes.map(s => 
                    s.id === sceneId ? { ...s, imageUrl } : s
                );
                updateGeneratedContent({ scenes: updatedScenes });
            }
        } catch (err: any) {
             setError(err.message || 'apiErrors.imageGeneration');
        } finally {
            setIsPreviewLoading(false);
        }
    };

    const generateAllSceneImages = async (aspectRatio: string, customPrompts: { [sceneId: string]: string }): Promise<GeneratedContent | undefined> => {
        if (!generatedContent) return undefined;
        setIsPreviewLoading(true);
        try {
             const promises = generatedContent.scenes.map(async (scene) => {
                const prompt = customPrompts[scene.id] || scene.visualSuggestion;
                // Check if image already exists to avoid re-generation if not needed, 
                // but for "generate all" we usually imply overwrite or fresh generation. 
                // Let's stick to generating fresh if this is called.
                const imageUrl = await generateImageFromSuggestion(generatedContent.title, scene.text, prompt, aspectRatio);
                return { id: scene.id, imageUrl };
            });
            
            const results = await Promise.all(promises);
            const updatedScenes = generatedContent.scenes.map(scene => {
                const result = results.find(r => r.id === scene.id);
                return result ? { ...scene, imageUrl: result.imageUrl } : scene;
            });
            
            const newContent = { ...generatedContent, scenes: updatedScenes };
            setGeneratedContent(newContent);
            updateActiveProjectState({ generatedContent: newContent });
            return newContent;

        } catch (err: any) {
            setError(err.message || 'apiErrors.imageGeneration');
        } finally {
            setIsPreviewLoading(false);
        }
        return undefined;
    };

    // --- Internal Rendering Logic ---
    const renderVideoTask = async (videoSettings: VideoSettings, isPreview: boolean, overrideAudioUrl?: string, overrideContent?: GeneratedContent): Promise<Blob | null> => {
         const content = overrideContent || translatedContent || generatedContent;
        const currentAudioUrl = overrideAudioUrl || videoAudioUrl;

        if (!content || (!isPreview && !currentAudioUrl)) {
            setError('apiErrors.missingSources');
            return null;
        }

        setIsGeneratingVideo(true);
        setLoadingMessage('publishingPanel.progress.loadingFFmpeg');
        setVideoGenerationProgress(0);
        setError(null);

        let audioContext: AudioContext | null = null;
        let mediaStreamDestination: MediaStreamAudioDestinationNode | null = null;
        let recorder: MediaRecorder | null = null;
        let animationFrameId: number | null = null;
        let finalBlob: Blob | null = null;

        try {
            // --- 1. Setup Audio ---
            let audioBuffer: AudioBuffer | null = null;
            let musicBuffer: AudioBuffer | null = null;
            
            audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            
            if (!isPreview && currentAudioUrl) {
                setLoadingMessage('publishingPanel.progress.analyzingAudio');
                const response = await fetch(currentAudioUrl);
                const arrayBuffer = await response.arrayBuffer();
                audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
            }

             if (!isPreview && backgroundMusicUrl) {
                try {
                    const response = await fetch(backgroundMusicUrl);
                    const arrayBuffer = await response.arrayBuffer();
                    musicBuffer = await audioContext.decodeAudioData(arrayBuffer);
                } catch (e) {
                    console.warn("Failed to load music", e);
                }
            }
            
            // --- SAFETY CHECK: Audio Duration ---
            let totalDuration = 5; // Default 5s for silent preview
            if (!isPreview && audioBuffer) {
                 // Ensure duration is finite and positive to prevent hangs
                 if (!isFinite(audioBuffer.duration) || audioBuffer.duration <= 0) {
                     throw new Error("Invalid audio duration detected. Please regenerate audio.");
                 }
                 totalDuration = audioBuffer.duration;
            } else if (isPreview) {
                totalDuration = content.scenes.length * 4; // 4s per scene
            }

            // --- 2. Setup Video Canvas ---
            const canvas = document.createElement('canvas');
            const is1080 = videoSettings.resolution === '1080p';
            const isPortrait = videoSettings.aspectRatio === '9:16';
            
            canvas.width = isPortrait ? (is1080 ? 1080 : 720) : (is1080 ? 1920 : 1280); 
            canvas.height = isPortrait ? (is1080 ? 1920 : 1280) : (is1080 ? 1080 : 720);
            
            const ctx = canvas.getContext('2d');
            if (!ctx) throw new Error('Could not get canvas context');

            // --- 3. Setup Recording Stream ---
            const stream = canvas.captureStream(30); // 30 FPS
            mediaStreamDestination = audioContext.createMediaStreamDestination();
            
            // Add audio track to stream if not silent
            if (!isPreview && (audioBuffer || musicBuffer)) {
                if (audioBuffer) {
                    const source = audioContext.createBufferSource();
                    source.buffer = audioBuffer;
                    source.connect(mediaStreamDestination);
                    source.start(0);
                }
                if (musicBuffer) {
                     const musicSource = audioContext.createBufferSource();
                     musicSource.buffer = musicBuffer;
                     const gainNode = audioContext.createGain();
                     gainNode.gain.value = 0.2; // Lower volume for background music
                     musicSource.connect(gainNode);
                     gainNode.connect(mediaStreamDestination);
                     musicSource.loop = true;
                     musicSource.start(0);
                }
                stream.addTrack(mediaStreamDestination.stream.getAudioTracks()[0]);
            }

            // Determine MIME type based on requested format or availability
            let mimeType = 'video/webm;codecs=vp9';
            if (videoSettings.format === 'mp4') {
                 if (MediaRecorder.isTypeSupported('video/mp4')) {
                     mimeType = 'video/mp4';
                 } else if (MediaRecorder.isTypeSupported('video/mp4;codecs=avc1')) {
                     mimeType = 'video/mp4;codecs=avc1';
                 } else {
                     console.warn("MP4 not supported by this browser, falling back to WebM");
                 }
            }

            recorder = new MediaRecorder(stream, {
                mimeType: mimeType,
                videoBitsPerSecond: is1080 ? 5000000 : 2500000 // Higher bitrate for 1080p
            });
            
            const chunks: Blob[] = [];
            recorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunks.push(e.data);
            };

            const completionPromise = new Promise<Blob>((resolve) => {
                recorder!.onstop = () => {
                   const blob = new Blob(chunks, { type: recorder!.mimeType });
                   resolve(blob);
                };
            });

            recorder.start();
            setLoadingMessage('publishingPanel.progress.processingScenes');

            // --- 4. Animation Loop ---
            const startTime = performance.now();
            let scenes = content.scenes;
            
            // Pre-load images
            const loadedImages: HTMLImageElement[] = await Promise.all(scenes.map(async s => {
                const img = new Image();
                let src = s.imageUrl;
                if (videoStyle === 'avatar') {
                    // In avatar mode, we treat "scenes" differently in the renderer loop below
                    // For loading, if it's slideshow we load scenes, if avatar we load bg + avatar
                }
                
                if (!src && videoStyle !== 'avatar') {
                   return new Promise<HTMLImageElement>((resolve) => {
                        const placeholder = document.createElement('canvas');
                        placeholder.width = 100; placeholder.height = 100;
                        resolve(new Image());
                   });
                }
                
                if (src) {
                     img.src = src;
                    return new Promise<HTMLImageElement>((resolve) => {
                        img.onload = () => resolve(img);
                        img.onerror = () => resolve(img);
                    });
                }
                return new Image();
            }));
            
            // Pre-load Avatar Assets if needed
            let avatarImg: HTMLImageElement | null = null;
            let bgImg: HTMLImageElement | null = null;
            if (videoStyle === 'avatar' && avatarImageUrl && avatarBackgroundUrl) {
                avatarImg = new Image(); avatarImg.src = avatarImageUrl;
                bgImg = new Image(); bgImg.src = avatarBackgroundUrl;
                await Promise.all([
                    new Promise(r => avatarImg!.onload = r),
                    new Promise(r => bgImg!.onload = r)
                ]);
            }
            
            // Pre-load watermark
            let watermarkImg: HTMLImageElement | null = null;
            if (watermarkImageUrl) {
                watermarkImg = new Image();
                watermarkImg.src = watermarkImageUrl;
                await new Promise(r => { watermarkImg!.onload = r; watermarkImg!.onerror = r; });
            }

            const drawFrame = () => {
                const currentTime = (performance.now() - startTime) / 1000;
                
                if (currentTime >= totalDuration) {
                    recorder?.stop();
                    return;
                }
                
                const progress = Math.min(100, Math.round((currentTime / totalDuration) * 100));
                setVideoGenerationProgress(progress);

                // Determine current scene text
                const sceneDuration = totalDuration / scenes.length;
                const sceneIndex = Math.min(scenes.length - 1, Math.floor(currentTime / sceneDuration));
                const currentScene = scenes[sceneIndex];

                // Render Logic
                if (videoStyle === 'avatar' && bgImg && avatarImg) {
                    // --- AVATAR RENDER MODE ---
                    
                    // 1. Draw Background
                    const bgRatio = Math.max(canvas.width / bgImg.width, canvas.height / bgImg.height);
                    const bgShiftX = (canvas.width - bgImg.width * bgRatio) / 2;
                    const bgShiftY = (canvas.height - bgImg.height * bgRatio) / 2;
                    ctx.drawImage(bgImg, 0, 0, bgImg.width, bgImg.height, bgShiftX, bgShiftY, bgImg.width * bgRatio, bgImg.height * bgRatio);
                    
                    // 2. Draw Avatar with Config
                    // Default scaling logic if config is 1.0
                    const isPortrait = canvas.height > canvas.width;
                    const baseScale = isPortrait ? 0.6 : 0.5; 
                    
                    // Apply user configuration
                    const userScale = avatarConfig.scale || 1;
                    const finalScale = baseScale * userScale;
                    
                    const avWidth = canvas.width * finalScale;
                    const avHeight = avWidth * (avatarImg.height / avatarImg.width);
                    
                    // Calculate base centered position (bottom center)
                    const baseX = (canvas.width - avWidth) / 2;
                    const baseY = canvas.height - avHeight + (avHeight * 0.1); // Default 10% offset down
                    
                    // Apply user position offsets (percentage of canvas dimensions)
                    const offsetX = (avatarConfig.x || 0) / 100 * canvas.width;
                    const offsetY = (avatarConfig.y || 0) / 100 * canvas.height;

                    ctx.drawImage(avatarImg, baseX + offsetX, baseY - offsetY, avWidth, avHeight);

                } else {
                    // --- SLIDESHOW RENDER MODE ---
                    const currentImage = loadedImages[sceneIndex];
                    if (currentImage && currentImage.width > 0) {
                        const ratio = Math.max(canvas.width / currentImage.width, canvas.height / currentImage.height);
                        const centerShift_x = (canvas.width - currentImage.width * ratio) / 2;
                        const centerShift_y = (canvas.height - currentImage.height * ratio) / 2;
                        ctx.drawImage(currentImage, 0, 0, currentImage.width, currentImage.height, centerShift_x, centerShift_y, currentImage.width * ratio, currentImage.height * ratio);
                    } else {
                        ctx.fillStyle = '#0f766e';
                        ctx.fillRect(0, 0, canvas.width, canvas.height);
                    }
                }

                // Draw Text Overlay
                ctx.font = `bold ${isPortrait ? 32 : 48}px Tajawal`;
                const textPadding = isPortrait ? 40 : 80;
                // Adjust text position if avatar is present to avoid overlap? 
                // For now, keep it standardized at bottom area
                const textY = isPortrait ? canvas.height * 0.8 : canvas.height * 0.85;
                wrapAndDrawText(ctx, currentScene.text, canvas.width / 2, canvas.width - (textPadding * 2), isPortrait ? 45 : 60, textY);

                // Draw Watermark
                if (watermarkImg && watermarkImg.width > 0) {
                    const wmWidth = canvas.width * watermarkSettings.size;
                    const wmHeight = wmWidth * (watermarkImg.height / watermarkImg.width);
                    const padding = 20;
                    let wmX = padding;
                    let wmY = padding;

                    if (watermarkSettings.position.includes('right')) wmX = canvas.width - wmWidth - padding;
                    if (watermarkSettings.position.includes('bottom')) wmY = canvas.height - wmHeight - padding;

                    ctx.globalAlpha = watermarkSettings.opacity;
                    ctx.drawImage(watermarkImg, wmX, wmY, wmWidth, wmHeight);
                    ctx.globalAlpha = 1.0;
                }

                animationFrameId = requestAnimationFrame(drawFrame);
            };

            drawFrame();
            
            finalBlob = await completionPromise;
            return finalBlob;

        } catch (err: any) {
            console.error("Video Generation Error:", err);
            setError(err.message || 'apiErrors.videoCombination');
            return null;
        } finally {
             if (animationFrameId) cancelAnimationFrame(animationFrameId);
             if (recorder && recorder.state !== 'inactive') recorder.stop();
             if (mediaStreamDestination) mediaStreamDestination.stream.getTracks().forEach(track => track.stop());
             if (audioContext && audioContext.state !== 'closed') audioContext.close();
             setIsGeneratingVideo(false);
        }
    };

    // --- Video Generation Public Wrappers ---
    const generateSilentPreview = async (videoSettings: VideoSettings) => {
        setIsVideoPreview(true);
        const blob = await renderVideoTask(videoSettings, true);
        if (blob) {
            const url = URL.createObjectURL(blob);
            setVideoUrl(url);
        }
    };
    
    const clearVideoPreview = () => {
        setIsVideoPreview(false);
        setVideoUrl(null);
    };

    const combineImageAndAudio = async (videoSettings: VideoSettings, isPreview: boolean, overrideAudioUrl?: string, overrideContent?: GeneratedContent) => {
        const blob = await renderVideoTask(videoSettings, isPreview, overrideAudioUrl, overrideContent);
        if (blob) {
            const url = URL.createObjectURL(blob);
            setVideoUrl(url);
            updateActiveProjectState({ videoUrl: url });
        }
    };

    // --- Auto Generate Video ---
    const autoGenerateVideo = async () => {
        if (!generatedContent) return;
        
        const defaultSettings: VideoSettings = {
             resolution: '720p',
             aspectRatio: '16:9',
             frameRate: '30',
             transition: 'fade'
        };
        
        setIsGeneratingVideo(true);
        setLoadingMessage('publishingPanel.progress.writingFiles'); 

        try {
             let currentContent = generatedContent;
             let currentAudioUrl = videoAudioUrl;

             // 1. Images: Check if any scene is missing an image
             if (currentContent.scenes.some(s => !s.imageUrl)) {
                 setLoadingMessage('publishingPanel.step1.generating');
                 const updated = await generateAllSceneImages('16:9', {});
                 if (updated) currentContent = updated;
             }

             // 2. Audio
             if (!currentAudioUrl && videoStyle === 'slideshow') {
                 setLoadingMessage('publishingPanel.step2.generating');
                 const script = currentContent.scenes.map(s => s.text).join(' ');
                 const newUrl = await generateVideoAudio(script);
                 if (newUrl) currentAudioUrl = newUrl;
             }

             // 3. Combine
             const blob = await renderVideoTask(defaultSettings, false, currentAudioUrl || undefined, currentContent);
             if (blob) {
                 const url = URL.createObjectURL(blob);
                 setVideoUrl(url);
                 updateActiveProjectState({ videoUrl: url });
             }

        } catch (e) {
             console.error(e);
             setError('apiErrors.unexpected');
             setIsGeneratingVideo(false);
        }
    };

    const downloadVideo = async (videoSettings: VideoSettings) => {
        const blob = await renderVideoTask(videoSettings, false);
        if (blob) {
             const url = URL.createObjectURL(blob);
             const a = document.createElement('a');
             a.href = url;
             // Determine extension based on blob type or requested format
             const ext = blob.type.includes('mp4') ? 'mp4' : 'webm';
             a.download = `${generatedContent?.title.replace(/\s/g, '_') || 'video'}_${videoSettings.resolution}.${ext}`;
             document.body.appendChild(a);
             a.click();
             document.body.removeChild(a);
             // Clean up URL after a delay to ensure download starts
             setTimeout(() => URL.revokeObjectURL(url), 1000);
        }
    };


    // --- Other Actions ---
    const clearContent = () => {
        resetStateForNewContent();
        setContentType(null);
    };

    const generateQuiz = async () => {
        if (!generatedContent) return;
        setIsGeneratingQuiz(true);
        try {
            const quiz = await generateQuizFromContent(generatedContent);
            setQuizQuestion(quiz);
            updateActiveProjectState({ quizQuestion: quiz });
        } catch (err: any) {
            setError('apiErrors.quizGeneration');
        } finally {
             setIsGeneratingQuiz(false);
        }
    };

    const setVideoStyle = (style: VideoStyle) => {
        setVideoStyleState(style);
        updateActiveProjectState({ videoStyle: style });
    };

    // Avatar Actions
    const generateAvatar = async (prompt: string) => {
        setIsGeneratingAvatar(true);
        try {
            const url = await generateAvatarImage(prompt);
            setAvatarImageUrl(url);
            updateActiveProjectState({ avatarImageUrl: url });
        } catch (err: any) {
            setError('apiErrors.avatarGeneration');
        } finally {
            setIsGeneratingAvatar(false);
        }
    };
    
    const uploadAvatarImage = async (file: File) => {
        try {
            const base64 = await blobToBase64(file);
            setAvatarImageUrl(base64);
            updateActiveProjectState({ avatarImageUrl: base64 });
        } catch (error) {
             setError('apiErrors.unexpected');
        }
    };

    const removeAvatarBackground = async () => {
        if (!avatarImageUrl) return;
        setIsRemovingAvatarBackground(true);
        try {
            const url = await removeImageBackground(avatarImageUrl);
            setAvatarImageUrl(url);
            updateActiveProjectState({ avatarImageUrl: url });
        } catch (err: any) {
             setError('apiErrors.avatarBackgroundRemoval');
        } finally {
            setIsRemovingAvatarBackground(false);
        }
    };

    const saveAvatarToLibrary = () => {
        if (avatarImageUrl && !avatarLibrary.includes(avatarImageUrl)) {
            setAvatarLibrary(prev => [...prev, avatarImageUrl]);
        }
    };

    const deleteAvatarFromLibrary = (imageUrl: string) => {
        setAvatarLibrary(prev => prev.filter(img => img !== imageUrl));
    };

    const selectAvatarFromLibrary = (imageUrl: string) => {
        setAvatarImageUrl(imageUrl);
        updateActiveProjectState({ avatarImageUrl: imageUrl });
    };
    
    const generateAvatarBackground = async (aspectRatio: string, customPrompt?: string) => {
        if (!generatedContent) return;
        setIsGeneratingAvatarBackground(true);
        try {
            const url = await generateBackgroundImage(generatedContent.title, customPrompt, aspectRatio);
            setAvatarBackgroundUrl(url);
            updateActiveProjectState({ avatarBackgroundUrl: url });
        } catch (err: any) {
             setError('apiErrors.imageGeneration');
        } finally {
             setIsGeneratingAvatarBackground(false);
        }
    };

    const generateAvatarVisualPreview = async (videoSettings: VideoSettings) => {
        // Deprecated in favor of interactive preview, but kept for fallback
        // ... logic preserved in renderVideoTask preview mode
        const blob = await renderVideoTask(videoSettings, true);
        if (blob) {
            const url = URL.createObjectURL(blob);
            setVideoUrl(url);
        }
    };
    
    const updateAvatarConfig = (config: Partial<AvatarConfig>) => {
        setAvatarConfig(prev => {
            const newConfig = { ...prev, ...config };
            updateActiveProjectState({ avatarConfig: newConfig });
            return newConfig;
        });
    };
    
    const updateWatermarkSettings = (settings: Partial<WatermarkSettings>) => {
        const newSettings = { ...watermarkSettings, ...settings };
        setWatermarkSettings(newSettings);
        updateActiveProjectState({ watermarkSettings: newSettings });
    };

    // NEW: Select Background Logic
    const selectBackground = (url: string) => {
        setAvatarBackgroundUrl(url);
        updateActiveProjectState({ avatarBackgroundUrl: url });
        setVideoStyleState('avatar'); 
        updateActiveProjectState({ videoStyle: 'avatar' });
        // Optionally switch panel if we want to force user to see the result immediately, 
        // but since this is called from the side panel, they are already seeing the editor.
        _setActivePanel('generator'); // Switch back to generator view to see the result in the editor side
    };

    // --- Scheduler Actions ---
    const openScheduleModal = (type: ContentType) => {
        setContentTypeToSchedule(type);
        setIsScheduleModalOpen(true);
    };

    const closeScheduleModal = () => {
        setIsScheduleModalOpen(false);
        setContentTypeToSchedule(null);
    };

    const scheduleJob = (type: ContentType, scheduledAt: string) => {
        const newJob: ScheduledJob = {
            id: Date.now().toString(),
            contentType: type,
            scheduledAt,
            status: 'Scheduled'
        };
        setScheduledJobs(prev => [...prev, newJob]);
        localStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify([...scheduledJobs, newJob]));
        closeScheduleModal();
        
        // In a real app, this would be handled by a backend cron. 
        // Here we simulate it with setTimeout if the app is open.
        const timeUntil = new Date(scheduledAt).getTime() - Date.now();
        if (timeUntil > 0) {
            setTimeout(async () => {
                 try {
                    const content = await generateDailyContent(type);
                    // Update job status
                    setScheduledJobs(prev => prev.map(j => j.id === newJob.id ? { ...j, status: 'Completed', generatedContent: content } : j));
                 } catch (err) {
                    setScheduledJobs(prev => prev.map(j => j.id === newJob.id ? { ...j, status: 'Failed', error: 'Generation failed' } : j));
                 }
            }, timeUntil);
        }
    };

    const deleteJob = (jobId: string) => {
         const updated = scheduledJobs.filter(j => j.id !== jobId);
         setScheduledJobs(updated);
         localStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(updated));
    };

    const viewJobContent = (job: ScheduledJob) => {
        if (job.generatedContent) {
            setGeneratedContent(job.generatedContent);
            setContentType(job.contentType);
            setActivePanel('generator'); // Or studio
        }
    };

    // --- Other Modal Actions ---
    const openLoginModal = () => setIsLoginModalOpen(true);
    const closeLoginModal = () => setIsLoginModalOpen(false);
    
    const login = (email: string) => {
        const plan = 'free';
        const credits = SUBSCRIPTION_PLANS.find(p => p.id === plan)?.dailyCredits || 5;
        const newUser: User = { email, plan, credits, maxCredits: credits };
        setUser(newUser);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
        closeLoginModal();
    };
    
    const logout = () => {
        setUser(null);
        localStorage.removeItem(USER_STORAGE_KEY);
    };
    
    const openSubscriptionModal = () => setIsSubscriptionModalOpen(true);
    const closeSubscriptionModal = () => setIsSubscriptionModalOpen(false);

    const upgradePlan = (planId: PlanTier) => {
        if (!user) {
            openLoginModal();
            return;
        }
        const planDetails = SUBSCRIPTION_PLANS.find(p => p.id === planId);
        const credits = planDetails?.dailyCredits || 100;
        
        const updatedUser = { ...user, plan: planId, credits: credits, maxCredits: credits };
        setUser(updatedUser);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
        closeSubscriptionModal();
        // In a real app, this would redirect to a payment gateway like Stripe/Paddle
        alert("Simulated: Upgraded to " + planId + " with " + credits + " credits.");
    };
    
    const redeemCoupon = (code: string) => {
        // Simulate B2B coupon logic
        if (code === 'PARTNER2024') {
            if (user) {
                const updatedUser: User = { ...user, plan: 'business', credits: 1000, maxCredits: 1000 };
                setUser(updatedUser);
                localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
                return true;
            } else {
                openLoginModal();
                return false;
            }
        }
        return false;
    };

    const triggerInstallPrompt = () => {
        if (installPromptEvent) {
            (installPromptEvent as any).prompt();
            setInstallPromptEvent(null);
        }
    };

    const openInstallGuide = () => setIsInstallGuideOpen(true);
    const closeInstallGuide = () => setIsInstallGuideOpen(false);

    // Capture PWA install event
    useEffect(() => {
        const handler = (e: Event) => {
            e.preventDefault();
            setInstallPromptEvent(e);
        };
        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);
    
    const openFeedbackModal = () => setIsFeedbackModalOpen(true);
    const closeFeedbackModal = () => setIsFeedbackModalOpen(false);
    
    const submitFeedback = async (feedback: string) => {
        return await processUserFeedback(feedback);
    };
    
    const openDeployModal = () => setIsDeployModalOpen(true);
    const closeDeployModal = () => setIsDeployModalOpen(false);
    
    const openTutorialModal = () => setIsTutorialModalOpen(true);
    const closeTutorialModal = () => setIsTutorialModalOpen(false);
    
    const openDocsModal = () => setIsDocsModalOpen(true);
    const closeDocsModal = () => setIsDocsModalOpen(false);

    const hideWelcomeScreen = () => {
        setIsWelcomeScreenVisible(false);
        sessionStorage.setItem('welcomeScreenShown', 'true');
    };
    
    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };
    
    // Project CRUD
    const loadProject = (projectId: string) => {
        const project = projects.find(p => p.id === projectId);
        if (project) {
            setActiveProjectId(project.id);
            setContentType(project.contentType);
            setGeneratedContent(project.generatedContent);
            setTranslatedContent(project.translatedContent);
            setVideoAudioUrl(project.videoAudioUrl);
            setBackgroundMusicUrl(project.backgroundMusicUrl);
            setVideoUrl(project.videoUrl);
            setQuizQuestion(project.quizQuestion);
            setVideoStyleState(project.videoStyle);
            setAvatarImageUrl(project.avatarImageUrl);
            setAvatarBackgroundUrl(project.avatarBackgroundUrl);
            setAvatarCombinedPreviewUrl(project.avatarCombinedPreviewUrl);
            setAvatarConfig(project.avatarConfig || { scale: 1, x: 0, y: 0 });
            setWatermarkImageUrl(project.watermarkImageUrl);
            setWatermarkSettings(project.watermarkSettings || { position: 'bottom-right', opacity: 0.5, size: 0.15 });
            setActivePanel('generator');
        }
    };

    const deleteProject = (projectId: string) => {
        const updated = projects.filter(p => p.id !== projectId);
        setProjects(updated);
        if (activeProjectId === projectId) {
            resetStateForNewContent();
        }
    };
    
    const renameProject = (projectId: string, newTitle: string) => {
        setProjects(prev => prev.map(p => p.id === projectId ? { ...p, title: newTitle } : p));
        if (activeProjectId === projectId && generatedContent) {
            setGeneratedContent({ ...generatedContent, title: newTitle });
        }
    };

    const cloneCommunityProject = (communityProject: CommunityProject) => {
        resetStateForNewContent();
        setContentType(communityProject.contentType);
        setGeneratedContent(communityProject.generatedContent);
        saveCurrentProject(communityProject.generatedContent);
        setActivePanel('generator');
    };

    return (
        <AppContext.Provider value={{
            contentType,
            generatedContent,
            translatedContent,
            audioUrl,
            videoAudioUrl,
            backgroundMusicUrl,
            videoUrl,
            isVideoPreview,
            videoGenerationProgress,
            scheduledJobs,
            isLoading,
            isTranslating,
            isGeneratingAudio,
            isGeneratingVideoAudio,
            isGeneratingBackgroundMusic,
            isPreviewLoading,
            isGeneratingVideo,
            loadingMessage,
            error,
            isScheduleModalOpen,
            contentTypeToSchedule,
            isLoginModalOpen,
            user,
            userStats,
            quizQuestion,
            isGeneratingQuiz,
            isWelcomeScreenVisible,
            theme,
            videoStyle,
            avatarImageUrl,
            isGeneratingAvatar,
            isRemovingAvatarBackground,
            avatarBackgroundUrl,
            isGeneratingAvatarBackground,
            avatarCombinedPreviewUrl,
            isGeneratingAvatarPreview,
            avatarConfig,
            avatarLibrary,
            projects,
            activeProjectId,
            activePanel,
            watermarkImageUrl,
            watermarkSettings,
            installPromptEvent,
            isFeedbackModalOpen,
            isDeployModalOpen,
            isTutorialModalOpen,
            isDocsModalOpen,
            isSubscriptionModalOpen,
            canGoBack: panelHistory.length > 1,
            isInstallGuideOpen,
            
            generateContent,
            selectHadith,
            selectVerses,
            translateContent: translateContentAction,
            generateAllSceneImages,
            generateSceneImage,
            generateAudio,
            generateVideoAudio,
            generateBackgroundMusic: generateBackgroundMusicAction,
            combineImageAndAudio,
            generateSilentPreview,
            clearVideoPreview,
            updateGeneratedContent,
            clearContent,
            openScheduleModal,
            closeScheduleModal,
            scheduleJob,
            deleteJob,
            viewJobContent,
            openLoginModal,
            closeLoginModal,
            login,
            logout,
            triggerInstallPrompt,
            openInstallGuide,
            closeInstallGuide,
            openFeedbackModal,
            closeFeedbackModal,
            submitFeedback,
            generateQuiz,
            hideWelcomeScreen,
            toggleTheme,
            setVideoStyle,
            generateAvatar,
            uploadAvatarImage,
            removeAvatarBackground,
            saveAvatarToLibrary,
            deleteAvatarFromLibrary,
            selectAvatarFromLibrary,
            uploadAvatarBackground,
            generateAvatarBackground,
            generateAvatarVisualPreview,
            updateAvatarConfig,
            loadProject,
            deleteProject,
            renameProject,
            setActivePanel,
            goBack,
            uploadSceneImage,
            uploadVideoAudio,
            uploadWatermarkImage,
            updateWatermarkSettings,
            removeWatermark,
            openDeployModal,
            closeDeployModal,
            openTutorialModal,
            closeTutorialModal,
            openDocsModal,
            closeDocsModal,
            cloneCommunityProject,
            openSubscriptionModal,
            closeSubscriptionModal,
            upgradePlan,
            redeemCoupon,
            autoGenerateVideo,
            selectBackground,
            downloadVideo
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = (): AppContextType => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};
