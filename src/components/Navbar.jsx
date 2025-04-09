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
    <div className="w-full h-16 absolute top-0 left-0 right-0 z-99">
      <div className="navbar min-h-16 h-full bg-base-100 shadow-md p-0">
        <div className="navbar-start pl-2 flex-none w-1/4">
          <Link href="/" className="btn btn-ghost gap-2">
            <Image
              src="/favicon.ico"
              width={36}
              height={36}
              alt="darel's Projects"
              priority
            />
            <span className="text-xl font-semibold">darel's Projects</span>
          </Link>
        </div>
        <div className="navbar-center flex-1 px-4">
          <SearchBar />
        </div>
        <div className="navbar-end pr-2 flex-none w-1/4">
          <ul className="menu menu-lg menu-horizontal px-1 hidden lg:flex">
            <li className="text-lg"><Link href="/">Home</Link></li>
            <li>
              <details>
                <summary className="text-lg">Categories</summary>
                <ul className="p-2 bg-base-100 rounded-t-none">
                  {categories.map((category) => (
                    <li key={category.id} className="text-lg">
                      <Link href={`/category?list=${category.id}`}>
                        {category.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </details>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}