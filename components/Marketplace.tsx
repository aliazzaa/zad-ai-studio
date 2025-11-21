
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { useLanguage } from '../contexts/LanguageContext';
import { marketplaceItems } from '../libraryData';
import { MarketplaceCategory } from '../types';

const STORAGE_KEY = 'zad_marketplace_downloads';

const Marketplace: React.FC = () => {
    const { openSubscriptionModal, goBack, canGoBack } = useAppContext();
    const { t, language } = useLanguage();
    const [activeFilter, setActiveFilter] = useState<MarketplaceCategory | 'all'>('all');
    
    // Initialize from localStorage to persist state across reloads
    const [downloadedItems, setDownloadedItems] = useState<Set<string>>(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved ? new Set(JSON.parse(saved)) : new Set();
        } catch (e) {
            return new Set();
        }
    });

    const filteredItems = activeFilter === 'all' 
        ? marketplaceItems 
        : marketplaceItems.filter(item => item.category === activeFilter);

    const handleItemAction = (id: string, isPro: boolean) => {
        if (isPro) {
            openSubscriptionModal();
        } else {
            // Simulate loading/downloading and persist state
            const newSet = new Set(downloadedItems);
            newSet.add(id);
            setDownloadedItems(newSet);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(newSet)));
        }
    };

    const categories: { id: MarketplaceCategory | 'all', labelKey: string }[] = [
        { id: 'all', labelKey: 'marketplace.categories.all' },
        { id: 'template', labelKey: 'marketplace.categories.template' },
        { id: 'background', labelKey: 'marketplace.categories.background' },
        { id: 'avatar', labelKey: 'marketplace.categories.avatar' },
        { id: 'audio', labelKey: 'marketplace.categories.audio' },
    ];

    return (
        <div className="p-6 space-y-8 animate-fade-in pb-20">
             <div className="flex items-center justify-between">
                {canGoBack && (
                    <button onClick={goBack} className="flex items-center gap-2 px-5 py-2.5 font-bold text-teal-800 transition-all bg-white/80 rounded-full shadow-sm hover:bg-white hover:shadow backdrop-blur-md dark:bg-slate-800/80 dark:text-teal-300 dark:hover:bg-slate-800">
                        <svg xmlns="http://www.w3.org/2000/svg" className={`w-5 h-5 ${language === 'ar' ? 'transform rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        <span>{t('global.backToDashboard')}</span>
                    </button>
                )}
                <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-yellow-500 dark:from-amber-300 dark:to-yellow-200 filter drop-shadow-sm">
                    {t('marketplace.title')}
                </h2>
                <div className="w-10"></div>
            </div>

            {/* Hero Banner with Shimmer Effect */}
            <div className="relative overflow-hidden rounded-3xl shadow-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white p-8 md:p-12 shimmer-btn">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500 rounded-full opacity-10 blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
                 <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                     <div className="space-y-4 text-center md:text-start">
                         <h3 className="text-4xl font-bold leading-tight">{t('marketplace.hero.title')}</h3>
                         <p className="text-slate-300 text-lg max-w-xl">{t('marketplace.hero.desc')}</p>
                     </div>
                     <div className="text-6xl animate-bounce-slow">🛍️</div>
                 </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap justify-center gap-3">
                {categories.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveFilter(cat.id)}
                        className={`px-6 py-2 rounded-full font-bold transition-all transform active:scale-95 ${
                            activeFilter === cat.id 
                                ? 'bg-amber-500 text-white shadow-lg scale-105' 
                                : 'bg-white text-slate-600 hover:bg-amber-50 hover:shadow-sm dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                        }`}
                    >
                        {t(cat.labelKey)}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredItems.map(item => {
                    const isDownloaded = downloadedItems.has(item.id);
                    return (
                        <div key={item.id} className="group relative bg-white dark:bg-slate-800 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-slate-700 overflow-hidden flex flex-col hover:-translate-y-2">
                            <div className="relative h-48 overflow-hidden">
                                <img 
                                    src={item.thumbnailUrl} 
                                    alt={t(item.titleKey)} 
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                {item.isPro && (
                                    <span className="absolute top-3 left-3 px-3 py-1 bg-gradient-to-r from-yellow-400 to-amber-500 text-white text-xs font-bold rounded-full shadow-md animate-pulse-slow">
                                        PRO 👑
                                    </span>
                                )}
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="flex justify-between items-center text-xs font-medium">
                                        <span className="flex items-center gap-1">⭐ {item.rating}</span>
                                        <span>📥 {item.downloads + (isDownloaded ? 1 : 0)}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="p-5 flex flex-col flex-grow">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-bold text-lg text-gray-800 dark:text-white line-clamp-1">{t(item.titleKey)}</h4>
                                </div>
                                <p className="text-sm text-gray-500 dark:text-slate-400 mb-4 line-clamp-2 flex-grow">{t(item.descriptionKey)}</p>
                                
                                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-slate-700">
                                    <span className={`font-bold text-lg ${item.price === 'free' ? 'text-green-600 dark:text-green-400' : 'text-slate-800 dark:text-white'}`}>
                                        {item.price === 'free' ? t('marketplace.free') : `$${item.price}`}
                                    </span>
                                    <button 
                                        onClick={() => handleItemAction(item.id, item.isPro)}
                                        disabled={isDownloaded}
                                        className={`px-5 py-2 rounded-lg font-bold text-sm transition-all shadow-sm flex items-center gap-2 transform active:scale-95 ${
                                            isDownloaded
                                                ? 'bg-green-100 text-green-700 cursor-default border border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800'
                                                : item.isPro 
                                                    ? 'bg-amber-500 hover:bg-amber-600 text-white hover:shadow-md' 
                                                    : 'bg-teal-600 hover:bg-teal-700 text-white hover:shadow-md shimmer-btn'
                                        }`}
                                    >
                                        {isDownloaded ? (
                                            <>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                                <span>{t('marketplace.saved')}</span>
                                            </>
                                        ) : (
                                            item.isPro ? t('marketplace.unlock') : t('marketplace.use')
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Marketplace;
