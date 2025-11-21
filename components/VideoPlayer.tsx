
import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { useLanguage } from '../contexts/LanguageContext';
import { VideoSettings } from '../types';

// Define SVG icons for social media platforms
const YouTubeIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M21.582,6.186c-0.23-0.854-0.908-1.532-1.762-1.762C18.254,4,12,4,12,4S5.746,4,4.18,4.424 c-0.854,0.23-1.532,0.908-1.762,1.762C2,7.746,2,12,2,12s0,4.254,0.418,5.814c0.23,0.854,0.908,1.532,1.762,1.762 C5.746,20,12,20,12,20s6.254,0,7.82-0.424c0.854-0.23,1.532-0.908,1.762-1.762C22,16.254,22,12,22,12S22,7.746,21.582,6.186z M10,15.464V8.536L16,12L10,15.464z"></path></svg>;
const FacebookIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M22,12c0-5.523-4.477-10-10-10S2,6.477,2,12c0,4.99,3.657,9.128,8.438,9.878V15.89H8.207V12.55h2.23V9.998 c0-2.204,1.31-3.447,3.358-3.447c0.963,0,1.983,0.179,1.983,0.179v2.949h-1.482c-1.09,0-1.428,0.649-1.428,1.383v1.655h3.29l-0.522,3.34H14.65v6.028C19.343,21.128,22,16.99,22,12z"></path></svg>;
const TwitterIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231L18.244 2.25zM17.633 19.75h1.745L6.425 4.25H4.558l13.075 15.5z"></path></svg>;
const WhatsAppIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M12.04,2c-5.52,0-10,4.48-10,10c0,1.75,0.46,3.45,1.32,4.95L2,22l5.25-1.38c1.45,0.79,3.08,1.21,4.79,1.21 c5.52,0,10-4.48,10-10S17.56,2,12.04,2z M12.04,20.15c-1.49,0-2.96-0.41-4.24-1.21L7.1,19.23l-3.3,0.87l0.89-3.23l-0.31-0.7 c-0.88-1.34-1.35-2.92-1.35-4.59c0-4.41,3.59-8,8-8s8,3.59,8,8S16.45,20.15,12.04,20.15z M16.56,14.28 c-0.28-0.14-1.67-0.82-1.93-0.92s-0.45-0.14-0.64,0.14s-0.73,0.92-0.9,1.1s-0.33,0.19-0.61,0.07c-0.28-0.12-1.19-0.44-2.27-1.4 c-0.84-0.75-1.41-1.68-1.58-1.96s-0.18-0.45,0.07-0.59c0.23-0.12,0.45-0.31,0.64-0.49c0.18-0.17,0.24-0.28,0.36-0.47 c0.12-0.18,0.06-0.37-0.01-0.51c-0.07-0.14-0.64-1.54-0.88-2.1s-0.48-0.48-0.64-0.48s-0.36,0-0.52,0s-0.45,0.07-0.69,0.36 s-0.92,0.9-1.12,2.18s-0.2,2.37,0.11,2.9c0.31,0.53,1.4,2.2,3.4,3.01c2,0.81,2.68,0.92,3.48,0.84c0.8-0.08,1.67-0.68,1.9-1.33 s0.24-1.23,0.16-1.37C17.01,14.42,16.84,14.42,16.56,14.28z"></path></svg>;
const CopyIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"></path></svg>;

const VideoPlayer: React.FC<{ videoUrl: string }> = ({ videoUrl }) => {
    const { generatedContent, isVideoPreview, clearVideoPreview, downloadVideo, isGeneratingVideo } = useAppContext();
    const { t } = useLanguage();
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState('00:00');
    const [duration, setDuration] = useState('00:00');
    const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);
    const [isDownloadMenuOpen, setIsDownloadMenuOpen] = useState(false);
    const shareMenuRef = useRef<HTMLDivElement>(null);
    const downloadMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const updateProgress = () => {
            setProgress((video.currentTime / video.duration) * 100);
            setCurrentTime(formatTime(video.currentTime));
        };

        const setVideoDuration = () => {
            setDuration(formatTime(video.duration));
        };
        
        video.addEventListener('timeupdate', updateProgress);
        video.addEventListener('loadedmetadata', setVideoDuration);

        return () => {
            video.removeEventListener('timeupdate', updateProgress);
            video.removeEventListener('loadedmetadata', setVideoDuration);
        };
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (shareMenuRef.current && !shareMenuRef.current.contains(event.target as Node)) {
                setIsShareMenuOpen(false);
            }
            if (downloadMenuRef.current && !downloadMenuRef.current.contains(event.target as Node)) {
                setIsDownloadMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [shareMenuRef, downloadMenuRef]);


    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleSeek = (e: React.MouseEvent<HTMLProgressElement>) => {
        const progressContainer = e.currentTarget;
        const clickPosition = e.nativeEvent.offsetX;
        const width = progressContainer.offsetWidth;
        const duration = videoRef.current?.duration;
        if (duration) {
            videoRef.current.currentTime = (clickPosition / width) * duration;
        }
    };
    
    const handleDownloadOption = (resolution: string, format: 'webm' | 'mp4') => {
        setIsDownloadMenuOpen(false);
        // Construct settings for download
        // Need to determine aspectRatio from current video or context, defaulting to 16:9 if not available in props
        // Assuming 16:9 for now or we could fetch from video dimensions
        let aspectRatio = '16:9';
        if (videoRef.current) {
             const ratio = videoRef.current.videoWidth / videoRef.current.videoHeight;
             if (ratio < 1) aspectRatio = '9:16';
        }

        const settings: VideoSettings = {
            resolution,
            aspectRatio,
            frameRate: '30',
            transition: 'fade',
            format
        };
        downloadVideo(settings);
    };


    const handleShare = async () => {
        if (!generatedContent) return;
        const fullText = generatedContent.scenes.map(s => s.text).join('\n\n');

        // Use Web Share API if available (mobile)
        try {
            const response = await fetch(videoUrl);
            const blob = await response.blob();
            const file = new File([blob], `${generatedContent.title.replace(/\s/g, '_')}.webm`, { type: 'video/webm' });

            if (navigator.share && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    title: generatedContent.title,
                    text: fullText,
                    files: [file],
                });
                return;
            } 
        } catch (error) {
            console.error('Error with Web Share API:', error);
        }

        // Fallback to desktop share menu
        setIsShareMenuOpen(true);
    };

    const getShareText = () => {
        if (!generatedContent) return '';
        const fullText = generatedContent.scenes.map(s => s.text).join('\n\n');
        return `
            ${t('contentEditor.suggestedTitleLabel')}: ${generatedContent.title}
            ---
            ${fullText}
            ---
            YouTube Tips: ${generatedContent.youtubeTips}
            Hashtags: ${generatedContent.hashtags.join(' ')}
        `.trim();
    };

    const copyToClipboardAndAlert = (text: string) => {
        navigator.clipboard.writeText(text);
        alert(t('videoPlayer.shareFallback.alert'));
    }

    const sharePlatforms = [
        { name: 'YouTube', icon: <YouTubeIcon />, color: 'text-red-600', action: () => {
            copyToClipboardAndAlert(getShareText());
            window.open('https://studio.youtube.com/upload', '_blank');
        }},
        { name: 'Facebook', icon: <FacebookIcon />, color: 'text-blue-600', action: () => {
            copyToClipboardAndAlert(getShareText());
            window.open('https://www.facebook.com', '_blank');
        }},
        { name: 'Twitter', icon: <TwitterIcon />, color: 'text-black dark:text-white', action: () => {
             const text = `${generatedContent?.title}\n\n${generatedContent?.hashtags.join(' ')}`;
             window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
        }},
        { name: 'WhatsApp', icon: <WhatsAppIcon />, color: 'text-green-500', action: () => {
             const text = getShareText();
             window.open(`https://web.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
        }},
        { name: t('global.copyButton'), icon: <CopyIcon />, color: 'text-gray-600 dark:text-gray-300', action: () => {
            copyToClipboardAndAlert(getShareText());
        }},
    ];

    const downloadOptions = [
        { label: '720p (WebM)', res: '720p', format: 'webm' },
        { label: '1080p (WebM)', res: '1080p', format: 'webm' },
        // Show MP4 options only if supported by browser logic
        ...(MediaRecorder.isTypeSupported('video/mp4') ? [
            { label: '720p (MP4)', res: '720p', format: 'mp4' },
            { label: '1080p (MP4)', res: '1080p', format: 'mp4' }
        ] : [])
    ];

    return (
        <div className="p-4 bg-white rounded-lg shadow-md dark:bg-slate-800">
            <h3 className="mb-4 text-xl font-bold text-center text-teal-800 dark:text-teal-300">
                {isVideoPreview ? t('videoPlayer.previewTitle') : t('videoPlayer.title')}
            </h3>
            <div className="relative group">
                <video
                    ref={videoRef}
                    src={videoUrl}
                    className="w-full rounded-lg"
                    onClick={togglePlay}
                    playsInline
                    loop
                />
                <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100" onClick={togglePlay}>
                    <button className="text-5xl text-white">
                        {isPlaying ? '❚❚' : '▶'}
                    </button>
                </div>
            </div>
            
             <div className="flex items-center gap-4 mt-3">
                <button onClick={togglePlay} title={t('videoPlayer.playPauseTooltip')} className="p-2 text-white bg-teal-600 rounded-full dark:bg-teal-500">
                    {isPlaying ? '❚❚' : '▶'}
                </button>
                <span className="text-sm font-mono text-gray-600 dark:text-slate-400">{currentTime}</span>
                <progress
                    value={progress}
                    max="100"
                    onClick={handleSeek}
                    className="w-full h-2 rounded-full cursor-pointer [&::-webkit-progress-bar]:rounded-full [&::-webkit-progress-bar]:bg-slate-200 dark:[&::-webkit-progress-bar]:bg-slate-600 [&::-webkit-progress-value]:rounded-full [&::-webkit-progress-value]:bg-teal-500"
                />
                <span className="text-sm font-mono text-gray-600 dark:text-slate-400">{duration}</span>
            </div>

            {isVideoPreview ? (
                 <div className="flex flex-col gap-3 mt-4">
                    <button
                        onClick={clearVideoPreview}
                        className="flex-1 px-4 py-2 font-semibold text-center text-white transition-colors duration-200 bg-teal-600 rounded-md shadow-sm hover:bg-teal-700"
                    >
                        {t('videoPlayer.backToEditor')}
                    </button>
                </div>
            ) : (
                <>
                    <div className="relative flex flex-col gap-3 mt-4 sm:flex-row z-10">
                        <div className="relative flex-1" ref={downloadMenuRef}>
                            <button
                                onClick={() => setIsDownloadMenuOpen(!isDownloadMenuOpen)}
                                disabled={isGeneratingVideo}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2 font-semibold text-white transition-colors duration-200 bg-teal-600 rounded-md shadow-sm hover:bg-teal-700 disabled:bg-gray-400"
                                title={t('videoPlayer.downloadTooltip')}
                            >
                                {isGeneratingVideo ? (
                                    <span className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                                        {t('global.loading')}
                                    </span>
                                ) : (
                                    <>
                                        {t('videoPlayer.download')}
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                                    </>
                                )}
                            </button>
                            {isDownloadMenuOpen && (
                                <div className="absolute left-0 right-0 z-20 mt-2 bg-white rounded-lg shadow-xl border border-gray-100 dark:bg-slate-700 dark:border-slate-600 animate-fade-in overflow-hidden">
                                    <ul className="py-1">
                                        {downloadOptions.map((opt, idx) => (
                                            <li key={idx}>
                                                <button 
                                                    onClick={() => handleDownloadOption(opt.res, opt.format as any)}
                                                    className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 dark:text-slate-200 dark:hover:bg-slate-600"
                                                >
                                                    {opt.label}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        <button onClick={handleShare} title={t('videoPlayer.shareTooltip')} className="flex-1 px-4 py-2 font-semibold text-center text-teal-700 transition-colors duration-200 bg-white border border-teal-600 rounded-md shadow-sm dark:bg-slate-700 dark:text-teal-300 dark:border-teal-500 hover:bg-teal-50 dark:hover:bg-slate-600">
                            {t('videoPlayer.share')}
                        </button>
                        {isShareMenuOpen && (
                            <div ref={shareMenuRef} className="absolute right-0 z-20 w-48 p-2 mt-12 bg-white rounded-lg shadow-xl -top-2 dark:bg-slate-700 animate-fade-in border border-gray-200 dark:border-slate-600">
                                <ul className="space-y-1">
                                    {sharePlatforms.map(platform => (
                                        <li key={platform.name}>
                                            <button onClick={() => { platform.action(); setIsShareMenuOpen(false); }} className={`w-full flex items-center gap-3 px-3 py-2 text-sm text-left rounded-md hover:bg-gray-100 dark:hover:bg-slate-600 ${platform.color}`}>
                                                {platform.icon}
                                                <span className="text-gray-800 dark:text-slate-200">{platform.name}</span>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                    <p className="mt-2 text-xs text-center text-gray-500 dark:text-slate-400">
                        {navigator.share ? t('videoPlayer.shareHelpText.native') : t('videoPlayer.shareHelpText.desktop')}
                    </p>
                </>
            )}
        </div>
    );
};

export default VideoPlayer;
