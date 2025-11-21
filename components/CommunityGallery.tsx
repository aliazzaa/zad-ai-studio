
import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { useLanguage } from '../contexts/LanguageContext';
import { communityProjects } from '../libraryData';
import { CommunityProject, ContentType } from '../types';
import { CONTENT_TYPE_DETAILS } from '../constants';

const CommunityGallery: React.FC = () => {
    const { cloneCommunityProject, goBack, canGoBack } = useAppContext();
    const { t, language } = useLanguage();
    const [filter, setFilter] = useState<ContentType | 'all'>('all');

    const filteredProjects = filter === 'all' 
        ? communityProjects 
        : communityProjects.filter(p => p.contentType === filter);

    const categories = Array.from(new Set(communityProjects.map(p => p.contentType)));

    return (
        <div className="p-6 space-y-8 animate-fade-in">
             <div className="flex items-center justify-between">
                {canGoBack && (
                    <button onClick={goBack} className="flex items-center gap-2 px-5 py-2.5 font-bold text-teal-800 transition-all bg-white/80 rounded-full shadow-sm hover:bg-white hover:shadow backdrop-blur-md dark:bg-slate-800/80 dark:text-teal-300 dark:hover:bg-slate-800">
                        <svg xmlns="http://www.w3.org/2000/svg" className={`w-5 h-5 ${language === 'ar' ? 'transform rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        <span>{t('global.backToDashboard')}</span>
                    </button>
                )}
                <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-300 dark:to-pink-300 filter drop-shadow-sm">{t('community.title')}</h2>
                <div className="w-10"></div>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-white/20">
                <div className="flex flex-wrap gap-2 justify-center mb-8">
                    <button 
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${filter === 'all' ? 'bg-purple-600 text-white shadow-lg' : 'bg-white/50 text-gray-600 hover:bg-white dark:bg-slate-700/50 dark:text-slate-300'}`}
                    >
                        {t('community.all')}
                    </button>
                    {categories.map(cat => (
                        <button 
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${filter === cat ? 'bg-purple-600 text-white shadow-lg' : 'bg-white/50 text-gray-600 hover:bg-white dark:bg-slate-700/50 dark:text-slate-300'}`}
                        >
                            {t(CONTENT_TYPE_DETAILS[cat].labelKey)}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.map((project) => (
                        <div key={project.id} className="group relative bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg transition-transform hover:-translate-y-2 border border-gray-100 dark:border-slate-700">
                            <div className="h-48 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-slate-700 dark:to-slate-600 relative overflow-hidden">
                                {project.thumbnailUrl ? (
                                    <img src={project.thumbnailUrl} alt={project.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-6xl">✨</div>
                                )}
                                <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-md text-white text-xs px-2 py-1 rounded-md">
                                    {t(CONTENT_TYPE_DETAILS[project.contentType].labelKey)}
                                </div>
                            </div>
                            
                            <div className="p-5">
                                <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-1">{project.title}</h3>
                                <p className="text-xs text-gray-500 dark:text-slate-400 mb-3">{t('community.by')} {project.authorName}</p>
                                <p className="text-sm text-gray-600 dark:text-slate-300 mb-4 line-clamp-2">{project.description}</p>
                                
                                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-slate-500 mb-4">
                                    <span className="flex items-center gap-1">👁️ {project.views}</span>
                                    <span className="flex items-center gap-1">❤️ {project.likes}</span>
                                </div>

                                <button 
                                    onClick={() => cloneCommunityProject(project)}
                                    className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl shadow-md hover:shadow-lg hover:opacity-90 transition-all flex items-center justify-center gap-2"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" /></svg>
                                    {t('community.cloneButton')}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CommunityGallery;
