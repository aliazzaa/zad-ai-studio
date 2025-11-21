
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { StreamingPlatform, StreamingPlatformCredentials } from '../../types';

interface StreamingHubProps {
    platform: Exclude<StreamingPlatform, 'youtube'>;
}

const platformData = {
    facebook: {
        dashboardUrl: 'https://www.facebook.com/live/producer',
        name: 'Facebook',
        color: 'bg-blue-600',
        icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
    },
    tiktok: {
        dashboardUrl: 'https://www.tiktok.com/studio/download',
        name: 'TikTok',
        color: 'bg-black',
        icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93v6.16c0 2.52-1.12 4.84-2.98 6.38C11.48 22.4 8.94 22.97 6.5 22.7c-3.6-.4-6.6-3.47-6.6-7.17 0-3.95 3.22-7.17 7.17-7.17.63 0 1.25.09 1.85.25v4.23c-.26-.08-.53-.14-.8-.14-1.8 0-3.27 1.47-3.27 3.27 0 1.8 1.47 3.27 3.27 3.27 1.72 0 3.13-1.33 3.25-3.05V.02h1.16z"/></svg>
    },
    instagram: {
        dashboardUrl: 'https://www.instagram.com/',
        name: 'Instagram',
        color: 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500',
        icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.069-4.85.069-3.204 0-3.584-.012-4.849-.069-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
    },
    twitter: {
        dashboardUrl: 'https://twitter.com/i/broadcasts/create',
        name: 'Twitter (X)',
        color: 'bg-gray-900',
        icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231L18.244 2.25zM17.633 19.75h1.745L6.425 4.25H4.558l13.075 15.5z"/></svg>
    },
    generic: {
        dashboardUrl: '',
        name: 'Generic RTMP',
        color: 'bg-gray-500',
        icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/><path d="M11 7h2v6h-2zm0 8h2v2h-2z"/></svg>
    }
};

