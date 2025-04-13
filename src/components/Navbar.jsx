"use client";

import { getAllCategoriesData } from '@/lib/api';
import Link from 'next/link';
import SearchBar from './SearchBar';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useAuthStore } from "@/lib/authStore";

export default function Navbar() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const { userSession } = useAuthStore();

  const isSuperadmin = userSession?.user?.user_metadata?.provider_id === process.env.NEXT_PUBLIC_SUPERADMIN;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    async function fetchCategories() {
      try {
        const data = await getAllCategoriesData();
        setCategories(data);
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
        setIsLoading(false);
      }
    }

    fetchCategories();
  }, []);

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="w-full h-16 fixed top-0 left-0 right-0 z-[99]">
      <div className={`navbar min-h-16 h-full transition-colors duration-200 ${isScrolled ? 'bg-secondary shadow-md' : 'bg-transparent'} px-2 sm:px-6`}>
        <div className="flex-none flex items-center">
          <div className="drawer">
            <input id="navbar-menu" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content">
              <label htmlFor="navbar-menu" className="btn btn-ghost">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </label>
            </div>
            <div className="drawer-side z-[100] left-0">
              <label htmlFor="navbar-menu" aria-label="close sidebar" className="drawer-overlay"></label>
              <ul className="menu p-4 w-80 min-h-full bg-secondary">
                <li>
                  <Link href="/" className='text-lg' onClick={() => document.getElementById('navbar-menu').checked = false}>Home</Link>
                </li>
                {isLoading ? (
                  <div className="loading loading-spinner loading-lg ml-4 mt-4"></div>
                ) : (
                  <li>
                    <Link href="/categories" title={"Show all categories"} onClick={() => document.getElementById('navbar-menu').checked = false} className='mb-1'>
                      <summary className='text-lg'>Categories</summary>
                    </Link>
                    {categories.length > 1 && (
                      <ul>
                        {categories.map((category) => (
                          <li key={category.id}>
                            <Link href={`/category?list=${category.id}`} onClick={() => document.getElementById('navbar-menu').checked = false} title={category.desc}>
                              <section>
                                <h5 className="font-semilight font-mono text-lg">{category.title}</h5>
                              </section>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                )}
                {isSuperadmin && (
                  <li>
                    <Link href="/manage" onClick={() => document.getElementById('navbar-menu').checked = false}>
                      <summary className='text-lg'>Manage</summary>
                    </Link>
                    <ul>
                      <li>
                        <Link href="/manage/upload" className='text-lg' onClick={() => document.getElementById('navbar-menu').checked = false}>
                          <section>
                            <h5 className="font-semilight font-mono text-lg">Upload</h5>
                          </section>
                        </Link>
                      </li>
                    </ul>
                  </li>
                )}
              </ul>
            </div>
          </div>
          <Link href="/" className="flex items-center flex-row w-12">
            <Image
              src="/favicon.ico"
              width={36}
              height={36}
              alt="darel's Projects"
              priority
            />
          </Link>
        </div>

        <div className="flex-1 px-4">
          <div className="max-w-2xl mx-auto">
            <SearchBar />
          </div>
        </div>

        <div className="flex-none">
          {userSession ? (<Link href="/profile" className="btn btn-ghost btn-circle avatar">
          {!avatarError ? (
            <div className="w-10 rounded-full">
              <img
                src={userSession.user.user_metadata.avatar_url}
                alt={userSession.user.user_metadata.full_name}
                onError={() => setAvatarError(true)}
              />
            </div>
          ) : (
            <div className="avatar avatar-placeholder">
              <div className="bg-neutral text-neutral-content w-10 rounded-full">
                <span className="text-md p-2">{getInitials(userSession.user.user_metadata.full_name)}</span>
              </div>
            </div>
          )}
          </Link>) : <Link className='btn btn-ghost rounded avatar' href="/auth/login">
            <button className='flex items-center'>
              <div className="avatar avatar-placeholder">
                <div className="bg-neutral text-neutral-content w-10 rounded-full">
                  <span className="text-xl">?</span>
                </div>
              </div>
              <p className='ml-3 text-xs font-bold'>Sign in</p>
            </button>
            </Link>}
        </div>
      </div>
    </div>
  );
}