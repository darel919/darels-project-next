"use client";

import { getAllCategoriesData } from '@/lib/api';
import Link from 'next/link';
import SearchBar from './SearchBar';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await getAllCategoriesData();
        setCategories(data);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    }

    fetchCategories();
  }, []);

  return (
    <div className="w-full h-16 fixed top-0 left-0 right-0 z-99">
      <div className="navbar min-h-16 h-full bg-base-100 shadow-md px-6">
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
              <ul className="menu p-4 w-80 h-full min-h-full bg-base-100">
                <li>
                  <Link href="/" onClick={() => document.getElementById('navbar-menu').checked = false}>Home</Link>
                </li>
                <li>
                  <Link href="/categories">
                    <summary>Categories</summary>
                  </Link>
                  <ul>
                    {categories.map((category) => (
                      <li key={category.id}>
                        <Link 
                          href={`/category?list=${category.id}`}
                          onClick={() => document.getElementById('navbar-menu').checked = false}
                        >
                          <section>
                            <h5 className="font-bold text-md">{category.title}</h5>
                            <h6 className="text-xs">{category.desc}</h6>
                          </section>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
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

        {/* <div className="flex-none">
          <button className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <img alt="User avatar" src="https://ui-avatars.com/api/?name=D&background=neutral&color=fff" />
            </div>
          </button>
        </div> */}
      </div>
    </div>
  );
}