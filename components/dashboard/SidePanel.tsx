
import React from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { PanelMode } from '../../types';
import GeneratorControls from './GeneratorControls';
import HadithLibrary from '../HadithLibrary';
import QuranLibrary from '../QuranLibrary';
import BackgroundLibrary from '../BackgroundLibrary';
import { useLanguage } from '../../contexts/LanguageContext';

const SidePanel: React.FC = () => {
    const { activePanel, setActivePanel } = useAppContext();
    const { t } = useLanguage();

    const panels: { id: PanelMode; labelKey: string; icon: React.ReactNode; isSpecial?: boolean }[] = [
        { id: 'generator', labelKey: 'sidePanel.generator', icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg> },
        { id: 'community', labelKey: 'sidePanel.community', icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg> },
        { id: 'marketplace', labelKey: 'sidePanel.marketplace', isSpecial: true, icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg> },
        { id: 'hadithLibrary', labelKey: 'sidePanel.hadithLibrary', icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg> },
        { id: 'quranLibrary', labelKey: 'sidePanel.quranLibrary', icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 19.5A2.5 2.5 0 016.5 17H20" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" /></svg> },
        { id: 'backgroundLibrary', labelKey: 'sidePanel.backgroundLibrary', icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> },
        { id: 'live', labelKey: 'sidePanel.liveStream', icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M13 12a1 1 0 11-2 0 1 1 0 012 0z" /></svg> },
        { id: 'scheduler', labelKey: 'sidePanel.scheduler', icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> },
    ];

    const renderActivePanel = () => {
        switch (activePanel) {
            case 'generator':
            case 'community': 
            case 'live': 
            case 'scheduler':
            case 'marketplace':
                return <GeneratorControls />;
            case 'hadithLibrary':
                return <HadithLibrary />;
            case 'quranLibrary':
                return <QuranLibrary />;
            case 'backgroundLibrary':
                return <BackgroundLibrary />;
            default:
                return <GeneratorControls />;
        }
    };

    return (
        <div className="p-4 shadow-2xl glass-panel rounded-2xl border border-white/20">
            <nav className="flex flex-wrap gap-2 justify-center">
                {panels.map((panel) => {
                     const label = t(panel.labelKey);
                     const isActive = activePanel === panel.id;
                     return (
                         <button
                            key={panel.id}
                            onClick={() => setActivePanel(panel.id)}
                            title={label}
                            className={`
                                flex flex-row items-center justify-center flex-1 min-w-[80px] p-3 text-xs md:text-sm font-bold rounded-xl transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 dark:focus:ring-offset-slate-800
                                ${isActive 
                                    ? 'bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-lg scale-[1.02] ring-1 ring-teal-400/50' 
                                    : panel.isSpecial 
                                        ? 'bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-900/20 dark:text-amber-300 dark:hover:bg-amber-900/40 border border-amber-200/50'
                                        : 'bg-white/50 text-slate-600 hover:bg-white hover:shadow-md hover:text-teal-700 dark:bg-slate-700/30 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white border border-transparent hover:border-white/20'
                                }
                            `}
                        >
                            <span className="ltr:mr-2 rtl:ml-2">{panel.icon}</span>
                            <span className="hidden sm:inline">{label}</span>
                        </button>
                    );
                })}
            </nav>
            {/* Only show context controls if we are NOT navigating away to a full-screen module */}
            {['hadithLibrary', 'quranLibrary', 'backgroundLibrary', 'generator'].includes(activePanel) && (
                <div className="pt-6 mt-4 border-t border-gray-200/50 dark:border-white/5">
                    {renderActivePanel()}
                </div>
            )}
        </div>
    );
};

export default SidePanel;
