
export enum ContentType {
  // --- Islamic Content ---
  HadithQudsi = 'hadith_qudsi',
  RiyadSalihin = 'riyad_salihin',
  PropheticBiography = 'prophetic_biography',
  PropheticManners = 'prophetic_manners',
  StoriesOfCompanions = 'stories_of_companions',
  QuranicStories = 'quranic_stories',
  QuranicParables = 'quranic_parables',
  StoriesOfTheProphets = 'stories_of_the_prophets',
  NamesOfAllah = 'names_of_allah',
  SpiritualExhortations = 'spiritual_exhortations',
  RespondToMisconceptions = 'respond_to_misconceptions',
  ComparativeReligion = 'comparative_religion',
  GlobalCultureBridge = 'global_culture_bridge', // NEW: Global Outreach
  
  // --- Greetings & Occasions ---
  GenerateDua = 'generate_dua',
  OccasionGreetings = 'occasion_greetings',
  DailyGreetings = 'daily_greetings',

  // --- Creator Studio ---
  ChildrenStories = 'children_stories',
  YoutubeScript = 'youtube_script',
  PodcastScript = 'podcast_script',
  BlogOutline = 'blog_outline',
  
  // --- Educational Platform ---
  ArabicForForeigners = 'arabic_for_foreigners',
  TajweedRules = 'tajweed_rules',
  StockMarketAnalysis = 'stock_market_analysis',
  LessonPlan = 'lesson_plan',
  EducationalVideoScript = 'educational_video_script',
  AppTutorial = 'app_tutorial', // NEW: Generate App Tutorial

  // --- Marketing Studio ---
  SocialMediaCampaign = 'social_media_campaign',
  AdCopy = 'ad_copy',
  SeoArticle = 'seo_article',
  EmailNewsletter = 'email_newsletter',
  ProductDescription = 'product_description',
  
  // Internal Types
  QuranVerse = 'quran_verse', // For library selection
  QuranicAudioStories = 'quranic_audio_stories', // Kept for legacy/specific functionality
  Adhkar = 'adhkar', // Kept for legacy/specific functionality
}

export type PanelMode = 'generator' | 'hadithLibrary' | 'quranLibrary' | 'backgroundLibrary' | 'scheduler' | 'live' | 'studio' | 'dashboard' | 'community' | 'marketplace';
export type Theme = 'light' | 'dark';
export type VideoStyle = 'slideshow' | 'avatar';
export type StreamingPlatform = 'youtube' | 'facebook' | 'tiktok' | 'twitter' | 'instagram' | 'generic';

export type PlanTier = 'free' | 'pro' | 'business';

export interface User {
  email: string;
  plan: PlanTier;
  credits: number;     // Current remaining credits
  maxCredits: number;  // Daily limit based on plan
}

export interface SubscriptionPlan {
    id: PlanTier;
    titleKey: string;
    priceKey: string;
    descriptionKey: string;
    featuresKey: string[];
    isPopular?: boolean;
    buttonKey: string;
    dailyCredits: number;
}

export interface Achievement {
    id: string;
    titleKey: string;
    icon: string;
    descriptionKey: string;
    unlocked: boolean;
}

export interface UserStats {
    totalGenerations: number;
    level: number;
    xp: number;
    nextLevelXp: number;
    achievements: Achievement[];
}

export interface Scene {
  id: string;
  text: string;
  visualSuggestion: string;
  imageUrl?: string;
}

export interface GeneratedContent {
  title: string;
  scenes: Scene[];
  youtubeTips: string;
  hashtags: string[];
}

export interface WatermarkSettings {
    position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    opacity: number; // 0 to 1
    size: number; // 0.1 (small), 0.15 (medium), 0.2 (large) as a percentage of canvas width
}

export interface AvatarConfig {
    scale: number; // 0.1 to 2.0
    x: number; // -100 to 100 (percentage offset from center)
    y: number; // -100 to 100 (percentage offset from center)
}

export interface Project {
    id: string; // Unique ID, can be a timestamp
    title: string; // User-editable title
    createdAt: string; // ISO string
    contentType: ContentType;
    generatedContent: GeneratedContent;
    translatedContent: GeneratedContent | null;
    videoAudioUrl: string | null;
    backgroundMusicUrl: string | null;
    videoUrl: string | null;
    quizQuestion: QuizQuestion | null;
    videoStyle: VideoStyle;
    avatarImageUrl: string | null;
    avatarBackgroundUrl: string | null;
    avatarCombinedPreviewUrl: string | null;
    avatarConfig: AvatarConfig; // New field
    watermarkImageUrl: string | null;
    watermarkSettings: WatermarkSettings;
}

