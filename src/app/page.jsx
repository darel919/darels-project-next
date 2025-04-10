import Link from 'next/link';
import LibraryItemViewer from '../components/LibraryItemViewer';
import { getAllVideo } from '@/lib/api';
export default async function Home() {
  let videoData = null;
  try {
    videoData = await getAllVideo();
  } catch (err) {
    console.error('Failed to fetch video metadata:', err);
  }

  return (
    <section className="flex min-h-screen flex-col items-center justify-center pt-24 px-12">
      <div className="z-10 w-full items-center justify-between font-mono text-sm">
        <p>Welcome to darel's Projects.</p>
        <h1 className="text-4xl font-bold mb-4">Home</h1>
        
        <div className="flex flex-col gap-4">
          <LibraryItemViewer data={videoData} />
        </div>
      </div>
    </section>
  );
}