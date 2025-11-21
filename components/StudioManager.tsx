import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Project } from '../types';

const StudioManager: React.FC = () => {
    const { projects, loadProject, deleteProject, renameProject, activeProjectId, goBack, canGoBack } = useAppContext();
    const { t, language } = useLanguage();
    
    // Sort projects by most recent first
    const sortedProjects = [...projects].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const handleRename = (project: Project) => {
        const newName = prompt(t('studioManager.renamePrompt'), project.title);
        if (newName && newName.trim() !== '') {
            renameProject(project.id, newName.trim());
        }
    };
    
    const handleDelete = (project: Project) => {
        if (confirm(t('studioManager.deleteConfirm'))) {
            deleteProject(project.id);
        }
    };

    return (
        <section className="relative p-6 bg-white rounded-lg shadow animate-fade-in dark:bg-slate-800">
            <button
                onClick={goBack}
                title={t('global.close')}
                className="absolute top-4 ltr:right-4 rtl:left-4 p-2 text-gray-500 rounded-full hover:bg-gray-200 dark:text-slate-400 dark:hover:bg-slate-600"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
             {canGoBack && (
                <button
                    onClick={goBack}
                    className="flex items-center gap-2 px-4 py-2 mb-6 font-semibold text-gray-700 transition-colors duration-200 bg-gray-100 rounded-lg shadow-sm hover:bg-gray-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
                    title={t('global.backToDashboard')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className={`w-5 h-5 ${language === 'ar' ? 'transform rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>{t('global.backToDashboard')}</span>
                </button>
            )}
            <h2 className="pb-4 mb-6 text-2xl font-bold text-center text-teal-800 border-b border-gray-200 dark:text-teal-300 dark:border-slate-700">
                {t('studioManager.title')}
            </h2>
            
            {sortedProjects.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                    <span className="text-5xl">📁</span>
                    <p className="mt-4 text-lg text-gray-500 dark:text-slate-400">
                        {t('studioManager.noProjects')}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {sortedProjects.map(project => {
                        const thumbnail = project.generatedContent?.scenes?.find(s => s.imageUrl)?.imageUrl;
                        const isActive = project.id === activeProjectId;
                        return (
                            <div key={project.id} className={`relative flex flex-col overflow-hidden transition-all duration-300 border rounded-lg shadow-md group dark:border-slate-700 ${isActive ? 'ring-2 ring-teal-500 dark:ring-teal-400' : 'hover:shadow-xl hover:-translate-y-1'}`}>
                                <div className="relative w-full h-40 bg-gray-200 dark:bg-slate-700">
                                    {thumbnail ? (
                                        <img src={thumbnail} alt={project.title} className="object-cover w-full h-full" />
                                    ) : (
                                        <div className="flex items-center justify-center w-full h-full">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-gray-400 dark:text-slate-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" /></svg>
                                        </div>
                                    )}
                                     <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                </div>

                                <div className="flex flex-col flex-grow p-4 bg-white dark:bg-slate-800">
                                    <h3 className="flex-grow font-bold text-gray-800 truncate dark:text-slate-200" title={project.title}>{project.title}</h3>
                                    <p className="text-xs text-gray-500 dark:text-slate-400">
                                        {t('studioManager.createdAt')} {new Date(project.createdAt).toLocaleString()}
                                    </p>
                                    
                                    <div className="flex justify-end gap-2 pt-3 mt-auto border-t border-gray-100 dark:border-slate-700">
                                        <button onClick={() => handleDelete(project)} title={t('studioManager.deleteProjectTooltip')} className="p-2 text-gray-500 rounded-full hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/50 dark:hover:text-red-400">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                        <button onClick={() => handleRename(project)} title={t('studioManager.renameProjectTooltip')} className="p-2 text-gray-500 rounded-full hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900/50 dark:hover:text-blue-400">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                        </button>
                                         <button onClick={() => loadProject(project.id)} title={t('studioManager.loadProjectTooltip')} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white transition-colors duration-200 bg-teal-600 rounded-md shadow hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600">
                                            {t('studioManager.loadProject')}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </section>
    );
};

export default StudioManager;
