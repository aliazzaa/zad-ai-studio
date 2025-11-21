
import React, { useState, useMemo } from 'react';
import { backgroundLibrary as staticBackgroundLibrary } from '../libraryData';
import { BackgroundAsset } from '../types';
import TabButton from './TabButton';
import { useAppContext } from '../contexts/AppContext';
import { useLanguage } from '../contexts/LanguageContext';

const BackgroundLibrary: React.FC = () => {
    const { selectBackground } = useAppContext();
    const { t } = useLanguage();
    const [activeCategory, setActiveCategory] = useState<'all' | BackgroundAsset['category']>('all');
    const [searchTerm, setSearchTerm] = useState('');

    const categories: { id: 'all' | BackgroundAsset['category']; labelKey: string }[] = [
        { id: 'all', labelKey: 'backgroundLibrary.categories.all' },
        { id: 'geometric', labelKey: 'backgroundLibrary.categories.geometric' },
        { id: 'architecture', labelKey: 'backgroundLibrary.categories.architecture' },
        { id: 'calligraphy', labelKey: 'backgroundLibrary.categories.calligraphy' },
        { id: 'nature', labelKey: 'backgroundLibrary.categories.nature' }
    ];

    const displayedBackgrounds = useMemo(() => {
        let filtered = staticBackgroundLibrary;
        if (activeCategory !== 'all') {
            filtered = filtered.filter(bg => bg.category === activeCategory);
        }
        if (searchTerm) {
            filtered = filtered.filter(bg => t(bg.titleKey).toLowerCase().includes(searchTerm.toLowerCase()));
        }
        return filtered;
    }, [activeCategory, searchTerm, t]);

    const handleDownload = (url: string, title: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const link = document.createElement('a');
        link.href = url;
        link.download = `${title.replace(/\s/g, '_')}.jpg`; // Simple fallback extension
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="p-4 bg-white rounded-lg shadow dark:bg-slate-800 animate-fade-in">
             <div className="flex flex-col items-center justify-between gap-4 p-4 mb-4 border-b border-gray-200 sm:flex-row dark:border-slate-700">
                <h2 className="text-xl font-bold text-teal-800 dark:text-teal-300">{t('backgroundLibrary.title')}</h2>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
                 {categories.map((cat) => (
                    <TabButton
                        key={cat.id}
                        label={t(cat.labelKey)}
                        isActive={activeCategory === cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                    />
                ))}
            </div>

            <div className="mb-6">
                <input
                    type="search"
                    placeholder={t('backgroundLibrary.searchPlaceholder')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-400"
                />
            </div>

            {displayedBackgrounds.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                    {displayedBackgrounds.map((bg) => (
                        <div 
                            key={bg.id} 
                            className="group relative overflow-hidden rounded-lg border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all cursor-pointer"
                            onClick={() => selectBackground(bg.url)}
                        >
                            <div className="aspect-video w-full overflow-hidden bg-gray-100 dark:bg-slate-900">
                                <img 
                                    src={bg.url} 
                                    alt={t(bg.titleKey)} 
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                            </div>
                            
                            {/* Overlay Actions */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-4 text-center">
                                <p className="text-white font-bold text-sm mb-2 drop-shadow-md">{t(bg.titleKey)}</p>
                                <button 
                                    className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-full shadow-md transition-colors w-full"
                                >
                                    {t('backgroundLibrary.useButton')}
                                </button>
                                <button 
                                    onClick={(e) => handleDownload(bg.url, t(bg.titleKey), e)}
                                    className="px-3 py-1.5 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white text-xs font-bold rounded-full border border-white/50 transition-colors w-full"
                                >
                                    {t('backgroundLibrary.downloadButton')}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="py-8 text-center text-gray-500 dark:text-slate-400">
                    {t('backgroundLibrary.noResults')}
                </p>
            )}
        </div>
    );
};

export default BackgroundLibrary;
