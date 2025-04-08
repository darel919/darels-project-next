import { getVideoData } from '@/lib/api';

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
    } catch (err) {
      error = err.message;
    }
  }
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {videoId && !error ? (
          videoData ? (
            <div className="mt-4">
              <h2 className="text-2xl font-bold">{videoData.title}</h2>
              <p className="mt-2">{videoData.description}</p>
            </div>
          ) : (
            <p>Loading video data...</p>
          )
        ) : (
          <p>No video ID provided. Please use ?v=videoId in the URL.</p>
        )}
      </div>
    </main>
  );
}