import { Suspense } from 'react';
import Loading from '../../loading';
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
                    <li><Link href="/manage">Manage</Link></li>
                    <li><p><b>Content Studio</b></p></li>
                </ul>
            </div>
            <section className="flex flex-row items-center justify-between">
              <h1 className="text-4xl font-bold my-4">Content Studio</h1>
              
              <Link href="/manage/content/upload">
                <button className='btn btn-primary text-color text-[var(--color-text)]'>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                  </svg>
                  Upload
                </button>
              </Link>

            </section>
            <p>Welcome to Content Studio. Select items you want to manage.</p>
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