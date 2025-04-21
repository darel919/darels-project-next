"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ErrorState from "@/components/ErrorState";
export const dynamic = 'force-dynamic';

import { useAuthStore } from "@/lib/authStore";

export default function CategoryManagePage() {
    const [categoryData, setCategoryData] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const { userSession } = useAuthStore();

    useEffect(() => {
        async function loadCategories() {
            try {
                const uuid = userSession?.user?.user_metadata?.provider_id;
                const response = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + '/categories', {
                    headers: {
                        Authorization: uuid
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch categories');
                }
                const data = await response.json();
                setCategoryData(Array.isArray(data) ? data : []);
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        }
        loadCategories();
    }, [userSession]);

    if (error) {
        return <ErrorState 
          message="Currently, categories are unavailable." 
          actionDesc="We are having trouble loading the categories. Please try again later."
          action="home" 
        />;
    }

    if (loading) {
        return <div className="min-h-screen pt-20 px-6 sm:px-10 flex justify-center items-center"><span className="loading loading-lg"></span></div>;
    }

    return (
        <div className="min-h-screen pt-20 px-6 sm:px-10 font-mono">
            <div className="w-full mx-auto">
                <div className="breadcrumbs text-sm mb-4">
                    <ul>
                        <li><Link href="/">Home</Link></li>
                        <li><Link href="/manage">Manage</Link></li>
                        <li><p><b>Category Manager</b></p></li>
                    </ul>
                </div>
                <h1 className="text-4xl font-bold my-4">Category Manager</h1>
                <p className="mb-6">Pick a category to manage.</p>
                {categoryData && categoryData.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {categoryData.map((category, index) => (
                            <Link key={category.id || index} href={`/manage/categories/edit?list=${category.id}`} className="card bg-primary text-secondary-content shadow-sm hover:shadow-md transition-shadow duration-200">
                                <div className="card-body">
                                    <div className="flex justify-between items-start mb-2">
                                        <h2 className="card-title text-lg">{category.title}</h2>
                                        <div className="flex flex-col items-end space-y-1">
                                            {category.isHidden && (
                                                <div className="badge badge-ghost gap-1" title="This category is hidden. You have to share this category for others to see it.">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                                                    </svg>
                                                    Hidden
                                                </div>
                                            )}
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
        </div>
    );
}