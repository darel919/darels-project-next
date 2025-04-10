"use server"

import { getVideoData } from '@/lib/api';
import Player from '../../components/Player';
import Recommendation from '../../components/WatchRecommendations';
import WatchDescriptionViewer from '../../components/WatchDescriptionViewer';
import styles from './page.module.css';

export async function generateMetadata({ searchParams }) {
  const baseURL = 'https://api.darelisme.my.id/dp';
  const params = await searchParams;
  const videoId = params.v;

  let videoData = null;
  try {
    if (videoId) {
      videoData = await getVideoData(videoId);
    }
  } catch (error) {
    console.error('Error fetching video data:', error);
  }

  return {
    title: videoData?.title +" - darel's Projects",
    description: `Play ${videoData?.title} at darel's Projects`,
    keywords: videoData?.title ? `${videoData.title}, darelc, darelisme, darelism, archives` : 'darelc, darelisme, darelism, archives',
    authors: [{ name: videoData?.creator}],
    openGraph: {
      title: videoData?.title,
      description: `Play ${videoData?.title} at darel's Projects`,
      url: `https://projects.darelisme.my.id/watch?v=${videoId}`,
      images: [
        {
          url: `${baseURL}/thumb?id=${videoId}`,
          width: 1280,
          height: 720,
        },
      ],
      siteName: "darel's Projects",
      type: 'video.other',
      video: {
        width: 1280,
        height: 720,
      },
    },
    twitter: {
      card: 'summary_large_image',
      title: videoData?.title,
      description: `Play ${videoData?.title} at darel's Projects`,
      images: `${baseURL}/thumb?id=${videoId}`,
    },
    other: {
      'interactionCount': videoData?.total_views || '0',
      'uploadDate': videoData?.created,
    },
  };
}

export default async function WatchPage({ searchParams }) {
  const params = await searchParams;
  const videoId = params.v;
  
  let videoData = null;
  let error = null;
  
  if (videoId) {
    try {
      videoData = await getVideoData(videoId);
      
      if (!videoData.yt_vid_id && videoId) {
        videoData.yt_vid_id = videoId;
      }
    } catch (err) {
      error = err.message;
    }
  }
  
  const description = videoData?.description || videoData?.desc 
    ? (videoData.description || videoData.desc) 
    : "No description for this video";
  
  return (
      <section className="flex min-h-screen flex-col items-center pt-16 sm:pt-24 px-4 sm:px-12">
        <div className="w-full">
          {error && (
            <div className="alert alert-error mb-4">
              <span>{error}</span>
            </div>
          )}
          
          {videoId && !error ? (
            videoData ? (
              <section className={styles.watchContainer}>
                <div className={styles.watchComp}>
                  <div className="mt-4">
                    <div className="bg-black relative" style={{ 
                      aspectRatio: '16/9',
                      width: '100%',
                    }}>
                      <Player playerData={videoData} className="w-full h-full" />
                    </div>
                    <h1 className="text-xl font-bold mt-6 mb-4">{videoData.title}</h1>
                    
                    <WatchDescriptionViewer videoData={videoData} description={description}/>
                  </div>
                </div>
                <div className={styles.recommendationComp}>
                  <Recommendation videoId={videoId} />
                </div>
              </section>
            ) : (
              <div className="flex flex-col items-center p-8">
                <span className="loading loading-spinner loading-lg text-primary"></span>
                <p className="mt-4">Loading video data...</p>
              </div>
            )
          ) : (
            <div className="alert alert-info">
              <span>No video ID provided. Please use ?v=videoId in the URL.</span>
            </div>
          )}
        </div>
      </section>
      );
}