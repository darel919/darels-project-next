import { getVideoData } from '@/lib/api';
import Player from '../../components/Player';
import Recommendation from '../../components/WatchRecommendations';
import WatchDescriptionViewer from '../../components/WatchDescriptionViewer';
import styles from './page.module.css';

export async function generateMetadata({ searchParams }) {
  const params = await searchParams;
  const videoId = params.v;
  
  let videoData = null;
  if (videoId) {
    try {
      videoData = await getVideoData(videoId);
    } catch (error) {
      console.error('Failed to fetch video metadata:', error);
    }
  }
  
  return {
    title: videoData ? `Watching: ${videoData.title}` : 'Watch Page',
    description: videoData ? videoData.description : `Watch video content`,
    openGraph: {
      title: videoData ? `Watching: ${videoData.title}` : 'Watch Page',
      description: videoData ? videoData.description : `Watch video content`,
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
      
      // Make sure the YouTube video ID is available in playerData
      if (!videoData.yt_vid_id && videoId) {
        videoData.yt_vid_id = videoId;
      }
    } catch (err) {
      error = err.message;
    }
  }
  
  // Process the description on the server side
  const description = videoData?.description || videoData?.desc 
    ? (videoData.description || videoData.desc) 
    : "No description for this video";
  
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="w-full max-w-5xl">
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
                  <div className="w-full bg-black relative" style={{ 
                    minHeight: '400px',
                    aspectRatio: '16/9'
                  }}>
                    <Player playerData={videoData} className="w-full h-full" />
                  </div>
                  <h1 className="text-xl font-bold mt-1">{videoData.title}</h1>
                  
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
    </main>
  );
}