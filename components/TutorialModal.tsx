import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { useLanguage } from '../contexts/LanguageContext';
import { TUTORIAL_SLIDES } from '../constants';

const TutorialModal: React.FC = () => {
    const { isTutorialModalOpen, closeTutorialModal } = useAppContext();
    const { t } = useLanguage();
    const [currentSlide, setCurrentSlide] = useState(0);

    if (!isTutorialModalOpen) {
        return null;
    }

    const handleNext = () => {
        if (currentSlide < TUTORIAL_SLIDES.length - 1) {
            setCurrentSlide(currentSlide + 1);
        } else {
            closeTutorialModal();
        }
    };

    const handlePrev = () => {
        if (currentSlide > 0) {
            setCurrentSlide(currentSlide - 1);
        }
    };

    const slide = TUTORIAL_SLIDES[currentSlide];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 animate-fade-in">
            <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-xl m-4 space-y-4 dark:bg-slate-800">
                <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-slate-700">
                    <h2 className="text-xl font-bold text-teal-800 dark:text-teal-300">
                        {t('tutorialModal.title')}
                    </h2>
                    <button onClick={closeTutorialModal} className="p-1 text-gray-500 rounded-full hover:bg-gray-200 dark:text-slate-400 dark:hover:bg-slate-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="text-center py-8 min-h-[200px] flex flex-col justify-center items-center">
                    <div className="text-6xl mb-4">{slide.icon}</div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2 dark:text-slate-200">{t(slide.titleKey)}</h3>
                    <p className="text-gray-600 dark:text-slate-400">{t(slide.descriptionKey)}</p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-slate-700">
                     <button
                        onClick={handlePrev}
                        disabled={currentSlide === 0}
                        className="px-6 py-2 font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-slate-600 dark:text-slate-200 dark:hover:bg-slate-500 dark:disabled:opacity-30"
                    >
                        {t('pagination.previous')}
                    </button>
                    
                    <div className="flex gap-2">
                        {TUTORIAL_SLIDES.map((_, index) => (
                            <div key={index} className={`w-3 h-3 rounded-full transition-colors duration-300 ${currentSlide === index ? 'bg-teal-600 dark:bg-teal-400' : 'bg-gray-300 dark:bg-slate-600'}`}></div>
                        ))}
                    </div>

                     <button
                        onClick={handleNext}
                        className="px-6 py-2 font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600"
                    >
                        {currentSlide === TUTORIAL_SLIDES.length - 1 ? t('feedbackModal.close') : t('pagination.next')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TutorialModal;