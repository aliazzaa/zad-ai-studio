import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { useLanguage } from '../contexts/LanguageContext';

const WelcomeScreen: React.FC = () => {
    const { hideWelcomeScreen } = useAppContext();
    const { t } = useLanguage();

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-100 dark:bg-slate-900 animate-fade-in">
            <div className="w-full max-w-2xl p-8 mx-4 text-center bg-white rounded-xl shadow-2xl transform transition-all duration-500 hover:scale-105 dark:bg-slate-800">
                <h1 className="text-4xl md:text-5xl font-bold text-teal-700 dark:text-teal-400 flex items-center justify-center gap-4">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-12 h-12 text-teal-600 dark:text-teal-400 fill-current"><path d="M50 5 a 45 45 0 1 0 0 90 a 35 35 0 1 1 0 -70"></path></svg>
                    {t('header.title')}
                </h1>
                <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
                    {t('welcomeScreen.subtitle')}
                </p>
                <button
                    onClick={hideWelcomeScreen}
                    className="w-full max-w-xs px-8 py-4 mt-8 text-lg font-bold text-white transition-transform duration-300 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-lg shadow-lg hover:scale-110 focus:outline-none focus:ring-4 focus:ring-teal-300 dark:focus:ring-teal-800"
                >
                    {t('welcomeScreen.button')}
                </button>
            </div>
        </div>
    );
};

export default WelcomeScreen;