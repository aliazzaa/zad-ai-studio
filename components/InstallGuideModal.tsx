
import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { useLanguage } from '../contexts/LanguageContext';
import TabButton from './TabButton';

const InstallGuideModal: React.FC = () => {
    const { isInstallGuideOpen, closeInstallGuide, triggerInstallPrompt, installPromptEvent } = useAppContext();
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState<'desktop' | 'ios' | 'android'>('desktop');

    if (!isInstallGuideOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in p-4">
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl dark:bg-slate-800 border border-white/20 overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-slate-700">
                    <h3 className="text-xl font-bold text-teal-800 dark:text-teal-300 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        {t('installGuide.title')}
                    </h3>
                    <button onClick={closeInstallGuide} className="p-2 text-gray-500 rounded-full hover:bg-gray-100 dark:text-slate-400 dark:hover:bg-slate-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <div className="flex p-4 border-b border-gray-100 dark:border-slate-700 gap-2 justify-center bg-gray-50 dark:bg-slate-900/50">
                    <TabButton label={t('installGuide.desktop')} isActive={activeTab === 'desktop'} onClick={() => setActiveTab('desktop')} />
                    <TabButton label={t('installGuide.ios')} isActive={activeTab === 'ios'} onClick={() => setActiveTab('ios')} />
                    <TabButton label={t('installGuide.android')} isActive={activeTab === 'android'} onClick={() => setActiveTab('android')} />
                </div>

                <div className="p-6 text-center">
                    <p className="mb-6 text-gray-600 dark:text-slate-300">{t('installGuide.description')}</p>

                    {installPromptEvent && (
                        <button 
                            onClick={() => { triggerInstallPrompt(); closeInstallGuide(); }}
                            className="w-full mb-6 py-3 bg-teal-600 text-white font-bold rounded-xl shadow-lg hover:bg-teal-700 animate-pulse"
                        >
                            {t('installGuide.autoInstallButton')}
                        </button>
                    )}

                    {activeTab === 'desktop' && (
                        <div className="space-y-4 text-left bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl">
                            <div className="flex items-start gap-3">
                                <span className="bg-teal-100 text-teal-800 font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">1</span>
                                <p className="text-sm text-gray-700 dark:text-slate-200">{t('installGuide.desktopStep1')}</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="bg-teal-100 text-teal-800 font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">2</span>
                                <p className="text-sm text-gray-700 dark:text-slate-200">{t('installGuide.desktopStep2')}</p>
                            </div>
                        </div>
                    )}

                    {activeTab === 'ios' && (
                        <div className="space-y-4 text-left bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl">
                            <div className="flex items-start gap-3">
                                <span className="bg-teal-100 text-teal-800 font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">1</span>
                                <p className="text-sm text-gray-700 dark:text-slate-200">{t('installGuide.iosStep1')}</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="bg-teal-100 text-teal-800 font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">2</span>
                                <p className="text-sm text-gray-700 dark:text-slate-200 flex items-center gap-2">
                                    {t('installGuide.iosStep2')} 
                                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                                </p>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="bg-teal-100 text-teal-800 font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">3</span>
                                <p className="text-sm text-gray-700 dark:text-slate-200">{t('installGuide.iosStep3')}</p>
                            </div>
                        </div>
                    )}

                    {activeTab === 'android' && (
                        <div className="space-y-4 text-left bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl">
                            <div className="flex items-start gap-3">
                                <span className="bg-teal-100 text-teal-800 font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">1</span>
                                <p className="text-sm text-gray-700 dark:text-slate-200 flex items-center gap-2">
                                    {t('installGuide.androidStep1')} 
                                    <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path></svg>
                                </p>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="bg-teal-100 text-teal-800 font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">2</span>
                                <p className="text-sm text-gray-700 dark:text-slate-200">{t('installGuide.androidStep2')}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InstallGuideModal;
