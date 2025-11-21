
import { useState, useEffect, useCallback } from 'react';

const CLIENT_ID = process.env.YOUTUBE_CLIENT_ID; 
const API_KEY = process.env.YOUTUBE_API_KEY; 
const SCOPES = 'https://www.googleapis.com/auth/youtube.force-ssl';

export const isConfigured = !!(CLIENT_ID && API_KEY);

interface AuthProfile {
    name: string;
    email: string;
    picture: string;
}

const useGoogleAuth = () => {
    const [tokenClient, setTokenClient] = useState<any>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [profile, setProfile] = useState<AuthProfile | null>(null);
    const [isGapiReady, setIsGapiReady] = useState(false);

    const gapiLoaded = useCallback(() => {
        window.gapi.load('client', async () => {
            try {
                await window.gapi.client.init({
                    apiKey: API_KEY,
                    discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest'],
                });
                // Set the access token if it exists from a previous session
                if (accessToken) {
                    window.gapi.client.setToken({ access_token: accessToken });
                }
                setIsGapiReady(true);
            } catch (error) {
                console.error("Error initializing GAPI client", error);
            }
        });
    }, [accessToken]);

    const gsiLoaded = useCallback(() => {
        const client = window.google.accounts.oauth2.initTokenClient({
            client_id: CLIENT_ID,
            scope: SCOPES,
            callback: async (tokenResponse: any) => {
                if (tokenResponse && tokenResponse.access_token) {
                    setAccessToken(tokenResponse.access_token);
                    
                    // Ensure gapi client is ready and configured before setting token
                    // This logic ensures we don't set a token on an uninitialized client
                    if (window.gapi.client && window.gapi.client.youtube) {
                        window.gapi.client.setToken({ access_token: tokenResponse.access_token });
                    }
                    
                    // Fetch user profile after getting the token
                    try {
                        const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                            headers: { 'Authorization': `Bearer ${tokenResponse.access_token}` }
                        });
                        if (!response.ok) {
                           throw new Error('Failed to fetch user profile');
                        }
                        const userProfile = await response.json();
                        setProfile({
                            name: userProfile.name,
                            email: userProfile.email,
                            picture: userProfile.picture,
                        });
                    } catch (error) {
                        console.error("Failed to fetch user profile", error);
                    }
                }
            },
        });
        setTokenClient(client);
    }, []);

    useEffect(() => {
        if (isConfigured) {
            // The scripts are loaded from index.html, we just need to wait for them
            const checkScripts = setInterval(() => {
                if (window.gapi && window.google) {
                    clearInterval(checkScripts);
                    gapiLoaded();
                    gsiLoaded();
                }
            }, 100);
            return () => clearInterval(checkScripts);
        }
    }, [gapiLoaded, gsiLoaded]);


    const signIn = () => {
        if (tokenClient) {
            tokenClient.requestAccessToken({ prompt: 'consent' });
        } else {
            console.error("Google Identity Services client not initialized.");
        }
    };

    const signOut = () => {
        if (accessToken) {
            window.google.accounts.oauth2.revoke(accessToken, () => {
                setAccessToken(null);
                setProfile(null);
                // Clear the token from the gapi client
                if (window.gapi && window.gapi.client) {
                     window.gapi.client.setToken(null);
                }
            });
        }
    };
    
    return { accessToken, profile, signIn, signOut, isGapiReady, isConfigured };
};

export default useGoogleAuth;
