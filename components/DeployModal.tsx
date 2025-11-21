
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { useLanguage } from '../contexts/LanguageContext';

const DeployModal: React.FC = () => {
    const { isDeployModalOpen, closeDeployModal, openDocsModal } = useAppContext();
    const { t } = useLanguage();
    
    const [step, setStep] = useState(0); // 0: initial, 1-3: steps, 4: success
    const deploymentSteps = [
        'deployModal.step1',
        'deployModal.step2',
        'deployModal.step3'
    ];

    useEffect(() => {
        // Automatically advance steps
        if (step > 0 && step <= deploymentSteps.length) {
            const timer = setTimeout(() => {
                setStep(currentStep => currentStep + 1);
            }, 1500 + Math.random() * 500); // Simulate variable time for each step
            return () => clearTimeout(timer);
        }
    }, [step, deploymentSteps.length]);

    if (!isDeployModalOpen) {
        return null;
    }

    const handleStart = () => {
        setStep(1); // Start the deployment process
    };

    const handleClose = () => {
        setStep(0); // Reset for next time
        closeDeployModal();
    };

    const handleOpenRealGuide = () => {
        closeDeployModal();
        openDocsModal(); 
    };
    
    const renderInitialState = () => (
        <>
            <p className="mt-4 text-center text-gray-600 dark:text-slate-400">{t('deployModal.subtitle')}</p>
            
            <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 text-sm">
                <h4 className="font-bold text-slate-700 dark:text-slate-200 mb-2">{t('deployModal.quickStepsTitle')}</h4>
                <ol className="list-decimal list-inside space-y-1 text-slate-600 dark:text-slate-400">
                    <li><code>npm run build</code></li>
                    <li><code>firebase deploy</code></li>
                </ol>
            </div>

            <div className="flex flex-col items-center justify-center gap-4 mt-6">
                <button
                    onClick={handleStart}
                    className="w-full max-w-xs px-6 py-3 font-bold text-white transition-transform duration-300 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-lg shadow-lg hover:scale-105"
                >
                    {t('deployModal.start')}
                </button>
                 <button
                    onClick={handleClose}
                    className="text-sm text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200"
                >
                    {t('global.cancel')}
                </button>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100 dark:border-slate-700 text-center">
                <p className="text-xs text-gray-500 dark:text-slate-400 mb-2">{t('deployModal.developerNote')}</p>
                <button 
                    onClick={handleOpenRealGuide}
                    className="text-xs font-bold text-teal-600 hover:underline dark:text-teal-400"
                >
                    {t('deployModal.viewRealGuide')}
                </button>
            </div>
        </>
    );

    const renderProgressState = () => (
        <div className="mt-6">
            <ul className="space-y-4">
                {deploymentSteps.map((stepKey, index) => (
                    <li key={stepKey} className="flex items-center gap-4 text-lg">
                        {step > index + 1 ? (
                            <span className="text-2xl text-green-500">✅</span>
                        ) : step === index + 1 ? (
                            <div className="w-6 h-6 border-2 border-teal-600 border-solid rounded-full border-t-transparent animate-spin dark:border-teal-400 dark:border-t-transparent"></div>
                        ) : (
                            <span className="text-2xl text-gray-400 dark:text-slate-500">⚪</span>
                        )}
                        <span className={`transition-colors duration-300 ${step > index ? 'text-gray-800 dark:text-slate-200' : 'text-gray-500 dark:text-slate-400'}`}>
                            {t(stepKey)}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
    
    const renderSuccessState = () => (
         <div className="text-center mt-6 animate-fade-in">
            <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4 dark:bg-green-900/30">
                <span className="text-4xl">🚀</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">{t('deployModal.successTitle')}</h3>
            <p className="text-gray-600 dark:text-slate-300 mb-6">{t('deployModal.successMessage')}</p>
            
            <div className="bg-slate-100 dark:bg-slate-700 p-4 rounded-xl mb-6 flex items-center justify-between border border-slate-200 dark:border-slate-600">
                <div className="text-left">
                    <p className="text-xs text-gray-500 dark:text-slate-400 uppercase font-bold">{t('deployModal.liveUrlLabel')}</p>
                    <p className="text-teal-600 dark:text-teal-400 font-mono font-bold">https://zad-ai-studio.app/live</p>
                </div>
                <button 
                    onClick={() => alert("Copied to clipboard!")}
                    className="p-2 bg-white dark:bg-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-500 text-gray-600 dark:text-slate-200 shadow-sm transition-colors"
                    title={t('global.copyButton')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                </button>
            </div>

            <div className="flex gap-3">
                <button
                    onClick={handleClose}
                    className="flex-1 py-3 font-bold text-gray-700 bg-gray-200 rounded-xl hover:bg-gray-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
                >
                    {t('deployModal.close')}
                </button>
                <button
                    onClick={() => window.open('https://zad-ai-studio.app/live', '_blank')}
                    className="flex-1 py-3 font-bold text-white bg-teal-600 rounded-xl hover:bg-teal-700 shadow-lg hover:shadow-xl"
                >
                    {t('deployModal.visitSite')} ↗
                </button>
            </div>
        </div>
    );

    const getTitle = () => {
        if (step === 0) return t('deployModal.title');
        if (step > deploymentSteps.length) return t('global.success');
        return t('deployModal.deploying');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-md p-6 bg-white rounded-2xl shadow-2xl m-4 dark:bg-slate-800 border border-white/20">
                 <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-slate-700">
                    <h2 className="text-xl font-extrabold text-teal-800 dark:text-teal-300">{getTitle()}</h2>
                    <button onClick={handleClose} className="p-2 text-gray-500 rounded-full hover:bg-gray-100 dark:text-slate-400 dark:hover:bg-slate-700 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                {step === 0 && renderInitialState()}
                {step > 0 && step <= deploymentSteps.length && renderProgressState()}
                {step > deploymentSteps.length && renderSuccessState()}
            </div>
        </div>
    );
};

export default DeployModal;
