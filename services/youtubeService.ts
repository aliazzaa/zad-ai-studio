
import { LiveBroadcast, LiveStream } from '../types';

const handleGapiError = (error: any) => {
    console.error("YouTube API GAPI Error:", error);
    const message = error.result?.error?.message || 'An error occurred with the YouTube API.';
    throw new Error(message);
};

export const listBroadcasts = async (): Promise<any> => {
    try {
        const response = await window.gapi.client.youtube.liveBroadcasts.list({
            part: 'snippet,contentDetails,status',
            broadcastStatus: 'all',
            mine: true,
        });
        return response.result;
    } catch (error) {
        handleGapiError(error);
    }
};

export const getBroadcast = async (id: string): Promise<LiveBroadcast> => {
    try {
        const response = await window.gapi.client.youtube.liveBroadcasts.list({
            part: 'snippet,contentDetails,status',
            id: id,
        });
        if (response.result.items && response.result.items.length > 0) {
            return response.result.items[0];
        }
        throw new Error('Broadcast not found.');
    } catch (error) {
        handleGapiError(error);
        throw error;
    }
};

export const getLiveStream = async (id: string): Promise<LiveStream> => {
     try {
        const response = await window.gapi.client.youtube.liveStreams.list({
            part: 'snippet,cdn',
            id: id,
        });
        if (response.result.items && response.result.items.length > 0) {
            return response.result.items[0];
        }
        throw new Error('Live stream not found.');
    } catch (error) {
        handleGapiError(error);
        throw error;
    }
};


export const scheduleBroadcast = async (
    title: string,
    description: string,
    scheduledStartTime: string
): Promise<LiveBroadcast> => {
    try {
        // 1. Create the Live Stream resource
        const streamInsertResponse = await window.gapi.client.youtube.liveStreams.insert({
            part: 'snippet,cdn,status',
            resource: {
                snippet: { title },
                cdn: {
                    frameRate: "variable",
                    ingestionType: "rtmp",
                    resolution: "variable",
                },
            },
        });
        const liveStream = streamInsertResponse.result;

        // 2. Create the Live Broadcast resource
        // We set enableAutoStart to false to give the user manual control to start the broadcast from the app
        const broadcastInsertResponse = await window.gapi.client.youtube.liveBroadcasts.insert({
            part: 'snippet,contentDetails,status',
            resource: {
                snippet: {
                    title,
                    description,
                    scheduledStartTime,
                },
                status: { privacyStatus: 'private' },
                contentDetails: {
                    enableAutoStart: false, 
                    enableAutoStop: true,
                },
            },
        });
        const liveBroadcast = broadcastInsertResponse.result;

        // 3. Bind the stream to the broadcast
        const bindResponse = await window.gapi.client.youtube.liveBroadcasts.bind({
            id: liveBroadcast.id!,
            streamId: liveStream.id!,
            part: 'snippet,contentDetails,status',
        });
        return bindResponse.result;
    } catch (error) {
        handleGapiError(error);
        throw error;
    }
};

export const transitionBroadcast = async (id: string, status: 'live' | 'testing' | 'complete'): Promise<LiveBroadcast> => {
    try {
        const response = await window.gapi.client.youtube.liveBroadcasts.transition({
            id: id,
            broadcastStatus: status,
            part: 'snippet,contentDetails,status',
        });
        return response.result;
    } catch (error) {
        handleGapiError(error);
        throw error;
    }
};
