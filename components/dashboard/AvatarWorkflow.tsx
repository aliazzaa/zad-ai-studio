



import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { VIDEO_ADVANCED_SETTINGS_OPTIONS } from '../../constants';
import { VideoSettings, WatermarkSettings } from '../../types';
import WorkflowStep from './WorkflowStep';
import { backgroundLibrary } from '../../libraryData';

const AvatarWorkflow: React.FC = () => {
    const { 
        generatedContent, 
        translatedContent,
        generateVideoAudio,
        isGeneratingVideoAudio,
        videoAudioUrl,
        backgroundMusicUrl,
        isGeneratingBackgroundMusic,
        generateBackgroundMusic,
        combineImageAndAudio,
        isGeneratingVideo,
        avatarImageUrl,
        isGeneratingAvatar,
        generateAvatar,
        uploadAvatarImage,
        removeAvatarBackground,
        isRemovingAvatarBackground,
        avatarLibrary,
        saveAvatarToLibrary,
        deleteAvatarFromLibrary,
        selectAvatarFromLibrary,
        avatarBackgroundUrl,
        isGeneratingAvatarBackground,
        generateAvatarBackground,
        loadingMessage,
        videoGenerationProgress,
        error,
        uploadAvatarBackground,
        uploadVideoAudio,
        watermarkImageUrl,
        watermarkSettings,
        uploadWatermarkImage,
        updateWatermarkSettings,
        removeWatermark,
        avatarConfig,
        updateAvatarConfig
    } = useAppContext();
    const { t } = useLanguage();
    
    const [advancedSettings, setAdvancedSettings] = useState<VideoSettings>({
        resolution: VIDEO_ADVANCED_SETTINGS_OPTIONS.resolutions[1].value,
        aspectRatio: VIDEO_ADVANCED_SETTINGS_OPTIONS.aspectRatios[0].value,
        frameRate: VIDEO_ADVANCED_SETTINGS_OPTIONS.frameRates[1].value,
        transition: VIDEO_ADVANCED_SETTINGS_OPTIONS.transitions[0].value,
    });
    const [audioScript, setAudioScript] = useState('');
    const [avatarPrompt, setAvatarPrompt] = useState('');
    const [avatarBackgroundPrompt, setAvatarBackgroundPrompt] = useState('');
    const [musicPrompt, setMusicPrompt] = useState('');

    const fileInputRef = useRef<HTMLInputElement>(null);
    const backgroundInputRef = useRef<HTMLInputElement>(null);
    const audioInputRef = useRef<HTMLInputElement>(null);
    const watermarkInputRef = useRef<HTMLInputElement>(null);
    
    // Canvas for interactive compositor
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isPlayingPreview, setIsPlayingPreview] = useState(false);
    const previewAudioRef = useRef<HTMLAudioElement>(null);
    const animationFrameRef = useRef<number | null>(null);

    useEffect(() => {
        if (generatedContent) {
            const contentToSpeak = translatedContent || generatedContent;
            setAudioScript(contentToSpeak.scenes.map(s => s.text).join('\n\n'));
            setMusicPrompt(`Spiritual, calm, and hopeful background music suitable for a video titled "${generatedContent.title}".`);
        }
    }, [generatedContent, translatedContent]);

    // Interactive Compositor Logic
    useEffect(() => {
        const renderCanvas = () => {
            const canvas = canvasRef.current;
            if (!canvas || !avatarBackgroundUrl || !avatarImageUrl) return;

            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            // Set canvas dimensions based on aspect ratio
            const isPortrait = advancedSettings.aspectRatio === '9:16';
            const width = 640; // Preview width
            const height = isPortrait ? 1138 : 360; // 16:9 or 9:16 approximation
            canvas.width = width;
            canvas.height = height;

            const bgImg = new Image();
            bgImg.src = avatarBackgroundUrl;
            const avatarImg = new Image();
            avatarImg.src = avatarImageUrl;

            // Simple loader mechanism
            let loadedCount = 0;
            const draw = () => {
                loadedCount++;
                if (loadedCount < 2) return;

                // Clear
                ctx.clearRect(0, 0, width, height);

                // Draw BG
                const bgRatio = Math.max(width / bgImg.width, height / bgImg.height);
                const bgShiftX = (width - bgImg.width * bgRatio) / 2;
                const bgShiftY = (height - bgImg.height * bgRatio) / 2;
                ctx.drawImage(bgImg, 0, 0, bgImg.width, bgImg.height, bgShiftX, bgShiftY, bgImg.width * bgRatio, bgImg.height * bgRatio);

                // Draw Avatar
                const baseScale = isPortrait ? 0.6 : 0.5;
                const userScale = avatarConfig.scale || 1;
                const finalScale = baseScale * userScale;

                const avWidth = width * finalScale;
                const avHeight = avWidth * (avatarImg.height / avatarImg.width);

                // Default Center
                const baseX = (width - avWidth) / 2;
                const baseY = height - avHeight + (avHeight * 0.1);

                // Offsets
                const offsetX = (avatarConfig.x || 0) / 100 * width;
                const offsetY = (avatarConfig.y || 0) / 100 * height;
                
                // Simple idle animation if playing
                let bounceY = 0;
                if (isPlayingPreview) {
                     bounceY = Math.sin(Date.now() / 200) * 2; 
                }

                ctx.drawImage(avatarImg, baseX + offsetX, baseY - offsetY + bounceY, avWidth, avHeight);
                
                if (isPlayingPreview) {
                     animationFrameRef.current = requestAnimationFrame(draw);
                }
            };

            bgImg.onload = draw;
            avatarImg.onload = draw;
            // Force trigger if already cached
            if (bgImg.complete) draw();
            if (avatarImg.complete) draw();
        };

        renderCanvas();
        
        return () => {
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        };
    }, [avatarBackgroundUrl, avatarImageUrl, avatarConfig, advancedSettings.aspectRatio, isPlayingPreview]);

    const togglePreviewPlayback = () => {
        if (!previewAudioRef.current) return;
        
        if (isPlayingPreview) {
            previewAudioRef.current.pause();
            previewAudioRef.current.currentTime = 0;
            setIsPlayingPreview(false);
        } else {
            previewAudioRef.current.play();
            setIsPlayingPreview(true);
        }
    };
    
    const handleAudioEnded = () => {
        setIsPlayingPreview(false);
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

    const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            uploadAvatarImage(file);
        }
    };

    const handleBackgroundFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            uploadAvatarBackground(file);
        }
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
    
    const handleSelectBackground = async (url: string) => {
         try {
             const response = await fetch(url);
             const blob = await response.blob();
             const file = new File([blob], "background.png", { type: blob.type });
             uploadAvatarBackground(file);
         } catch(e) {
             console.error("Error selecting background", e);
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
             {error && (
                 <div className="p-4 my-2 text-center text-red-800 bg-red-100 border border-red-400 rounded-lg dark:bg-red-900/20 dark:text-red-300 dark:border-red-500">
                    <p>{t(error)}</p>
                </div>
            )}
            <WorkflowStep number={1} title={t('publishingPanel.avatar.title')} isComplete={!!avatarImageUrl}>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-4">
                         <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300" htmlFor="avatar-prompt-textarea">{t('publishingPanel.avatar.promptLabel')}</label>
                            <textarea
                                id="avatar-prompt-textarea"
                                value={avatarPrompt}
                                onChange={(e) => setAvatarPrompt(e.target.value)}
                                rows={2}
                                className="w-full p-2 mt-1 bg-slate-50 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                            />
                        </div>
                        <button
                            onClick={() => generateAvatar(avatarPrompt)}
                            disabled={isGeneratingAvatar || !avatarPrompt}
                            title={t('publishingPanel.avatar.generateTooltip')}
                            className="w-full px-6 py-2 font-semibold text-white transition-colors duration-300 bg-teal-600 rounded-lg shadow hover:bg-teal-700 disabled:bg-gray-400"
                        >
                            {isGeneratingAvatar ? t('publishingPanel.avatar.generating') : t('publishingPanel.avatar.button')}
                        </button>
                         <div className="flex items-center gap-2 my-2">
                            <hr className="flex-grow border-gray-300 dark:border-slate-600"/>
                            <span className="text-sm text-gray-500 dark:text-slate-400">{t('global.or')}</span>
                            <hr className="flex-grow border-gray-300 dark:border-slate-600"/>
                        </div>
                         <input type="file" accept="image/*" onChange={handleAvatarUpload} ref={fileInputRef} className="hidden"/>
                         <button
                            onClick={() => fileInputRef.current?.click()}
                            title={t('publishingPanel.avatar.uploadTooltip')}
                            className="w-full px-6 py-2 font-semibold text-teal-700 transition-colors duration-200 bg-white border border-teal-600 rounded-lg shadow-sm dark:bg-slate-700 dark:text-teal-300 dark:border-teal-500 hover:bg-teal-50 dark:hover:bg-slate-600"
                        >
                            {t('publishingPanel.avatar.uploadButton')}
                        </button>
                    </div>
                    <div className="flex flex-col items-center justify-center space-y-3">
                        {avatarImageUrl ? (
                            <>
                                <img src={avatarImageUrl} alt="Avatar Preview" className="w-32 h-32 rounded-full shadow-lg object-cover" />
                                 <div className="flex flex-wrap justify-center gap-2">
                                     <button onClick={removeAvatarBackground} disabled={isRemovingAvatarBackground} title={t('publishingPanel.avatar.removeBgTooltip')} className="px-3 py-1 text-xs font-semibold text-white bg-gray-600 rounded-lg hover:bg-gray-700 disabled:bg-gray-400">
                                        {isRemovingAvatarBackground ? t('publishingPanel.avatar.removingBackground') : t('publishingPanel.avatar.removeBackground')}
                                     </button>
                                     <button onClick={saveAvatarToLibrary} disabled={avatarLibrary.includes(avatarImageUrl)} title={t('publishingPanel.avatar.saveToLibraryTooltip')} className="px-3 py-1 text-xs font-semibold text-white bg-cyan-600 rounded-lg hover:bg-cyan-700 disabled:bg-gray-400">
                                         {avatarLibrary.includes(avatarImageUrl) ? t('publishingPanel.avatar.savedToLibrary') : t('publishingPanel.avatar.saveToLibrary')}
                                     </button>
                                 </div>
                            </>
                        ): (
                            <div className="flex items-center justify-center w-32 h-32 text-gray-400 bg-gray-100 rounded-full dark:bg-slate-700">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                            </div>
                        )}
                    </div>
                </div>
                 {/* Avatar Library */}
                <div className="pt-4 mt-4 border-t border-gray-200 dark:border-slate-700">
                    <h5 className="mb-2 font-semibold text-center text-gray-700 dark:text-slate-300">{t('publishingPanel.avatar.libraryTitle')}</h5>
                    {avatarLibrary.length > 0 ? (
                        <div className="flex flex-wrap justify-center gap-2">
                            {avatarLibrary.map((url, index) => (
                                <div key={index} className="relative group">
                                    <img 
                                        src={url} 
                                        alt={`Saved Avatar ${index + 1}`} 
                                        className="w-16 h-16 rounded-full object-cover cursor-pointer border-2 border-transparent hover:border-teal-500"
                                        onClick={() => selectAvatarFromLibrary(url)}
                                    />
                                    <button 
                                        onClick={() => deleteAvatarFromLibrary(url)}
                                        className="absolute top-0 right-0 p-0.5 text-white bg-red-600 rounded-full opacity-0 group-hover:opacity-100"
                                        title={t('global.deleteTooltip')}
                                    >
                                         <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-center text-gray-500 dark:text-slate-400">{t('publishingPanel.avatar.libraryEmpty')}</p>
                    )}
                </div>
            </WorkflowStep>

            <WorkflowStep number={2} title={t('publishingPanel.avatar.backgroundTitle')} isComplete={!!avatarBackgroundUrl} isDisabled={!avatarImageUrl}>
                 <div className="flex flex-col items-center gap-4">
                    {avatarBackgroundUrl ? (
                        <img src={avatarBackgroundUrl} alt="Background Preview" className="w-full rounded-lg shadow-md aspect-video object-cover" />
                    ) : null}
                     <div className="w-full space-y-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300" htmlFor="bg-prompt-textarea">{t('publishingPanel.avatar.backgroundPromptLabel')}</label>
                        <textarea
                            id="bg-prompt-textarea"
                            value={avatarBackgroundPrompt}
                            onChange={(e) => setAvatarBackgroundPrompt(e.target.value)}
                            rows={2}
                            className="w-full p-2 bg-slate-50 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                        />
                    </div>
                    <button
                        onClick={() => generateAvatarBackground(advancedSettings.aspectRatio, avatarBackgroundPrompt)}
                        disabled={isGeneratingAvatarBackground}
                        title={t('publishingPanel.avatar.bgGenerateTooltip')}
                        className="w-full px-6 py-2 font-semibold text-white transition-colors duration-300 bg-teal-600 rounded-lg shadow hover:bg-teal-700 disabled:bg-gray-400"
                    >
                        {isGeneratingAvatarBackground ? t('publishingPanel.avatar.generatingBackground') : t('publishingPanel.avatar.backgroundButton')}
                    </button>
                    
                     {/* Curated Library Section */}
                    <div className="w-full pt-4 mt-2 border-t border-gray-200 dark:border-slate-700">
                        <label className="block mb-2 text-sm font-semibold text-center text-gray-700 dark:text-slate-300">
                            {t('publishingPanel.avatar.chooseFromLibrary')}
                        </label>
                        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                            {backgroundLibrary.map(bg => (
                                <button 
                                    key={bg.id}
                                    onClick={() => handleSelectBackground(bg.url)}
                                    title={t(bg.titleKey)}
                                    className="relative w-full h-16 overflow-hidden rounded-md shadow-sm hover:ring-2 hover:ring-teal-500 transition-all"
                                >
                                    <img src={bg.url} alt={t(bg.titleKey)} className="object-cover w-full h-full" />
                                    <div className="absolute inset-0 flex items-center justify-center transition-opacity bg-black opacity-0 bg-opacity-20 hover:opacity-100">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center w-full gap-2 my-2">
                        <hr className="flex-grow border-gray-300 dark:border-slate-600"/>
                        <span className="text-sm text-gray-500 dark:text-slate-400">{t('global.or')}</span>
                        <hr className="flex-grow border-gray-300 dark:border-slate-600"/>
                    </div>
                    <input type="file" accept="image/*" ref={backgroundInputRef} onChange={handleBackgroundFileChange} className="hidden" />
                    <button
                        onClick={() => backgroundInputRef.current?.click()}
                        title={t('publishingPanel.avatar.bgUploadTooltip')}
                        className="w-full px-6 py-2 font-semibold text-teal-700 transition-colors duration-200 bg-white border border-teal-600 rounded-lg shadow-sm hover:bg-teal-50 dark:hover:bg-slate-600"
                    >
                        {t('global.upload')}
                    </button>
                </div>
            </WorkflowStep>

             <WorkflowStep number={3} title={t('publishingPanel.avatar.interactivePreviewTitle')} isComplete={false} isDisabled={!avatarBackgroundUrl || !avatarImageUrl}>
                 <div className="flex flex-col items-center gap-4 w-full">
                    {/* Interactive Canvas */}
                    <div className="relative w-full bg-gray-900 rounded-lg overflow-hidden shadow-md border border-gray-700">
                        <canvas ref={canvasRef} className="w-full h-auto block" />
                        
                        {/* Play Button Overlay */}
                        {videoAudioUrl && (
                            <div className="absolute bottom-4 right-4 z-10">
                                <button 
                                    onClick={togglePreviewPlayback}
                                    className={`p-3 rounded-full shadow-lg transition-all ${isPlayingPreview ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white`}
                                >
                                    {isPlayingPreview ? (
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                                    ) : (
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                                    )}
                                </button>
                            </div>
                        )}
                        {videoAudioUrl && <audio ref={previewAudioRef} src={videoAudioUrl} onEnded={handleAudioEnded} className="hidden" />}
                    </div>

                    {/* Compositor Controls */}
                    <div className="w-full p-4 bg-slate-100 dark:bg-slate-800 rounded-lg space-y-3">
                        <div className="flex justify-between items-center">
                            <h6 className="font-bold text-xs uppercase text-slate-500 dark:text-slate-400">{t('publishingPanel.avatar.compositor.controls')}</h6>
                            <button 
                                onClick={() => updateAvatarConfig({ scale: 1, x: 0, y: 0 })}
                                className="text-xs text-teal-600 hover:underline dark:text-teal-400"
                            >
                                {t('publishingPanel.avatar.compositor.reset')}
                            </button>
                        </div>
                        
                        {/* Scale Slider */}
                        <div className="flex items-center gap-3">
                            <span className="text-sm w-12 font-medium text-slate-700 dark:text-slate-300">{t('publishingPanel.avatar.compositor.size')}</span>
                            <input 
                                type="range" min="0.1" max="2.0" step="0.1" 
                                value={avatarConfig.scale} 
                                onChange={(e) => updateAvatarConfig({ scale: parseFloat(e.target.value) })}
                                className="flex-grow h-2 bg-slate-300 rounded-lg appearance-none cursor-pointer dark:bg-slate-600"
                            />
                        </div>

                        {/* X Position */}
                        <div className="flex items-center gap-3">
                            <span className="text-sm w-12 font-medium text-slate-700 dark:text-slate-300">{t('publishingPanel.avatar.compositor.posX')}</span>
                            <input 
                                type="range" min="-100" max="100" step="5" 
                                value={avatarConfig.x} 
                                onChange={(e) => updateAvatarConfig({ x: parseFloat(e.target.value) })}
                                className="flex-grow h-2 bg-slate-300 rounded-lg appearance-none cursor-pointer dark:bg-slate-600"
                            />
                        </div>

                         {/* Y Position */}
                        <div className="flex items-center gap-3">
                            <span className="text-sm w-12 font-medium text-slate-700 dark:text-slate-300">{t('publishingPanel.avatar.compositor.posY')}</span>
                            <input 
                                type="range" min="-100" max="100" step="5" 
                                value={avatarConfig.y} 
                                onChange={(e) => updateAvatarConfig({ y: parseFloat(e.target.value) })}
                                className="flex-grow h-2 bg-slate-300 rounded-lg appearance-none cursor-pointer dark:bg-slate-600"
                            />
                        </div>
                    </div>
                </div>
            </WorkflowStep>

             <WorkflowStep number={4} title={t('publishingPanel.music.title')} isComplete={!!backgroundMusicUrl} isDisabled={!avatarImageUrl}>
                <div className="space-y-4">
                    {backgroundMusicUrl && (
                        <div className="w-full space-y-2">
                            <audio controls className="w-full" src={backgroundMusicUrl}>
                                {t('contentEditor.audioElementNotSupported')}
                            </audio>
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
            
            <WorkflowStep number={5} title={t('publishingPanel.watermark.title')} isComplete={!!watermarkImageUrl} isDisabled={!avatarImageUrl}>
                <div className="flex flex-col items-center gap-4 md:flex-row">
                    <div className="flex-shrink-0 space-y-2 text-center">
                        <div className="flex items-center justify-center w-32 h-32 bg-gray-100 border-2 border-dashed rounded-lg dark:bg-slate-700 dark:border-slate-600 overflow-hidden">
                            {watermarkImageUrl ? (
                                <img src={watermarkImageUrl} alt="Watermark preview" className="object-contain max-w-full max-h-full" />
                            ) : (
                                <span className="text-sm text-gray-500 dark:text-slate-400">{t('global.upload')}</span>
                            )}
                        </div>
                        <input type="file" accept="image/png, image/jpeg" ref={watermarkInputRef} onChange={handleWatermarkFileChange} className="hidden" />
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
                            <label htmlFor="opacity-slider-avatar" className="block text-sm font-medium text-gray-700 dark:text-slate-300">
                                {t('publishingPanel.watermark.opacity')}: {Math.round(watermarkSettings.opacity * 100)}%
                            </label>
                            <input
                                id="opacity-slider-avatar"
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

            <WorkflowStep number={6} title={t('publishingPanel.avatar.finalStepTitle')} isComplete={false} isDisabled={!avatarImageUrl}>
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
                        rows={6}
                        className="w-full p-2 mt-1 bg-slate-50 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                    />
                </div>
                <button
                    onClick={() => generateVideoAudio(audioScript)}
                    disabled={isGeneratingVideoAudio}
                    title={videoAudioUrl ? t('publishingPanel.audio.regenerateTooltip') : t('publishingPanel.audio.generateTooltip')}
                    className="w-full px-6 py-2 font-semibold text-white transition-colors duration-300 bg-teal-600 rounded-lg shadow hover:bg-teal-700 disabled:bg-gray-400"
                >
                    {isGeneratingVideoAudio ? t('publishingPanel.step2.generating') : (videoAudioUrl ? t('publishingPanel.step2.regenerateButton') : t('publishingPanel.step2.button'))}
                </button>
                 <div className="flex items-center w-full gap-2 my-2">
                    <hr className="flex-grow border-gray-300 dark:border-slate-600"/>
                    <span className="text-sm text-gray-500 dark:text-slate-400">{t('global.or')}</span>
                    <hr className="flex-grow border-gray-300 dark:border-slate-600"/>
                </div>
                <input type="file" accept="audio/*" ref={audioInputRef} onChange={handleAudioFileChange} className="hidden" />
                <button
                    onClick={() => audioInputRef.current?.click()}
                    title={t('publishingPanel.audio.uploadTooltip')}
                    className="w-full px-6 py-2 font-semibold text-teal-700 transition-colors duration-200 bg-white border border-teal-600 rounded-lg shadow-sm hover:bg-teal-50 dark:hover:bg-slate-600"
                >
                    {t('publishingPanel.uploadAudio')}
                </button>
                <div className="pt-4 mt-4 border-t border-gray-200 dark:border-slate-700">
                     <h5 className="mb-3 font-semibold text-center text-gray-700 dark:text-slate-300">{t('publishingPanel.avatar.createVideoTitle')}</h5>
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => combineImageAndAudio(advancedSettings, false)}
                            disabled={isGeneratingVideo || !videoAudioUrl}
                            title={t('publishingPanel.final.createTooltip')}
                            className="w-full px-6 py-3 font-bold text-white transition-transform duration-200 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-lg shadow-lg hover:scale-105 disabled:bg-gray-400 disabled:from-gray-400 disabled:to-gray-500 disabled:scale-100"
                        >
                            {t('publishingPanel.createVideoButton')}
                        </button>
                    </div>
                </div>
            </WorkflowStep>
        </div>
    );
};

export default AvatarWorkflow;
