import { getAllCategoriesData } from "@/lib/api";
import Link from "next/link";
import ErrorState from "@/components/ErrorState";
import CategoryHeader from "@/components/CategoryHeader";

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
      message="Currently, categories are unavailable." 
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
            <li><p><b>Categories</b></p></li>
          </ul>
        </div>
        <CategoryHeader />

        {categoryData && categoryData.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryData.map((category, index) => (
                  <Link key={category.id || index} href={`/category?list=${category.id}`} className="card bg-primary text-secondary-content shadow-sm hover:shadow-md transition-shadow duration-200">
                      <div className="card-body">
                          <div className="flex justify-between items-start mb-2">
                              <h2 className="card-title text-lg">{category.title}</h2>
                              <div className="flex flex-col items-end space-y-1">
                                  {category.isExclusive && (
                                      <div className="badge badge-ghost gap-1" title="This category is exclusive. Watch recommendation will only display videos from the same category.">
                                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4">
                                              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
                                          </svg>
                                          Exclusive
                                      </div>
                                  )}
                              </div>
                          </div>
                          {category.videoLength > 0 && <p className="text-sm opacity-70 mb-2">{category.videoLength} video{category.videoLength !== 1 ? 's' : ''}</p>}
                          <p className="text-sm opacity-90 line-clamp-3">{category.desc}</p>
                      </div>
                  </Link>
              ))}
          </div>
      ) : (
          <div className="text-center text-base-content opacity-60 mt-10">No categories available</div>
      )}
      </div>
    </section>
  );
}