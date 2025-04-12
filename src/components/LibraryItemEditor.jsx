import { formatRelativeTime } from '../utils/timeUtils';
import styles from './LibraryItemViewer.module.css';

export default function LibraryItemViewer({ data }) {
  
  let videos = Array.isArray(data) ? data : data?.result?.videos || data?.result || data?.videos || [];
  
  const categoryInfo = data?.category || null;

  const getThumbnailUrl = (videoId) => {
    return `${process.env.NEXT_PUBLIC_API_BASE_URL}/thumb?id=${videoId}`;
  };

  return (
    <div className={`${styles.libraryViewer} font-mono`}>
      <div className="videos-container">
        {videos.length === 0 ? (
          <div className={styles.noVideos}>
            {categoryInfo ? 
            <h2 className="font-bold text-xl">No videos available in this category.</h2> : 
            <h2 className="text-xl">No videos available.</h2> }
          </div>
        ) : (
          <section>
            <div className={styles.categoryDescription}>
              <span>{videos.length} total videos</span>
            </div>
            <div className={styles.videosGrid}>
            {videos.map((video, index) => (
              <div key={video.id || index} className={styles.videoCard}>
                <div className={styles.videoContent}>
                  <div className={styles.thumbnailContainer}>
                    <a href={`/manage/edit?v=${video.id}`} className={styles.thumbnailLink}>
                      <img 
                        src={getThumbnailUrl(video.id)} 
                        alt={video.title} 
                        className={styles.videoThumbnail}
                        loading="lazy"
                      />
                    </a>
                  </div>
                  <div className={styles.videoInfo}>
                    <a href={`/manage/edit?v=${video.id}`} className={styles.titleLink}>
                      <h3 className={styles.videoTitle}>{video.title}</h3>
                    </a>
                    <div className={styles.videoMeta}>
                      <span>{video.total_views || 'No'} views</span>
                      {video.created && <span title={new Date(video.created).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}>{formatRelativeTime(video.created)}</span>}
                    </div>
                    {/* {video.expand && video.expand.category && video.expand.category[0] && (
                      <div className={styles.categoryLinkContainer}>
                        <a href={`/category?list=${video.expand.category[0].id}`}>
                          <p>{video.expand.category[0].title}</p>
                        </a>
                      </div>
                    )} */}
                  </div>
                </div>
              </div>
            ))}
          </div>
          </section>

        )}
      </div>
    </div>
  );
}