export interface CommunityProject {
    id: string;
    title: string;
    authorName: string;
    likes: number;
    views: number;
    contentType: ContentType;
    thumbnailUrl?: string;
    description: string;
    generatedContent: GeneratedContent; // The template content to clone
}

export interface BackgroundAsset {
    id: string;
    url: string;
    titleKey: string;
    category: 'geometric' | 'architecture' | 'calligraphy' | 'nature';
}

export type MarketplaceCategory = 'template' | 'background' | 'avatar' | 'audio';

export interface MarketplaceItem {
    id: string;
    titleKey: string;
    descriptionKey: string;
    category: MarketplaceCategory;
    price: number | 'free'; // 0 or 'free' for free items
    isPro: boolean;
    thumbnailUrl: string;
    rating: number;
    downloads: number;
}


export interface ScheduledJob {
    id: string;
    contentType: ContentType;
    scheduledAt: string; // ISO string
    status: 'Scheduled' | 'Completed' | 'Failed';
    generatedContent?: GeneratedContent;
    error?: string;
}

export interface LibraryHadith {
  type: ContentType;
  title: string;
  script: string;
  explanation: string;
}

export interface Surah {
  number: number;
  name: string;
  englishName: string;
  numberOfAyahs: number;
}

export interface Ayah {
  number: number;
  text: string;
  audio: string;
  numberInSurah: number;
}

export interface VideoSettings {
  resolution: string;
  aspectRatio: string;
  frameRate: string;
  transition: string;
  format?: 'webm' | 'mp4';
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
}

export interface AppContextType {
    // State
    contentType: ContentType | null;
    generatedContent: GeneratedContent | null;
    translatedContent: GeneratedContent | null;
    audioUrl: string | null; // For dedicated audio stories
    videoAudioUrl: string | null; // For video voiceover
    backgroundMusicUrl: string | null;
    videoUrl: string | null;
    isVideoPreview: boolean;
    videoGenerationProgress: number;
    scheduledJobs: ScheduledJob[];
    isLoading: boolean;
    isTranslating: boolean;
    isGeneratingAudio: boolean; // For dedicated audio stories
    isGeneratingVideoAudio: boolean; // For video voiceover
    isGeneratingBackgroundMusic: boolean;
    isPreviewLoading: boolean;
    isGeneratingVideo: boolean;
    loadingMessage: string;
    error: string | null; // This will now be a translation key
    isScheduleModalOpen: boolean;
    contentTypeToSchedule: ContentType | null;
    isLoginModalOpen: boolean;
    user: User | null;
    userStats: UserStats; // NEW: Gamification Stats
    quizQuestion: QuizQuestion | null;
    isGeneratingQuiz: boolean;
    isWelcomeScreenVisible: boolean;
    theme: Theme;
    videoStyle: VideoStyle;
    avatarImageUrl: string | null;
    isGeneratingAvatar: boolean;
    isRemovingAvatarBackground: boolean;
    avatarBackgroundUrl: string | null;
    isGeneratingAvatarBackground: boolean;
    avatarCombinedPreviewUrl: string | null;
    isGeneratingAvatarPreview: boolean;
    avatarConfig: AvatarConfig;
    watermarkImageUrl: string | null;
    watermarkSettings: WatermarkSettings;

    // Actions
    generateContent: (type: ContentType, customPrompt?: string) => Promise<void>;
    selectHadith: (hadith: LibraryHadith) => Promise<void>;
    selectVerses: (verses: Ayah[], surah: Surah) => Promise<void>;
    translateContent: (language: string) => Promise<void>;
    generateAllSceneImages: (aspectRatio: string, customPrompts: { [sceneId: string]: string }) => Promise<GeneratedContent | undefined>;
    generateSceneImage: (sceneId: string, aspectRatio: string, customPrompt: string) => Promise<void>;
    generateAudio: () => Promise<void>; // For dedicated audio stories
    generateVideoAudio: (text: string) => Promise<string | undefined>; // For video voiceover
    generateBackgroundMusic: (prompt: string) => Promise<void>;
    combineImageAndAudio: (videoSettings: VideoSettings, isPreview: boolean, overrideAudioUrl?: string, overrideContent?: GeneratedContent) => Promise<void>;
    generateSilentPreview: (videoSettings: VideoSettings) => Promise<void>;
    clearVideoPreview: () => void;
    updateGeneratedContent: (newContent: Partial<GeneratedContent>) => void;
    clearContent: () => void;
    generateQuiz: () => Promise<void>;
    setVideoStyle: (style: VideoStyle) => void;
    generateAvatar: (prompt: string) => Promise<void>;
    uploadAvatarImage: (file: File) => void;
    removeAvatarBackground: () => Promise<void>;
    generateAvatarBackground: (aspectRatio: string, customPrompt?: string) => Promise<void>;
    generateAvatarVisualPreview: (videoSettings: VideoSettings) => Promise<void>;
    updateAvatarConfig: (config: Partial<AvatarConfig>) => void;
    autoGenerateVideo: () => Promise<void>;
    downloadVideo: (videoSettings: VideoSettings) => Promise<void>;
    
