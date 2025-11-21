
import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import SkeletonLoader from '../SkeletonLoader';
import LoadingSpinner from '../LoadingSpinner';
import { CONTENT_TYPE_DETAILS, SUPPORTED_LANGUAGES } from '../../constants';
import { ContentType, Scene } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';

const ContentEditor: React.FC = () => {
    const { 
        generatedContent, 
        translatedContent,
        isLoading, 
        error, 
        updateGeneratedContent, 
        contentType,
        translateContent,
        isTranslating,
        clearContent,
        isGeneratingAudio,
        audioUrl,
        generateAudio,
        quizQuestion,
        isGeneratingQuiz,
        generateQuiz,
        autoGenerateVideo,
        isGeneratingVideo,
        generateAllSceneImages,
        isPreviewLoading
    } = useAppContext();
    const { t } = useLanguage();

    const [copied, setCopied] = useState(false);
    const [quizCopied, setQuizCopied] = useState(false);
    const [showTranslation, setShowTranslation] = useState(false);
    const [isTranslateDropdownOpen, setIsTranslateDropdownOpen] = useState(false);
    const translateDropdownRef = useRef<HTMLDivElement>(null);


    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (translateDropdownRef.current && !translateDropdownRef.current.contains(event.target as Node)) {
                setIsTranslateDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [translateDropdownRef]);

    useEffect(() => {
        setShowTranslation(false);
    }, [generatedContent]);

    const handleExport = () => {
        if (!generatedContent) return;
        const textToExport = generatedContent.scenes.map(scene => scene.text).join('\n\n');
        const content = `العنوان: ${generatedContent.title}\n\n${textToExport}`;
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${generatedContent.title.replace(/\s/g, '_')}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (isLoading) {
        return <SkeletonLoader />;
    }
    
    if (error && !generatedContent) {
        return (
             <div className="flex flex-col items-center justify-center h-full p-8 my-4 text-center bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-2xl shadow-lg dark:bg-red-900/20 dark:text-red-300 dark:border-red-800/30">
                <p className="mb-6 text-lg font-medium text-red-700 dark:text-red-400">{t(error)}</p>
                <button onClick={clearContent} className="px-8 py-3 text-sm font-bold text-white transition-all transform bg-red-600 rounded-xl shadow-md hover:bg-red-700 hover:shadow-xl hover:scale-105 active:scale-95">
                    {t('contentEditor.tryAgain')}
                </button>
            </div>
        );
    }

    if (!generatedContent || !contentType) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-12 text-center glass-panel rounded-2xl shadow-2xl">
                <div className="p-6 mb-8 bg-teal-50/50 rounded-full shadow-inner dark:bg-slate-700/30 border border-teal-100/50">
                    <span className="text-7xl drop-shadow-sm" role="img" aria-label={t('contentEditor.placeholderIconLabel')}>✍️</span>
                </div>
                <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-teal-700 to-teal-900 dark:from-teal-200 dark:to-teal-500">{t('contentEditor.title')}</h2>
                <p className="max-w-lg mt-4 text-xl leading-relaxed text-gray-500 dark:text-slate-400">
                    {t('contentEditor.placeholderTitle')}
                </p>
            </div>
        );
    }

    const contentToDisplay = showTranslation && translatedContent ? translatedContent : generatedContent;
    const details = CONTENT_TYPE_DETAILS[contentType as keyof typeof CONTENT_TYPE_DETAILS];
    const supportsInteractive = (details as any).supportsInteractive;

    const handleCopy = () => {
        const fullScript = contentToDisplay.scenes.map(s => s.text).join('\n\n');
        const textToCopy = `
${t('contentEditor.suggestedTitleLabel')}: ${contentToDisplay.title}

${fullScript}
---
YouTube Tips: ${generatedContent.youtubeTips}
Hashtags: ${generatedContent.hashtags.join(' ')}
        `.trim();
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleCopyQuiz = () => {
        if (!quizQuestion) return;
        const textToCopy = `
${quizQuestion.question}

A) ${quizQuestion.options[0]}
B) ${quizQuestion.options[1]}
C) ${quizQuestion.options[2]}
        `.trim();
        navigator.clipboard.writeText(textToCopy);
        setQuizCopied(true);
        setTimeout(() => setQuizCopied(false), 2000);
    };
    
    const handleTranslate = (language: string) => {
        translateContent(language).then(() => {
            setShowTranslation(true);
        });
    };

    const handleSceneTextChange = (sceneId: string, newText: string) => {
        if (!generatedContent) return;
        const newScenes = generatedContent.scenes.map(scene => 
            scene.id === sceneId ? { ...scene, text: newText } : scene
        );
        updateGeneratedContent({ scenes: newScenes });
    };

    const handleShareAudio = async () => {
        if (!audioUrl || !generatedContent) return;
        try {
            const response = await fetch(audioUrl);
            const blob = await response.blob();
            const file = new File([blob], `${generatedContent.title.replace(/\s/g, '_')}_story.wav`, { type: 'audio/wav' });

            if (navigator.share && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    title: generatedContent.title,
                    files: [file],
                });
            } else {
                alert(t('global.shareNotSupported'));
            }
        } catch (error) {
            console.error('Error sharing audio:', error);
            alert(t('global.shareError'));
        }
    };


    const ActionButton: React.FC<{ onClick: () => void, disabled?: boolean, children: React.ReactNode, variant?: 'primary' | 'danger', title?: string }> = ({ onClick, disabled, children, variant = 'primary', title }) => {
        const colorClasses = {
            primary: 'text-teal-900 border-teal-200 bg-white/80 backdrop-blur-sm hover:bg-teal-50 hover:border-teal-300 dark:bg-slate-800/80 dark:text-teal-300 dark:border-slate-600 dark:hover:bg-slate-700',
            danger: 'text-red-800 border-red-200 bg-white/80 backdrop-blur-sm hover:bg-red-50 hover:border-red-300 dark:bg-slate-800/80 dark:text-red-400 dark:border-red-900/50 dark:hover:bg-red-900/20',
        };
        return (
            <button
                onClick={onClick}
                disabled={disabled}
                title={title}
                className={`flex items-center gap-2 px-5 py-2.5 text-sm font-bold transition-all duration-200 border rounded-xl shadow-sm hover:shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${colorClasses[variant]}`}
            >
                {children}
            </button>
        );
    }

    return (
        <div className="p-8 shadow-2xl glass-panel rounded-2xl space-y-8 animate-fade-in border border-white/30">
            <div>
                <label className="block mb-3 text-sm font-bold text-teal-800 uppercase tracking-wider opacity-80 dark:text-teal-300" htmlFor="title-input">{t('contentEditor.suggestedTitleLabel')}</label>
                <input
                    id="title-input"
                    type="text"
                    value={contentToDisplay.title}
                    onChange={(e) => updateGeneratedContent({ title: e.target.value })}
                    className="w-full p-4 text-3xl font-extrabold text-gray-800 transition-all bg-white/60 border border-gray-200/60 rounded-xl backdrop-blur-md focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 dark:bg-slate-900/60 dark:border-white/10 dark:text-white shadow-inner"
                />
            </div>
            
            <div className="space-y-6">
                 <label className="block text-sm font-bold text-teal-800 uppercase tracking-wider opacity-80 dark:text-teal-300">{t('contentEditor.scenesTitle')}</label>
                 {contentToDisplay.scenes.map((scene, index) => (
                    <div key={scene.id} className="relative p-6 transition-all bg-white/50 border border-white/40 rounded-2xl hover:shadow-lg hover:bg-white/70 dark:bg-slate-800/40 dark:border-white/5 dark:hover:bg-slate-800/60 group backdrop-blur-sm">
                        <span className="absolute top-4 left-4 px-3 py-1 text-xs font-bold text-teal-800 bg-teal-100/80 rounded-lg backdrop-blur-md dark:bg-teal-900/80 dark:text-teal-200 border border-teal-200/50 z-10">
                           {t('contentEditor.sceneLabel', { number: index + 1 })}
                        </span>
                        
                        <div className="flex flex-col md:flex-row gap-6 mt-8">
                            <div className="flex-grow space-y-3">
                                <label className="text-xs font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wide">{t('contentEditor.scriptLabel')}</label>
                                <textarea
                                    id={`scene-input-${index}`}
                                    value={scene.text}
                                    onChange={(e) => handleSceneTextChange(scene.id, e.target.value)}
                                    rows={4}
                                    className="w-full p-2 text-xl leading-relaxed text-gray-800 bg-transparent border-0 rounded-md resize-none focus:ring-0 dark:text-slate-100 font-medium placeholder-gray-400"
                                    placeholder={t('contentEditor.scriptLabel')}
                                />
                                
                                <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-gray-100 dark:border-white/5 mt-2">
                                    <label className="text-xs font-bold text-gray-500 dark:text-slate-500 uppercase block mb-1">{t('contentEditor.visualSuggestionLabel')}</label>
                                    <p className="text-sm text-gray-600 dark:text-slate-300 italic leading-relaxed">{scene.visualSuggestion}</p>
                                </div>
                            </div>

                            <div className="md:w-1/3 flex-shrink-0">
                                {scene.imageUrl ? (
                                    <img src={scene.imageUrl} alt={`Scene ${index + 1}`} className="w-full rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 aspect-video object-cover bg-gray-100 dark:bg-slate-800" />
                                ) : (
                                    <div className="w-full aspect-video bg-gray-100 dark:bg-slate-800/50 rounded-lg border border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-400 text-xs text-center p-4 transition-colors hover:bg-gray-50 dark:hover:bg-slate-800">
                                        <span className="flex flex-col items-center gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                            {t('publishingPanel.storyboard.notGenerated')}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                 ))}
            </div>
            
            {contentType === ContentType.QuranicAudioStories && (
                <div className="p-6 mt-6 border border-teal-200/50 rounded-2xl bg-gradient-to-br from-teal-50/40 to-cyan-50/40 dark:bg-teal-900/10 dark:border-teal-800/30 backdrop-blur-md">
                    <h4 className="text-lg font-bold text-center text-teal-800 dark:text-teal-300 mb-4">{t('contentEditor.audioStoryToolsTitle')}</h4>
                    <div className="flex flex-col items-center justify-center gap-4">
                        <button
                            onClick={generateAudio}
                            disabled={isGeneratingAudio}
                            title={t('contentEditor.generateAudioTooltip')}
                            className="w-full max-w-xs px-8 py-3.5 font-bold text-white transition-all duration-300 bg-gradient-to-r from-cyan-600 to-teal-600 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 disabled:bg-gray-400 disabled:scale-100"
                        >
                            {isGeneratingAudio ? t('contentEditor.generatingAudio') : t('contentEditor.generateAudioButton')}
                        </button>
                        {isGeneratingAudio && <LoadingSpinner message={t('contentEditor.generatingAudio')}/>}
                        {audioUrl && (
                             <div className="w-full mt-4 space-y-4 p-4 bg-white/40 rounded-xl backdrop-blur-sm dark:bg-slate-800/40">
                                <audio controls className="w-full h-10 rounded-full" src={audioUrl}>
                                    {t('contentEditor.audioElementNotSupported')}
                                </audio>
                                <div className="flex justify-center gap-4">
                                    <a href={audioUrl} download={`${generatedContent.title.replace(/\s/g, '_')}_story.wav`} className="flex items-center gap-2 px-5 py-2 text-sm font-bold text-teal-800 transition-all bg-white/80 border border-teal-200 rounded-lg shadow-sm hover:bg-white hover:scale-105 dark:bg-slate-800 dark:text-teal-300 dark:border-teal-700">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                                        {t('global.download')}
                                    </a>
                                    {navigator.share && (
                                        <button onClick={handleShareAudio} className="flex items-center gap-2 px-5 py-2 text-sm font-bold text-teal-800 transition-all bg-white/80 border border-teal-200 rounded-lg shadow-sm hover:bg-white hover:scale-105 dark:bg-slate-800 dark:text-teal-300 dark:border-teal-700">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor"><path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" /></svg>
                                            {t('global.share')}
                                        </button>
                                    )}
                                </div>
                             </div>
                        )}
                    </div>
                </div>
            )}

            {supportsInteractive && (
                 <div className="p-6 mt-6 border border-dashed border-teal-300/50 rounded-2xl dark:border-teal-700 bg-teal-50/20 dark:bg-teal-900/10">
                    <h4 className="text-lg font-bold text-center text-teal-800 dark:text-teal-300 mb-4">{t('contentEditor.engagementTools.title')}</h4>
                    {!quizQuestion && (
                        <div className="flex flex-col items-center justify-center gap-4">
                            <button
                                onClick={generateQuiz}
                                disabled={isGeneratingQuiz}
                                title={t('contentEditor.generateQuizTooltip')}
                                className="w-full max-w-xs px-8 py-3.5 font-bold text-white transition-all duration-300 bg-gradient-to-r from-cyan-600 to-teal-600 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 disabled:bg-gray-400 disabled:scale-100"
                            >
                                {isGeneratingQuiz ? t('contentEditor.engagementTools.generatingQuiz') : t('contentEditor.engagementTools.generateQuizButton')}
                            </button>
                            {isGeneratingQuiz && <LoadingSpinner message={t('contentEditor.engagementTools.generatingQuiz')}/>}
                        </div>
                    )}
                    {quizQuestion && (
                        <div className="mt-4 p-6 bg-white/80 border border-white/60 rounded-2xl shadow-sm animate-fade-in dark:bg-slate-800/80 dark:border-slate-600 backdrop-blur-sm">
                            <p className="text-xl font-bold text-gray-800 dark:text-slate-100 mb-4">{quizQuestion.question}</p>
                            <ul className="space-y-3">
                                {quizQuestion.options.map((option, index) => (
                                    <li key={index} className={`p-4 rounded-xl transition-colors border ${index === quizQuestion.correctAnswerIndex ? 'bg-green-100/80 border-green-300 text-green-900 font-bold dark:bg-green-900/40 dark:text-green-200' : 'bg-gray-50/50 border-gray-100 text-gray-700 dark:bg-slate-700/50 dark:text-slate-300 dark:border-slate-600'}`}>
                                        <span className="inline-flex items-center justify-center w-8 h-8 ltr:mr-2 rtl:ml-2 font-bold bg-white rounded-full shadow-sm dark:bg-slate-800">{String.fromCharCode(65 + index)}</span> {option} {index === quizQuestion.correctAnswerIndex ? `(${t('contentEditor.engagementTools.correctAnswer')})` : ''}
                                    </li>
                                ))}
                            </ul>
                             <div className="flex justify-end mt-6">
                                <button
                                    onClick={handleCopyQuiz}
                                    className="px-6 py-2.5 text-sm font-bold text-cyan-800 transition-all bg-cyan-50 border border-cyan-200 rounded-xl shadow-sm hover:bg-cyan-100 hover:shadow-md dark:bg-slate-800 dark:text-cyan-300 dark:border-cyan-700"
                                >
                                    {quizCopied ? t('contentEditor.copied') : t('contentEditor.engagementTools.copyQuizButton')}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}


            <div className="flex flex-wrap items-center justify-end gap-3 pt-6 border-t border-gray-200/50 dark:border-white/10">
                {/* Generate Visuals Button (New) */}
                 <button
                    onClick={() => generateAllSceneImages('16:9', {})}
                    disabled={isPreviewLoading || isGeneratingVideo}
                    className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white transition-all duration-300 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100"
                    title="Generate AI images for all scenes"
                >
                    {isPreviewLoading ? (
                         <span className="flex items-center gap-2">
                             <div className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                             {t('global.loading')}
                        </span>
                    ) : (
                        <span className="flex items-center gap-2">
                            <span>🖼️</span>
                            {t('contentEditor.generateVisualsButton')}
                        </span>
                    )}
                </button>

                {/* Direct Video Generation Button */}
                <button
                    onClick={autoGenerateVideo}
                    disabled={isGeneratingVideo || isPreviewLoading}
                    className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white transition-all duration-300 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100"
                    title={t('contentEditor.createVideoDirectly')}
                >
                    {isGeneratingVideo ? (
                        <span className="flex items-center gap-2">
                             <div className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                             {t('global.loading')}
                        </span>
                    ) : (
                        <span className="flex items-center gap-2">
                            <span>🎬</span>
                            {t('contentEditor.createVideoDirectly')}
                        </span>
                    )}
                </button>

                <div className="relative" ref={translateDropdownRef}>
                    <ActionButton 
                        onClick={() => setIsTranslateDropdownOpen(o => !o)} 
                        disabled={isTranslating} 
                        title={t('contentEditor.translateTooltip')}
                    >
                        <span>🌐 {isTranslating ? t('contentEditor.translating') : t('contentEditor.translateButton')}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 ltr:ml-1 rtl:mr-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                    </ActionButton>

                    {isTranslateDropdownOpen && (
                        <div className="absolute bottom-full mb-2 ltr:right-0 rtl:left-0 z-10 w-48 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl dark:bg-slate-800 ring-1 ring-black ring-opacity-5 overflow-hidden animate-fade-in border border-white/20">
                            <ul className="py-1">
                                {Object.entries(SUPPORTED_LANGUAGES)
                                    .filter(([code]) => code !== 'ar') 
                                    .map(([code, name]) => (
                                        <li
                                            key={code}
                                            onClick={() => {
                                                handleTranslate(code);
                                                setIsTranslateDropdownOpen(false);
                                            }}
                                            className="block w-full px-4 py-2.5 text-sm text-left text-gray-700 cursor-pointer hover:bg-teal-50 hover:text-teal-700 dark:text-white dark:hover:bg-slate-700"
                                        >
                                            {name}
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>
                    )}
                </div>
                
                {translatedContent && (
                    <ActionButton 
                        onClick={() => setShowTranslation(s => !s)} 
                    >
                        {showTranslation ? t('contentEditor.showOriginalButton') : t('contentEditor.showTranslationButton')}
                    </ActionButton>
                )}

                <ActionButton onClick={handleCopy} title={t('contentEditor.copyTooltip')}>📋 {copied ? t('contentEditor.copied') : t('contentEditor.copyButton')}</ActionButton>
                <ActionButton onClick={handleExport} title={t('contentEditor.exportTooltip')}>📄 {t('contentEditor.exportButton')}</ActionButton>
                <ActionButton onClick={clearContent} variant="danger" title={t('contentEditor.deleteTooltip')}>
                   🗑️ {t('global.delete')}
                </ActionButton>
            </div>
        </div>
    );
};

export default ContentEditor;
