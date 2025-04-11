"use client"

import { formatRelativeTime } from '../utils/timeUtils';
import styles from './WatchDescriptionViewer.module.css';

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
    <div className={`${styles.descComp} mt-2 rounded-lg border border-base-300`}>
      <details className="group">
        <summary className="list-none cursor-pointer">
          <div className="group-open:hidden">
            <div>
              <span>{videoData.total_views || 'No'} views • {videoData.created ? formatRelativeTime(videoData.created) : 'No date'}</span>
            </div>
            <p className="text-sm my-2 line-clamp-1">
              {description}
            </p>
            <span className="text-sm text-base-content/80 mt-2">Show more</span>
          </div>
        </summary>
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm">{videoData.total_views || 'No'} views • Published on {videoData.created ? formatFullDate(videoData.created) : 'No date'}</span>
            <button onClick={() => document.activeElement?.closest('details')?.removeAttribute('open')} className="text-sm text-base-content/80">
              Show less
            </button>
          </div>
          <p className="mt-2 mb-4">
            {description}
          </p>
          {videoData.expand?.category?.[0] && (
            <a href={`/category?list=${videoData.expand.category[0].id}`} className="card bg-secondary hover:bg-base-300 font-mono">
              <div className="card-body p-4">
                <p className="opacity-[0.5]">This video is part of</p>
                <h3 className="text-lg leading-none">{videoData.expand.category[0].title}</h3>
                <p className="text-xs text-base-content/70">{videoData.expand.category[0].desc}</p>
              </div>
            </a>
          )}
        </div>
      </details>
    </div>
  );
}