"use server"

import { notFound } from 'next/navigation';
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
    notFound(); // Use Next.js built-in not-found instead of throwing error
  }

  try {
    const videoData = await getVideoData(videoId);
    
    if (!videoData.yt_vid_id && videoId) {
      videoData.yt_vid_id = videoId;
    }
    
    const description = videoData?.description || videoData?.desc 
      ? (videoData.description || videoData.desc) 
      : "No description for this video";
    
    return (
      <section className="flex min-h-screen flex-col items-center pt-16 sm:pt-24 px-4 sm:px-12">
        <div className="w-full">
          <section className={styles.watchContainer}>
            <div className={styles.watchComp}>
              <div>
                <div className="w-full" style={{ 
                  aspectRatio: '16/9',
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
        </div>
      </section>
    );
  } catch (error) {
    // Redirect to not-found page for video not found errors
    notFound();
  }
}