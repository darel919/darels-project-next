'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SearchBar() {
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSearch = async (e) => {
    const query = e.target.value;
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
    const searchQuery = e.target.search.value;
    if (searchQuery) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setShowDropdown(false);
    }
  };

  return (
    <div className="w-full relative">
      <form onSubmit={handleSubmit} className="w-full">
        <label className="relative block w-full">
          <input
            type="search"
            name="search"
            className="input input-bordered rounded-full w-full pl-10"
            placeholder="Search"
            required
            onChange={handleSearch}
            autoComplete="off"
            aria-autocomplete="none"
          />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 stroke-current opacity-50" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </label>
      </form>
      
      {showDropdown && (error ? (
        <div className="menu bg-base-100 w-full mt-1 rounded-box absolute z-50 shadow-lg p-4 text-center text-base-content/60">
          {error}
        </div>
      ) : searchResults.length > 0 && (
        <ul className="menu bg-base-100 w-full mt-1 rounded-box absolute z-50 shadow-lg max-h-64 overflow-auto">
          {searchResults.map((result, index) => (
            <li key={index}>
              <Link href={'/watch?v='+result.id} onClick={() => setShowDropdown(false)}>
                {result.title}
              </Link>
            </li>
          ))}
        </ul>
      ))}
    </div>
  );
}