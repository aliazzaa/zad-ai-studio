

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Surah, Ayah } from '../types';
import LoadingSpinner from './LoadingSpinner';
import Pagination from './Pagination';
import { useAppContext } from '../contexts/AppContext';
import { useLanguage } from '../contexts/LanguageContext';
import { surahs as staticSurahs, quranData as staticQuranData } from '../quranData';


const VERSES_PER_PAGE = 10;

const QuranLibrary: React.FC = () => {
    const { selectVerses } = useAppContext();
    const { t } = useLanguage();
    const [surahs] = useState<Surah[]>(staticSurahs);
    const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);
    const [verses, setVerses] = useState<Ayah[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [playingAudio, setPlayingAudio] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement>(null);
    const [currentPage, setCurrentPage] = useState(1);
    
    const [selectedVerses, setSelectedVerses] = useState<Ayah[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (selectedSurah) {
            setSelectedVerses([]);
            setIsLoading(true);
            setVerses([]);
            setError(null);
            
            // Artificial delay to show loading state, as local data is too fast
            setTimeout(() => {
                const surahVerses = staticQuranData[selectedSurah.number];
                if (surahVerses) {
                    setVerses(surahVerses);
                } else {
                    setError(t('quranLibrary.fetchSurahError', { surahName: selectedSurah.name }));
                }
                setIsLoading(false);
            }, 100); // 100ms delay
        }
    }, [selectedSurah, t]);

    const handlePlayAudio = (audioUrl: string) => {
        if (audioRef.current) {
            if (playingAudio === audioUrl) {
                audioRef.current.pause();
                setPlayingAudio(null);
            } else {
                audioRef.current.src = audioUrl;
                audioRef.current.play();
                setPlayingAudio(audioUrl);
            }
        }
    };

    const handleSurahChange = (surahNumber: string) => {
        const surah = surahs.find(s => s.number === parseInt(surahNumber)) || null;
        setSelectedSurah(surah);
        setCurrentPage(1);
        setSelectedVerses([]);
        setSearchTerm('');
    };

     const handleVerseClick = (ayah: Ayah) => {
        setSelectedVerses(prev => {
            const isSelected = prev.some(v => v.number === ayah.number);
            if (isSelected) {
                return prev.filter(v => v.number !== ayah.number);
            } else {
                return [...prev, ayah];
            }
        });
    };

    const filteredVerses = useMemo(() => {
        if (!searchTerm) return verses;
        return verses.filter(ayah => 
            ayah.text.includes(searchTerm) || 
            ayah.numberInSurah.toString().includes(searchTerm)
        );
    }, [verses, searchTerm]);

    const totalPages = Math.ceil(filteredVerses.length / VERSES_PER_PAGE);
    const paginatedVerses = filteredVerses.slice(
        (currentPage - 1) * VERSES_PER_PAGE,
        currentPage * VERSES_PER_PAGE
    );

    return (
        <div className="relative p-4 pb-24 bg-white rounded-lg shadow animate-fade-in dark:bg-slate-800">
             <div className="flex flex-col items-center justify-between gap-4 p-4 mb-4 border-b border-gray-200 sm:flex-row dark:border-slate-700">
                <h2 className="text-xl font-bold text-teal-800 dark:text-teal-300">{t('quranLibrary.title')}</h2>
            </div>
            
            <div className="my-4">
                <select 
                    onChange={(e) => handleSurahChange(e.target.value)}
                    value={selectedSurah?.number || ''}
                    className="w-full p-3 bg-slate-50 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                >
                    <option value="" disabled>{t('quranLibrary.selectSurah')}</option>
                    {surahs.map(surah => (
                        <option key={surah.number} value={surah.number}>
                            {surah.number}. {surah.name} ({surah.englishName})
                        </option>
                    ))}
                </select>
            </div>

            {selectedSurah && (
                 <div className="my-4">
                    <input
                        type="search"
                        placeholder={t('quranLibrary.searchPlaceholder')}
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="w-full p-3 bg-slate-50 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-400"
                    />
                </div>
            )}

            {isLoading && selectedSurah && <LoadingSpinner message={t('quranLibrary.loadingSurah', { surahName: selectedSurah.name })} />}
            {error && <p className="text-center text-red-600 dark:text-red-400">{error}</p>}

            {paginatedVerses.length > 0 && selectedSurah && !isLoading && (
                <div className="mt-6">
                    <div className="p-4 mb-6 text-center text-white bg-teal-700 rounded-lg shadow-md dark:bg-teal-800">
                        <h3 className="text-3xl font-bold">{selectedSurah.name}</h3>
                        <p className="mt-1 text-lg opacity-90">{selectedSurah.englishName}</p>
                        <div className="flex justify-center gap-6 mt-3 text-sm">
                            <span className="px-3 py-1 bg-teal-800 rounded-full bg-opacity-50 dark:bg-teal-900">
                                {t('quranLibrary.surahNumber')} {selectedSurah.number}
                            </span>
                            <span className="px-3 py-1 bg-teal-800 rounded-full bg-opacity-50 dark:bg-teal-900">
                                {t('quranLibrary.ayahCount')} {selectedSurah.numberOfAyahs}
                            </span>
                        </div>
                    </div>
                    <ul className="space-y-4">
                        {paginatedVerses.map((ayah) => {
                             const isSelected = selectedVerses.some(v => v.number === ayah.number);
                             return (
                                <li 
                                    key={ayah.number}
                                    onClick={() => handleVerseClick(ayah)}
                                    className={`p-4 transition-all duration-200 border-r-4 rounded-md shadow-sm cursor-pointer dark:text-slate-200 ${isSelected ? 'bg-teal-100 border-teal-600 ring-2 ring-teal-500 dark:bg-teal-900/50 dark:border-teal-400 dark:ring-teal-400' : 'bg-gray-50 border-transparent hover:bg-teal-50 dark:bg-slate-700/50 dark:hover:bg-slate-700'}`}
                                >
                                    <p className="flex items-start text-lg leading-loose text-gray-800 dark:text-slate-200">
                                        <span className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 mx-4 text-sm font-bold text-teal-700 bg-teal-200 rounded-full dark:bg-teal-800 dark:text-teal-200">
                                            {ayah.numberInSurah}
                                        </span>
                                        {ayah.text}
                                    </p>
                                    <div className="flex items-center justify-end gap-2 mt-3">
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); handlePlayAudio(ayah.audio); }} 
                                            title={t('quranLibrary.playAudioTooltip')}
                                            className="px-3 py-1 text-sm text-teal-700 bg-teal-100 rounded-full hover:bg-teal-200 dark:bg-teal-800 dark:text-teal-200 dark:hover:bg-teal-700">
                                            {playingAudio === ayah.audio ? t('quranLibrary.pause') : t('quranLibrary.listen')}
                                        </button>
                                    </div>
                                </li>
                             );
                        })}
                    </ul>
                    <Pagination 
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </div>
            )}
            
            {verses.length > 0 && paginatedVerses.length === 0 && searchTerm && (
                 <p className="py-8 text-center text-gray-500 dark:text-slate-400">
                    {t('quranLibrary.noResults', { searchTerm, surahName: selectedSurah?.name })}
                </p>
            )}

            <audio ref={audioRef} onEnded={() => setPlayingAudio(null)} />
            
             {selectedVerses.length > 0 && selectedSurah && (
                <div className="fixed bottom-0 left-0 right-0 z-20 p-4 bg-white border-t-2 border-teal-500 shadow-2xl animate-fade-in dark:bg-slate-800 dark:border-teal-500">
                    <div className="container flex flex-col items-center justify-between gap-2 mx-auto sm:flex-row">
                        <span className="text-lg font-semibold text-teal-800 dark:text-teal-300">
                            {t('quranLibrary.versesSelected', { count: selectedVerses.length })}
                        </span>
                        <button 
                            onClick={() => {
                                selectVerses(selectedVerses, selectedSurah);
                            }}
                            className="px-6 py-3 font-bold text-white transition-transform duration-200 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-lg shadow-lg hover:scale-105"
                        >
                            {t('quranLibrary.generateFromSelection')}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuranLibrary;