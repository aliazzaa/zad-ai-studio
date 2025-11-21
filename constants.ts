
import { ContentType, Achievement, SubscriptionPlan } from './types';

export const CONTENT_TYPE_DETAILS = {
  // --- Islamic Content ---
  [ContentType.HadithQudsi]: {
    labelKey: 'contentType.hadithQudsi.label',
    promptName: 'الأحاديث القدسية',
    scriptLabelKey: 'contentType.hadithQudsi.scriptLabel',
  },
  [ContentType.RiyadSalihin]: {
    labelKey: 'contentType.riyadSalihin.label',
    promptName: 'رياض الصالحين',
    scriptLabelKey: 'contentType.riyadSalihin.scriptLabel',
  },
  [ContentType.PropheticBiography]: {
    labelKey: 'contentType.propheticBiography.label',
    promptName: 'مواقف من السيرة النبوية العطرة',
    scriptLabelKey: 'contentType.propheticBiography.scriptLabel',
    supportsInteractive: true,
  },
  [ContentType.PropheticManners]: {
    labelKey: 'contentType.propheticManners.label',
    promptName: 'شمائل وأخلاق النبي محمد صلى الله عليه وسلم',
    scriptLabelKey: 'contentType.propheticManners.scriptLabel',
  },
  [ContentType.StoriesOfCompanions]: {
    labelKey: 'contentType.storiesOfCompanions.label',
    promptName: 'قصص الصحابة رضوان الله عليهم',
    scriptLabelKey: 'contentType.storiesOfCompanions.scriptLabel',
    supportsInteractive: true,
  },
  [ContentType.QuranicStories]: {
    labelKey: 'contentType.quranicStories.label',
    promptName: 'قصص القرآن الكريم (مثل قصة أصحاب الكهف، ذي القرنين، إلخ)',
    scriptLabelKey: 'contentType.quranicStories.scriptLabel',
    supportsInteractive: true,
  },
  [ContentType.QuranicParables]: {
    labelKey: 'contentType.quranicParables.label',
    promptName: 'الأمثال المضروبة في القرآن الكريم وشرحها',
    scriptLabelKey: 'contentType.quranicParables.scriptLabel',
  },
  [ContentType.StoriesOfTheProphets]: {
    labelKey: 'contentType.storiesOfTheProphets.label',
    promptName: 'قصص الأنبياء عليهم السلام كما وردت في القرآن الكريم والسنة النبوية',
    scriptLabelKey: 'contentType.storiesOfTheProphets.scriptLabel',
    supportsInteractive: true,
  },
  [ContentType.NamesOfAllah]: {
    labelKey: 'contentType.namesOfAllah.label',
    promptName: 'شرح اسم من أسماء الله الحسنى',
    scriptLabelKey: 'contentType.namesOfAllah.scriptLabel',
  },
  [ContentType.SpiritualExhortations]: {
    labelKey: 'contentType.spiritualExhortations.label',
    promptName: 'مواعظ إيمانية ورقائق، مثل الدعوة للصبر والاحتساب، والزهد في الدنيا، والتفكر في الموت',
    scriptLabelKey: 'contentType.spiritualExhortations.scriptLabel',
    supportsInteractive: true,
  },
  [ContentType.RespondToMisconceptions]: {
    labelKey: 'contentType.respondToMisconceptions.label',
    promptName: 'الرد على شبهة عقدية أو فكرية شائعة بأسلوب علمي ومبسط',
    scriptLabelKey: 'contentType.respondToMisconceptions.scriptLabel',
    supportsInteractive: true,
  },
  [ContentType.ComparativeReligion]: {
    labelKey: 'contentType.comparativeReligion.label',
    promptName: 'مقارنة الأديان للتعرف على دين آخر وبيان الفروقات مع الإسلام',
    scriptLabelKey: 'contentType.comparativeReligion.scriptLabel',
    supportsInteractive: true,
  },
  [ContentType.GlobalCultureBridge]: {
    labelKey: 'contentType.globalCultureBridge.label',
    promptName: 'جسور ثقافية: شرح القيم الإسلامية بلغة عالمية إنسانية مشتركة لغير المسلمين',
    scriptLabelKey: 'contentType.globalCultureBridge.scriptLabel',
    supportsInteractive: true,
  },

  // --- Greetings & Occasions ---
  [ContentType.GenerateDua]: {
    labelKey: 'contentType.generateDua.label',
    promptName: 'دعاء مأثور أو دعاء عام',
    scriptLabelKey: 'contentType.generateDua.scriptLabel',
  },
  [ContentType.OccasionGreetings]: {
    labelKey: 'contentType.occasionGreetings.label',
    promptName: 'رسالة تهنئة لمناسبة دينية أو اجتماعية (مثل: عيد الفطر، رمضان، زواج، مولود جديد)',
    scriptLabelKey: 'contentType.occasionGreetings.scriptLabel',
  },
  [ContentType.DailyGreetings]: {
    labelKey: 'contentType.dailyGreetings.label',
    promptName: 'رسالة تحية صباحية أو مسائية، أو رسالة ليوم الجمعة',
    scriptLabelKey: 'contentType.dailyGreetings.scriptLabel',
  },
  
  // --- Creator Studio ---
  [ContentType.ChildrenStories]: {
    labelKey: 'contentType.childrenStories.label',
    promptName: 'قصة إسلامية بسيطة وهادفة للأطفال',
    scriptLabelKey: 'contentType.childrenStories.scriptLabel',
    supportsInteractive: true,
  },
  [ContentType.YoutubeScript]: {
    labelKey: 'contentType.youtubeScript.label',
    promptName: 'أفكار وسيناريو فيديو يوتيوب. حدد مجال القناة (تقنية، سفر، طبخ) والموضوع، وسيقوم الذكاء الاصطناعي بكتابة سيناريو كامل للحلقة.',
    scriptLabelKey: 'contentType.youtubeScript.scriptLabel',
    supportsInteractive: true,
  },
  [ContentType.PodcastScript]: {
    labelKey: 'contentType.podcastScript.label',
    promptName: 'نص حلقة بودكاست. حدد موضوع الحلقة وأسلوبها (حواري، سردي)، وسيقوم الذكاء الاصطناعي بكتابة النص.',
    scriptLabelKey: 'contentType.podcastScript.scriptLabel',
  },
  [ContentType.BlogOutline]: {
    labelKey: 'contentType.blogOutline.label',
    promptName: 'هيكل مقال لمدونة. أدخل عنوان المقال، وسيقوم الذكاء الاصطناعي بإنشاء مخطط تفصيلي مع مقدمة ونقاط رئيسية وخاتمة.',
    scriptLabelKey: 'contentType.blogOutline.scriptLabel',
  },
  
  // --- Educational Platform ---
  [ContentType.ArabicForForeigners]: {
    labelKey: 'contentType.arabicForForeigners.label',
    promptName: 'درس بسيط وعملي لتعليم اللغة العربية لغير الناطقين بها (مثل: التحيات، في المطعم، في المطار)',
    scriptLabelKey: 'contentType.arabicForForeigners.scriptLabel',
    supportsInteractive: true,
  },
  [ContentType.TajweedRules]: {
    labelKey: 'contentType.tajweedRules.label',
    promptName: 'درس في أحكام التلاوة والتجويد (مثل: الإظهار، الإدغام، الإقلاب، إلخ)',
    scriptLabelKey: 'contentType.tajweedRules.scriptLabel',
    supportsInteractive: true,
  },
  [ContentType.StockMarketAnalysis]: {
    labelKey: 'contentType.stockMarketAnalysis.label',
    promptName: 'درس تعليمي مبسط عن البورصة والأسهم، يشرح مفهوماً أساسياً مثل (ما هو السهم، ما هو المؤشر، استراتيجيات الاستثمار البسيطة)',
    scriptLabelKey: 'contentType.stockMarketAnalysis.scriptLabel',
    supportsInteractive: true,
  },
  [ContentType.LessonPlan]: {
    labelKey: 'contentType.lessonPlan.label',
    promptName: 'خطة درس تعليمية متكاملة. حدد المادة والمرحلة الدراسية والموضوع، وسيقوم الذكاء الاصطناعي بإنشاء هيكل للدرس يشمل الأهداف والأنشطة والتقييم.',
    scriptLabelKey: 'contentType.lessonPlan.scriptLabel',
  },
  [ContentType.EducationalVideoScript]: {
    labelKey: 'contentType.educationalVideoScript.label',
    promptName: 'سيناريو فيديو تعليمي (شرح). حوّل أي موضوع معقد إلى سيناريو فيديو شرح مبسط وجذاب.',
    scriptLabelKey: 'contentType.educationalVideoScript.scriptLabel',
    supportsInteractive: true,
  },
  [ContentType.AppTutorial]: {
    labelKey: 'contentType.appTutorial.label',
    promptName: 'شرح البرنامج: سيناريو فيديو يشرح ميزات تطبيق زاد اليوم وكيفية استخدامه',
    scriptLabelKey: 'contentType.appTutorial.scriptLabel',
    supportsInteractive: true,
  },

  // --- Marketing Studio ---
  [ContentType.SocialMediaCampaign]: {
    labelKey: 'contentType.socialMediaCampaign.label',
    promptName: 'حملة تسويقية للسوشيال ميديا. اذكر الهدف من الحملة (إطلاق منتج، زيادة الوعي) والمنصة (انستغرام، تويتر)، لتوليد سلسلة من 3-5 منشورات مترابطة.',
    scriptLabelKey: 'contentType.socialMediaCampaign.scriptLabel',
  },
  [ContentType.AdCopy]: {
    labelKey: 'contentType.adCopy.label',
    promptName: 'نص إعلاني (Ad Copy). إنشاء نصوص إعلانية جذابة ومقنعة لمنصات مثل إعلانات جوجل وفيسبوك.',
    scriptLabelKey: 'contentType.adCopy.scriptLabel',
  },
  [ContentType.SeoArticle]: {
    labelKey: 'contentType.seoArticle.label',
    promptName: 'مقالة متوافقة مع SEO. اكتب مقالاً كاملاً أو مسودة غنية بالكلمات المفتاحية لتحسين الظهور في محركات البحث.',
    scriptLabelKey: 'contentType.seoArticle.scriptLabel',
  },
  [ContentType.EmailNewsletter]: {
    labelKey: 'contentType.emailNewsletter.label',
    promptName: 'نشرة بريدية (Email Newsletter). صياغة رسائل بريدية إخبارية أو ترويجية بأسلوب احترافي.',
    scriptLabelKey: 'contentType.emailNewsletter.scriptLabel',
  },
  [ContentType.ProductDescription]: {
    labelKey: 'contentType.productDescription.label',
    promptName: 'وصف منتج لمتجر إلكتروني. كتابة وصف جذاب ومفصل للمنتجات.',
    scriptLabelKey: 'contentType.productDescription.scriptLabel',
  },

  // --- Internal/Legacy ---
  [ContentType.QuranVerse]: {
    labelKey: 'contentType.quranVerse.label',
    promptName: 'آية من القرآن الكريم',
    scriptLabelKey: 'contentType.quranVerse.scriptLabel',
  },
  [ContentType.QuranicAudioStories]: {
    labelKey: 'contentType.quranicAudioStories.label',
    promptName: 'قصة من قصص القرآن الكريم بأسلوب سردي شيق ومناسب للإنتاج الصوتي',
    scriptLabelKey: 'contentType.quranicAudioStories.scriptLabel',
    supportsInteractive: true,
  },
  [ContentType.Adhkar]: {
    labelKey: 'contentType.adhkar.label',
    promptName: 'أذكار الصباح والمساء',
    scriptLabelKey: 'contentType.adhkar.scriptLabel',
  },
};

