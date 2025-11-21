
import React from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { VideoStyle } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import SlideshowWorkflow from './SlideshowWorkflow';
import AvatarWorkflow from './AvatarWorkflow';

const PublishingPanel: React.FC = () => {
    const { 
        generatedContent, 
        videoUrl,
        videoStyle,
        setVideoStyle,
    } = useAppContext();
    const { t } = useLanguage();


    if (!generatedContent) {
        return (
             <div className="flex flex-col items-center justify-center h-full p-6 text-center bg-white border border-gray-200 rounded-lg shadow-md dark:bg-slate-800 dark:border-slate-700">
                <span className="text-5xl" role="img" aria-label={t('publishingPanel.placeholderIconLabel')}>🎬</span>
                <h2 className="mt-4 text-2xl font-bold text-teal-800 dark:text-teal-300">{t('publishingPanel.title')}</h2>
                <p className="mt-2 text-gray-500 dark:text-slate-400">
                    {t('publishingPanel.placeholderTitle')}
                </p>
            </div>
        );
    }
    
    // The VideoPlayer is now rendered in UnifiedDashboard, so we don't need a loading/player state here.
    // This panel will always show the controls.

    const VideoStyleSelector = () => (
        <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50">
            <h4 className="font-bold text-center text-teal-800 dark:text-teal-300">{t('publishingPanel.videoStyle.title')}</h4>
            <div className="flex justify-center gap-4 mt-3">
                {(['slideshow', 'avatar'] as VideoStyle[]).map(style => (
                    <button
                        key={style}
                        onClick={() => setVideoStyle(style)}
                        className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 ${videoStyle === style ? 'bg-teal-600 text-white shadow' : 'bg-white text-teal-700 hover:bg-teal-50 dark:bg-slate-700 dark:text-teal-300 dark:hover:bg-slate-600'}`}
                    >
                        {t(`publishingPanel.videoStyle.${style}`)}
                    </button>
                ))}
            </div>
        </div>
    );


    return (
        <div className="p-4 bg-white rounded-lg shadow-md space-y-6 dark:bg-slate-800 dark:border dark:border-slate-700">
            <h3 className="text-xl font-bold text-center text-teal-800 dark:text-teal-300">{t('publishingPanel.title')}</h3>
            
            <VideoStyleSelector />
            
            {videoStyle === 'slideshow' ? <SlideshowWorkflow /> : <AvatarWorkflow />}

        </div>
    );
};

export default PublishingPanel;