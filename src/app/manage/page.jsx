import { Suspense } from 'react';
import Loading from '../loading';
import LibraryItemEditor from '@/components/LibraryItemEditor';
import ErrorState from '@/components/ErrorState';
import Link from 'next/link';

export const metadata = {
  title: 'dp-studio Home'
};

export const revalidate = 0;

async function Content() {
  let videoData = null;
  let error = null;
  let loading = true;
  
  try {
    const response = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL+'/', {
      headers: {
        'app': 'dpUploader'
      }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    videoData = await response.json();
    loading = false;
  } catch (err) {
    error = err.message;
    loading = false;
  }

  if (loading) {
    return <Loading />;
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
    <section className="flex flex-col items-center justify-center pt-20 px-6 sm:px-10">
        <div className="z-10 w-full items-center justify-between font-mono text-sm">
            <div className="breadcrumbs text-sm mb-4">
                <ul>
                    <li><Link href="/">Home</Link></li>
                    <li><p>Content Studio</p></li>
                </ul>
            </div>
            <h1 className="text-4xl font-bold my-4">Content Studio</h1>
            <p>Welcome to dp-studio. Select items you want to manage.</p>
            <div className="flex flex-col">
              <LibraryItemEditor data={videoData} />
            </div>
        </div>
    </section>
  );
}

export default function ManagePage() {
  return (
    <Suspense fallback={<Loading />}>
      <Content />
    </Suspense>
  );
}