"use client"

import { formatRelativeTime } from '../utils/timeUtils';
import { useAuthStore } from '../lib/authStore';
import { useRouter } from 'next/navigation';
import WatchDescriptionViewer from './WatchDescriptionViewer';

export default function VideoDescription({ videoData }) {
  const router = useRouter();
  const { userSession } = useAuthStore();
  const isSuperadmin = userSession?.user?.user_metadata?.provider_id === process.env.NEXT_PUBLIC_SUPERADMIN;

  const shareContent = async () => {
    const shareData = {
      title: videoData.title,
      text: `Hey! Watch this "${videoData.title}" video on darel's Projects!`,
      url: window.location.href,
      hashtags: videoData.tags?.join(', ') || '',
      via: 'darelsProjects',
    };
    
    if (navigator.share) {
      await navigator.share(shareData)
        .then(() => console.log('Content shared successfully'))
        .catch((error) => console.error('Error sharing content:', error));
    } else {
      alert("Failed to share this video.\n\nThis is because either you're not in secure context, or your browser doesn't support share API.");
      console.error("Web Share is not supported in your browser!");
    }
  };

  const manageContent = () => {
    router.push('/manage/edit?v=' + videoData.id);
  }

  return (
    <div>
      <section className='w-full mb-4 flex gap-2'>
        <button className='btn text-[var(--color-text)] btn-primary hover:bg-secondary px-5 rounded-4xl' onClick={shareContent} title="Share this video">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
          </svg>
          <p className='ml-1 text-[var(--color-text)]'>Share</p>
        </button>
        
        {isSuperadmin && (
          <button className='btn text-[var(--color-text)] btn-primary hover:bg-secondary px-5 rounded-4xl' onClick={manageContent} title="Edit this video">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
            </svg>
            <p className='ml-1 text-[var(--color-text)]'>Edit</p>
          </button>
        )}
      </section>

      <WatchDescriptionViewer videoData={videoData} />
    </div>
  );
}