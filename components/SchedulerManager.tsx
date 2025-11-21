
import React from 'react';
import { ScheduledJob } from '../types';
import { CONTENT_TYPE_DETAILS } from '../constants';
import { useAppContext } from '../contexts/AppContext';
import { useLanguage } from '../contexts/LanguageContext';


const SchedulerManager: React.FC= () => {
    const { scheduledJobs, viewJobContent, deleteJob, goBack, canGoBack } = useAppContext();
    const { t, language } = useLanguage();
    const sortedJobs = [...scheduledJobs].sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime());

    const getStatusChip = (status: ScheduledJob['status']) => {
        switch(status) {
            case 'Scheduled':
                return <span className="px-3 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900/50 dark:text-blue-200">{t('scheduler.status.scheduled')}</span>;
            case 'Completed':
                return <span className="px-3 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full dark:bg-green-900/50 dark:text-green-200">{t('scheduler.status.completed')}</span>;
            case 'Failed':
                return <span className="px-3 py-1 text-xs font-semibold text-red-800 bg-red-100 rounded-full dark:bg-red-900/50 dark:text-red-200">{t('scheduler.status.failed')}</span>;
            default:
                return null;
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
            <h2 className="pb-4 mb-6 text-2xl font-bold text-center text-teal-800 border-b border-gray-200 dark:text-teal-300 dark:border-slate-700">{t('scheduler.title')}</h2>
            {sortedJobs.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-slate-400">{t('scheduler.noJobs')}</p>
            ) : (
                <div className="space-y-4">
                    {sortedJobs.map(job => (
                        <div key={job.id} className="flex flex-col items-center justify-between gap-4 p-4 border border-gray-200 rounded-lg md:flex-row dark:border-slate-700">
                            <div className="flex-1 text-center md:text-right">
                                <p className="font-bold text-teal-700 dark:text-teal-400">{t(CONTENT_TYPE_DETAILS[job.contentType].labelKey)}</p>
                                <p className="text-sm text-gray-500 dark:text-slate-400">
                                    {new Date(job.scheduledAt).toLocaleString('ar-EG', { dateStyle: 'medium', timeStyle: 'short' })}
                                </p>
                                {job.status === 'Failed' && <p className="mt-1 text-xs text-red-500 truncate dark:text-red-400" title={job.error}>{t('scheduler.reason')}: {job.error}</p>}
                            </div>
                            <div className="flex items-center gap-2">
                                {getStatusChip(job.status)}
                                {job.status === 'Completed' && (
                                    <button
                                        onClick={() => viewJobContent(job)}
                                        className="px-3 py-1 text-sm font-semibold text-white bg-teal-600 rounded-full hover:bg-teal-700"
                                    >
                                        {t('scheduler.viewContent')}
                                    </button>
                                )}
                                {(job.status === 'Scheduled' || job.status === 'Failed') && (
                                     <button
                                        onClick={() => deleteJob(job.id)}
                                        className="px-3 py-1 text-sm font-semibold text-white bg-red-500 rounded-full hover:bg-red-600"
                                    >
                                        {t('global.delete')}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};

export default SchedulerManager;