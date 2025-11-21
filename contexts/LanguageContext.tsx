import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';

type Language = 'ar' | 'en';

interface LanguageContextType {
    language: Language;
    setLanguage: (language: Language) => void;
    t: (key: string, replacements?: { [key: string]: string | number }) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [language, setLanguageState] = useState<Language>('ar');
    const [translations, setTranslations] = useState<any>({});

    useEffect(() => {
        const savedLanguage = localStorage.getItem('language') as Language;
        if (savedLanguage && ['ar', 'en'].includes(savedLanguage)) {
            setLanguageState(savedLanguage);
        }
    }, []);

    useEffect(() => {
        const fetchTranslations = async () => {
            try {
                const response = await fetch(`/locales/${language}.json`);
                if (!response.ok) {
                    throw new Error(`Could not load ${language} translations`);
                }
                const data = await response.json();
                setTranslations(data);
            } catch (error) {
                console.error(error);
                // Fallback to Arabic if English file is missing or fails
                if (language !== 'ar') {
                    const fallbackResponse = await fetch(`/locales/ar.json`);
                    const data = await fallbackResponse.json();
                    setTranslations(data);
                }
            }
        };

        fetchTranslations();
        localStorage.setItem('language', language);
        document.documentElement.lang = language;
        document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';

    }, [language]);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
    };

    const t = useCallback((key: string, replacements: { [key: string]: string | number } = {}): string => {
        const keys = key.split('.');
        let result = translations;
        for (const k of keys) {
            result = result?.[k];
            if (result === undefined) {
                return key; // Return the key itself if not found
            }
        }
        
        if (typeof result !== 'string') {
            return key;
        }

        // Handle replacements
        let replacedResult = result;
        for (const placeholder in replacements) {
            replacedResult = replacedResult.replace(
                new RegExp(`{{${placeholder}}}`, 'g'),
                String(replacements[placeholder])
            );
        }

        return replacedResult;
    }, [translations]);

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = (): LanguageContextType => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
