"use client";

import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import artplayerPluginHlsControl from 'artplayer-plugin-hls-control';
import Artplayer from 'artplayer';
import styles from './Player.module.css';

export default function Player({ playerData, className }) {
    const artRef = useRef(null);
    const containerRef = useRef(null);
    const videoRef = useRef(null);
    const [bgUrl, setBgUrl] = useState(null);
    const [isSelfMode, setIsSelfMode] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [loadingIframe, setLoadingIframe] = useState(false);
    const [isInitializing, setIsInitializing] = useState(true);
    const [useProxy, setUseProxy] = useState(false);

    const baseAPIEndpoint = process.env.NEXT_PUBLIC_API_BASE_URL;


    useEffect(() => {
        if (!playerData) return;
        
        if (artRef.current) {
            artRef.current.destroy();
            artRef.current = null;
        }
        
        if (playerData.selfHostUrl) {
            setIsSelfMode(true);
        } 
        else if (playerData.yt_vid_id) {
            setIsSelfMode(false);
            setLoadingIframe(true);
            setBgUrl(`${baseAPIEndpoint}/thumb?id=${playerData.id}`);
        } 
        else {
            setErrorMsg("No valid playback source available.");
            setTimeout(() => window.close(), 3000);
        }
        setIsInitializing(false);
    }, [playerData]);

    useEffect(() => {
        if (isSelfMode && playerData?.selfHostUrl) {
            initializeArtPlayer();
        }
    }, [isSelfMode, playerData]);

    const initializeArtPlayer = () => {
        if (!containerRef.current || !playerData || !playerData.selfHostUrl) return;

        const thumbUrl = baseAPIEndpoint + '/thumb?id=' + playerData.id;
        const hlsUrl = baseAPIEndpoint.replace(/\/dp$/, '') + playerData.selfHostUrl;

        if (artRef.current) {
            artRef.current.destroy();
            artRef.current = null;
        }

        artRef.current = new Artplayer({
            container: containerRef.current,
            url: hlsUrl,
            type: 'm3u8',
            autoplay: true,
            // volume: 0.5,
            isLive: false,
            muted: false,
            autoSize: false,
            autoMini: true,
            loop: false,
            flip: false,
            playbackRate: true,
            aspectRatio: false,
            setting: true,
            fullscreenWeb: false,
            hotkey: true,
            pip: true,
            fullscreen: true,
            subtitleOffset: true,
            miniProgressBar: true,
            mutex: true,
            backdrop: true,
            playsInline: false,
            autoPlayback: true,
            airplay: true,
            autoOrientation: true,
            screenshot: true,
            theme: '#23ade5',
            poster: thumbUrl,
            lang: navigator.language.toLowerCase(),
            plugins: [
                artplayerPluginHlsControl({
                    quality: {
                        control: true,
                        setting: true,
                        getName: (level) => `${level.height}P`,
                        title: 'Quality',
                        auto: 'Auto',
                    },
                }),
            ],
            customType: {
                m3u8: function playM3u8(video, url, art) {
                    if (Hls.isSupported()) {
                        if (art.hls) art.hls.destroy();
                        const hls = new Hls();
                        
                        hls.loadSource(url);
                        hls.attachMedia(video);
                        
                        art.hls = hls;
                        art.on('destroy', () => {
                            if (art.hls) {
                                art.hls.destroy();
                                art.hls = null;
                            }
                        });
                    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                        video.src = url;
                    } else {
                        art.notice.show = 'Unsupported HLS playback';
                    }
                }
            },
        });

    };

    const handleIframeLoad = () => {
        setLoadingIframe(false);
    };

    if (isInitializing || isSelfMode === null) {
        return (
            <div className="w-full h-full flex justify-center items-center">
                <div className="flex flex-col items-center">
                    <span className="loading loading-ball loading-xl"></span>
                    <h2 className="text-base-content font-light text-3xl mt-4">Loading iPlayer</h2>
                </div>
            </div>
        );
    }

    if (errorMsg) {
        return (
            <div className="text-center border bg-base-300 text-base-content p-6 rounded-lg">
                <h1 className="font-bold text-2xl mb-4">Can't play this title right now.</h1>
                <section>
                    <p className="text-xs font-bold mb-2">DWS-iPlayer stop reason: </p>
                    <h3 className="text-sm font-light text-error">
                        {playerData?.yt_vid_id ? `${playerData.yt_vid_id} ${errorMsg}` : errorMsg}
                    </h3>
                </section>
            </div>
        );
    }

    if (isSelfMode) {
        return (
            <div 
                ref={containerRef} 
                className={`${className} rounded-lg overflow-hidden`}
            ></div>
        );
    }

    return (
        <div id="iframe" className={`w-full h-full flex justify-center items-center ${styles.iframeComp}`}
            style={loadingIframe && bgUrl ? { 
                backgroundImage: `url(${bgUrl})`, 
                backgroundSize: 'cover', 
                backgroundPosition: 'center',
                backdropFilter: 'blur(4px)',
                WebkitBackdropFilter: 'blur(4px)',
                position: 'relative',
                transition: 'all 0.3s ease'
            } : {}}>
            {loadingIframe && bgUrl && <div className="absolute inset-0" style={{
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                backdropFilter: 'blur(5px)',
                WebkitBackdropFilter: 'blur(5px)',
                borderRadius: '0.5rem',
            }}></div>}
            {loadingIframe && (
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10 rounded-lg">
                    <div className="p-6 rounded-lg flex flex-col items-center text-primary-content">
                        <span className="loading loading-ball loading-xl"></span>
                        <h2 className="font-light text-3xl mt-4 text-center">Loading...</h2>
                    </div>
                </div>
            )}
            {playerData?.yt_vid_id && (
                <iframe 
                    className={`w-full h-full ${loadingIframe ? 'opacity-0' : 'opacity-100'} relative z-10 rounded-lg`}
                    style={{ transition: 'opacity 0.5s ease-in-out' }}
                    onLoad={handleIframeLoad}
                    loading="eager"
                    title="Player"
                    allowFullScreen
                    allow="autoplay"
                    type="text/html"
                    src={`${baseAPIEndpoint}/watch/ilink?v=${playerData.yt_vid_id}&useProxy=${useProxy}`}
                />
            )}
        </div>
    );
}
