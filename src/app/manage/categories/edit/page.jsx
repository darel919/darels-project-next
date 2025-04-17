'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import ErrorState from '@/components/ErrorState';
import { API_BASE_URL } from '@/lib/api';

export default function CategoryEditor() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const categoryId = searchParams.get('list');
    
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isHidden, setIsHidden] = useState(false);
    const [isExclusive, setIsExclusive] = useState(false);
    const [isDirty, setIsDirty] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (categoryId) {
            fetchCategoryData();
        } else {
            setError({ 
                message: "Category not found",
                desc: "This category does not exist or has been deleted.",
                actionText: "Return to Categories",
                action: "/manage/categories"
            });
            setIsLoading(false);
        }
    }, [categoryId]);

    const fetchCategoryData = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/category?id=${categoryId}`, {
                cache: 'no-store',
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'dp-iPlayer',
                    'X-Environment': process.env.NODE_ENV
                }
            });
            if (!response.ok) throw new Error('Failed to fetch category');
            const data = await response.json();
            if (!data.category) {
                setError({ 
                    message: "Category not found",
                    desc: "This category does not exist or has been deleted.",
                    actionText: "Return to Categories",
                    action: "/manage/categories"
                });
                setIsLoading(false);
                return;
            }
            
            const category = data.category;
            setTitle(category.title || '');
            setDescription(category.desc || '');
            setIsHidden(category.isHidden || false);
            setIsExclusive(category.isExclusive || false);
            setIsLoading(false);
        } catch (error) {
            setError({ 
                message: "This category is unavailable",
                desc: "We couldn't edit this category. Please try again later.",
                actionText: "Return to Categories",
                action: "/manage/categories"
            });
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (isDirty) {
                e.preventDefault();
                e.returnValue = '';
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [isDirty]);

    const handleInputChange = (setter) => (e) => {
        setter(e.target.value);
        setIsDirty(true);
    };

    const handleToggleChange = (setter) => (e) => {
        setter(e.target.checked);
        setIsDirty(true);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const response = await fetch(`${API_BASE_URL}/category?id=${categoryId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'dp-iPlayer',
                    'X-Environment': process.env.NODE_ENV
                },
                body: JSON.stringify({ title, description, isHidden, isExclusive }),
            });

            if (response.ok) {
                setIsDirty(false);
                router.push('/manage/categories');
            }
        } catch (error) {
            console.error('Error saving category:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this category?\n\nALL videos associated with this category will ALSO be DELETED!\n\nThis change is permanent!')) {
            setIsDeleting(true);
            try {
                const response = await fetch(`${API_BASE_URL}/category?id=${categoryId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'User-Agent': 'dp-iPlayer',
                        'X-Environment': process.env.NODE_ENV
                    }
                });

                if (response.ok) {
                    router.push('/manage/categories');
                }
            } catch (error) {
                console.error('Error deleting category:', error);
            } finally {
                setIsDeleting(false);
            }
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen pt-20 px-6 sm:px-10 flex justify-center items-center">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    if (error) {
        return <ErrorState 
            message={error.message} 
            actionDesc={error.desc}
            actionText={error.actionText}
            action={error.action}
        />;
    }

    return (
        <div className="min-h-screen pt-20 px-6 sm:px-10 pb-20">
            {/* <div className="breadcrumbs text-sm mb-4">
                <ul>
                    <li><Link href="/manage">Manage</Link></li>
                    <li><Link href="/manage/categories">Categories</Link></li>
                    <li>Edit Category</li>
                </ul>
            </div> */}

            <div className="breadcrumbs text-sm mb-4 font-mono">
                    <ul>
                        <li><Link href="/">Home</Link></li>
                        <li><Link href="/manage">Manage</Link></li>
                        <li><Link href="/manage/categories">Category Manager</Link></li>
                        <li><p>Editing: <b>{title}</b></p></li>
                    </ul>
                </div>

            <div className="flex flex-col gap-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Edit Category</h1>
                    <button 
                        onClick={handleSave}
                        disabled={!isDirty || isSaving}
                        className="btn btn-primary rounded-xl"
                    >
                        {isSaving ? (
                            <div className="flex items-center gap-2">
                                <span className="loading loading-spinner loading-sm"></span>
                                <span>Saving</span>
                            </div>
                        ) : (
                            <span>Save</span>
                        )}
                    </button>
                </div>

                <div className="form-control w-full gap-4">
                    <label className="form-control w-full">
                        <div className="label">
                            <span className="label-text text-lg">Title</span>
                        </div>
                        <input 
                            type="text" 
                            value={title}
                            onChange={handleInputChange(setTitle)}
                            className="input input-bordered w-full rounded-xl" 
                            disabled={isSaving}
                        />
                    </label>

                    <label className="form-control w-full">
                        <div className="label">
                            <span className="label-text text-lg">Description</span>
                        </div>
                        <textarea 
                            value={description}
                            onChange={handleInputChange(setDescription)}
                            className="textarea textarea-bordered w-full h-24 rounded-xl" 
                            disabled={isSaving}
                        />
                    </label>

                    <div className="flex flex-col gap-2 mt-8">
                        <label className="label cursor-pointer justify-start gap-4 my-2">
                            <input 
                                type="checkbox"
                                className="toggle bg-gray-400 checked:bg-green-800 border-none toggle-xl"
                                checked={isHidden}
                                onChange={handleToggleChange(setIsHidden)}
                                disabled={isSaving}
                            />
                            <span className="label-text">Hide from normal view</span>
                        </label>

                        <label className="label cursor-pointer justify-start gap-4 my-2">
                            <input 
                                type="checkbox"
                                className="toggle bg-gray-400 checked:bg-green-800 border-none toggle-xl"
                                checked={isExclusive}
                                onChange={handleToggleChange(setIsExclusive)}
                                disabled={isSaving}
                            />
                            <span className="label-text">Exclusive (only show recommendations from same playlist)</span>
                        </label>
                    </div>
                </div>

                <div className="divider"></div>

                <div className="flex justify-center">
                    <button 
                        className="btn btn-error btn-outline rounded-xl w-64"
                        onClick={handleDelete}
                        disabled={isDeleting}
                    >
                        {isDeleting ? (
                            <div className="flex items-center gap-2">
                                <span className="loading loading-spinner loading-sm"></span>
                                <span>Deleting...</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                                Delete Category
                            </div>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}