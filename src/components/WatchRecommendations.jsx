"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { formatRelativeTime } from '../utils/timeUtils';
import styles from './WatchRecommendations.module.css';

export default function WatchRecommendations({ videoId }) {
    const [recommendationData, setRecommendationData] = useState({ unique: [], same_category: [] });
    const [pending, setPending] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const searchParams = useSearchParams();

    const fetchRecommendations = async (id) => {
        setPending(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/recommendations`, {
                headers: {
                    requestId: id,
                    app: 'dws-iplayer-next'
                }
            });
            const data = await response.json();
            setRecommendationData(data);
        } catch (error) {
            console.error('Error fetching recommendations:', error);
            setRecommendationData({ unique: [], same_category: [] });
        } finally {
            setPending(false);
        }
    };

    const getThumbnailUrl = (videoId) => {
        return `${process.env.NEXT_PUBLIC_API_BASE_URL}/thumb?id=${videoId}`;
    };

    useEffect(() => {
        const newId = searchParams.get('v');
        if (newId) {
            fetchRecommendations(newId);
        }
    }, [searchParams]);

    useEffect(() => {
        setTimeout(() => {
            setSelectedCategory("unique");
        }, 750);
    }, []);

    const getCategoryTitle = () => {
        if (recommendationData.unique && 
            recommendationData.unique[0] && 
            recommendationData.unique[0].expand && 
            recommendationData.unique[0].expand.category && 
            recommendationData.unique[0].expand.category[0]) {
            return "More from "+ recommendationData.unique[0].expand.category[0].title;
        }
        return 'Category';
    };

    const categoryTitle = getCategoryTitle();

    const recommendations = selectedCategory 
        ? Array.isArray(recommendationData[selectedCategory]) ? recommendationData[selectedCategory] : []
        : Array.isArray(recommendationData.unique) ? recommendationData.unique : [];

    const handleRadioChange = (e) => {
        if (e.target.checked) {
            setSelectedCategory(e.target.value);
        }
    };

    const handleFormReset = () => {
        setSelectedCategory(null);
    };

    return (
        <div className={styles.recommendationsContainer}>
            <div className="overflow-x-auto w-full">
                <form className="filter flex-nowrap whitespace-nowrap" onReset={handleFormReset}>
                    <input className="btn btn-square" type="reset" value="×" />
                    <input
                        className="btn"
                        type="radio"
                        name="recommendation_type"
                        aria-label="For You"
                        value="unique"
                        checked={selectedCategory === 'unique'}
                        onChange={handleRadioChange}
                    />
                    <input
                        className="btn"
                        type="radio"
                        name="recommendation_type" 
                        aria-label={categoryTitle}
                        value="same_category"
                        checked={selectedCategory === 'same_category'}
                        onChange={handleRadioChange}
                    />
                </form>
            </div>

            {pending ? (
                <div className={styles.loading}>Loading recommendations...</div>
            ) : recommendations.length === 0 ? (
                <div className={styles.noRecommendations}>
                    <p>No recommendations available.</p>
                </div>
            ) : (
                <div className={styles.recommendationsList}>
                   {recommendations.map((video, index) => (
                        <div key={video.id || index} className={styles.recommendationItem}>
                            <div className="flex flex-row gap-2">
                                <div className={styles.thumbnailWrapper}>
                                    <a href={`/watch?v=${video.id}`} className={styles.thumbnailLink}>
                                        <img
                                            src={getThumbnailUrl(video.id)}
                                            alt={video.title}
                                            className={styles.videoThumbnail}
                                            loading="lazy"
                                        />
                                    </a>
                                </div>

                                <div className={styles.videoInfo}>
                                    <a href={`/watch?v=${video.id}`} className={styles.titleLink}>
                                        <h3 className={styles.videoTitle}>{video.title}</h3>
                                    </a>
                                    
                                    <div className={styles.videoMeta}>
                                        <span>{video.total_views || 'No'} views</span>
                                        {video.created && <span>{formatRelativeTime(video.created)}</span>}
                                    </div>
                                    
                                    {video.expand?.category?.[0] && (
                                        <div className={styles.categoryLink}>
                                            <a href={`/category?list=${video.expand.category[0].id}`}>
                                                {video.expand.category[0].title}
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}