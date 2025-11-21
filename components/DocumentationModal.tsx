
import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { useLanguage } from '../contexts/LanguageContext';
import TabButton from './TabButton';
import { ContentType } from '../types';

const DocumentationModal: React.FC = () => {
    const { isDocsModalOpen, closeDocsModal, generateContent } = useAppContext();
    const { t, language } = useLanguage();
    const [activeTab, setActiveTab] = useState<'guide' | 'technical' | 'troubleshoot' | 'deployment'>('guide');

    if (!isDocsModalOpen) return null;

    const handleGenerateTutorial = () => {
        closeDocsModal();
        generateContent(ContentType.AppTutorial);
    };

    const renderGuide = () => (
        <div className="space-y-8">
            {/* Hero Section for Tutorial Generation */}
            <div className="relative overflow-hidden rounded-2xl shadow-2xl group">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 opacity-90"></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
                <div className="relative p-8 text-center text-white flex flex-col items-center justify-center space-y-4">
                    <div className="p-3 bg-white/20 backdrop-blur-md rounded-full shadow-inner animate-bounce">
                        <span className="text-4xl">🎬</span>
                    </div>
                    <h4 className="text-2xl font-extrabold tracking-tight md:text-3xl">
                        {t('docs.guide.tutorialVideo.title')}
                    </h4>
                    <p className="max-w-lg mx-auto text-indigo-100 text-lg font-medium">
                        {t('docs.guide.tutorialVideo.desc')}
                    </p>
                    <button 
                        onClick={handleGenerateTutorial}
                        className="mt-4 px-8 py-3 bg-white text-indigo-700 font-black text-lg rounded-full shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-white/50 flex items-center gap-2"
                    >
                        <span>✨</span> {t('docs.guide.tutorialVideo.button')}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 border border-teal-100 rounded-2xl bg-teal-50/50 dark:bg-teal-900/10 dark:border-teal-800/30">
                    <h3 className="text-lg font-bold text-teal-800 dark:text-teal-300 mb-2 flex items-center gap-2">
                        <span className="bg-teal-200 text-teal-800 rounded-full w-6 h-6 flex items-center justify-center text-xs">1</span>
                        {t('docs.guide.generator.title')}
                    </h3>
                    <p className="text-gray-600 dark:text-slate-300 text-sm leading-relaxed">{t('docs.guide.generator.desc')}</p>
                </div>
                <div className="p-5 border border-purple-100 rounded-2xl bg-purple-50/50 dark:bg-purple-900/10 dark:border-purple-800/30">
                    <h3 className="text-lg font-bold text-purple-800 dark:text-purple-300 mb-2 flex items-center gap-2">
                        <span className="bg-purple-200 text-purple-800 rounded-full w-6 h-6 flex items-center justify-center text-xs">2</span>
                        {t('docs.guide.editor.title')}
                    </h3>
                    <p className="text-gray-600 dark:text-slate-300 text-sm leading-relaxed">{t('docs.guide.editor.desc')}</p>
                </div>
                <div className="p-5 border border-blue-100 rounded-2xl bg-blue-50/50 dark:bg-blue-900/10 dark:border-blue-800/30">
                    <h3 className="text-lg font-bold text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-2">
                        <span className="bg-blue-200 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-xs">3</span>
                        {t('docs.guide.video.title')}
                    </h3>
                    <p className="text-gray-600 dark:text-slate-300 text-sm leading-relaxed">{t('docs.guide.video.desc')}</p>
                </div>
                <div className="p-5 border border-red-100 rounded-2xl bg-red-50/50 dark:bg-red-900/10 dark:border-red-800/30">
                    <h3 className="text-lg font-bold text-red-800 dark:text-red-300 mb-2 flex items-center gap-2">
                         <span className="bg-red-200 text-red-800 rounded-full w-6 h-6 flex items-center justify-center text-xs">4</span>
                        {t('docs.guide.live.title')}
                    </h3>
                    <p className="text-gray-600 dark:text-slate-300 text-sm leading-relaxed">{t('docs.guide.live.desc')}</p>
                </div>
            </div>
        </div>
    );

    const renderTechnical = () => (
        <div className="space-y-6">
            <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl dark:bg-slate-800 dark:from-slate-800 dark:to-slate-800 dark:border-slate-600">
                <h4 className="font-bold text-blue-900 dark:text-blue-200 mb-2 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {t('docs.technical.rendering.title')}
                </h4>
                <p className="text-sm text-blue-800 dark:text-blue-300 leading-relaxed">{t('docs.technical.rendering.desc')}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <section className="p-4 border border-gray-200 rounded-xl">
                    <h3 className="font-bold text-gray-800 dark:text-white mb-2">Gemini API Integration</h3>
                    <p className="text-sm text-gray-600 dark:text-slate-300">{t('docs.technical.api.desc')}</p>
                </section>
                <section className="p-4 border border-gray-200 rounded-xl">
                    <h3 className="font-bold text-gray-800 dark:text-white mb-2">Audio Engine</h3>
                    <p className="text-sm text-gray-600 dark:text-slate-300">{t('docs.technical.audio.desc')}</p>
                </section>
            </div>
        </div>
    );

    const renderTroubleshoot = () => (
        <div className="space-y-4">
            <div className="p-5 border-l-4 border-red-500 bg-red-50 rounded-r-xl dark:bg-red-900/20 dark:border-red-500">
                <h4 className="font-bold text-red-900 dark:text-red-200 mb-2 flex items-center gap-2">
                    <span>⚠</span> {t('docs.troubleshoot.crash.title')}
                </h4>
                <p className="text-sm text-gray-800 dark:text-slate-300 mb-3">{t('docs.troubleshoot.crash.desc')}</p>
                <ul className="list-disc list-inside text-sm text-gray-700 dark:text-slate-300 space-y-1 ml-2">
                    <li>{t('docs.troubleshoot.crash.tip1')}</li>
                    <li>{t('docs.troubleshoot.crash.tip2')}</li>
                    <li>{t('docs.troubleshoot.crash.tip3')}</li>
                </ul>
            </div>
             <div className="p-5 border-l-4 border-yellow-500 bg-yellow-50 rounded-r-xl dark:bg-yellow-900/20 dark:border-yellow-500">
                <h4 className="font-bold text-yellow-900 dark:text-yellow-200 mb-2 flex items-center gap-2">
                    <span>⚡</span> {t('docs.troubleshoot.generation.title')}
                </h4>
                <p className="text-sm text-gray-800 dark:text-slate-300">{t('docs.troubleshoot.generation.desc')}</p>
            </div>
        </div>
    );

    const renderDeployment = () => (
        <div className="space-y-6">
            <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl dark:bg-slate-800 dark:border-slate-700">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">{t('docs.deployment.intro')}</h3>
                <div className="space-y-4">
                    <div>
                        <h4 className="font-bold text-teal-600 dark:text-teal-400 mb-2">1. {t('docs.deployment.prerequisites')}</h4>
                        <ul className="list-disc list-inside text-sm text-slate-600 dark:text-slate-300 ml-2">
                            <li>Node.js (v18+)</li>
                            <li>npm / yarn</li>
                            <li>Vercel CLI / Firebase CLI</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-teal-600 dark:text-teal-400 mb-2">2. {t('docs.deployment.env')}</h4>
                        <div className="bg-slate-900 text-slate-300 p-3 rounded-lg font-mono text-xs overflow-x-auto">
                            VITE_API_KEY=your_gemini_key<br/>
                            VITE_YOUTUBE_CLIENT_ID=your_google_client_id<br/>
                            VITE_YOUTUBE_API_KEY=your_youtube_api_key
                        </div>
                    </div>
                    <div>
                        <h4 className="font-bold text-teal-600 dark:text-teal-400 mb-2">3. {t('docs.deployment.build')}</h4>
                        <div className="bg-slate-900 text-slate-300 p-3 rounded-lg font-mono text-xs">
                            npm install<br/>
                            npm run build
                        </div>
                        <p className="text-xs text-slate-500 mt-2">{t('docs.deployment.buildDesc')}</p>
                    </div>
                    <div>
                        <h4 className="font-bold text-teal-600 dark:text-teal-400 mb-2">4. {t('docs.deployment.hosting')}</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">{t('docs.deployment.hostingDesc')}</p>
                        <div className="bg-slate-900 text-slate-300 p-3 rounded-lg font-mono text-xs">
                            # Vercel<br/>
                            vercel --prod<br/><br/>
                            # Firebase<br/>
                            firebase deploy
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-4">
            <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl flex flex-col max-h-[90vh] dark:bg-slate-900 border border-gray-200 dark:border-slate-700 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-900">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-teal-50 text-teal-600 rounded-2xl dark:bg-teal-900/30 dark:text-teal-400">
                             <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{t('docs.title')}</h2>
                            <p className="text-sm text-gray-500 dark:text-slate-400">{t('docs.subtitle')}</p>
                        </div>
                    </div>
                    <button onClick={closeDocsModal} className="p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 rounded-full transition-colors dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-300">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex px-6 pt-2 border-b border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 gap-2 md:gap-6 overflow-x-auto">
                    <TabButton label={t('docs.tabs.guide')} isActive={activeTab === 'guide'} onClick={() => setActiveTab('guide')} />
                    <TabButton label={t('docs.tabs.technical')} isActive={activeTab === 'technical'} onClick={() => setActiveTab('technical')} />
                    <TabButton label={t('docs.tabs.troubleshoot')} isActive={activeTab === 'troubleshoot'} onClick={() => setActiveTab('troubleshoot')} />
                    <TabButton label={t('docs.tabs.deployment')} isActive={activeTab === 'deployment'} onClick={() => setActiveTab('deployment')} />
                </div>

                {/* Content */}
                <div className="p-8 overflow-y-auto custom-scrollbar flex-grow bg-white dark:bg-slate-900">
                    {activeTab === 'guide' && renderGuide()}
                    {activeTab === 'technical' && renderTechnical()}
                    {activeTab === 'troubleshoot' && renderTroubleshoot()}
                    {activeTab === 'deployment' && renderDeployment()}
                </div>
            </div>
        </div>
    );
};

export default DocumentationModal;
