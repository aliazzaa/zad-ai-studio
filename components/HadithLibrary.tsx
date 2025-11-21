
import React, { useState, useEffect, useMemo } from 'react';
import { hadithLibrary as staticHadithLibrary } from '../libraryData';
import { ContentType, LibraryHadith } from '../types';
import { CONTENT_TYPE_DETAILS } from '../constants';
import TabButton from './TabButton';
import Pagination from './Pagination';
import { useAppContext } from '../contexts/AppContext';
import { useLanguage } from '../contexts/LanguageContext';

const ITEMS_PER_PAGE = 5;
const BOOKMARKS_STORAGE_KEY = 'hadithLibrary_bookmarks';


const HadithLibrary: React.FC = () => {
    const { selectHadith } = useAppContext();
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState<ContentType | 'bookmarks' | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [hadithData] = useState<LibraryHadith[]>(staticHadithLibrary);
    const [searchTerm, setSearchTerm] = useState('');
    const [bookmarkedScripts, setBookmarkedScripts] = useState<string[]>([]);

    useEffect(() => {
        const savedBookmarks = localStorage.getItem(BOOKMARKS_STORAGE_KEY);
        if (savedBookmarks) {
            try {
                setBookmarkedScripts(JSON.parse(savedBookmarks));
            } catch (e) {
                console.error("Failed to parse bookmarks:", e);
            }
        }
    }, []);
    
    const toggleBookmark = (hadithScript: string) => {
        const updatedBookmarks = bookmarkedScripts.includes(hadithScript)
            ? bookmarkedScripts.filter(script => script !== hadithScript)
            : [...bookmarkedScripts, hadithScript];
        
        setBookmarkedScripts(updatedBookmarks);
        localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(updatedBookmarks));
    };

    const hadithCategories = [
        ContentType.HadithQudsi, 
        ContentType.RiyadSalihin, 
        ContentType.PropheticManners,
        ContentType.Adhkar
    ].filter(type => staticHadithLibrary.some(h => h.type === type));

    const displayedHadiths = useMemo(() => {
        let baseList: LibraryHadith[] = [];
        if (activeTab === 'bookmarks') {
            baseList = hadithData.filter(h => bookmarkedScripts.includes(h.script));
        } else if (activeTab) {
            baseList = hadithData.filter(h => h.type === activeTab);
        }

        if (searchTerm) {
            return baseList.filter(h => 
                h.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                h.script.toLowerCase().includes(searchTerm.toLowerCase()) ||
                h.explanation.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        return baseList;
    }, [activeTab, hadithData, searchTerm, bookmarkedScripts]);

    const totalPages = Math.ceil(displayedHadiths.length / ITEMS_PER_PAGE);
    const paginatedHadiths = displayedHadiths.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handleTabClick = (type: ContentType | 'bookmarks') => {
        setActiveTab(type);
        setCurrentPage(1);
        setSearchTerm('');
    };

    return (
        <div className="p-4 bg-white rounded-lg shadow dark:bg-slate-800 animate-fade-in">
             <div className="flex flex-col items-center justify-between gap-4 p-4 mb-4 border-b border-gray-200 sm:flex-row dark:border-slate-700">
                <h2 className="text-xl font-bold text-teal-800 dark:text-teal-300">{t('hadithLibrary.title')}</h2>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-2 border-b border-gray-200 dark:border-slate-700">
                 <TabButton
                    key="bookmarks"
                    label={`★ ${t('hadithLibrary.bookmarksTab')}`}
                    isActive={activeTab === 'bookmarks'}
                    onClick={() => handleTabClick('bookmarks')}
                />
                {hadithCategories.map((type) => (
                    <TabButton
                        key={type}
                        label={t(CONTENT_TYPE_DETAILS[type as keyof typeof CONTENT_TYPE_DETAILS].labelKey)}
                        isActive={activeTab === type}
                        onClick={() => handleTabClick(type)}
                    />
                ))}
            </div>

            {activeTab && (
                <div className="mt-6">
                    <div className="my-4">
                        <input
                            type="search"
                            placeholder={t('hadithLibrary.searchPlaceholder')}
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full p-3 bg-slate-50 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-400"
                        />
                    </div>

                    {paginatedHadiths.length > 0 ? (
                        <>
                            <ul className="space-y-3">
                                {paginatedHadiths.map((hadith, index) => {
                                    const isBookmarked = bookmarkedScripts.includes(hadith.script);
                                    return (
                                     <li 
                                        key={index} 
                                        className="relative p-4 transition-all duration-300 transform bg-white border-l-4 border-teal-500 rounded-r-lg shadow-sm cursor-pointer group hover:shadow-md hover:border-teal-600 hover:bg-teal-50 hover:scale-[1.02] dark:bg-slate-700 dark:border-teal-500 dark:hover:bg-slate-600 dark:hover:border-teal-400"
                                        onClick={() => selectHadith(hadith)}
                                    >
                                        <h3 className="font-bold text-teal-800 text-md ltr:pr-8 rtl:pl-8 dark:text-teal-300">{hadith.title}</h3>
                                        <p className="mt-1 text-sm text-gray-600 truncate dark:text-slate-400">{hadith.script}</p>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleBookmark(hadith.script);
                                            }}
                                            title={isBookmarked ? t('hadithLibrary.bookmarkTooltipRemove') : t('hadithLibrary.bookmarkTooltipAdd')}
                                            className="absolute p-2 text-2xl transition-all duration-200 rounded-full opacity-50 top-2 ltr:right-2 rtl:left-2 group-hover:opacity-100 hover:bg-yellow-100 dark:hover:bg-yellow-500/20"
                                        >
                                           {isBookmarked ? <span className="text-yellow-500">★</span> : <span className="text-gray-400 dark:text-slate-500">☆</span>}
                                        </button>
                                    </li>
                                );
                                })}
                            </ul>
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                            />
                        </>
                    ) : (
                         <p className="py-8 text-center text-gray-500 dark:text-slate-400">
                            {searchTerm 
                                ? t('hadithLibrary.noResults', { searchTerm }) 
                                : activeTab === 'bookmarks'
                                ? t('hadithLibrary.noBookmarks')
                                : t('hadithLibrary.noHadithsInCategory')}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

export default HadithLibrary;
