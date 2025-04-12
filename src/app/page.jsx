import { Suspense } from 'react';
import Loading from './loading';
import LibraryItemViewer from '../components/LibraryItemViewer';
import { getAllVideo } from '@/lib/api';
import HomeGreetings from '@/components/HomeGreetings';

async function Content() {
  let videoData = null;
  try {
    videoData = await getAllVideo();
  } catch (err) {
    console.error('Failed to fetch video metadata:', err);
  }

  return (
    <>
      {videoData && videoData.length > 0 ? (
        <section className="flex flex-col items-center justify-center pt-20 px-6 sm:px-10">
          <div className="z-10 w-full items-center justify-between font-mono text-sm">
            <HomeGreetings/>
            <h1 className="text-4xl font-bold mt-8">Home</h1>
            <div className="flex flex-col">
              <LibraryItemViewer data={videoData} />
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <Content />
    </Suspense>
  );
}