const StreamingHub: React.FC<StreamingHubProps> = ({ platform }) => {
    const { t } = useLanguage();
    const currentPlatform = platformData[platform];
    const storageKey = `streaming_hub_credentials_${platform}`;

    const [serverUrl, setServerUrl] = useState('');
    const [streamKey, setStreamKey] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [saved, setSaved] = useState(false);
    const [isGuideOpen, setIsGuideOpen] = useState(false);
    const [showStreamKey, setShowStreamKey] = useState(false);


    useEffect(() => {
        try {
            const savedCredentials = localStorage.getItem(storageKey);
            if (savedCredentials) {
                const { serverUrl: savedUrl, streamKey: savedKey } = JSON.parse(savedCredentials);
                setServerUrl(savedUrl);
                setStreamKey(savedKey);
                setIsEditing(false);
            } else {
                setServerUrl('');
                setStreamKey('');
                setIsEditing(true);
            }
        } catch (error) {
            console.error("Failed to parse saved credentials:", error);
            setServerUrl('');
            setStreamKey('');
            setIsEditing(true);
        }
    }, [platform, storageKey]);

    const handleSave = () => {
        if (!serverUrl || !streamKey) return; 
        const credentials: Omit<StreamingPlatformCredentials, 'platform'> = { serverUrl, streamKey };
        localStorage.setItem(storageKey, JSON.stringify(credentials));
        setSaved(true);
        setIsEditing(false);
        setTimeout(() => setSaved(false), 2000);
    };

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    const hasCredentials = serverUrl && streamKey;

    return (
        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 dark:bg-slate-800 dark:border-slate-700 transition-all animate-fade-in">
            <div className="flex items-center justify-center gap-3 mb-6">
                 <div className={`p-3 rounded-full text-white shadow-lg ${currentPlatform.color}`}>
                    {currentPlatform.icon}
                 </div>
                <h3 className="text-2xl font-bold text-teal-800 dark:text-teal-300">
                    {t('liveStream.streamingHub.title', { platform: currentPlatform.name })}
                </h3>
            </div>

            <div className="p-5 mb-6 text-sm text-center text-blue-900 bg-blue-50 rounded-xl border border-blue-100 dark:bg-blue-900/20 dark:text-blue-200 dark:border-blue-900/30">
                <p className="leading-relaxed">{t('liveStream.streamingHub.instructions', { platform: currentPlatform.name })}</p>
                {currentPlatform.dashboardUrl && (
                    <a href={currentPlatform.dashboardUrl} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-2 mt-4 px-5 py-2 font-bold text-white transition-transform rounded-lg shadow hover:-translate-y-0.5 ${currentPlatform.color} hover:brightness-110`}>
                       {t('liveStream.streamingHub.goToDashboard', { platform: currentPlatform.name })}
                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                    </a>
                )}
            </div>
           
            <div className="space-y-5" dir="ltr">
                <div className="group">
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400 mb-1">
                        {t('liveStream.streamingHub.serverUrlLabel')}
                    </label>
                    <div className="flex gap-0 shadow-sm rounded-lg overflow-hidden ring-1 ring-gray-200 dark:ring-slate-600 focus-within:ring-2 focus-within:ring-teal-500 transition-shadow">
                        <input 
                            type="text" 
                            value={serverUrl} 
                            onChange={e => setServerUrl(e.target.value)} 
                            className="w-full p-3 font-mono text-sm bg-gray-50 text-gray-800 outline-none dark:bg-slate-900 dark:text-teal-300"
                            readOnly={!isEditing} 
                            placeholder="rtmp://..."
                        />
                        <button onClick={() => handleCopy(serverUrl)} className="px-4 bg-gray-100 hover:bg-gray-200 border-l border-gray-200 text-gray-600 font-bold text-xs uppercase dark:bg-slate-700 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-600 transition-colors" title={t('global.copyButton')}>
                           {t('global.copyButton')}
                        </button>
                    </div>
                </div>
                <div className="group">
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400 mb-1">
                        {t('liveStream.streamingHub.streamKeyLabel')}
                    </label>
                     <div className="flex gap-0 shadow-sm rounded-lg overflow-hidden ring-1 ring-gray-200 dark:ring-slate-600 focus-within:ring-2 focus-within:ring-teal-500 transition-shadow">
                        <input 
                            type={showStreamKey ? 'text' : 'password'}
                            value={streamKey} 
                            onChange={e => setStreamKey(e.target.value)} 
                            className="w-full p-3 font-mono text-sm bg-gray-50 text-gray-800 outline-none dark:bg-slate-900 dark:text-teal-300"
                            readOnly={!isEditing}
                            placeholder="••••••••••••"
                        />
                         <button 
                            onClick={() => setShowStreamKey(!showStreamKey)} 
                            className="px-3 bg-white border-l border-gray-200 text-gray-500 hover:text-gray-700 dark:bg-slate-900 dark:border-slate-600 dark:text-slate-400 dark:hover:text-slate-200"
                            title="Show/Hide"
                        >
                             {showStreamKey ? (
                                 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                             ) : (
                                 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                             )}
                         </button>
                         <button onClick={() => handleCopy(streamKey)} className="px-4 bg-gray-100 hover:bg-gray-200 border-l border-gray-200 text-gray-600 font-bold text-xs uppercase dark:bg-slate-700 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-600 transition-colors" title={t('global.copyButton')}>
                            {t('global.copyButton')}
                        </button>
                    </div>
                </div>
            </div>
            
             {/* Collapsible Guide */}
            <div className="mt-8 border border-gray-200 rounded-xl overflow-hidden dark:border-slate-600">
                <button 
                    onClick={() => setIsGuideOpen(!isGuideOpen)}
                    className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 dark:bg-slate-700 dark:hover:bg-slate-600 transition-colors"
                >
                    <span className="font-bold text-gray-700 dark:text-slate-200 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {t('liveStream.streamingHub.guideTitle')}
                    </span>
                    <svg className={`w-5 h-5 text-gray-500 transition-transform ${isGuideOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </button>
                {isGuideOpen && (
                    <div className="p-5 bg-white dark:bg-slate-800 text-sm space-y-3">
                        <ol className="list-decimal list-outside ltr:pl-4 rtl:pr-4 space-y-2 text-gray-600 dark:text-slate-300">
                            {[1, 2, 3, 4, 5, 6, 7].map(num => (
                                <li key={num} dangerouslySetInnerHTML={{ __html: t(`liveStream.streamingHub.steps.${num}`, { platform: currentPlatform.name }) }} />
                            ))}
                        </ol>
                    </div>
                )}
            </div>


            <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100 dark:border-slate-700">
                {!isEditing && hasCredentials && (
                    <button onClick={() => setIsEditing(true)} className="px-5 py-2 font-bold text-gray-700 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600">
                        {t('global.edit')}
                    </button>
                )}
                {isEditing && (
                    <>
                        {hasCredentials && (
                             <button onClick={() => setIsEditing(false)} className="px-5 py-2 font-bold text-gray-600 transition-colors bg-transparent rounded-lg hover:bg-gray-100 dark:text-slate-400 dark:hover:bg-slate-700">
                                {t('global.cancel')}
                            </button>
                        )}
                        <button onClick={handleSave} disabled={!serverUrl || !streamKey} className="px-6 py-2 font-bold text-white transition-all bg-teal-600 rounded-lg shadow hover:bg-teal-700 active:scale-95 disabled:opacity-50 disabled:scale-100">
                            {saved ? t('liveStream.streamingHub.saved') : t('global.save')}
                        </button>
                    </>
                )}
            </div>
            {!hasCredentials && !isEditing && (
                <p className="mt-4 text-sm text-center text-gray-400 dark:text-slate-500 italic">
                    {t('liveStream.streamingHub.noCredentials')}
                </p>
            )}
        </div>
    );
};

export default StreamingHub;
