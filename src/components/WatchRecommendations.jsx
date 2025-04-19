"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { formatRelativeTime } from '../utils/timeUtils';
import styles from './WatchRecommendations.module.css';

export default function WatchRecommendations() {
    const [recommendationData, setRecommendationData] = useState({ unique: [], same_category: [] });
    const [pending, setPending] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [hasSetDefault, setHasSetDefault] = useState(false);
    const searchParams = useSearchParams();
    const [isExclusive, setIsExclusive] = useState(false);

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
        const savedCategory = localStorage.getItem("recommendationCategory");
        if (savedCategory) {
            setSelectedCategory(savedCategory);
            setHasSetDefault(true);
        }
    }, []);

    useEffect(() => {
        const exclusive = recommendationData.same_category?.info?.isExclusive;
        setIsExclusive(!!exclusive);
        if (exclusive) {
            setSelectedCategory("same_category");
            setHasSetDefault(true);
            return;
        }
        if (!hasSetDefault && selectedCategory === null) {
            if (recommendationData.unique?.length > 0) {
                setSelectedCategory("unique");
                setHasSetDefault(true);
            } else if (recommendationData.same_category?.videos?.length > 0) {
                setSelectedCategory("same_category");
                setHasSetDefault(true);
            }
        }
    }, [recommendationData, selectedCategory, hasSetDefault]);

    useEffect(() => {
        if (selectedCategory !== null && !isExclusive) {
            localStorage.setItem("recommendationCategory", selectedCategory);
        }
    }, [selectedCategory, isExclusive]);

    const getCategoryTitle = () => {
        if (recommendationData.same_category?.info) {
            return recommendationData.same_category.info.title;
        }
        return '';
    };

    const categoryTitle = getCategoryTitle();

    const getRecommendationVideos = () => {
        if (!selectedCategory) {
            return Array.isArray(recommendationData.unique) ? recommendationData.unique : [];
        }
        
        if (selectedCategory === 'same_category') {
            return Array.isArray(recommendationData.same_category?.videos) 
                ? recommendationData.same_category.videos 
                : [];
        }
        
        return Array.isArray(recommendationData[selectedCategory]) 
            ? recommendationData[selectedCategory] 
            : [];
    };

    const recommendations = getRecommendationVideos();

    const handleRadioChange = (e) => {
        if (e.target.checked) {
            setSelectedCategory(e.target.value);
        }
    };

    const handleFormReset = () => {
        setSelectedCategory(null);
    };

    return (
        <div className={`${styles.recommendationsContainer} font-mono`}>
            {isExclusive ? null : (
                !pending ? (
                    <div className="overflow-x-auto w-full mb-6">
                        <form className="filter" onReset={handleFormReset}>
                            <input 
                                className="btn btn-square filter-reset" 
                                type="radio" 
                                name="recommendation_type" 
                                aria-label="×" 
                                checked={selectedCategory === null}
                                onChange={() => setSelectedCategory(null)}
                                disabled={isExclusive}
                            />
                            {recommendationData.unique?.length > 0 && (
                                <input
                                    className="btn"
                                    type="radio"
                                    name="recommendation_type"
                                    aria-label="For You"
                                    value="unique"
                                    checked={selectedCategory === 'unique'}
                                    onChange={handleRadioChange}
                                    disabled={isExclusive}
                                />
                            )}
                            {recommendationData.same_category.info && (
                                <input
                                    className="btn"
                                    type="radio"
                                    name="recommendation_type"
                                    aria-label={categoryTitle}
                                    value="same_category"
                                    checked={selectedCategory === 'same_category'}
                                    onChange={handleRadioChange}
                                    disabled={isExclusive}
                                />
                            )}
                        </form>
                    </div>
                ) : (
                    <div className="overflow-x-auto w-full mb-6">
                        <div className="flex gap-2">
                            <div className="skeleton w-10 h-10"></div>
                            <div className="skeleton w-24 h-10"></div>
                            <div className="skeleton w-32 h-10"></div>
                        </div>
                    </div>
                )
            )}

            {pending ? (
                <div className="flex flex-col gap-4 w-full">
                    {[...Array(7)].map((_, i) => (
                        <div key={i} className="flex gap-4">
                            <div className="skeleton w-32 h-20"></div>
                            <div className="flex flex-col gap-2 flex-1">
                                <div className="skeleton h-4 w-3/4"></div>
                                <div className="skeleton h-3 w-1/4"></div>
                                <div className="skeleton h-3 w-1/2"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : recommendations.length === 0 ? (
                <div className={styles.noRecommendations}>
                    <p>No recommendations available.</p>
                </div>
            ) : (
                <div className={styles.recommendationsList}>
                   {recommendations.map((video, index) => (
                        <div key={video.id || index} className={styles.recommendationItem}>
                            <div className="flex flex-row" title={video.desc}>
                                <div className={styles.thumbnailWrapper}>
                                    <Link href={`/watch?v=${video.id}`} className={styles.thumbnailLink}>
                                        <img
                                            src={getThumbnailUrl(video.id)}
                                            alt={video.title}
                                            className={styles.videoThumbnail}
                                            loading="lazy"
                                        />
                                    </Link>
                                </div>

                                <div className={styles.videoInfo}>
                                    <Link href={`/watch?v=${video.id}`} className={styles.titleLink}>
                                        <h3 className={styles.videoTitle}>{video.title}</h3>
                                    </Link>
                                    
                                    <div className={styles.videoMeta}>
                                        <span>{video.total_views || 'No'} views</span>
                                        {video.created && (
                                            <span title={new Date(video.created).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}>
                                                {formatRelativeTime(video.created)}
                                            </span>
                                        )}
                                    </div>
                                    
                                    {video.expand?.category?.[0] && (
                                        <div className={styles.categoryLink} title={video.expand.category[0].desc}>
                                            <Link href={`/category?list=${video.expand.category[0].id}`}>
                                                {video.expand.category[0].title}
                                            </Link>
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