export const CONTENT_TYPE_GROUPS = [
  {
    titleKey: 'contentTypeGroups.islamic',
    types: [ContentType.GlobalCultureBridge, ContentType.PropheticBiography, ContentType.StoriesOfCompanions, ContentType.QuranicStories, ContentType.StoriesOfTheProphets, ContentType.HadithQudsi, ContentType.SpiritualExhortations, ContentType.PropheticManners, ContentType.RiyadSalihin, ContentType.NamesOfAllah],
  },
  {
    titleKey: 'contentTypeGroups.marketing',
    types: [ContentType.SocialMediaCampaign, ContentType.AdCopy, ContentType.SeoArticle, ContentType.EmailNewsletter, ContentType.ProductDescription],
  },
  {
    titleKey: 'contentTypeGroups.creator',
    types: [ContentType.YoutubeScript, ContentType.PodcastScript, ContentType.BlogOutline, ContentType.ChildrenStories],
  },
  {
    titleKey: 'contentTypeGroups.educational',
    types: [ContentType.AppTutorial, ContentType.LessonPlan, ContentType.EducationalVideoScript, ContentType.StockMarketAnalysis, ContentType.TajweedRules, ContentType.ArabicForForeigners, ContentType.RespondToMisconceptions, ContentType.ComparativeReligion],
  },
  {
    titleKey: 'contentTypeGroups.greetings',
    types: [ContentType.OccasionGreetings, ContentType.DailyGreetings, ContentType.GenerateDua],
  },
];


