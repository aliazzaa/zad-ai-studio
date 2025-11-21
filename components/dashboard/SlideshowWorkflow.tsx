

import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { VIDEO_ADVANCED_SETTINGS_OPTIONS } from '../../constants';
import { VideoSettings, Scene, WatermarkSettings } from '../../types';
import ScenePreview from '../VideoPreview';
import WorkflowStep from './WorkflowStep';

const SlideshowWorkflow: React.FC = () => {
    const { 
        generatedContent, 
        translatedContent,
        generateAllSceneImages,
        generateSceneImage,
        isPreviewLoading,
        generateVideoAudio,
        isGeneratingVideoAudio,
        videoAudioUrl,
        backgroundMusicUrl,
        isGeneratingBackgroundMusic,
        generateBackgroundMusic,
        combineImageAndAudio,
        isGeneratingVideo,
        generateSilentPreview,
        loadingMessage,
        videoGenerationProgress,
        error,
        uploadSceneImage,
        uploadVideoAudio,
        watermarkImageUrl,
        watermarkSettings,
        uploadWatermarkImage,
        updateWatermarkSettings,
        removeWatermark
    } = useAppContext();
    const { t } = useLanguage();
    
    const [advancedSettings, setAdvancedSettings] = useState<VideoSettings>({
        resolution: VIDEO_ADVANCED_SETTINGS_OPTIONS.resolutions[1].value,
        aspectRatio: VIDEO_ADVANCED_SETTINGS_OPTIONS.aspectRatios[0].value,
        frameRate: VIDEO_ADVANCED_SETTINGS_OPTIONS.frameRates[1].value,
        transition: VIDEO_ADVANCED_SETTINGS_OPTIONS.transitions[0].value,
    });
    const [audioScript, setAudioScript] = useState('');
    const [customPrompts, setCustomPrompts] = useState<{ [sceneId: string]: string }>({});
    const [musicPrompt, setMusicPrompt] = useState('');

    const imageInputRef = useRef<HTMLInputElement>(null);
    const audioInputRef = useRef<HTMLInputElement>(null);
    const watermarkInputRef = useRef<HTMLInputElement>(null);
    const [targetSceneId, setTargetSceneId] = useState<string | null>(null);

    useEffect(() => {
        if (generatedContent) {
            const contentToSpeak = translatedContent || generatedContent;
            setAudioScript(contentToSpeak.scenes.map(s => s.text).join('\n\n'));
            
            const initialPrompts = generatedContent.scenes.reduce((acc, scene) => {
                acc[scene.id] = scene.visualSuggestion;
                return acc;
            }, {} as { [sceneId: string]: string });
            setCustomPrompts(initialPrompts);

            setMusicPrompt(`Spiritual, calm, and hopeful background music suitable for a video titled "${generatedContent.title}".`);
        }
    }, [generatedContent, translatedContent]);
    
    const handlePromptChange = (sceneId: string, newPrompt: string) => {
        setCustomPrompts(prev => ({ ...prev, [sceneId]: newPrompt }));
    };

    const handleImageUploadClick = (sceneId: string) => {
        setTargetSceneId(sceneId);
        imageInputRef.current?.click();
    };

    const handleImageFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && targetSceneId) {
            uploadSceneImage(targetSceneId, file);
        }
        if(event.target) event.target.value = ''; // Allow re-uploading the same file
    };

    const handleAudioFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            uploadVideoAudio(file);
        }
    };
    
    const handleWatermarkFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            uploadWatermarkImage(file);
        }
    };


    if (!generatedContent) return null;
    
    if (isGeneratingVideo) {
         return (
            <div className="p-6 bg-white rounded-lg shadow-md dark:bg-slate-800 flex flex-col items-center justify-center">
                <h3 className="mb-4 text-xl font-bold text-center text-teal-800 dark:text-teal-300">{t('publishingPanel.progress.title')}</h3>
                <div className="w-full my-4 bg-gray-200 rounded-full dark:bg-slate-700">
                    <div
                        className="p-1 text-xs font-medium leading-none text-center text-white bg-teal-500 rounded-full"
                        style={{ width: `${videoGenerationProgress}%` }}
                    >
                        {videoGenerationProgress}%
                    </div>
                </div>
                <p className="mt-2 text-sm text-center text-gray-600 dark:text-slate-400">{t(loadingMessage)}</p>
            </div>
        );
    }

    const scenes = translatedContent?.scenes || generatedContent.scenes;
    const allImagesGenerated = generatedContent.scenes.every(s => s.imageUrl);

    const handleShareVoiceover = async () => {
        if (!videoAudioUrl || !generatedContent) return;
        try {
            const response = await fetch(videoAudioUrl);
            const blob = await response.blob();
            const file = new File([blob], `${generatedContent.title.replace(/\s/g, '_')}_voiceover.wav`, { type: 'audio/wav' });

            if (navigator.share && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    title: generatedContent.title,
                    files: [file],
                });
            } else {
                alert(t('global.shareNotSupported'));
            }
        } catch (error) {
            console.error('Error sharing voiceover:', error);
            alert(t('global.shareError'));
        }
    };

    const handleShareMusic = async () => {
        if (!backgroundMusicUrl || !generatedContent) return;
        try {
            const response = await fetch(backgroundMusicUrl);
            const blob = await response.blob();
            const file = new File([blob], `${generatedContent.title.replace(/\s/g, '_')}_music.mp3`, { type: 'audio/mpeg' });

            if (navigator.share && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    title: t('publishingPanel.music.shareTitle'),
                    files: [file],
                });
            } else {
                alert(t('global.shareNotSupported'));
            }
        } catch (error) {
            console.error('Error sharing music:', error);
            alert(t('global.shareError'));
        }
    };

    const sizeOptions: {label: string, value: number}[] = [
        { label: t('publishingPanel.watermark.sizeOptions.small'), value: 0.1 },
        { label: t('publishingPanel.watermark.sizeOptions.medium'), value: 0.15 },
        { label: t('publishingPanel.watermark.sizeOptions.large'), value: 0.20 },
    ];

    const positionOptions: {label: string, value: WatermarkSettings['position']}[] = [
        { label: '⬉', value: 'top-left' },
        { label: '⬈', value: 'top-right' },
        { label: '⬋', value: 'bottom-left' },
        { label: '⬊', value: 'bottom-right' },
    ];

    return (
        <div className="space-y-6">
            <input type="file" accept="image/*" ref={imageInputRef} onChange={handleImageFileChange} className="hidden" />
            <input type="file" accept="audio/*" ref={audioInputRef} onChange={handleAudioFileChange} className="hidden" />
            <input type="file" accept="image/png, image/jpeg" ref={watermarkInputRef} onChange={handleWatermarkFileChange} className="hidden" />

            {error && (
                 <div className="p-4 my-2 text-center text-red-800 bg-red-100 border border-red-400 rounded-lg dark:bg-red-900/20 dark:text-red-300 dark:border-red-500">
                    <p>{t(error)}</p>
                </div>
            )}
            <WorkflowStep number={1} title={t('publishingPanel.step1.title')} isComplete={allImagesGenerated}>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {generatedContent.scenes.map(scene => (
                        <div key={scene.id} className="space-y-2">
                             <ScenePreview 
                                scene={scene}
                                aspectRatio={advancedSettings.aspectRatio}
                                isLoading={isPreviewLoading && !scene.imageUrl}
                                onRegenerate={() => generateSceneImage(scene.id, advancedSettings.aspectRatio, customPrompts[scene.id])}
                            />
                            <div>
                                <label htmlFor={`prompt-${scene.id}`} className="block text-xs font-medium text-gray-600 dark:text-slate-400">
                                    {t('publishingPanel.step1.promptLabel')}
                                </label>
                                <textarea
                                    id={`prompt-${scene.id}`}
                                    value={customPrompts[scene.id] || ''}
                                    onChange={(e) => handlePromptChange(scene.id, e.target.value)}
                                    rows={3}
                                    className="w-full p-2 mt-1 text-sm bg-slate-50 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-400"
                                />
                                <button
                                    onClick={() => handleImageUploadClick(scene.id)}
                                    title={t('publishingPanel.storyboard.uploadTooltip')}
                                    className="w-full mt-2 px-4 py-1.5 text-sm font-semibold text-teal-700 transition-colors duration-200 bg-white border border-teal-600 rounded-md shadow-sm dark:bg-slate-700 dark:text-teal-300 dark:border-teal-500 hover:bg-teal-50 dark:hover:bg-slate-600"
                                >
                                    {t('global.upload')}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <button
                    onClick={() => generateAllSceneImages(advancedSettings.aspectRatio, customPrompts)}
                    disabled={isPreviewLoading}
                    title={allImagesGenerated ? t('publishingPanel.slideshow.regenerateAllTooltip') : t('publishingPanel.slideshow.generateAllTooltip')}
                    className="w-full px-6 py-2 font-semibold text-white transition-colors duration-300 bg-teal-600 rounded-lg shadow hover:bg-teal-700 disabled:bg-gray-400"
                >
                    {isPreviewLoading ? t('publishingPanel.step1.generating') : (allImagesGenerated ? t('publishingPanel.step1.regenerateButton') : t('publishingPanel.step1.button'))}
                </button>
            </WorkflowStep>

            <WorkflowStep number={2} title={t('publishingPanel.step2.title')} isComplete={!!videoAudioUrl} isDisabled={!allImagesGenerated}>
                {videoAudioUrl && (
                     <div className="w-full space-y-3">
                        <audio controls className="w-full" src={videoAudioUrl}>
                            {t('contentEditor.audioElementNotSupported')}
                        </audio>
                        <div className="flex justify-center gap-3">
                           <a href={videoAudioUrl} download={`${generatedContent.title.replace(/\s/g, '_')}_voiceover.wav`} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-teal-700 transition-colors duration-200 bg-white border border-teal-600 rounded-md shadow-sm hover:bg-teal-50 dark:bg-slate-700 dark:text-teal-300 dark:border-teal-500 dark:hover:bg-teal-900/50">
                               <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                               {t('global.download')}
                           </a>
                           {navigator.share && (
                                <button onClick={handleShareVoiceover} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-teal-700 transition-colors duration-200 bg-white border border-teal-600 rounded-md shadow-sm hover:bg-teal-50 dark:bg-slate-700 dark:text-teal-300 dark:border-teal-500 dark:hover:bg-teal-900/50">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor"><path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" /></svg>
                                    {t('global.share')}
                                </button>
                           )}
                       </div>
                     </div>
                )}
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300" htmlFor="audio-script-textarea">{t('publishingPanel.step2.scriptLabel')}</label>
                    <textarea
                        id="audio-script-textarea"
                        value={audioScript}
                        onChange={(e) => setAudioScript(e.target.value)}
                        rows={8}
                        className="w-full p-2 mt-1 bg-slate-50 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                    />
                </div>
                <button
                    onClick={() => generateVideoAudio(audioScript)}
                    disabled={isGeneratingVideoAudio || !allImagesGenerated}
                    title={videoAudioUrl ? t('publishingPanel.audio.regenerateTooltip') : t('publishingPanel.audio.generateTooltip')}
                    className="w-full px-6 py-2 font-semibold text-white transition-colors duration-300 bg-teal-600 rounded-lg shadow hover:bg-teal-700 disabled:bg-gray-400"
                >
                    {isGeneratingVideoAudio ? t('publishingPanel.step2.generating') : (videoAudioUrl ? t('publishingPanel.step2.regenerateButton') : t('publishingPanel.step2.button'))}
                </button>
                <div className="flex items-center gap-2 my-2">
                    <hr className="flex-grow border-gray-300 dark:border-slate-600"/>
                    <span className="text-sm text-gray-500 dark:text-slate-400">{t('global.or')}</span>
                    <hr className="flex-grow border-gray-300 dark:border-slate-600"/>
                </div>
                <button
                    onClick={() => audioInputRef.current?.click()}
                    disabled={!allImagesGenerated}
                    title={t('publishingPanel.audio.uploadTooltip')}
                    className="w-full px-6 py-2 font-semibold text-teal-700 transition-colors duration-200 bg-white border border-teal-600 rounded-lg shadow-sm hover:bg-teal-50 dark:hover:bg-slate-600 disabled:opacity-50"
                >
                    {t('publishingPanel.uploadAudio')}
                </button>
            </WorkflowStep>

            <WorkflowStep number={3} title={t('publishingPanel.music.title')} isComplete={!!backgroundMusicUrl} isDisabled={!allImagesGenerated || !videoAudioUrl}>
                <div className="space-y-4">
                    {backgroundMusicUrl && (
                        <div className="w-full space-y-2">
                            <audio controls className="w-full" src={backgroundMusicUrl}>
                                {t('contentEditor.audioElementNotSupported')}
                            </audio>
                            <div className="flex justify-center gap-3">
                               <a href={backgroundMusicUrl} download={`${generatedContent.title.replace(/\s/g, '_')}_music.mp3`} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-teal-700 transition-colors duration-200 bg-white border border-teal-600 rounded-md shadow-sm hover:bg-teal-50 dark:bg-slate-700 dark:text-teal-300 dark:border-teal-500 dark:hover:bg-teal-900/50">
                                   <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                                   {t('publishingPanel.music.downloadMusic')}
                               </a>
                               {navigator.share && (
                                    <button onClick={handleShareMusic} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-teal-700 transition-colors duration-200 bg-white border border-teal-600 rounded-md shadow-sm hover:bg-teal-50 dark:bg-slate-700 dark:text-teal-300 dark:border-teal-500 dark:hover:bg-teal-900/50">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor"><path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" /></svg>
                                        {t('publishingPanel.music.shareMusic')}
                                    </button>
                               )}
                           </div>
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300" htmlFor="music-prompt-textarea">
                            {t('publishingPanel.music.promptLabel')}
                        </label>
                        <textarea
                            id="music-prompt-textarea"
                            value={musicPrompt}
                            onChange={(e) => setMusicPrompt(e.target.value)}
                            rows={3}
                            className="w-full p-2 mt-1 bg-slate-50 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                        />
                    </div>
                    <button
                        onClick={() => generateBackgroundMusic(musicPrompt)}
                        disabled={isGeneratingBackgroundMusic || !musicPrompt}
                        title={backgroundMusicUrl ? t('publishingPanel.music.regenerateTooltip') : t('publishingPanel.music.generateTooltip')}
                        className="w-full px-6 py-2 font-semibold text-white transition-colors duration-300 bg-cyan-600 rounded-lg shadow hover:bg-cyan-700 disabled:bg-gray-400"
                    >
                        {isGeneratingBackgroundMusic ? t('publishingPanel.music.generating') : (backgroundMusicUrl ? t('publishingPanel.music.regenerateButton') : t('publishingPanel.music.button'))}
                    </button>
                </div>
            </WorkflowStep>

            <WorkflowStep number={4} title={t('publishingPanel.watermark.title')} isComplete={!!watermarkImageUrl} isDisabled={!allImagesGenerated || !videoAudioUrl}>
                <div className="flex flex-col items-center gap-4 md:flex-row">
                    <div className="flex-shrink-0 space-y-2 text-center">
                        <div className="flex items-center justify-center w-32 h-32 bg-gray-100 border-2 border-dashed rounded-lg dark:bg-slate-700 dark:border-slate-600 overflow-hidden">
                            {watermarkImageUrl ? (
                                <img src={watermarkImageUrl} alt="Watermark preview" className="object-contain max-w-full max-h-full" />
                            ) : (
                                <span className="text-sm text-gray-500 dark:text-slate-400">{t('global.upload')}</span>
                            )}
                        </div>
                        <button onClick={() => watermarkInputRef.current?.click()} className="w-full px-4 py-2 text-sm font-semibold text-teal-700 transition-colors duration-200 bg-white border border-teal-600 rounded-lg shadow-sm hover:bg-teal-50 dark:bg-slate-700 dark:text-teal-300 dark:border-teal-500 dark:hover:bg-slate-600">
                            {t('publishingPanel.watermark.upload')}
                        </button>
                        {watermarkImageUrl && (
                             <button onClick={removeWatermark} className="w-full px-4 py-2 text-xs font-semibold text-red-700 transition-colors duration-200 bg-red-50 border border-red-200 rounded-lg shadow-sm hover:bg-red-100 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800 dark:hover:bg-red-900/50">
                                {t('publishingPanel.watermark.remove')}
                            </button>
                        )}
                    </div>
                    <div className="flex-grow w-full space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">{t('publishingPanel.watermark.position')}</label>
                            <div className="flex justify-around p-1 mt-1 bg-gray-200 rounded-lg dark:bg-slate-700">
                                {positionOptions.map(opt => (
                                    <button
                                        key={opt.value}
                                        onClick={() => updateWatermarkSettings({ position: opt.value })}
                                        title={t(`publishingPanel.watermark.positionOptions.${opt.value.replace('-', '')}`)}
                                        className={`px-3 py-1 text-lg rounded-md transition-colors ${watermarkSettings.position === opt.value ? 'bg-teal-500 text-white' : 'hover:bg-gray-300 dark:hover:bg-slate-600'}`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">{t('publishingPanel.watermark.size')}</label>
                            <div className="flex justify-around p-1 mt-1 bg-gray-200 rounded-lg dark:bg-slate-700">
                                {sizeOptions.map(opt => (
                                    <button
                                        key={opt.value}
                                        onClick={() => updateWatermarkSettings({ size: opt.value })}
                                        className={`px-4 py-1 rounded-md transition-colors ${watermarkSettings.size === opt.value ? 'bg-teal-500 text-white' : 'hover:bg-gray-300 dark:hover:bg-slate-600'}`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label htmlFor="opacity-slider" className="block text-sm font-medium text-gray-700 dark:text-slate-300">
                                {t('publishingPanel.watermark.opacity')}: {Math.round(watermarkSettings.opacity * 100)}%
                            </label>
                            <input
                                id="opacity-slider"
                                type="range"
                                min="0"
                                max="1"
                                step="0.05"
                                value={watermarkSettings.opacity}
                                onChange={e => updateWatermarkSettings({ opacity: parseFloat(e.target.value) })}
                                className="w-full h-2 mt-1 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                            />
                        </div>
                    </div>
                </div>
            </WorkflowStep>

            <WorkflowStep number={5} title={t('publishingPanel.step3.title')} isComplete={false} isDisabled={!allImagesGenerated || !videoAudioUrl}>
                 <div className="flex flex-col gap-3">
                    <button
                        onClick={() => generateSilentPreview(advancedSettings)}
                        disabled={!allImagesGenerated || isGeneratingVideo}
                        title={t('publishingPanel.final.previewTooltip')}
                        className="w-full px-6 py-2 font-semibold text-teal-700 transition-colors duration-200 bg-white border border-teal-600 rounded-md shadow-sm dark:bg-slate-700 dark:text-teal-300 dark:border-teal-500 hover:bg-teal-50 dark:hover:bg-slate-600 disabled:opacity-50"
                    >
                        {t('publishingPanel.step3.previewButton')}
                    </button>
                    <button
                        onClick={() => combineImageAndAudio(advancedSettings, false)}
                        disabled={isGeneratingVideo || !videoAudioUrl || !allImagesGenerated}
                        title={t('publishingPanel.final.createTooltip')}
                        className="w-full px-6 py-3 font-bold text-white transition-transform duration-200 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-lg shadow-lg hover:scale-105 disabled:bg-gray-400 disabled:from-gray-400 disabled:to-gray-500 disabled:scale-100"
                    >
                        {t('publishingPanel.createVideoButton')}
                    </button>
                </div>
            </WorkflowStep>
        </div>
    );
};

export default SlideshowWorkflow;