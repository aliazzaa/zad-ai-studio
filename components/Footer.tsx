
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const Footer: React.FC = () => {
    const { t } = useLanguage();
    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full mt-12 border-t border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                    
                    {/* Brand & Copyright */}
                    <div className="text-center md:text-start space-y-2">
                        <h3 className="font-bold text-teal-800 dark:text-teal-300 text-lg">
                            {t('header.title')}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-slate-400">
                            © {currentYear} Zad Al-Yawm. {t('footer.rightsReserved')}
                        </p>
                        <div className="flex gap-4 justify-center md:justify-start text-xs text-gray-400 dark:text-slate-500">
                            <a href="#" className="hover:underline">{t('footer.privacy')}</a>
                            <a href="#" className="hover:underline">{t('footer.terms')}</a>
                        </div>
                    </div>

                    {/* System Status */}
                    <div className="flex flex-col items-center justify-center gap-2">
                        <div className="flex items-center gap-2 px-4 py-1 rounded-full bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-800">
                            <span className="relative flex h-3 w-3">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                            </span>
                            <span className="text-xs font-bold text-green-700 dark:text-green-300 uppercase">
                                {t('footer.systemOnline')}
                            </span>
                        </div>
                        <p className="text-xs text-gray-400 dark:text-slate-600">{t('footer.version')} 1.0.0 (Production)</p>
                    </div>

                    {/* Technology Partners */}
                    <div className="flex flex-col items-center md:items-end gap-2">
                        <p className="text-xs uppercase font-bold text-gray-400 dark:text-slate-500 tracking-wider">
                            {t('footer.poweredBy')}
                        </p>
                        <div className="flex items-center gap-4 opacity-70 grayscale hover:grayscale-0 transition-all duration-300">
                            {/* Google Cloud / Gemini Logo Placeholder */}
                            <div className="flex items-center gap-1">
                                <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12z" fill="#fff"/><path d="M12.003 2c-2.18.004-4.36.018-6.54.043 1.953 2.897 4.238 5.633 6.88 8.275a.69.69 0 0 1 0 .974c-2.642 2.643-4.927 5.379-6.88 8.275 2.18.025 4.36.039 6.54.043V2z" fill="#4285F4"/></svg>
                                <span className="text-sm font-semibold text-gray-600 dark:text-slate-300">Google Gemini</span>
                            </div>
                            <div className="h-4 w-px bg-gray-300 dark:bg-slate-700"></div>
                            <span className="text-sm font-semibold text-gray-600 dark:text-slate-300">Vercel</span>
                        </div>
                    </div>

                </div>
            </div>
        </footer>
    );
};

export default Footer;
