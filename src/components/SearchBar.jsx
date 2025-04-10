'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SearchBar() {
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/search?q=${encodeURIComponent(query)}`);
        if (response.status === 404) {
          setSearchResults([]);
          setError("No results found");
          setShowDropdown(true);
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
        setSearchResults(data.data?.slice(0, 5) || []);
        setError(null);
        setShowDropdown(data.data?.slice(0, 5).length > 0);
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
        setError("An error occurred while searching");
        setShowDropdown(true);
      }
    } else {
      setSearchResults([]);
      setError(null);
      setShowDropdown(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchQuery) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setShowDropdown(false);
    }
  };

  return (
    <div className="w-full relative">
      <form onSubmit={handleSubmit} className="w-full">
        <input
          type="text"
          placeholder="Search"
          className="input pl-6 input-bordered w-full rounded-full"
          value={searchQuery}
          onChange={handleSearch}
          autoComplete="off"
          aria-autocomplete="none"
        />
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