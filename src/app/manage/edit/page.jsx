// "use client";

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getVideoData } from '@/lib/api';
import ErrorState from '@/components/ErrorState';

export default async function EditPage({searchParams}) {
  const params = await searchParams;
  const videoId = params.v;
  
    if (!videoId) {
        return <ErrorState 
        message="Invalid Video ID." 
        actionDesc="Please recheck the video ID."
        actionText='Return to Manage'
        action="manage"
        />;
    }
    let videoData = null;
    try {
        videoData = await getVideoData(videoId);
    } catch (error) {
        return <ErrorState 
        message="This video is unavailable." 
        actionDesc="We couldn't edit this video. Please recheck the video ID or choose another video to edit."
        actionText='Return to Manage'
        action="manage"
        />;
    }

    // return (
    //     <div className="min-h-screen pt-20 px-6 sm:px-10">
    //         <section>
    //             <div className="breadcrumbs text-sm mb-4">
    //                 <ul>
    //                     <li><Link href="/">Home</Link></li>
    //                     <li><Link href="/manage">Manage</Link></li>
    //                     <li><p>Managing content</p></li>
    //                 </ul>
    //             </div>
    //         </section>
    //         {videoId ? (
    //             <h1 className="text-xl font-bold">Editing video with ID: {videoId}</h1>
    //         ) : (
    //             <p>No video ID provided in the URL.</p>
    //         )}
    //         {/* Add editing form or components here */}
    //     </div>
    // );

    return (
        <section className="flex min-h-[55vh] flex-col justify-center p-8 font-mono">
            <h1 className="text-4xl font-bold mb-6">Coming soon...</h1>
            <p>Video manage function will be available later.</p>
        </section>
      );
}