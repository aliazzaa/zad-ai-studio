
import React, { useState } from 'react';
import useGoogleAuth from '../hooks/useGoogleAuth';
import * as youtubeService from '../services/youtubeService';
import { LiveBroadcast, LiveStream, StreamingPlatform } from '../types';
import LoadingSpinner from './LoadingSpinner';
import { useLanguage } from '../contexts/LanguageContext';
import { useAppContext } from '../contexts/AppContext';
import StreamingHub from './dashboard/StreamingHub';
import TabButton from './TabButton';


// --- YouTube Panel Component ---

const YouTubePanel: React.FC = () => {
    const { t } = useLanguage();
    const { accessToken, profile, isGapiReady, signIn, signOut } = useGoogleAuth();
    const [broadcasts, setBroadcasts] = useState<LiveBroadcast[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [authError, setAuthError] = useState(false);
    const [selectedBroadcast, setSelectedBroadcast] = useState<LiveBroadcast | null>(null);
    const [streamKey, setStreamKey] = useState<string | null>(null);
    const [ingestionAddress, setIngestionAddress] = useState<string | null>(null);
    const [showScheduleForm, setShowScheduleForm] = useState(false);
    const [isGuideOpen, setIsGuideOpen] = useState(false);


    const handleApiError = (err: any) => {
        console.error("API Error", err);
        const msg = err.message || '';
        if (msg.includes('401') || msg.toLowerCase().includes('unauthorized') || msg.toLowerCase().includes('token')) {
            setAuthError(true);
            setError(t('liveStream.error.authFailed'));
        } else {
             setError(t('liveStream.error.loadFailed'));
        }
    };

    const fetchBroadcasts = async () => {
        if (!isGapiReady) return;
        setIsLoading(true);
        setError(null);
        setAuthError(false);
        try {
            const response = await youtubeService.listBroadcasts();
            setBroadcasts(response.items || []);
        } catch (err) {
            handleApiError(err);
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        if (accessToken && isGapiReady) {
            fetchBroadcasts();
        }
    }, [accessToken, isGapiReady]);

    const handleSelectBroadcast = async (broadcast: LiveBroadcast) => {
        if (!isGapiReady) return;
        setSelectedBroadcast(broadcast);
        setStreamKey(null);
        setIngestionAddress(null);
        setIsLoading(true);
        try {
            const streamId = broadcast.contentDetails.boundStreamId;
            if (streamId) {
                const stream = await youtubeService.getLiveStream(streamId);
                setStreamKey(stream.cdn.ingestionInfo.streamName);
                setIngestionAddress(stream.cdn.ingestionInfo.ingestionAddress);
            } else {
                 setError(t('liveStream.error.noStreamBound'));
            }
        } catch (err) {
             setError(t('liveStream.error.fetchKeyFailed'));
        } finally {
            setIsLoading(false);
        }
    };

     const handleScheduleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!isGapiReady) return;

        const formData = new FormData(event.currentTarget);
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const scheduledTime = new Date(formData.get('scheduledTime') as string).toISOString();

        setIsLoading(true);
        setShowScheduleForm(false);
        try {
            await youtubeService.scheduleBroadcast(title, description, scheduledTime);
            await fetchBroadcasts();
        } catch (err) {
            setError(t('liveStream.error.scheduleFailed'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleTransition = async (id: string, status: 'live' | 'complete') => {
        if (!isGapiReady) return;
        setIsLoading(true);
        try {
            await youtubeService.transitionBroadcast(id, status);
            setTimeout(async () => {
                 await fetchBroadcasts();
                 if (selectedBroadcast?.id === id) {
                     const updatedBroadcast = await youtubeService.getBroadcast(id);
                     setSelectedBroadcast(updatedBroadcast);
                 }
            }, 2000);
        } catch (err) {
            setError(t('liveStream.error.transitionFailed', { status }));
            setIsLoading(false);
        }
    };

    if (!accessToken) {
        return (
            <div className="flex flex-col items-center justify-center p-10 text-center border-2 border-dashed border-red-200 rounded-2xl bg-red-50/50 dark:bg-red-900/10 dark:border-red-800/30">
                <div className="p-4 mb-6 bg-white rounded-full shadow-lg dark:bg-slate-700">
                     <svg className="w-12 h-12 text-red-600" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-800 dark:text-white">{t('liveStream.youtube.connectTitle')}</h3>
                <p className="max-w-md mb-6 text-gray-600 dark:text-slate-300">
                    {t('liveStream.signInPrompt')}
                </p>
                <button
                    onClick={signIn}
                    className="flex items-center gap-3 px-8 py-4 font-bold text-white transition-transform transform bg-red-600 rounded-xl shadow-lg hover:bg-red-700 hover:scale-105 disabled:opacity-50 disabled:scale-100"
                    disabled={!isGapiReady}
                >
                     {isGapiReady ? (
                        <>
                             <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/></svg>
                            {t('liveStream.signInButton')}
                        </>
                     ) : (
                        <>
                            <div className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                            {t('liveStream.initializingGoogle')}
                        </>
                     )}
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
             <div className="flex flex-col items-center justify-between gap-4 p-4 bg-white border border-gray-100 shadow-sm rounded-2xl sm:flex-row dark:bg-slate-800 dark:border-slate-700">
                <div className="flex items-center gap-4">
                    {profile?.picture && <img src={profile.picture} alt="Profile" className="w-12 h-12 rounded-full border-2 border-red-100" />}
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-white">{profile?.name}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{profile?.email}</p>
                    </div>
                </div>
                <div className="flex gap-3">
                     <button onClick={() => setShowScheduleForm(!showScheduleForm)} className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white transition-all bg-red-600 rounded-lg shadow hover:bg-red-700">
                        <span>+</span> {showScheduleForm ? t('global.close') : t('liveStream.scheduleNew')}
                    </button>
                    <button onClick={signOut} className="px-4 py-2 text-sm font-bold text-gray-700 transition-all bg-gray-100 border border-gray-200 rounded-lg hover:bg-gray-200 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600">
                        {t('header.logout')}
                    </button>
                </div>
            </div>
            
            {error && (
                <div className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-red-700 bg-red-50 border border-red-200 rounded-xl dark:bg-red-900/30 dark:text-red-300 dark:border-red-800">
                    <span>{error}</span>
                    {authError && (
                         <button onClick={signIn} className="px-4 py-2 text-sm font-bold text-white bg-red-600 rounded-lg hover:bg-red-700">
                            {t('liveStream.signInButton')}
                        </button>
                    )}
                </div>
            )}

            {showScheduleForm && (
                <div className="p-6 bg-white border border-gray-200 shadow-lg rounded-2xl dark:bg-slate-800 dark:border-slate-700 animate-fade-in">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">{t('liveStream.scheduleForm.title')}</h3>
                    <form onSubmit={handleScheduleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">{t('liveStream.scheduleForm.broadcastTitle')}</label>
                                <input name="title" type="text" required className="w-full p-2 rounded-lg border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-red-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"/>
                            </div>
                             <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">{t('scheduleModal.timeLabel')}</label>
                                <input name="scheduledTime" type="datetime-local" required className="w-full p-2 rounded-lg border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-red-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"/>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">{t('liveStream.scheduleForm.broadcastDescription')}</label>
                            <textarea name="description" rows={2} required className="w-full p-2 rounded-lg border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-red-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"></textarea>
                        </div>
                        <div className="flex justify-end gap-3 pt-2">
                            <button type="button" onClick={() => setShowScheduleForm(false)} className="px-4 py-2 font-bold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-slate-700 dark:text-slate-300">
                                {t('global.cancel')}
                            </button>
                            <button type="submit" className="px-6 py-2 font-bold text-white bg-red-600 rounded-lg shadow hover:bg-red-700">
                                {t('liveStream.scheduleForm.schedule')}
                            </button>
                        </div>
                    </form>
                </div>
            )}

             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* List Column */}
                <div className="lg:col-span-1 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden dark:bg-slate-800 dark:border-slate-700 h-[500px] flex flex-col">
                    <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center dark:bg-slate-700/50 dark:border-slate-600">
                        <h3 className="font-bold text-gray-700 dark:text-slate-200">{t('liveStream.broadcastList')}</h3>
                        <button onClick={fetchBroadcasts} className="text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                        </button>
                    </div>
                    
                    {isLoading && broadcasts.length === 0 ? (
                        <div className="flex-grow flex items-center justify-center"><LoadingSpinner message={t('liveStream.loadingBroadcasts')} /></div>
                    ) : (
                        <ul className="overflow-y-auto flex-grow p-2 space-y-2">
                            {broadcasts.map(b => {
                                const isLive = b.status.lifeCycleStatus === 'live';
                                const isSelected = selectedBroadcast?.id === b.id;
                                return (
                                    <li 
                                        key={b.id} 
                                        onClick={() => handleSelectBroadcast(b)} 
                                        className={`p-3 rounded-xl cursor-pointer transition-all border ${
                                            isSelected 
                                                ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800' 
                                                : 'bg-white border-transparent hover:bg-gray-50 dark:bg-slate-800 dark:hover:bg-slate-700'
                                        }`}
                                    >
                                        <div className="flex justify-between items-center mb-1">
                                            <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${isLive ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-200 text-gray-600 dark:bg-slate-600 dark:text-slate-300'}`}>
                                                {isLive ? 'LIVE' : b.status.lifeCycleStatus}
                                            </span>
                                            <span className="text-xs text-gray-400">
                                                {new Date(b.snippet.scheduledStartTime).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="font-semibold text-sm text-gray-800 dark:text-slate-200 line-clamp-2">{b.snippet.title}</p>
                                    </li>
                                );
                            })}
                            {broadcasts.length === 0 && (
                                <li className="text-center text-gray-500 py-8 text-sm">{t('liveStream.noBroadcastsFound')}</li>
                            )}
                        </ul>
                    )}
                </div>

                {/* Details Column */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm p-6 dark:bg-slate-800 dark:border-slate-700 min-h-[500px] flex flex-col">
                    {selectedBroadcast ? (
                        <div className="flex flex-col h-full">
                             <div className="mb-6">
                                <h4 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{selectedBroadcast.snippet.title}</h4>
                                <p className="text-gray-600 dark:text-slate-300 text-sm">{selectedBroadcast.snippet.description || 'No description'}</p>
                            </div>
                            
                             {isLoading && !streamKey ? (
                                <div className="flex-grow flex items-center justify-center"><LoadingSpinner message={t('liveStream.loadingStreamKey')}/></div>
                             ) : (
                                <div className="space-y-6 flex-grow">
                                    <div className="bg-slate-900 rounded-xl p-5 text-slate-200 shadow-inner border border-slate-700">
                                        <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">{t('liveStream.streamSettingsTitle')}</h5>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-xs text-slate-500 block mb-1">{t('liveStream.serverUrl')}</label>
                                                <div className="flex gap-2">
                                                    <input type="text" readOnly value={ingestionAddress || ''} className="flex-grow bg-black/50 border border-slate-700 rounded px-3 py-2 font-mono text-xs select-all text-green-400" />
                                                    <button onClick={() => navigator.clipboard.writeText(ingestionAddress || '')} className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-1 rounded text-xs font-bold">{t('liveStream.streamingHub.copyButton')}</button>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-xs text-slate-500 block mb-1">{t('liveStream.streamKey')}</label>
                                                <div className="flex gap-2">
                                                    <input type="password" readOnly value={streamKey || ''} className="flex-grow bg-black/50 border border-slate-700 rounded px-3 py-2 font-mono text-xs select-all text-green-400" />
                                                    <button onClick={() => navigator.clipboard.writeText(streamKey || '')} className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-1 rounded text-xs font-bold">{t('liveStream.streamingHub.copyButton')}</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Guide */}
                                    <div className="border border-gray-200 rounded-xl overflow-hidden dark:border-slate-600">
                                        <button 
                                            onClick={() => setIsGuideOpen(!isGuideOpen)}
                                            className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 dark:bg-slate-700 dark:hover:bg-slate-600 transition-colors"
                                        >
                                            <span className="font-bold text-gray-700 dark:text-slate-200 text-sm">{t('liveStream.streamingHub.guideTitle')}</span>
                                            <svg className={`w-5 h-5 text-gray-500 transition-transform ${isGuideOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                        </button>
                                        {isGuideOpen && (
                                            <div className="p-4 bg-white dark:bg-slate-800 text-xs space-y-2 text-gray-600 dark:text-slate-300">
                                                <p>1. {t('liveStream.streamingHub.steps.1', { platform: 'YouTube' })}</p>
                                                <p>2. {t('liveStream.streamingHub.steps.2', { platform: 'YouTube' })}</p>
                                                <p>3. {t('liveStream.streamingHub.steps.5', { platform: 'YouTube' })}</p>
                                                <p>4. {t('liveStream.streamingHub.steps.6', { platform: 'YouTube' })}</p>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="flex gap-3 pt-4 mt-auto">
                                        <button 
                                            onClick={() => handleTransition(selectedBroadcast.id, 'live')} 
                                            disabled={selectedBroadcast.status.lifeCycleStatus === 'live' || selectedBroadcast.status.lifeCycleStatus === 'complete' || isLoading} 
                                            className="flex-1 px-4 py-3 font-bold text-white bg-green-600 rounded-xl shadow hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {t('liveStream.startBroadcast')}
                                        </button>
                                        
                                        <button 
                                            onClick={() => handleTransition(selectedBroadcast.id, 'complete')} 
                                            disabled={selectedBroadcast.status.lifeCycleStatus !== 'live' || isLoading} 
                                            className="flex-1 px-4 py-3 font-bold text-white bg-red-600 rounded-xl shadow hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {t('liveStream.endBroadcast')}
                                        </button>
                                    </div>
                                </div>
                             )}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-slate-500">
                            <span className="text-6xl mb-4">📺</span>
                            <p>{t('liveStream.selectBroadcastPrompt')}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};


// --- Main Component ---

const LiveStreamManager: React.FC = () => {
    const { t, language } = useLanguage();
    const { goBack, canGoBack } = useAppContext();
    const { isConfigured } = useGoogleAuth();
    
    const [activePlatform, setActivePlatform] = useState<StreamingPlatform>('youtube');

    // Platforms list
    const platforms: StreamingPlatform[] = ['youtube', 'tiktok', 'facebook', 'instagram', 'twitter', 'generic'];

    const renderPlatformContent = () => {
        if (activePlatform === 'youtube') {
            return <YouTubePanel />;
        }
        return <StreamingHub platform={activePlatform as Exclude<StreamingPlatform, 'youtube'>} />;
    };

    const getPlatformLabel = (p: StreamingPlatform) => {
        switch(p) {
            case 'youtube': return t('liveStream.youtubeTab');
            case 'tiktok': return t('liveStream.tiktokTab');
            case 'facebook': return t('liveStream.facebookTab');
            case 'instagram': return t('liveStream.instagramTab');
            case 'twitter': return t('liveStream.twitterTab');
            case 'generic': return t('liveStream.genericTab');
            default: return p;
        }
    };

    return (
        <section className="relative flex flex-col gap-6 pb-12">
             <div className="flex items-center justify-between">
                {canGoBack && (
                    <button onClick={goBack} className="flex items-center gap-2 px-5 py-2.5 font-bold text-teal-800 transition-all bg-white/80 rounded-full shadow-sm hover:bg-white hover:shadow backdrop-blur-md dark:bg-slate-800/80 dark:text-teal-300 dark:hover:bg-slate-800" title={t('global.backToDashboard')}>
                        <svg xmlns="http://www.w3.org/2000/svg" className={`w-5 h-5 ${language === 'ar' ? 'transform rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        <span>{t('global.backToDashboard')}</span>
                    </button>
                )}
                <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-800 to-cyan-700 dark:from-teal-200 dark:to-cyan-300 filter drop-shadow-sm">
                    {t('liveStream.hubTitle')}
                </h2>
                <div className="w-10"></div>
            </div>

            {/* Warning if YouTube API not configured but selected */}
            {activePlatform === 'youtube' && !isConfigured && (
                <div className="p-4 text-center bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-xl dark:bg-yellow-900/20 dark:text-yellow-200 dark:border-yellow-700">
                    <p className="text-sm font-bold">{t('liveStream.featureDisabled.title')}</p>
                    <p className="text-xs mt-1 opacity-80">{t('liveStream.featureDisabled.description')}</p>
                </div>
            )}

            <div className="glass-panel rounded-3xl border border-white/30 shadow-xl overflow-hidden min-h-[600px]">
                {/* Unified Platform Tabs */}
                <div className="p-4 border-b border-gray-200/50 dark:border-white/10 bg-white/40 dark:bg-slate-900/40 overflow-x-auto">
                    <div className="flex gap-2 min-w-max justify-center">
                         {platforms.map(platform => (
                             <TabButton 
                                key={platform}
                                label={getPlatformLabel(platform)}
                                isActive={activePlatform === platform}
                                onClick={() => setActivePlatform(platform)}
                            />
                        ))}
                    </div>
                </div>

                {/* Content Area */}
                <div className="p-6 bg-slate-50/50 dark:bg-slate-900/30">
                     {renderPlatformContent()}
                </div>
            </div>
        </section>
    );
};

export default LiveStreamManager;
