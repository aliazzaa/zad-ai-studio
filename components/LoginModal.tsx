import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { useLanguage } from '../contexts/LanguageContext';

const LoginModal: React.FC = () => {
    const { isLoginModalOpen, closeLoginModal, login } = useAppContext();
    const { t } = useLanguage();
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    if (!isLoginModalOpen) {
        return null;
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !email.includes('@')) {
            setError(t('loginModal.error'));
            return;
        }
        login(email);
        setEmail('');
        setError('');
    };
    
    const handleClose = () => {
        setEmail('');
        setError('');
        closeLoginModal();
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 animate-fade-in">
            <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-xl m-4 dark:bg-slate-800">
                 <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-slate-700">
                    <h2 className="text-xl font-bold text-teal-800 dark:text-teal-300">{t('loginModal.title')}</h2>
                    <button onClick={handleClose} className="p-1 text-gray-500 rounded-full hover:bg-gray-200 dark:text-slate-400 dark:hover:bg-slate-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                
                <p className="mt-4 text-center text-gray-600 dark:text-slate-400">{t('loginModal.subtitle')}</p>
                
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <div>
                        <label htmlFor="email-input" className="block mb-2 font-semibold text-gray-700 dark:text-slate-300">{t('loginModal.emailLabel')}</label>
                        <input 
                            type="email" 
                            id="email-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder={t('loginModal.emailPlaceholder')}
                            className="w-full p-3 text-lg text-left border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-400"
                            dir="ltr"
                        />
                        {error && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>}
                    </div>
                     <button
                        type="submit"
                        className="w-full px-6 py-3 font-bold text-white bg-teal-600 rounded-lg hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600"
                    >
                        {t('loginModal.loginButton')}
                    </button>
                </form>

                <div className="pt-4 mt-4 text-center border-t border-gray-200 dark:border-slate-700">
                    <button
                        onClick={handleClose}
                        className="text-sm text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200"
                    >
                        {t('global.cancel')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginModal;