import React from 'react';
import LoadingSpinner from './LoadingSpinner';
import { useLanguage } from '../contexts/LanguageContext';
import { Scene } from '../types';
import { dataUrlToBlob } from '../utils';

interface ScenePreviewProps {
    scene: Scene;
    aspectRatio: string;
    onRegenerate: () => void;
    isLoading: boolean;
}

const ScenePreview: React.FC<ScenePreviewProps> = ({ scene, aspectRatio, onRegenerate, isLoading }) => {
    const { t } = useLanguage();
    const aspectClass = aspectRatio === '9:16' ? 'aspect-[9/16]' : 'aspect-video';

    const handleDownload = () => {
        if (!scene.imageUrl) return;
        const link = document.createElement('a');
        link.href = scene.imageUrl;
        link.download = `scene_${scene.id}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleShare = async () => {
        if (!scene.imageUrl) return;
        try {
            const blob = dataUrlToBlob(scene.imageUrl);
            const file = new File([blob], `scene_${scene.id}.png`, { type: 'image/png' });
            if (navigator.share && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    title: t('publishingPanel.storyboard.shareTitle'),
                    text: scene.text,
                    files: [file],
                });
            } else {
                alert(t('global.shareNotSupported'));
            }
        } catch (error) {
            console.error('Error sharing image:', error);
            alert(t('global.shareError'));
        }
    };


    return (
        <div className={`relative w-full overflow-hidden bg-gray-900 rounded-lg shadow-lg group ${aspectClass}`}>
            {isLoading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-800/50">
                    <div className="flex flex-col items-center">
                        <div className="w-8 h-8 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                        <p className="mt-2 text-xs text-white">{t('publishingPanel.storyboard.generating')}</p>
                    </div>
                </div>
            ) : scene.imageUrl ? (
                <>
                    <img 
                        src={scene.imageUrl} 
                        alt={t('publishingPanel.storyboard.imageAlt', { sceneId: scene.id })}
                        className="object-cover w-full h-full" 
                    />
                    <div className="absolute inset-0 flex items-center justify-center p-2 bg-black bg-opacity-30">
                        <p className="text-xs font-bold text-center text-white md:text-sm" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.8)' }}>
                            {scene.text}
                        </p>
                    </div>
                     <div className="absolute top-2 right-2 flex gap-1.5">
                        {navigator.share && (
                            <button
                                onClick={handleShare}
                                title={t('publishingPanel.storyboard.shareImage')}
                                className="p-2 text-white transition-all duration-300 bg-black rounded-full bg-opacity-40 opacity-0 group-hover:opacity-100 hover:bg-opacity-70 focus:opacity-100"
                            >
                               <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor"><path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" /></svg>
                            </button>
                        )}
                        <button
                            onClick={handleDownload}
                            title={t('publishingPanel.storyboard.downloadImage')}
                            className="p-2 text-white transition-all duration-300 bg-black rounded-full bg-opacity-40 opacity-0 group-hover:opacity-100 hover:bg-opacity-70 focus:opacity-100"
                        >
                           <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                        </button>
                        <button
                            onClick={onRegenerate}
                            title={t('publishingPanel.storyboard.regenerate')}
                            className="p-2 text-white transition-all duration-300 bg-black rounded-full bg-opacity-40 opacity-0 group-hover:opacity-100 hover:bg-opacity-70 focus:opacity-100"
                        >
                           <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 110 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" /></svg>
                        </button>
                    </div>
                </>
            ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2">
                    <p className="text-sm text-slate-300">{t('publishingPanel.storyboard.notGenerated')}</p>
                    <p className="text-xs text-slate-400 mt-1">{scene.visualSuggestion}</p>
                </div>
            )}
        </div>
    );
};

export default ScenePreview;