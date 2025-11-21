
import React from 'react';
import SidePanel from './SidePanel';
import ContentEditor from './ContentEditor';
import PublishingPanel from './PublishingPanel';
import { useAppContext } from '../../contexts/AppContext';
import VideoPlayer from '../VideoPlayer';
import { useLanguage } from '../../contexts/LanguageContext';

const UnifiedDashboard: React.FC = () => {
    const { videoUrl, goBack, canGoBack } = useAppContext();
    const { t, language } = useLanguage();

    // Render the main creation workflow with a new hierarchical layout
    return (
        <div className="flex flex-col gap-6 lg:gap-8 pb-12">
            {canGoBack && (
                <button
                    onClick={goBack}
                    className="flex items-center self-start gap-2 px-6 py-2.5 font-bold text-teal-800 transition-all duration-300 bg-white/90 rounded-full shadow-md backdrop-blur-xl hover:bg-white hover:shadow-lg hover:scale-105 dark:bg-slate-800/90 dark:text-teal-300 dark:hover:bg-slate-800"
                    title={t('global.backToDashboard')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className={`w-5 h-5 ${language === 'ar' ? 'transform rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>{t('global.backToDashboard')}</span>
                </button>
            )}

            {/* Top Panel: Sources & Libraries */}
            <div className="w-full transform transition-all duration-500 hover:scale-[1.005]">
                <SidePanel />
            </div>
            
            {/* Bottom Panels: Editor and Publishing */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
                {/* Main Column: Content Editor */}
                <section className="lg:col-span-7 xl:col-span-8">
                    <ContentEditor />
                </section>

                {/* Right Column: Video & Publishing Tools */}
                <aside className="lg:col-span-5 xl:col-span-4">
                    <div className="sticky top-24">
                        <PublishingPanel />
                    </div>
                </aside>
            </div>

            {/* Render Video Player at the bottom if a video has been generated */}
            {videoUrl && (
                <div className="mt-8 p-8 glass-panel rounded-2xl shadow-2xl animate-fade-in border border-white/30">
                    <VideoPlayer videoUrl={videoUrl} />
                </div>
            )}
        </div>
    );
};
export default UnifiedDashboard;
