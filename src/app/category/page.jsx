"use server"

import { getCategoryData } from "@/lib/api";
import LibraryItemViewer from "../../components/LibraryItemViewer";
import Link from "next/link";

export async function generateMetadata({ searchParams }) {
  const params = await searchParams;
  const listId = params.list;

  let categoryData = null;
  let error = null;

  if (listId) {
    try {
      categoryData = await getCategoryData(listId);
    } catch (err) {
      error = err.message;
    }
  }

  const listName = categoryData?.category.title || 'Showing categories';

  return {
    title: `${listName} - darel's Projects`,
    description: `Browse videos in category ${listName}`,
    openGraph: {
      title: `${listName} - darel's Projects`,
      description: `Browse videos in category ${listName}`,
    },
  };
}

export default async function CategoryPage({ searchParams }) {
  const params = await searchParams;
  const listId = params.list;

  let categoryData = null;
  let error = null;

  if (!listId) {
    return (
      <section className="flex min-h-screen flex-col items-center justify-center px-6 sm:px-24">
          <div className="flex-row sm:flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-8 sm:h-12 w-8 sm:w-12" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <div className='ml-0 sm:ml-4'>
              <h1 className="py-2 sm:pt-4 font-light text-5xl sm:text-3xl">Invalid Category Link</h1>
              <div className="font-light text-md sm:text-lg">Invalid category ID provided. Please select a category from the <Link href="/categories" className="link">categories page</Link>.</div>
            </div>
          </div>
          <div className="mt-6 sm:mt-12">
            <Link href="/" className="btn btn-primary rounded-4xl p-4 mx-2">
              Return to Home
            </Link>
            <Link href="/categories" className="btn btn-primary rounded-4xl p-4 mx-2">
              Select Category
            </Link>
          </div>
      </section>
    );
  }

  try {
    categoryData = await getCategoryData(listId);
    
    return (
      <section className="flex flex-col items-center justify-center pt-20 px-4 sm:px-10">
        <div className="z-10 w-full min-h-[55vh] items-center justify-between text-sm font-mono">
          <div className="breadcrumbs text-sm mb-4">
            <ul>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/categories">Category</Link></li>
              <li><p>{categoryData.category.title}</p></li>
            </ul>
          </div>

          <h1 className="text-4xl font-bold mb-2">{categoryData.category.title}</h1>
          <p className="mb-2">{categoryData.category.description}</p>
          <LibraryItemViewer data={categoryData} />
        </div>
      </section>
    );
  } catch (err) {
    return (
      <section className="flex flex-col items-center justify-center pt-20 px-4 sm:px-10">
        <div className="z-10 w-full min-h-[55vh] items-center justify-between text-sm">
          <div className="alert alert-error">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <div>
              <h3 className="font-bold">Error Loading Category</h3>
              <div className="text-xs">{err.message}. Return to <Link href="/categories" className="link">categories page</Link>.</div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}