"use server"

import { getCategoryData } from "@/lib/api";
import LibraryItemViewer from "../../components/LibraryItemViewer";

export async function generateMetadata({ searchParams }) {
  const params = await searchParams;
  const listId = params.list;
  
  return {
    title: `Category: ${listId || 'All'}`,
    description: `Browse videos in category ${listId || 'All'}`,
    openGraph: {
      title: `Category: ${listId || 'All'}`,
      description: `Browse videos in category ${listId || 'All'}`,
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
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <LibraryItemViewer data={categoryData} />
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
      </div>
    </main>
  );
}