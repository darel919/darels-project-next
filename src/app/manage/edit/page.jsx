"use client";
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
export default function EditPage() {
    const searchParams = useSearchParams();
    const videoId = searchParams.get('v');

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