export const SUPPORTED_LANGUAGES: { [key: string]: string } = {
  en: 'English',
  ar: 'العربية',
  fr: 'Français',
  es: 'Español',
  de: 'Deutsch',
  id: 'Bahasa Indonesia',
  tr: 'Türkçe',
  fa: 'فارسی',
  ur: 'اردو',
  hi: 'हिन्दी'
};

export const EDUCATIONAL_LEVELS = [
  { value: 'kindergarten', labelKey: 'educationalLevels.kindergarten' },
  { value: 'elementary_school', labelKey: 'educationalLevels.elementary' },
  { value: 'middle_school', labelKey: 'educationalLevels.middle' },
  { value: 'high_school', labelKey: 'educationalLevels.high' },
  { value: 'university', labelKey: 'educationalLevels.university' },
];

export const VIDEO_ADVANCED_SETTINGS_OPTIONS = {
  resolutions: [
    { value: '720p', labelKey: 'videoOptions.resolutions.720p' },
    { value: '1080p', labelKey: 'videoOptions.resolutions.1080p' },
  ],
  aspectRatios: [
    { value: '9:16', labelKey: 'videoOptions.aspectRatios.portrait' },
    { value: '16:9', labelKey: 'videoOptions.aspectRatios.landscape' },
  ],
  frameRates: [
    { value: '24', labelKey: 'videoOptions.frameRates.cinematic' },
    { value: '30', labelKey: 'videoOptions.frameRates.standard' },
  ],
  transitions: [
    { value: 'fade', labelKey: 'videoOptions.transitions.fade' },
    { value: 'none', labelKey: 'videoOptions.transitions.none' },
  ],
};

