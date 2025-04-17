import { Suspense } from 'react';
import Loading from './loading';
import LibraryItemViewer from '../components/LibraryItemViewer';
import { getAllVideo } from '@/lib/api';
import HomeGreetings from '@/components/HomeGreetings';
import ErrorState from '@/components/ErrorState';
import SortPreference from '@/components/SortPreference';
import { cookies } from 'next/headers';
import LoadingRedirect from '@/components/LoadingRedirect';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Page({ searchParams }) {
  const paramVal = await searchParams
  const sortBy = paramVal?.sortBy;
  const cookieStore = await cookies();
  const storedPreference = cookieStore.get('sortPreference')?.value || 'desc';
  
  // Show loading component when no sortBy parameter is present, then redirect
  if (!sortBy) {
    return <LoadingRedirect url={`/?sortBy=${storedPreference}`} />;
  }
  
  return (
    <main className="min-h-screen pt-20 px-6 sm:px-10">
      <Suspense fallback={<Loading />}>
        <Content searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

async function Content({ searchParams }) {
  const searchParam = await searchParams;
  const sortBy = searchParam?.sortBy;
  
  let videoData = null;
  let error = null;
  
  try {
    videoData = await getAllVideo(sortBy);
  } catch (err) {
    error = err.message;
  }

  if (error) {
    return (
      <ErrorState 
        message="Currently, the content library is unavailable." 
        actionText="Try Again" 
        actionDesc="We are having trouble loading the content library. Please try refreshing the page."
        action="reload"
      />
    );
  }

  if (!videoData?.length) return null;

  return (
    <section className="flex flex-col">
      <div className="z-10 w-full items-center justify-between font-mono text-sm">
        <HomeGreetings/>
        <section className="flex items-center justify-between mt-8">
          <h1 className="text-4xl font-bold">Home</h1>
          <SortPreference defaultValue={sortBy} />
        </section>
        <div className="flex flex-col">
          <LibraryItemViewer data={videoData} />
        </div>
      </div>
    </section>
  );
}