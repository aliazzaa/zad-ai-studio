import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { useLanguage } from '../contexts/LanguageContext';

const FeedbackModal: React.FC = () => {
    const { isFeedbackModalOpen, closeFeedbackModal, submitFeedback } = useAppContext();
    const { t } = useLanguage();
    const [feedback, setFeedback] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [aiResponse, setAiResponse] = useState('');

    if (!isFeedbackModalOpen) {
        return null;
    }

    const handleClose = () => {
        setFeedback('');
        setIsLoading(false);
        setAiResponse('');
        closeFeedbackModal();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!feedback.trim()) return;
        setIsLoading(true);
        try {
            const response = await submitFeedback(feedback);
            setAiResponse(response);
        } catch (error) {
            setAiResponse(t('apiErrors.unexpected'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 animate-fade-in">
            <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-xl m-4 dark:bg-slate-800">
                 <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-slate-700">
                    <h2 className="text-xl font-bold text-teal-800 dark:text-teal-300">{aiResponse ? t('feedbackModal.successTitle') : t('feedbackModal.title')}</h2>
                    <button onClick={handleClose} className="p-1 text-gray-500 rounded-full hover:bg-gray-200 dark:text-slate-400 dark:hover:bg-slate-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                {!aiResponse ? (
                    <>
                        <p className="mt-4 text-center text-gray-600 dark:text-slate-400">{t('feedbackModal.subtitle')}</p>
                        
                        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                            <div>
                                <textarea 
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                    placeholder={t('feedbackModal.placeholder')}
                                    rows={5}
                                    className="w-full p-3 text-lg border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-400"
                                    disabled={isLoading}
                                />
                            </div>
                             <div className="flex justify-end gap-4 pt-4 border-t border-gray-200 dark:border-slate-700">
                                <button
                                    onClick={handleClose}
                                    type="button"
                                    className="px-6 py-2 font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 dark:bg-slate-600 dark:text-slate-200 dark:hover:bg-slate-500"
                                >
                                    {t('global.cancel')}
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 font-bold text-white bg-teal-600 rounded-lg hover:bg-teal-700 disabled:bg-gray-400 dark:bg-teal-500 dark:hover:bg-teal-600 dark:disabled:bg-slate-500"
                                    disabled={isLoading || !feedback.trim()}
                                >
                                    {isLoading ? t('feedbackModal.submitting') : t('feedbackModal.submit')}
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    <div className="text-center mt-4 animate-fade-in">
                        <p className="text-lg text-gray-700 whitespace-pre-wrap dark:text-slate-300">{aiResponse}</p>
                        <button
                            onClick={handleClose}
                            className="w-full max-w-xs px-6 py-3 mt-6 font-bold text-white bg-teal-600 rounded-lg hover:bg-teal-700"
                        >
                            {t('feedbackModal.close')}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FeedbackModal;