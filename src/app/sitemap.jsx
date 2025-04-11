export default async function sitemap() {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
    const thumbConstructor = (id) => {
        return `${baseUrl}/thumb?id=${id}`
    }
    try {
        const videosRes = await fetch(`${baseUrl}/?sortBy=desc`)
        const videos = await videosRes.json()

        const routes = [
            {
                url: "https://projects.darelisme.my.id",
                lastModified: new Date(),
                changeFrequency: 'always',
                priority: 1,
            },
            {
                url: "https://projects.darelisme.my.id/about",
                lastModified: new Date(),
                changeFrequency: 'monthly',
                priority: 0,
            },
        ]

        const defaultTags = ["darel's Project", "dp", "dws", "darelisme"]
        
        const stopwords = ["and", "or", "if", "but", "because", "as", "what", "which", 
                          "this", "that", "these", "those", "then", "just", "so", "than", 
                          "such", "when", "while", "of", "at", "by", "for", "with", "about", 
                          "against", "between", "into", "through", "during", "before", 
                          "after", "above", "below", "to", "from", "up", "down", "in", 
                          "out", "on", "off", "over", "under", "again", "further", "then", 
                          "once", "here", "there", "all", "any", "both", "each", "few", 
                          "more", "most", "other", "some", "such", "no", "nor", "not", 
                          "only", "own", "same", "so", "than", "too", "very", "can", 
                          "will", "just", "should", "now", "a", "an", "the", "is", "are", 
                          "was", "were", "be", "been", "being", "have", "has", "had", 
                          "having", "do", "does", "did", "doing"]

        // Dynamic routes from videos
        const videoRoutes = videos.map((video) => ({
            url: `https://projects.darelisme.my.id/watch?v=${video.id}`,
            lastModified: new Date(video.created),
            changeFrequency: 'daily',
            priority: 0.8,
            videos: [
                {
                    title: video.title,
                    description: video.desc,
                    thumbnail_loc: thumbConstructor(video.id),
                    player_loc: `https://projects.darelisme.my.id/watch?v=${video.id}`,
                    view_count: video.total_views,
                    // uploader: video.creator,
                    publication_date: new Date(video.created).toISOString(),
                    family_friendly: "yes",
                    live: "no",
                    requires_subscription: "no",
                    tag: [...new Set([
                        ...defaultTags,
                        ...video.title.split(' ')
                            .filter(word => word.trim() !== '')
                            .filter(word => !stopwords.includes(word.toLowerCase()))
                    ])].slice(0, 32)
                }
            ]
        }))

        return [...routes, ...videoRoutes]
    } catch (error) {
        console.error('Error generating sitemap:', error)
        return []
    }
}