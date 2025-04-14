"use server"

import { notFound } from 'next/navigation';
import { getVideoData } from '@/lib/api';
import Player from '../../components/Player';
import Recommendation from '../../components/WatchRecommendations';
import VideoDataViewer from '../../components/VideoDataViewer';
import ScrollToTop from '../../components/ScrollToTop';
import styles from './page.module.css';
import ErrorState from '@/components/ErrorState';

export async function generateMetadata({ searchParams }) {
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const params = await searchParams;
  const videoId = params.v;

  let videoData = null;
  try {
    if (videoId) {
      videoData = await getVideoData(videoId);
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
  } catch (error) {
    console.error('Error fetching video data:', error);
  }
}

export default async function WatchPage({ searchParams }) {
  const params = await searchParams;
  const videoId = params.v;
  
  if (!videoId) {
    notFound();
  }

  let videoData = null;
  try {
    videoData = await getVideoData(videoId);
  } catch (error) {
    return <ErrorState 
      message="This video is currently unavailable." 
      actionDesc="We couldn't load this video. It might have been removed or there might be a temporary issue."
      action="home"
    />;
  }
    
  if (!videoData.yt_vid_id && videoId) {
    videoData.yt_vid_id = videoId;
  }
  
  return (
    <section className="flex min-h-[55vh] flex-col items-center pt-20 mx-4 sm:mx-8 mb-8">
      <ScrollToTop videoId={videoId} />
      <div className="w-full">
        <section className={styles.watchContainer}>
          <div className={styles.watchComp}>
            <div>
              <Player playerData={videoData} className="w-full h-full mb-4 aspect-16/9"/>
              {videoData.isHidden ? 
                <div className="badge badge-ghost" title="This video is hidden. You have to share this video for others to see it.">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                  <p>Hidden</p>
                </div> 
                : null
              }
              {videoData.expand.category[0].isHidden ? 
                <div className="badge badge-ghost" title="This video is inside a hidden category. You have to share this video for others to see it.">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                  <p>Hidden</p>
                </div> 
                : null
              }
              <h1 className="text-2xl font-bold mt-4 mb-4">{videoData.title}</h1>
              <VideoDataViewer videoData={videoData} />
            </div>
          </div>
          <div className={styles.recommendationComp}>
            <Recommendation videoId={videoId} />
          </div>
        </section>
      </div>
    </section>
  );
}