"use client";

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import ErrorState from '@/components/ErrorState';

async function fetchVideoData(videoId) {
    try {
        const response = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + '/watch?v=' + videoId);
        if (!response.ok) {
            throw new Error('Failed to fetch video data');
        }
        const data = await response.json();
        if (!data) {
            throw new Error('Video not found');
        }
        return data;
    } catch (error) {
        console.error("Error fetching video data:", error);
        throw error;
    }
}

async function fetchCategories() {
    try {
        const response = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + '/categories?showHidden=true');
        if (!response.ok) {
            throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error("Error fetching categories:", error);
        throw error; 
    }
}

export default function EditPage() {
    const searchParams = useSearchParams();
    const params = searchParams
    const videoId = params.get('v');
    
    const [videoData, setVideoData] = useState(null);
    const [categories, setCategories] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newCategoryTitle, setNewCategoryTitle] = useState("");
    const [newCategoryDesc, setNewCategoryDesc] = useState("");
    const [isCreatingCategory, setIsCreatingCategory] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const [formChanges, setFormChanges] = useState({
        title: false,
        desc: false,
        category: false,
        isHidden: false
    });
    const [currentTitle, setCurrentTitle] = useState("");
    const [currentDesc, setCurrentDesc] = useState("");
    const [currentIsHidden, setCurrentIsHidden] = useState(false);

    useEffect(() => {
        if (videoData?.title) {
            document.title = `Editing: ${videoData.title}`;
        }
    }, [videoData]);

    const hasChanges = Object.values(formChanges).some(changed => changed);

    const modalRef = useRef(null);

    const fetchAllData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [videoRes, fetchedCategories] = await Promise.all([
                await fetchVideoData(videoId),
                await fetchCategories() 
            ]);
            
            setVideoData(videoRes);
            console.log(fetchedCategories)
            setCategories(fetchedCategories);
            
            const currentCatId = videoRes.expand?.category?.[0]?.id || "";
            setSelectedCategoryId(currentCatId);

        } catch (fetchError) {
            console.error("Error fetching data:", fetchError);
            const errorMessage = fetchError.message.includes("Video not found") 
                ? "This video is unavailable." 
                : fetchError.message.includes("categories")
                ? "Could not load categories."
                : "An error occurred while loading data.";
                
            const errorDesc = fetchError.message.includes("Video not found")
                ? "We couldn't edit this video. Please recheck the video ID or choose another video to edit."
                : fetchError.message.includes("categories")
                ? "Failed to fetch the list of available playlists."
                : "Please try again later.";
            setError({ message: errorMessage, desc: errorDesc });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (videoId) {
            fetchAllData();
        } else {
            setError({ message: "Invalid Video ID.", desc: "Please recheck the video ID." });
            setIsLoading(false);
        }
    }, [videoId]);

    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (hasChanges) {
                e.preventDefault();
                e.returnValue = '';
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [hasChanges]);

    useEffect(() => {
        if (videoData) {
            setCurrentTitle(videoData.title);
            setCurrentDesc(videoData.desc);
            setCurrentIsHidden(videoData.isHidden);
        }
    }, [videoData]);

    const handleInputChange = (field, value) => {
        const original = videoData[field];
        setFormChanges(prev => ({
            ...prev,
            [field]: value !== original
        }));
    };

    const handleCategoryChange = (event) => {
        const value = event.target.value;
        if (value === "create_new") {
            setNewCategoryTitle("");
            setNewCategoryDesc("");
            modalRef.current?.showModal();
        } else {
            setSelectedCategoryId(value);
            const originalCategoryId = videoData.expand?.category?.[0]?.id || "";
            setFormChanges(prev => ({
                ...prev,
                category: value !== originalCategoryId
            }));
        }
    };

    const handleCreateCategory = async (event) => {
        event.preventDefault();
        if (!newCategoryTitle) return; 

        setIsCreatingCategory(true);
        try {
            const response = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + '/category/new', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title: newCategoryTitle, desc: newCategoryDesc }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create category');
            }

            const newCategory = await response.json(); 

            const updatedCategories = await fetchCategories();
            setCategories(updatedCategories);
            setSelectedCategoryId(newCategory.id); 

            modalRef.current?.close(); 

        } catch (creationError) {
            console.error("Error creating category:", creationError);
            alert(`Failed to create category: ${creationError.message}`); 
        } finally {
            setIsCreatingCategory(false);
        }
    };

    const handleCancelCreate = () => {
        setSelectedCategoryId(videoData?.expand?.category?.[0]?.id || ""); 
        modalRef.current?.close();
    };

    const handleResetAllChanges = () => {
        if (window.confirm("Are you sure you want to reset all changes?")) {
            window.location.reload();
        }
    }

    const handleSaveChanges = async () => {
        setIsSaving(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: currentTitle,
                    desc: currentDesc,
                    isHidden: currentIsHidden,
                    category: selectedCategoryId,
                    id: videoData.id,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update video');
            }

            const toastElement = document.createElement('div');
            toastElement.className = 'toast toast-end';
            toastElement.setAttribute('role', 'alert');
            toastElement.setAttribute('aria-live', 'polite');
            const alertElement = document.createElement('div');
            alertElement.className = 'alert alert-success';
            alertElement.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>Video updated successfully!</span>
            `;
            toastElement.appendChild(alertElement);
            document.body.appendChild(toastElement);
            
            setFormChanges({
                title: false,
                desc: false,
                category: false,
                isHidden: false
            });
            
            setTimeout(() => {
                toastElement.remove();
                window.location.reload();
            }, 2000);

        } catch (error) {
            console.error("Error updating video:", error);
            const toastElement = document.createElement('div');
            toastElement.className = 'toast toast-end';
            toastElement.setAttribute('role', 'alert');
            toastElement.setAttribute('aria-live', 'assertive');
            const alertElement = document.createElement('div');
            alertElement.className = 'alert alert-error';
            alertElement.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>Save failed: ${error.message}</span>
            `;
            toastElement.appendChild(alertElement);
            document.body.appendChild(toastElement);
            
            setTimeout(() => {
                toastElement.remove();
            }, 3000);
        } finally {
            setIsSaving(false);
        }
    }

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this video? This change is permanent!")) {
            setIsDeleting(true);
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/?v=${videoId}`, {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    throw new Error('Failed to delete video');
                }

                const toastElement = document.createElement('div');
                toastElement.className = 'toast toast-end';
                toastElement.setAttribute('role', 'alert');
                toastElement.setAttribute('aria-live', 'polite');
                const alertElement = document.createElement('div');
                alertElement.className = 'alert alert-success';
                alertElement.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span>Video deleted successfully!</span>
                `;
                toastElement.appendChild(alertElement);
                document.body.appendChild(toastElement);
                
                setTimeout(() => {
                    toastElement.remove();
                    window.location.href = '/manage';
                }, 2000);

            } catch (error) {
                console.error("Error deleting video:", error);
                const toastElement = document.createElement('div');
                toastElement.className = 'toast toast-end';
                toastElement.setAttribute('role', 'alert');
                toastElement.setAttribute('aria-live', 'assertive');
                const alertElement = document.createElement('div');
                alertElement.className = 'alert alert-error';
                alertElement.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span>Failed to delete video. Please try again.</span>
                `;
                toastElement.appendChild(alertElement);
                document.body.appendChild(toastElement);
                
                setTimeout(() => {
                    toastElement.remove();
                }, 3000);
            } finally {
                setIsDeleting(false);
            }
        }
    };

    const handleNavigation = (e) => {
        if (hasChanges && !isSaving) {
            const confirm = window.confirm("Are you sure? All your changes are going to be lost");
            if (!confirm) {
                e.preventDefault();
            }
        }
    };

    if (isLoading) {
        return <div className="min-h-screen pt-20 px-6 sm:px-10 flex justify-center items-center"><span className="loading loading-lg"></span></div>;
    }

    if (error) {
        return <ErrorState 
            message={error.message} 
            actionDesc={error.desc}
            actionText='Return to Manage'
            action="manage"
        />;
    }
    
    if (!videoId) {
         return <ErrorState 
            message="Invalid Video ID." 
            actionDesc="Please recheck the video ID."
            actionText='Return to Manage'
            action="manage"
        />;
    }

    if (!videoData) {
        return <div className="min-h-screen pt-20 px-6 sm:px-10">Video data not available.</div>;
    }

    return (
        <div className="min-h-screen pt-20 px-6 sm:px-10 pb-20">
            <section>
                <div className="breadcrumbs text-sm mb-4">
                    <ul>
                        <li><Link href="/" onClick={handleNavigation} className={isSaving ? 'pointer-events-none opacity-50' : ''}>Home</Link></li>
                        <li><Link href="/manage" onClick={handleNavigation} className={isSaving ? 'pointer-events-none opacity-50' : ''}>Studio</Link></li>
                        <li><p>Editing: <b>{videoData.title}</b></p></li>
                    </ul>
                </div>
                <section className='sm:flex items-center justify-between'>
                    <h1 className="text-xl font-bold">Video details</h1>
                    <section className='mt-4 sm:mt-0'>
                        <button 
                            className="btn rounded-xl mx-1 hover:bg-warning hover:border-warning"
                            onClick={handleResetAllChanges}
                            disabled={!hasChanges || isSaving}
                        >
                            <span className="text-sm sm:text-md font-bold">Undo changes</span>
                        </button>
                        <button 
                            className="btn btn-primary rounded-xl ml-1"
                            onClick={handleSaveChanges}
                            disabled={!hasChanges || isSaving}
                        >
                            {isSaving ? (
                                <div className="flex items-center gap-2">
                                    <span className="loading loading-spinner loading-sm"></span>
                                    <span className="text-sm sm:text-lg font-light">Saving</span>
                                </div>
                            ) : (
                                <span className="text-sm sm:text-md font-bold">Save</span>
                            )}
                        </button>
                    </section>
                </section>
                <section className='flex flex-col sm:flex-row items-start justify-center mt-4'>
                    <img src={process.env.NEXT_PUBLIC_API_BASE_URL+'/thumb?id='+videoData.id} alt="Thumbnail" className="rounded-xl mt-4 h-auto max-w-[300px] max-h-[400px] object-cover mb-8 sm:mb-0" />
                    <fieldset className="fieldset ml-0 sm:ml-8 rounded-box w-full">
                        <label className="fieldset-label mb-2 text-lg">Title</label>
                        <input 
                            type="text" 
                            className="input w-full rounded-lg" 
                            placeholder="Onana what's my name? [Rihanna version]" 
                            value={currentTitle}
                            onChange={(e) => {
                                setCurrentTitle(e.target.value);
                                handleInputChange('title', e.target.value);
                            }}
                            disabled={isSaving}
                        />
                        
                        <label className="fieldset-label my-2 text-lg">Description</label>
                        <textarea 
                            className="textarea h-24 w-full rounded-lg" 
                            placeholder="Berang berang pergi ke pasar (cakepppp)"
                            value={currentDesc}
                            onChange={(e) => {
                                setCurrentDesc(e.target.value);
                                handleInputChange('desc', e.target.value);
                            }}
                            disabled={isSaving}
                        />
                        
                        {categories.length > 0 && (
                            <section>
                                <label className="fieldset-label my-2 text-lg">Category</label>
                                <select 
                                    value={selectedCategoryId} 
                                    onChange={handleCategoryChange}
                                    className="select w-full rounded-lg"
                                    disabled={isSaving}
                                >
                                    <option value="" disabled={selectedCategoryId !== ""}>
                                        Pick a category
                                    </option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.title}
                                        </option>
                                    ))}
                                    <option value="create_new" className="font-bold text-info">
                                        + Create new category...
                                    </option>
                                </select>
                            </section>
                        )}

                        <label className="fieldset-label flex items-center gap-2 my-4">
                            <input 
                                type="checkbox" 
                                checked={currentIsHidden} 
                                onChange={(e) => {
                                    setCurrentIsHidden(e.target.checked);
                                    handleInputChange('isHidden', e.target.checked);
                                }}
                                className="toggle bg-green-900 checked:bg-red-800 border-none toggle-xl"
                                disabled={isSaving}
                            />
                        <p className='text-lg sm:text-md font-bold sm:font-normal ml-2'>Hide this video</p>
                        </label>
                    </fieldset>
                </section>
                <section className="mt-12 flex justify-center">
                    <button 
                        className="btn btn-neutral hover:bg-error hover:text-white w-64"
                        onClick={handleDelete}
                        disabled={isDeleting}
                    >
                        {isDeleting ? (
                            <div className="flex items-center gap-2">
                                <span className="loading loading-spinner loading-sm"></span>
                                <span className='font-light'>Deleting...</span>
                            </div>
                        ) : (
                            <section className='flex items-center gap-2'>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                                <span className='font-light'>Delete Video</span>
                            </section>

                        )}
                    </button>
                </section>
            </section>

            <dialog id="create_category_modal" className="modal" ref={modalRef}>
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Create New Category</h3>
                    <form onSubmit={handleCreateCategory}>
                        <div className="py-4 space-y-4">
                             <label className="fieldset-label">Title</label>
                             <input 
                                type="text" 
                                placeholder="Category Title" 
                                className="input input-bordered w-full" 
                                value={newCategoryTitle}
                                onChange={(e) => setNewCategoryTitle(e.target.value)}
                                required
                            />
                             <label className="fieldset-label">Description</label>
                             <textarea 
                                className="textarea textarea-bordered h-24 w-full" 
                                placeholder="Category Description (Optional)"
                                value={newCategoryDesc}
                                onChange={(e) => setNewCategoryDesc(e.target.value)}
                            />
                        </div>
                        <div className="modal-action">
                            <button type="button" className="btn" onClick={handleCancelCreate} disabled={isCreatingCategory}>Cancel</button>
                            <button type="submit" className="btn btn-primary" disabled={isCreatingCategory}>
                                {isCreatingCategory ? <span className="loading loading-spinner loading-xs"></span> : "Save"}
                            </button>
                        </div>
                    </form>
                </div>
                 <form method="dialog" className="modal-backdrop">
                    <button type="button" onClick={handleCancelCreate}>close</button>
                </form>
            </dialog>
        </div>
    );
}