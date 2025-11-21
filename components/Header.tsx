




import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { useLanguage } from '../contexts/LanguageContext';
import { SUPPORTED_LANGUAGES } from '../constants';

const Header: React.FC = () => {
    const { 
        user, openLoginModal, logout, 
        installPromptEvent, triggerInstallPrompt, openInstallGuide,
        openFeedbackModal, openDeployModal, openTutorialModal, openDocsModal,
        openSubscriptionModal,
        theme, toggleTheme, setActivePanel
    } = useAppContext();
    const { language, setLanguage, t } = useLanguage();
    
    const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
    const [isMoreDropdownOpen, setIsMoreDropdownOpen] = useState(false);
    
    const moreDropdownRef = useRef<HTMLDivElement>(null);

    const handleLanguageChange = (lang: string) => {
        setLanguage(lang as 'ar' | 'en');
        setIsLangDropdownOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (moreDropdownRef.current && !moreDropdownRef.current.contains(event.target as Node)) {
                setIsMoreDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [moreDropdownRef]);
    
    const IconBtn: React.FC<{ onClick: () => void; title: string; children: React.ReactNode, className?: string }> = ({ onClick, title, children, className }) => (
        <button
            onClick={onClick}
            className={`p-2 transition-all duration-300 bg-white/10 rounded-full text-white hover:bg-white/20 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-white/50 active:scale-95 shadow-sm border border-white/10 ${className}`}
            title={title}
        >
            {children}
        </button>
    );

    const handleTitleClick = () => {
        setActivePanel('dashboard');
    };

    const handleInstallClick = () => {
        if (installPromptEvent) {
            triggerInstallPrompt();
        } else {
            openInstallGuide();
        }
    };

    return (
        <header className="sticky top-0 z-50 w-full transition-all duration-300 border-b border-white/10 backdrop-blur-xl bg-gradient-to-r from-[var(--brand-gradient-start)] via-[var(--brand-gradient-end)] to-[var(--brand-gradient-start)] bg-[length:200%_100%] animate-[gradient_15s_ease_infinite] shadow-lg dark:border-slate-800/50">
            <div className="container flex items-center justify-between p-3 mx-auto md:px-6">
                 <div className="flex items-center gap-3">
                    <div className="relative">
                        <button
                            onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                            title={t('header.languageTooltip')}
                            className="flex items-center px-3 py-2 text-sm font-bold text-teal-900 transition-all duration-200 bg-white/90 rounded-full shadow-sm backdrop-blur-md hover:bg-white hover:shadow-md hover:scale-105 dark:bg-slate-800/90 dark:text-white dark:hover:bg-slate-800"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 ltr:mr-2 rtl:ml-2 opacity-70" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.874 6 7.5 6h5c.626 0 .988-.27 1.256-.679a6.012 6.012 0 011.912 2.706C15.988 8.27 15.626 8.5 15 8.5h-1a1 1 0 00-1 1v1a1 1 0 001 1h1c.626 0 .988.23 1.256.679a6.012 6.012 0 01-1.912 2.706C13.488 14.27 13.126 14 12.5 14h-5c-.626 0-.988.27-1.256.679a6.012 6.012 0 01-1.912-2.706C4.012 11.73 4.374 11.5 5 11.5h1a1 1 0 001-1v-1a1 1 0 00-1-1H5c-.626 0-.988-.23-1.256-.679z" clipRule="evenodd" /></svg>
                            <span className="hidden sm:inline">{SUPPORTED_LANGUAGES[language]}</span>
                        </button>
                        {isLangDropdownOpen && (
                            <div className="absolute z-20 w-40 mt-2 overflow-hidden bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl ltr:left-0 rtl:right-0 dark:bg-slate-800/95 ring-1 ring-black/5 animate-fade-in border border-white/20">
                                <ul className="py-1">
                                    {Object.entries(SUPPORTED_LANGUAGES).map(([code, name]) => (
                                        <li
                                            key={code}
                                            onClick={() => handleLanguageChange(code)}
                                            className="px-4 py-2 text-sm text-gray-700 transition-colors cursor-pointer hover:bg-teal-50 hover:text-teal-700 dark:text-white dark:hover:bg-slate-700"
                                        >
                                            {name}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                     {user ? (
                        <button
                            onClick={logout}
                            title={t('header.logoutTooltip')}
                            className="px-4 py-2 text-sm font-bold text-white transition-all duration-200 border border-white/30 rounded-full hover:bg-white/10 backdrop-blur-sm"
                        >
                            {t('header.logout')}
                        </button>
                    ) : (
                        <button
                            onClick={openLoginModal}
                            title={t('header.loginTooltip')}
                            className="px-5 py-2 text-sm font-bold text-teal-900 transition-all duration-300 bg-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 dark:bg-slate-800 dark:text-white border border-white/50"
                        >
                            {t('header.login')}
                        </button>
                    )}
                </div>

                <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center">
                    <button onClick={handleTitleClick} className="flex flex-col items-center group" title={t('dashboard.title')}>
                        <h1 className="text-2xl font-extrabold text-white md:text-3xl flex items-center gap-3 tracking-tight">
                            <div className="p-2 bg-white/20 rounded-full backdrop-blur-md shadow-inner group-hover:bg-white/30 transition-all duration-500 border border-white/20">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-8 h-8 text-white fill-current drop-shadow-md"><path d="M50 5 a 45 45 0 1 0 0 90 a 35 35 0 1 1 0 -70"></path></svg>
                            </div>
                            <span className="drop-shadow-lg bg-clip-text text-transparent bg-gradient-to-b from-white to-teal-100">{t('header.title')}</span>
                        </h1>
                    </button>
                </div>
               
                <div className="flex items-center gap-3">
                    <button 
                        onClick={openSubscriptionModal}
                        title={t('header.upgradeTooltip')}
                        className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-white bg-gradient-to-tr from-yellow-400 to-orange-500 rounded-full shadow-lg hover:scale-105 transition-transform animate-pulse border border-yellow-200"
                    >
                        💎 <span className="hidden md:inline">{t('header.upgrade')}</span>
                    </button>

                    <button 
                        onClick={handleInstallClick} 
                        title={t('header.installApp')} 
                        className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-bold text-white transition-all duration-300 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full shadow-md hover:shadow-lg hover:scale-105 border border-white/20"
                    >
                       <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
                       <span className="hidden md:inline">{t('header.installApp')}</span>
                   </button>

                    <IconBtn onClick={openDocsModal} title={t('header.docsTooltip')}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </IconBtn>
                    <IconBtn onClick={toggleTheme} title={t(theme === 'dark' ? 'header.themeTooltipLight' : 'header.themeTooltipDark')}>
                        {theme === 'dark' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm-.707 12.122l.707-.707a1 1 0 011.414 1.414l-.707.707a1 1 0 01-1.414-1.414zM4 11a1 1 0 100-2H3a1 1 0 100 2h1z" /></svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 20 20" fill="currentColor"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>
                        )}
                    </IconBtn>

                     <div className="relative" ref={moreDropdownRef}>
                        <IconBtn onClick={() => setIsMoreDropdownOpen(!isMoreDropdownOpen)} title={t('header.moreOptions')}>
                             <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 20 20" fill="currentColor"><path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" /></svg>
                        </IconBtn>
                        {isMoreDropdownOpen && (
                            <div className="absolute z-20 w-56 mt-2 overflow-hidden bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl ltr:right-0 rtl:left-0 dark:bg-slate-800/95 ring-1 ring-black/5 animate-fade-in border border-white/20">
                                <ul className="py-1">
                                     <li onClick={() => { openTutorialModal(); setIsMoreDropdownOpen(false); }} className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 cursor-pointer hover:bg-teal-50 dark:text-white dark:hover:bg-slate-700">
                                        🎥 <span className="font-medium">{t('header.watchTutorial')}</span>
                                    </li>
                                     <li onClick={() => { openFeedbackModal(); setIsMoreDropdownOpen(false); }} className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 cursor-pointer hover:bg-teal-50 dark:text-white dark:hover:bg-slate-700">
                                        💡 <span className="font-medium">{t('header.improveApp')}</span>
                                    </li>
                                     <li onClick={() => { openDeployModal(); setIsMoreDropdownOpen(false); }} className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 cursor-pointer hover:bg-teal-50 dark:text-white dark:hover:bg-slate-700">
                                        🚀 <span className="font-medium">{t('header.deployApp')}</span>
                                    </li>
                                     <li onClick={() => { handleInstallClick(); setIsMoreDropdownOpen(false); }} className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 cursor-pointer hover:bg-teal-50 sm:hidden dark:text-white dark:hover:bg-slate-700">
                                        📥 <span className="font-medium">{t('header.installApp')}</span>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
