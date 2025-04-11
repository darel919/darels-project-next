'use client';

import LibraryItemViewer from '@/components/LibraryItemViewer';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;
      
      try {
        setLoading(true);
        setResults([]);
        setError(null);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/search?q=${encodeURIComponent(query)}`);
        if (response.status === 404) {
          setResults([]);
          return;
        }
        if (!response.ok) {
          const errorText = await response.text();
          console.log('Response not OK:', errorText);
          setError(`Unable to search your query: ${errorText}` || 'Failed to fetch search results');
          setResults([]);
          return;
        }
        const data = await response.json();
        setResults(data.data);
      } catch (err) {
        setError(err.message || 'Failed to fetch search results');
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  if (!query) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <h1 className="text-2xl font-bold mb-4">Search</h1>
        <p>Please enter a search term</p>
      </div>
    );
  }

  return (
    <div className="container min-h-[60vh] min-w-screen pt-16 px-4 sm:px-12">     
      {loading && (
        <div className="flex justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      )}

      {error && (
        <div className="flex items-center mt-12 text-red-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="ml-2 text-2xl">{error}</span>
        </div>
      )}

      {!loading && !error && results.length === 0 && (
        <div className="flex items-center mt-12">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="ml-2 text-xl">No results were found for your query <b>"{query}"</b></span>
        </div>
      )}

      {results.length > 0 && (
        <div> 
          <LibraryItemViewer data={results}/>
        </div>
      )}
    </div>
  );
}


export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-[50vh]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    }>
      <SearchResults />
    </Suspense>
  );
}