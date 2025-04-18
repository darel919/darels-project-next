"use server"

import { getCategoryData } from "@/lib/api";
import LibraryItemViewer from "../../components/LibraryItemViewer";
import Link from "next/link";
import ErrorState from "@/components/ErrorState";
import CategoriesHeader from "@/components/CategoriesHeader";

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
      <ErrorState 
        message="Invalid Category Link." 
        actionText="Select Category"
        actionDesc="The category you're trying to access doesn't exist. Please select a valid category."
        action="categories"
      />
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
              <li><Link href="/categories">Categories</Link></li>
              <li><p>Viewing: <b>{categoryData.category.title}</b></p></li>
            </ul>
          </div>

          <CategoriesHeader title={categoryData.category.title} desc={categoryData.category.desc} id={categoryData.category.id}/>
          <LibraryItemViewer data={categoryData} />
        </div>
      </section>
    );
  } catch (err) {
    return (
      <ErrorState 
        message="This category is currently unavailable." 
        actionText="Return to Categories"
        actionDesc="We are having trouble loading this category. Please try another category or come back later."
        action="categories"
      />
    );
  }
}