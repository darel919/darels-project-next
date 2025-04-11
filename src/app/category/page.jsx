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

  const listName = categoryData?.category.title || 'All';

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

  if (listId) {
    try {
      categoryData = await getCategoryData(listId);
    } catch (err) {
      error = err.message;
    }
  }

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
        <p className="mb-8">{categoryData.category.description}</p>
        <LibraryItemViewer data={categoryData} />
        {error && (
          <div className="border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
      </div>
    </section>
  );
}