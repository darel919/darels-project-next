import { getAllCategoriesData } from "@/lib/api";
import Link from "next/link";
import ErrorState from "@/components/ErrorState";

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  return {
    title: `Showing all categories - darel's Projects`,
  };
}

export default async function CategoryPage() {
  let categoryData = null;
  let error = null;

  try {
    categoryData = await getAllCategoriesData();
  } catch (err) {
    error = err.message;
  }

  if (error) {
    return <ErrorState 
      message="Currently, categories are unavailable" 
      actionDesc="We are having trouble loading the categories. Please try again later."
      action="home" 
    />;
  }

  return (
    <section className="flex flex-col items-center justify-center pt-20 px-6 sm:px-10 mb-12">
      <div className="z-10 w-full min-h-[55vh] items-center justify-between text-sm font-mono">
        <div className="breadcrumbs text-sm mb-4">
          <ul>
            <li><Link href="/">Home</Link></li>
            <li><p>Category</p></li>
          </ul>
        </div>
        <h1 className="text-4xl font-bold mb-2">Categories</h1>

        {categoryData && categoryData.length > 0 ? (categoryData.map((category, index) => (
          <Link key={category.id || index} href={`/category?list=${category.id}`} className="card bg-secondary shadow-sm my-4">
            <div className="card-body">
              <h2 className="card-title">{category.title} {category.videoLength ? `${category.videoLength} videos` : ''}</h2>
              <p>{category.desc}</p>
            </div>
          </Link>
        ))) : (
          <div className="text-center text-gray-500">No categories available</div>
        )}
      </div>
    </section>
  );
}