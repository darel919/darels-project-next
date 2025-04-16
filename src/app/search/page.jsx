"use server";

import LibraryItemViewer from '@/components/LibraryItemViewer';
import { LOCAL_API_BASE_URL } from '@/lib/api';
import ErrorState from '@/components/ErrorState';

export async function generateMetadata({ searchParams }) {
  const params = await searchParams
  const query = params.q || '';
  return {
    title: query ? `${query} - darel's Project` : "Searching at darel's Project",
  };
}

export default async function SearchPage({ searchParams }) {
  const params = await searchParams
  const query = params.q || '';

  if (!query) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Search Results</h1>
        <p>Please enter a search term.</p>
      </div>
    );
  }

  try {
    const response = await fetch(`${LOCAL_API_BASE_URL}/search?q=${encodeURIComponent(query)}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      if (response.status === 404) {
        return (
          <div className="min-h-[55vh] min-w-screen flex pt-24 px-6 sm:px-10">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="ml-2 text-xl">No results were found for your query <b>"{query}"</b></span>
          </div>
        );
      }
      throw new Error(`Failed to search (HTTP ${response.status})`);
    }

    const data = await response.json();
    const results = data?.data || [];

    if (results.length === 0) {
      return (
        <div className="min-h-[55vh] min-w-screen flex pt-24 px-6 sm:px-10">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="ml-2 text-xl">No results were found for your query <b>"{query}"</b></span>
        </div>
      );
    }

    return (
      <div className="px-6 pt-20 sm:px-12 mb-12">
        <LibraryItemViewer data={results} />
      </div>
    );
  } catch (error) {
    console.error("Error searching:", error);
    return <ErrorState message="Search is unavailable right now." actionDesc="Please try searching again later." actionText="Try Again" action="reload" />;
  }
}