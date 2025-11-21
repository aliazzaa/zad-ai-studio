
import React, { useState, useEffect } from 'react';
import { CONTENT_TYPE_DETAILS } from '../constants';
import { useAppContext } from '../contexts/AppContext';
import { useLanguage } from '../contexts/LanguageContext';

const ScheduleModal: React.FC = () => {
    const { isScheduleModalOpen, contentTypeToSchedule, closeScheduleModal, scheduleJob } = useAppContext();
    const { t } = useLanguage();

    const [scheduledAt, setScheduledAt] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (isScheduleModalOpen) {
            const now = new Date();
            now.setHours(now.getHours() + 1);
            const defaultDateTime = now.toISOString().slice(0, 16);
            setScheduledAt(defaultDateTime);
            setError('');
        }
    }, [isScheduleModalOpen]);

    if (!isScheduleModalOpen || !contentTypeToSchedule) {
        return null;
    }

    const handleSubmit = () => {
        const selectedDate = new Date(scheduledAt);
        if (selectedDate <= new Date()) {
            setError(t('scheduleModal.errorDateInPast'));
            return;
        }
        scheduleJob(contentTypeToSchedule, selectedDate.toISOString());
    };

    const contentTypeLabel = t(CONTENT_TYPE_DETAILS[contentTypeToSchedule].labelKey);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 animate-fade-in">
            <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl m-4 dark:bg-slate-800">
                <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-slate-700">
                    <h2 className="text-xl font-bold text-teal-800 dark:text-teal-300">
                        🗓️ {t('scheduleModal.title', { label: contentTypeLabel })}
                    </h2>
                     <button onClick={closeScheduleModal} className="p-1 text-gray-500 rounded-full hover:bg-gray-200 dark:text-slate-400 dark:hover:bg-slate-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <p className="mt-4 text-center text-gray-600 dark:text-slate-400">{t('scheduleModal.description')}</p>
                
                <div className="my-6">
                    <label htmlFor="schedule-time" className="block mb-2 font-semibold text-gray-700 dark:text-slate-300">{t('scheduleModal.timeLabel')}</label>
                    <input 
                        type="datetime-local" 
                        id="schedule-time"
                        value={scheduledAt}
                        onChange={(e) => setScheduledAt(e.target.value)}
                        min={new Date().toISOString().slice(0, 16)}
                        className="w-full p-3 text-lg text-center border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-400"
                    />
                    {error && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>}
                </div>

                <div className="flex justify-end gap-4 pt-4 border-t border-gray-200 dark:border-slate-700">
                    <button
                        onClick={closeScheduleModal}
                        className="px-6 py-2 font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 dark:bg-slate-600 dark:text-slate-200 dark:hover:bg-slate-500"
                    >
                        {t('global.cancel')}
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-6 py-2 font-bold text-white bg-teal-600 rounded-lg hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600"
                    >
                        {t('sidePanel.scheduler')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ScheduleModal;