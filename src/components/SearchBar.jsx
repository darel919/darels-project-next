'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';


export default function SearchBar() {
  const [isClient, setIsClient] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const timeoutRef = useRef(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="w-full relative">
        <form className="w-full">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="input pl-6 input-bordered w-full rounded-full"
              value=""
              disabled
            />
          </div>
        </form>
      </div>
    );
  }

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length < 1) {
      setSearchResults([]);
      setError(null);
      setShowDropdown(false);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      if (query) {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/search?q=${encodeURIComponent(query)}`);
          if (response.status === 404) {
            setSearchResults([]);
            setError("No results found");
            setShowDropdown(true);
            setIsLoading(false);
            return;
          }
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const contentType = response.headers.get("content-type");
          if (!contentType || !contentType.includes("application/json")) {
            throw new TypeError("Response was not JSON");
          }
          const data = await response.json();
          setSearchResults(data.data?.slice(0, 10) || []);
          setError(null);
          setShowDropdown(data.data?.slice(0, 10).length > 0);
        } catch (error) {
          console.error('Search error:', error);
          setSearchResults([]);
          setError("An error occurred while searching");
          setShowDropdown(true);
        } finally {
          setIsLoading(false);
        }
      } else {
        setSearchResults([]);
        setError(null);
        setShowDropdown(false);
        setIsLoading(false);
      }
    }, 500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchQuery) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setShowDropdown(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setError(null);
    setShowDropdown(false);
    setIsLoading(false);
  };

  return (
    <div className="w-full relative">
      <form onSubmit={handleSubmit} className="w-full">
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="input pl-6 input-bordered w-full rounded-full"
            value={searchQuery}
            onChange={handleSearch}
            autoComplete="off"
            aria-autocomplete="none"
          />
          {isLoading && (
            <span className="loading loading-spinner loading-sm absolute right-12 top-1/2 transform -translate-y-1/2"></span>
          )}
          {searchQuery && (
            <button
              type="button"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              onClick={clearSearch}
            >
              ✕
            </button>
          )}
        </div>
        {showDropdown && (
          <div className="absolute w-full mt-1 bg-base-100 rounded-box shadow-lg z-50">
            {error ? (
              <div className="p-4 text-error">{error}</div>
            ) : (
              <ul className="menu menu-vertical p-2">
                {searchResults.map((result) => (
                  <li key={result.id}>
                    <Link
                      href={`/project/${result.id}`}
                      onClick={() => setShowDropdown(false)}
                      className="block p-2 hover:bg-base-200"
                    >
                      {result.title}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </form>
    </div>
  );
}