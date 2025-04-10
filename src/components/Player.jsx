"use client"

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
    const [isSelfMode, setIsSelfMode] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);
    const [loadingIframe, setLoadingIframe] = useState(true);
    const [useProxy, setUseProxy] = useState(false);
    
    useEffect(() => {
        if (playerData?.yt_vid_id) {
            const APIEndpoint = process.env.NEXT_PUBLIC_API_BASE_URL || '/';
            setBgUrl(`${APIEndpoint}/thumb?id=${playerData.yt_vid_id}`);
        }
    }, [playerData?.yt_vid_id]);

    useEffect(() => {
        if (!playerData) return;
        
        if (artRef.current) {
            artRef.current.destroy();
            artRef.current = null;
        }
        
        if (playerData.selfHostUrl) {
            setIsSelfMode(true);
            setTimeout(() => initializeArtPlayer(), 0);
        } 
        else if (playerData.yt_vid_id) {
            setIsSelfMode(false);
        } 
        else {
            setErrorMsg("No valid playback source available.");
            setTimeout(() => window.close(), 3000);
        }
    }, [playerData]);

    const initializeArtPlayer = () => {
        if (!containerRef.current || !playerData || !playerData.selfHostUrl) return;

        const baseAPIEndpoint = process.env.NEXT_PUBLIC_API_BASE_URL;
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
                        const hls = new Hls({
                            xhrSetup: (xhr, url) => {
                                xhr.withCredentials = false;
                            }
                        });
                        
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
        <div id="iframe" className={`w-full h-full flex justify-center items-center bg-base-300 bg-opacity-35 ${styles.iframeComp}`}>
            {loadingIframe && (
                <div className="flex flex-col items-center">
                    {bgUrl && (
                        <img 
                            src={bgUrl} 
                            alt="Video thumbnail" 
                            className="absolute inset-0 w-full h-full object-cover z-[-1]" 
                        />
                    )}
                    <h1 className="text-2xl font-bold text-white">Loading iframe...</h1>
                    <div className="progress w-56 my-4">
                        <div className="bg-primary indeterminate"></div>
                    </div>
                    <h2 className="text-white">Waiting YouTube response</h2>
                </div>
            )}
            {playerData?.yt_vid_id && (
                <iframe 
                    className={`w-full h-full ${loadingIframe ? 'hidden' : ''}`}
                    onLoad={handleIframeLoad}
                    loading="eager"
                    title="Player"
                    allowFullScreen
                    allow="autoplay"
                    src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/watch/ilink?v=${playerData.yt_vid_id}&useProxy=${useProxy}`}
                />
            )}
        </div>
    );
}
