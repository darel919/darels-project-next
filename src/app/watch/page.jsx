"use server"

import { notFound } from 'next/navigation';
import { getVideoData } from '@/lib/api';
import Player from '../../components/Player';
import Recommendation from '../../components/WatchRecommendations';
import WatchDescriptionViewer from '../../components/WatchDescriptionViewer';
import ShareButton from '../../components/ShareButton';
import ScrollToTop from '../../components/ScrollToTop';
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
    notFound();
  }

  try {
    const videoData = await getVideoData(videoId);
    
    if (!videoData.yt_vid_id && videoId) {
      videoData.yt_vid_id = videoId;
    }
    
    const description = videoData?.description || videoData?.desc 
      ? (videoData.description || videoData.desc) 
      : "No description for this video";

    const currentUrl = `https://projects.darelisme.my.id/watch?v=${videoId}`;
    
    return (
      <section className="flex min-h-[55vh] flex-col items-center pt-20 mx-4 sm:mx-8 mb-8">
        <ScrollToTop videoId={videoId} />
        <div className="w-full">
          <section className={styles.watchContainer}>
            <div className={styles.watchComp}>
              <div>
                <div className="w-full" style={{ 
                  aspectRatio: '16/9',
                }}>
                  <Player playerData={videoData} className="w-full h-full" />
                </div>
                <h1 className="text-2xl font-bold mt-7 mb-4">{videoData.title}</h1>
                <section className='w-full mb-4'>
                  <ShareButton title={videoData.title} url={currentUrl} />
                </section>
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
    notFound();
  }
}