    // Upload Actions
    uploadSceneImage: (sceneId: string, file: File) => void;
    uploadAvatarBackground: (file: File) => void;
    uploadVideoAudio: (file: File) => void;
    uploadWatermarkImage: (file: File) => void;
    removeWatermark: () => void;

    // Watermark Actions
    updateWatermarkSettings: (settings: Partial<WatermarkSettings>) => void;

    // Avatar Library
    avatarLibrary: string[];
    saveAvatarToLibrary: () => void;
    deleteAvatarFromLibrary: (imageUrl: string) => void;
    selectAvatarFromLibrary: (imageUrl: string) => void;
    selectBackground: (url: string) => void; // NEW: Select background from library

    // Project Management
    projects: Project[];
    activeProjectId: string | null;
    loadProject: (projectId: string) => void;
    deleteProject: (projectId: string) => void;
    renameProject: (projectId: string, newTitle: string) => void;
    cloneCommunityProject: (project: CommunityProject) => void;
    
    // Scheduler Actions
    openScheduleModal: (contentType: ContentType) => void;
    closeScheduleModal: () => void;
    scheduleJob: (contentType: ContentType, scheduledAt: string) => void;
    deleteJob: (jobId: string) => void;
    viewJobContent: (job: ScheduledJob) => void;
    
    // Panel mode for full-screen components
    activePanel: PanelMode;
    setActivePanel: (panel: PanelMode) => void;
    goBack: () => void;
    canGoBack: boolean;
    
    // Auth Actions
    openLoginModal: () => void;
    closeLoginModal: () => void;
    login: (email: string) => void;
    logout: () => void;

    // Subscription Actions
    isSubscriptionModalOpen: boolean;
    openSubscriptionModal: () => void;
    closeSubscriptionModal: () => void;
    upgradePlan: (planId: PlanTier) => void;
    redeemCoupon: (code: string) => boolean;

    // PWA Install Actions
    installPromptEvent: Event | null;
    triggerInstallPrompt: () => void;
    isInstallGuideOpen: boolean; // NEW
    openInstallGuide: () => void; // NEW
    closeInstallGuide: () => void; // NEW

    // Feedback Actions
    isFeedbackModalOpen: boolean;
    openFeedbackModal: () => void;
    closeFeedbackModal: () => void;
    submitFeedback: (feedback: string) => Promise<string>;

    // Deploy Actions
    isDeployModalOpen: boolean;
    openDeployModal: () => void;
    closeDeployModal: () => void;

    // Tutorial Actions
    isTutorialModalOpen: boolean;
    openTutorialModal: () => void;
    closeTutorialModal: () => void;
    
    // Documentation Actions
    isDocsModalOpen: boolean;
    openDocsModal: () => void;
    closeDocsModal: () => void;

    // Welcome Screen Actions
    hideWelcomeScreen: () => void;

    // Theme Actions
    toggleTheme: () => void;
}


// --- YouTube Live Stream Types ---
export interface LiveBroadcast {
  id: string;
  snippet: {
    title: string;
    description: string;
    publishedAt: string;
    scheduledStartTime: string;
  };
  status: {
    lifeCycleStatus: 'created' | 'ready' | 'testing' | 'live' | 'complete' | 'revoked';
    privacyStatus: 'public' | 'private' | 'unlisted';
    recordingStatus: string;
  };
  contentDetails: {
    boundStreamId: string;
    monitorStream: {
      embedHtml: string;
    };
  };
}

export interface LiveStream {
  id: string;
  snippet: {
    title: string;
  };
  cdn: {
    ingestionInfo: {
      streamName: string;
      ingestionAddress: string;
    };
  };
}

export interface StreamingPlatformCredentials {
    platform: StreamingPlatform;
    serverUrl: string;
    streamKey: string;
}


// Global window interface
declare global {
  interface Window {
    // Google API client for YouTube
    gapi: any;
    // Google Identity Services for OAuth2
    google: any;
  }
}
