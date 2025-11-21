
import React from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { PanelMode, ContentType } from '../../types';
import { GLOBAL_TRENDS } from '../../constants';

interface DashboardSection {
    id: PanelMode;
    titleKey: string;
    descriptionKey: string;
    buttonKey: string;
    icon: string;
    isBeta?: boolean;
    isNew?: boolean;
}

// Smart Suggestion Types
type SuggestionType = 'morning' | 'friday' | 'evening';

interface SuggestionConfig {
    type: SuggestionType;
    titleKey: string;
    descKey: string;
    buttonKey: string;
    icon: string;
    bgGradient: string;
    contentType: ContentType;
    prompt?: string;
}


const Dashboard: React.FC = () => {
    const { setActivePanel, user, userStats, openSubscriptionModal, generateContent } = useAppContext();
    const { t } = useLanguage();

    // Logic for Time-Based Suggestion
    const getSuggestion = (): SuggestionConfig | null => {
        const now = new Date();
        const hour = now.getHours();
        const day = now.getDay(); // 0 = Sunday, 5 = Friday

        if (day === 5) { // Friday specific
            return {
                type: 'friday',
                titleKey: 'dashboard.smartSuggestion.friday.title',
                descKey: 'dashboard.smartSuggestion.friday.desc',
                buttonKey: 'dashboard.smartSuggestion.friday.button',
                icon: '🕌',
                bgGradient: 'from-emerald-600 to-teal-800',
                contentType: ContentType.DailyGreetings,
                prompt: 'رسالة تهنئة وتذكير بفضائل يوم الجمعة وسورة الكهف'
            };
        }
        
        if (hour >= 5 && hour < 12) { // Morning (5 AM - 12 PM)
            return {
                type: 'morning',
                titleKey: 'dashboard.smartSuggestion.morning.title',
                descKey: 'dashboard.smartSuggestion.morning.desc',
                buttonKey: 'dashboard.smartSuggestion.morning.button',
                icon: '☀️',
                bgGradient: 'from-orange-400 to-yellow-500',
                contentType: ContentType.DailyGreetings, // Using DailyGreetings as a proxy for Adhkar for general generation
                prompt: 'أذكار الصباح وتأملات في بداية اليوم'
            };
        }

        if (hour >= 20 || hour < 5) { // Evening (8 PM - 5 AM)
            return {
                type: 'evening',
                titleKey: 'dashboard.smartSuggestion.evening.title',
                descKey: 'dashboard.smartSuggestion.evening.desc',
                buttonKey: 'dashboard.smartSuggestion.evening.button',
                icon: '🌙',
                bgGradient: 'from-indigo-800 to-purple-900',
                contentType: ContentType.SpiritualExhortations,
                prompt: 'قصة قصيرة أو موعظة هادئة قبل النوم (وتر)'
            };
        }

        return null;
    };

    const activeSuggestion = getSuggestion();

    const handleSuggestionClick = () => {
        if (activeSuggestion) {
            generateContent(activeSuggestion.contentType, activeSuggestion.prompt);
            setActivePanel('generator');
        }
    };


    const sections: DashboardSection[] = [
        {
            id: 'generator',
            titleKey: 'dashboard.creatorStudio.title',
            descriptionKey: 'dashboard.creatorStudio.description',
            buttonKey: 'dashboard.creatorStudio.button',
            icon: '✨',
        },
        {
            id: 'studio',
            titleKey: 'dashboard.myProjects.title',
            descriptionKey: 'dashboard.myProjects.description',
            buttonKey: 'dashboard.myProjects.button',
            icon: '📁',
        },
         {
            id: 'community',
            titleKey: 'dashboard.community.title',
            descriptionKey: 'dashboard.community.description',
            buttonKey: 'dashboard.community.button',
            icon: '🌍',
            isNew: true,
        },
        {
            id: 'scheduler',
            titleKey: 'sidePanel.scheduler',
            descriptionKey: 'dashboard.scheduler.description',
            buttonKey: 'dashboard.scheduler.button',
            icon: '🗓️',
        },
        {
            id: 'live',
            titleKey: 'sidePanel.liveStream',
            descriptionKey: 'dashboard.liveStream.description',
            buttonKey: 'dashboard.liveStream.button',
            icon: '🔴',
            isBeta: true,
        },
    ];

    const progressPercent = Math.min(100, (userStats.xp / userStats.nextLevelXp) * 100);
    
    // Credit Calculation
    const credits = user?.credits || 0;
    const maxCredits = user?.maxCredits || 5; // Default for guest
    const creditPercent = Math.min(100, (credits / maxCredits) * 100);
    const isLowCredits = creditPercent < 20;

    return (
        <div className="p-4 space-y-8 animate-fade-in">
             {/* Global Pulse Ticker */}
             <div className="glass-panel rounded-full px-6 py-2 flex items-center gap-4 overflow-hidden border border-white/20 bg-black/80 text-white shadow-xl">
                <span className="font-bold text-teal-400 whitespace-nowrap flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                    GLOBAL PULSE:
                </span>
                <div className="flex items-center gap-8 animate-marquee whitespace-nowrap">
                    {GLOBAL_TRENDS.map((trend, i) => (
                        <span key={i} className="text-sm opacity-80 flex items-center gap-2">
                            {trend.topic} <span className="text-xs bg-white/20 px-1 rounded">{trend.lang}</span>
                        </span>
                    ))}
                     {/* Duplicate for loop effect */}
                     {GLOBAL_TRENDS.map((trend, i) => (
                        <span key={`dup-${i}`} className="text-sm opacity-80 flex items-center gap-2">
                            {trend.topic} <span className="text-xs bg-white/20 px-1 rounded">{trend.lang}</span>
                        </span>
                    ))}
                </div>
            </div>
            
            {/* Smart Suggestion Banner */}
            {activeSuggestion && (
                <div className={`relative overflow-hidden rounded-2xl shadow-2xl bg-gradient-to-r ${activeSuggestion.bgGradient} text-white p-6 md:p-8 transform transition-all hover:scale-[1.01]`}>
                    <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-white opacity-10 rounded-full blur-3xl"></div>
                    
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-start">
                        <div className="flex items-center gap-4">
                            <div className="text-5xl md:text-6xl animate-bounce-slow">{activeSuggestion.icon}</div>
                            <div>
                                <h2 className="text-2xl md:text-3xl font-bold mb-2 text-white drop-shadow-md">{t(activeSuggestion.titleKey)}</h2>
                                <p className="text-white/90 text-lg font-medium">{t(activeSuggestion.descKey)}</p>
                            </div>
                        </div>
                        <button 
                            onClick={handleSuggestionClick}
                            className="px-8 py-3 bg-white text-gray-900 font-bold rounded-full shadow-lg hover:bg-gray-100 hover:scale-105 transition-all active:scale-95 whitespace-nowrap"
                        >
                            {t(activeSuggestion.buttonKey)}
                        </button>
                    </div>
                </div>
            )}

            <h2 className="text-3xl font-bold text-center text-teal-800 md:text-4xl dark:text-teal-300">
                {t('dashboard.title')}
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* User Profile & Gamification Card */}
                <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-white/30 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6 bg-gradient-to-r from-teal-900/90 to-cyan-900/90 text-white">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-yellow-400 to-orange-500 flex items-center justify-center text-2xl font-bold shadow-lg border-2 border-white">
                            {userStats.level}
                        </div>
                        <div>
                            <h3 className="text-xl font-bold">{user && user.email !== 'guest@zad.app' ? user.email.split('@')[0] : t('profile.guest')}</h3>
                            <p className="text-teal-200 text-sm">{t('profile.levelLabel', { level: userStats.level })}</p>
                        </div>
                    </div>
                    
                    <div className="flex-grow w-full md:w-auto max-w-md">
                        <div className="flex justify-between text-xs mb-1 opacity-80">
                            <span>XP: {userStats.xp}</span>
                            <span>Next: {userStats.nextLevelXp}</span>
                        </div>
                        <div className="w-full h-3 bg-black/30 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        {userStats.achievements.map(ach => (
                            <div 
                                key={ach.id} 
                                className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all border-2 ${ach.unlocked ? 'bg-white/20 border-yellow-400 text-white' : 'bg-black/20 border-transparent text-white/20 grayscale'}`}
                                title={ach.unlocked ? t(ach.descriptionKey) : t('profile.locked')}
                            >
                                {ach.icon}
                            </div>
                        ))}
                    </div>
                </div>
                
                {/* Usage & Credits Card */}
                 <div className="glass-panel p-6 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-lg bg-white dark:bg-slate-800 flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="font-bold text-gray-700 dark:text-slate-200">{t('dashboard.credits.title')}</h3>
                        <span className={`px-2 py-1 text-xs rounded-md font-bold ${user?.plan === 'free' ? 'bg-gray-200 text-gray-600' : 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white'}`}>
                            {user?.plan === 'free' ? 'FREE' : 'PRO'}
                        </span>
                    </div>
                    
                    <div className="flex items-center gap-4">
                         <div className="relative w-16 h-16 flex-shrink-0">
                            <svg className="w-full h-full" viewBox="0 0 36 36">
                                <path className="text-gray-200 dark:text-slate-700" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                                <path className={`${isLowCredits ? 'text-red-500' : 'text-teal-500'} transition-all duration-500`} strokeDasharray={`${creditPercent}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center font-bold text-sm text-gray-700 dark:text-white">
                                {credits}
                            </div>
                        </div>
                        <div className="flex-grow">
                            <p className="text-sm text-gray-500 dark:text-slate-400">{t('dashboard.credits.remaining', { max: maxCredits })}</p>
                             <button onClick={openSubscriptionModal} className="mt-2 w-full py-1.5 text-xs font-bold text-white bg-teal-600 rounded hover:bg-teal-700">
                                {t('dashboard.credits.refill')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>


            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {sections.map((section) => (
                    <div 
                        key={section.id}
                        title={t('dashboard.cardTooltip', { section: t(section.titleKey) })}
                        className="flex flex-col p-6 text-center transition-all duration-300 transform bg-white border border-gray-200 rounded-lg shadow-lg cursor-pointer group hover:shadow-2xl hover:-translate-y-2 dark:bg-slate-800 dark:border-slate-700"
                        onClick={() => setActivePanel(section.id)}
                    >
                        <div className="mx-auto text-5xl">{section.icon}</div>
                        <div className="flex items-center justify-center gap-2 mt-4">
                            <h3 className="text-xl font-bold text-gray-800 dark:text-slate-200">{t(section.titleKey)}</h3>
                            {section.isBeta && <span className="px-2 py-0.5 text-xs font-semibold text-orange-800 bg-orange-200 rounded-full dark:bg-orange-900 dark:text-orange-300">{t('dashboard.liveStream.beta')}</span>}
                            {section.isNew && <span className="px-2 py-0.5 text-xs font-semibold text-purple-800 bg-purple-200 rounded-full dark:bg-purple-900 dark:text-purple-300">{t('dashboard.community.new')}</span>}
                        </div>
                        <p className="flex-grow mt-2 text-gray-600 dark:text-slate-400">{t(section.descriptionKey)}</p>
                        <button
                            className="w-full px-6 py-3 mt-6 font-bold text-white transition-transform duration-200 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-lg shadow-lg pointer-events-none group-hover:scale-105"
                        >
                            {t(section.buttonKey)}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