export const TUTORIAL_SLIDES = [
  {
    titleKey: 'tutorialModal.slides.slide1.title',
    descriptionKey: 'tutorialModal.slides.slide1.description',
    icon: '👋',
  },
  {
    titleKey: 'tutorialModal.slides.slide2.title',
    descriptionKey: 'tutorialModal.slides.slide2.description',
    icon: '✨',
  },
  {
    titleKey: 'tutorialModal.slides.slide3.title',
    descriptionKey: 'tutorialModal.slides.slide3.description',
    icon: '✍️',
  },
  {
    titleKey: 'tutorialModal.slides.slide4.title',
    descriptionKey: 'tutorialModal.slides.slide4.description',
    icon: '🚀',
  },
  {
    titleKey: 'tutorialModal.slides.slide5.title',
    descriptionKey: 'tutorialModal.slides.slide5.description',
    icon: '🎨',
  },
  {
    titleKey: 'tutorialModal.slides.slide6.title',
    descriptionKey: 'tutorialModal.slides.slide6.description',
    icon: '🎬',
  },
  {
    titleKey: 'tutorialModal.slides.slide7.title',
    descriptionKey: 'tutorialModal.slides.slide7.description',
    icon: '📚',
  },
  {
    titleKey: 'tutorialModal.slides.slide8.title',
    descriptionKey: 'tutorialModal.slides.slide8.description',
    icon: '🛠️',
  },
];

// --- Gamification ---
export const ACHIEVEMENTS: Achievement[] = [
    {
        id: 'beginner',
        titleKey: 'achievements.beginner.title',
        descriptionKey: 'achievements.beginner.desc',
        icon: '🌱',
        unlocked: true // Default
    },
    {
        id: 'creator_lvl1',
        titleKey: 'achievements.creator_lvl1.title',
        descriptionKey: 'achievements.creator_lvl1.desc',
        icon: '🖊️',
        unlocked: false
    },
    {
        id: 'global_voice',
        titleKey: 'achievements.global_voice.title',
        descriptionKey: 'achievements.global_voice.desc',
        icon: '🌏',
        unlocked: false
    },
     {
        id: 'peace_builder',
        titleKey: 'achievements.peace_builder.title',
        descriptionKey: 'achievements.peace_builder.desc',
        icon: '🕊️',
        unlocked: false
    }
];

export const GLOBAL_TRENDS = [
    { topic: "Climate Justice in Islam", lang: "En" },
    { topic: "Mental Health & Sabr", lang: "En" },
    { topic: "Zakat & Economic Equality", lang: "Ar/En" },
    { topic: "Cleanliness (Taharah) & Environment", lang: "Global" },
    { topic: "Islamic Art & Modern Design", lang: "Global" }
];

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
      id: 'free',
      titleKey: 'plans.free.title',
      priceKey: 'plans.free.price',
      descriptionKey: 'plans.free.description',
      featuresKey: ['plans.free.f1', 'plans.free.f2', 'plans.free.f3'],
      buttonKey: 'plans.free.button',
      dailyCredits: 5
  },
  {
      id: 'pro',
      titleKey: 'plans.pro.title',
      priceKey: 'plans.pro.price',
      descriptionKey: 'plans.pro.description',
      featuresKey: ['plans.pro.f1', 'plans.pro.f2', 'plans.pro.f3', 'plans.pro.f4'],
      isPopular: true,
      buttonKey: 'plans.pro.button',
      dailyCredits: 100
  },
  {
      id: 'business',
      titleKey: 'plans.business.title',
      priceKey: 'plans.business.price',
      descriptionKey: 'plans.business.description',
      featuresKey: ['plans.business.f1', 'plans.business.f2', 'plans.business.f3', 'plans.business.f4'],
      buttonKey: 'plans.business.button',
      dailyCredits: 1000
  }
];
