const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function serverFetch(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'dp-iPlayer',
      'environment': process.env.NODE_ENV,
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

export async function getVideoData(videoId) {
  if (!videoId) {
    throw new Error('Video ID is required');
  }

  const response = await fetch(`${API_BASE_URL}/watch?v=${videoId}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch video data: ${response.status}`);
  }
  
  const data = await response.json();
  return data;
}

export async function getAllCategoriesData() {
    return serverFetch(`/categories`);
}

export async function getCategoryData(categoryId) {
    return serverFetch(`/category?id=${categoryId}`);
}
