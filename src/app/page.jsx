import { Suspense } from 'react';
import Loading from './loading';
import LibraryItemViewer from '../components/LibraryItemViewer';
import { getAllVideo } from '@/lib/api';
import HomeGreetings from '@/components/HomeGreetings';
import ErrorState from '@/components/ErrorState';

export const revalidate = 0; // Disable page caching

async function Content() {
  let videoData = null;
  let error = null;
  
  try {
    videoData = await getAllVideo();
  } catch (err) {
    error = err.message;
  }

  if (error) {
    return (
      <ErrorState 
        message="Currently, the content library is unavailable" 
        actionText="Try Again" 
        actionDesc="We are having trouble loading the content library. Please try refreshing the page."
        action="reload"
      />
    );
  }

  if (!videoData?.length) return null;

  return (
    <section className="flex flex-col items-center justify-center pt-20 px-6 sm:px-10">
      <div className="z-10 w-full items-center justify-between font-mono text-sm">
        <HomeGreetings/>
        <h1 className="text-4xl font-bold mt-8">Home</h1>
        <div className="flex flex-col">
          <LibraryItemViewer data={videoData} />
        </div>
      </div>
    </section>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <Content />
    </Suspense>
  );
}