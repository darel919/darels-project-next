const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const LOCAL_API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL || API_BASE_URL;

export { API_BASE_URL, LOCAL_API_BASE_URL };

export async function serverFetch(endpoint, options = {}) {
  const url = `${LOCAL_API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'dp-iPlayer',
      'X-Environment': process.env.NODE_ENV,
      ...options.headers,
    },
  });
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}

export async function getAllVideo() {
    return serverFetch(`/?sortBy=desc`);
}

export async function getVideoData(id) {
  try {
    const res = await fetch(`${LOCAL_API_BASE_URL}/watch?v=${id}`, { 
      next: { revalidate: 600 },
      cache: 'no-store'
    });
    
    if (!res.ok) {
      if (res.status === 404) {
        throw new Error("Video not found. It may have been removed, unavailable, or you might have an invalid link.");
      }
      throw new Error(`Failed to fetch video data (HTTP ${res.status})`);
    }

    return await res.json();
  } catch (error) {
    if (error.message === "fetch failed") {
      throw new Error("Unable to connect to the video server. Please check your internet connection or try again later.");
    }
    throw error;
  }
}

export async function searchVideos(query) {
  try {
    const response = await serverFetch(`/search?q=${encodeURIComponent(query)}`, {
      next: { revalidate: 60 }
    });
    const results = response && response.data ? response.data : [];
    
    return Array.isArray(results) ? results : [];
  } catch (error) {
    console.error("Search error:", error);
    return [];
  }
}

export async function getAllCategoriesData() {
    const res = await fetch(`${API_BASE_URL}/categories`, {
        cache: 'no-store',
        headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'dp-iPlayer',
            'X-Environment': process.env.NODE_ENV
        }
    });
    
    if (!res.ok) {
        throw new Error(`API error: ${res.status} ${res.statusText}`);
    }
    
    return res.json();
}

export async function getCategoryData(categoryId) {
    return serverFetch(`/category?id=${categoryId}`);
}
