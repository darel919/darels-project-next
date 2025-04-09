"use client"

import { formatRelativeTime } from '../utils/timeUtils';

export default function VideoDescription({ videoData, description }) {
  const formatFullDate = (dateString) => {
    if (!dateString) return 'No date available';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <details className="border border-base-300 bg-base-100 group">
      <summary className="list-none cursor-pointer p-4">
        <div className="group-open:hidden">
          <span>{videoData.total_views || 'No'} views {videoData.created ? formatRelativeTime(videoData.created) : 'No date'}</span>
          <p className="text-sm mt-1 line-clamp-1">
            {description}
          </p>
        </div>
      </summary>
      <div className="px-4 pb-4">
        <span className="text-sm">{videoData.total_views || 'No'} views • Published on {videoData.created ? formatFullDate(videoData.created) : 'No date'}</span>
        <p className="mt-2">
          {description}
        </p>
        {videoData.expand?.category?.[0] && (
          <p className="text-sm mt-2">{videoData.expand.category[0].title}</p>
        )}
      </div>
    </details>
  );
}