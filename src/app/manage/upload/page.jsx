"use client";

import { useState, useRef, useEffect } from 'react';
import ErrorState from '@/components/ErrorState';

const API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL;

export default function UploadPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processingStatus, setProcessingStatus] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [showProcessing, setShowProcessing] = useState(false);
  const [contentId, setContentId] = useState(null);
  const [uploadFailed, setUploadFailed] = useState(false);
  const [categories, setCategories] = useState([]);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    desc: '',
    date_created: new Date().toISOString().split('T')[0],
    category_select: '',
    submitted_by: 'darelisme Archives'
  });
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const videoRef = useRef(null);
  const uploadRef = useRef(null);
  const modalRef = useRef(null);
  const statusIntervalRef = useRef(null);
  const uploadInProgress = (uploadProgress > 0 && uploadProgress < 100) || 
                          (showProcessing && processingStatus !== 'done' && !uploadFailed);

  useEffect(() => {
    const performChecks = async () => {
      if (window.location.hostname === process.env.NEXT_PUBLIC_APP_EXT_BASE_URL.slice(8)) {
        try {
          const pingResponse = await fetch(process.env.NEXT_PUBLIC_DARELISME_PING_URL);
          if (pingResponse.ok) {
            setError({
              message: "Upload is unavailable",
              desc: "You're not connected on Merapi network"
            });
            setIsLoading(false);
          } else {
            localStorage.setItem('redirectAfterSwitch', '/manage/upload');
            window.location.href = process.env.NEXT_PUBLIC_APP_LOCAL_BASE_URL + '/manage/upload';
          }
        } catch (err) {
          localStorage.setItem('redirectAfterSwitch', '/manage/upload');
          window.location.href = process.env.NEXT_PUBLIC_APP_LOCAL_BASE_URL + '/manage/upload';
        }
      } else {
        setIsLoading(false);
      }
    };

    performChecks();
    fetchCategories();

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (statusIntervalRef.current) {
        clearInterval(statusIntervalRef.current);
      }
    };
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(API_BASE_URL + '/categories?showHidden=true');
      if (response.ok) {
        const data = await response.json();
        
        const formattedCategories = data.map(cat => ({
          id: cat.id,
          title: cat.title
        }));
        
        formattedCategories.push({
          id: "create_new",
          title: "Create new category"
        });
        
        setCategories(formattedCategories);
        
        if (formattedCategories.length > 1) {
          setFormData(prev => ({ ...prev, category_select: formattedCategories[0].id }));
        }
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  useEffect(() => {
    if (showSuccessToast) {
      const timer = setTimeout(() => {
        setShowSuccessToast(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [showSuccessToast]);

  const handleBeforeUnload = (e) => {
    if (uploadInProgress) {
      e.preventDefault();
      e.returnValue = 'Changes you made may not be saved. Are you sure you want to leave?';
      return e.returnValue;
    }
  };

  const handleCategoryChange = async (e) => {
    const newValue = e.target.value;
    
    if (newValue === "create_new") {
      const categoryName = prompt("Enter a name for the new category:");
      if (!categoryName || categoryName.trim() === "") {
        return;
      }
      
      const categoryDesc = prompt("Enter a description for the new category:");
      if (!categoryDesc || categoryDesc.trim() === "") {
        return;
      }
      
      try {
        const response = await fetch(`${API_BASE_URL}/category/new`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            title: categoryName.trim(),
            desc: categoryDesc.trim()
          })
        });
        
        if (!response.ok) {
          throw new Error("Failed to create category");
        }
        
        const newCategory = await response.json();
        
        await fetchCategories();
        
        if (newCategory && newCategory.id) {
          setFormData(prev => ({ ...prev, category_select: newCategory.id }));
        }
      } catch (error) {
        console.error("Failed to create category:", error);
        alert(`Failed to create category: ${error.message}`);
      }
    } else {
      setFormData(prev => ({ ...prev, category_select: newValue }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileName = file.name.replace(/\.[^/.]+$/, "");
    setFormData(prev => ({ ...prev, title: fileName }));

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.removeAttribute('src');
        videoRef.current.load();
        videoRef.current.src = objectUrl;
        videoRef.current.load();
        const playPromise = videoRef.current.play();
        
        if (playPromise !== undefined) {
          playPromise.catch(err => {
            console.log("Autoplay prevented:", err);
          });
        }
      }
    }, 50);
  };

  const updateStatusMessage = (status) => {
    switch (status) {
      case 'pending':
        setStatusMessage('Video is waiting in processing queue...');
        break;
      case 'starting':
        setStatusMessage('Processing has started...');
        break;
      case 'converting480':
        setStatusMessage('Converting video to 480p...');
        break;
      case 'converting720':
        setStatusMessage('Converting video to 720p...');
        break;
      case 'done':
        setStatusMessage('Video is ready to view!');
        break;
      default:
        setStatusMessage('Processing video...');
    }
  };

  const startJobStatusCheck = (id) => {
    setShowProcessing(true);
    setProcessingStatus('pending');
    updateStatusMessage('pending');

    if (statusIntervalRef.current) {
      clearInterval(statusIntervalRef.current);
    }

    statusIntervalRef.current = setInterval(async () => {
      try {
        if (!id) {
          console.error("No content ID provided for status check");
          return;
        }
        
        const response = await fetch(`${API_BASE_URL}/upload/jobCheck?id=${id}`);
        const data = await response.json();

        if (data?.upload_status) {
          setProcessingStatus(data.upload_status);
          updateStatusMessage(data.upload_status);

          if (data.upload_status === 'done') {
            stopJobStatusCheck();
            setShowSuccessToast(true);
            window.open(`/watch?v=${id}`, '_blank');
            modalRef.current?.close();
          }
        }
      } catch (error) {
        console.error("Error checking job status:", error);
      }
    }, 500);
  };

  const stopJobStatusCheck = () => {
    if (statusIntervalRef.current) {
      clearInterval(statusIntervalRef.current);
      statusIntervalRef.current = null;
    }
    setShowProcessing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const fileInput = uploadRef.current;
    if (!fileInput.files?.[0]) {
      alert("Please select a video file to upload");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setStatusMessage('Initializing upload...');
    setUploadFailed(false);
    modalRef.current?.showModal();

    try {
      const initialData = {
        date_created: formData.date_created,
        category: formData.category_select,
        submitted_by: formData.submitted_by,
        desc: formData.desc,
        title: formData.title,
        isSelfHost: true
      };

      const storeResponse = await fetch(API_BASE_URL + '/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(initialData)
      });

      if (!storeResponse.ok) {
        throw new Error("Failed to create content entry");
      }

      const storeData = await storeResponse.json();
      if (!storeData.upload_id) {
        throw new Error("Failed to get upload ID from server");
      }

      const videoId = storeData.upload_id;
      setContentId(videoId);
      setStatusMessage('Uploading video...');

      const uploadFormData = new FormData();
      uploadFormData.append('file', fileInput.files[0]);
      uploadFormData.append('content_id', videoId);

      await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            setUploadProgress(Math.round((event.loaded / event.total) * 100));
          }
        });

        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(xhr.response);
          } else {
            reject(new Error(`Upload failed: ${xhr.statusText || 'Server error'}`));
          }
        });

        xhr.addEventListener('error', () => {
          reject(new Error('Network error occurred during upload'));
        });

        xhr.addEventListener('abort', () => {
          reject(new Error('Upload aborted'));
        });

        xhr.open('POST', API_BASE_URL + '/upload', true);
        xhr.send(uploadFormData);
      });

      setUploadProgress(100);
      setStatusMessage('Upload complete! Processing video...');
      
      startJobStatusCheck(videoId);

      setFormData({
        title: '',
        desc: '',
        date_created: new Date().toISOString().split('T')[0],
        category_select: categories[0]?.id || '',
        submitted_by: 'darelisme Archives'
      });
      fileInput.value = '';
      setPreviewUrl(null);

    } catch (error) {
      console.error("Upload process failed:", error);
      setStatusMessage(`Upload failed: ${error.message}`);
      setUploadProgress(0);
      setUploadFailed(true);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancelUpload = () => {
    if (uploadInProgress) {
      if (confirm('Are you sure you want to cancel the upload?')) {
        stopJobStatusCheck();
        setUploadFailed(true);
        setStatusMessage('Upload cancelled');
        setIsUploading(false);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 px-6 sm:px-10 flex justify-center items-center">
        <span className="loading loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error.message} actionDesc={error.desc} />;
  }

  return (
    <section className="min-h-screen pt-20 px-6 sm:px-10 pb-20">
      {showSuccessToast && (
        <div className="toast toast-top toast-end z-50">
          <div className="alert alert-success">
            <span>Upload successful! Your video is ready to view.</span>
          </div>
        </div>
      )}

      <div className="breadcrumbs text-sm mb-4 font-mono">
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/manage">Content Studio</a></li>
          <li><b>Video Upload</b></li>
        </ul>
      </div>

      <div className="mb-8 font-mono">
        <h1 className="text-4xl font-bold">Upload Video</h1>
      </div>

      <section className='flex flex-row gap-6'>
      {previewUrl && (
          <div className="w-[55vw] ">
            <video
              ref={videoRef}
              className="aspect-video rounded-lg"
              controls
              muted
              loop
              preload="auto"
            />
          </div>
        )}
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full max-w-3xl mx-auto">
        <div className="form-control w-full">
          <input
            type="file"
            className="file-input file-input-bordered w-full"
            accept="video/*"
            ref={uploadRef}
            onChange={handleFileChange}
            required
          />
        </div>

        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Title</span>
          </label>
          <input
            type="text"
            placeholder="Video title"
            className="input input-bordered w-full"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            required
          />
        </div>

        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Description</span>
          </label>
          <textarea
            className="textarea textarea-bordered h-24 w-full"
            placeholder="Video description"
            value={formData.desc}
            onChange={(e) => setFormData(prev => ({ ...prev, desc: e.target.value }))}
            required
          />
        </div>

        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Date Created</span>
          </label>
          <input
            type="date"
            className="input input-bordered w-full"
            value={formData.date_created}
            onChange={(e) => setFormData(prev => ({ ...prev, date_created: e.target.value }))}
            required
          />
        </div>

        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Category</span>
          </label>
          <select
            className="select select-bordered w-full"
            value={formData.category_select}
            onChange={handleCategoryChange}
            required
          >
            <option value="" disabled>Select a category</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.title}
              </option>
            ))}
          </select>
        </div>

        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Content Creator</span>
          </label>
          <input
            type="text"
            placeholder="Who created this content?"
            className="input input-bordered w-full"
            value={formData.submitted_by}
            onChange={(e) => setFormData(prev => ({ ...prev, submitted_by: e.target.value }))}
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={isUploading}
        >
          {isUploading ? (
            <div className="flex items-center gap-2">
              <span className="loading loading-spinner loading-sm"></span>
              <span>Uploading...</span>
            </div>
          ) : (
            'Upload Video'
          )}
        </button>
      </form>
      </section>



      <dialog ref={modalRef} className="modal" onClose={(e) => {
        if (uploadInProgress) {
          e.preventDefault();
        }
      }}>
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Upload Progress</h3>
          
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="mb-4">
              <h4 className="font-bold mb-2">Uploading</h4>
              <progress className="progress progress-success w-full" value={uploadProgress} max="100"></progress>
              <p className="mt-2">{uploadProgress}% complete</p>
            </div>
          )}

          {showProcessing && (
            <div className="mb-4">
              <h4 className="font-bold mb-2">Processing</h4>
              <ul className="steps w-full">
                <li className={`step ${['pending', 'starting', 'converting480', 'converting720', 'done'].includes(processingStatus) ? 'step-success' : ''}`}>Queue</li>
                <li className={`step ${['starting', 'converting480', 'converting720', 'done'].includes(processingStatus) ? 'step-success' : ''}`}>Starting</li>
                <li className={`step ${['converting480', 'converting720', 'done'].includes(processingStatus) ? 'step-success' : ''}`}>Processing</li>
                <li className={`step ${['done'].includes(processingStatus) ? 'step-success' : ''}`}>Done</li>
              </ul>
            </div>
          )}

          <p className="text-lg mt-4">{statusMessage}</p>

          <div className="modal-action">
            {(uploadProgress === 100 && processingStatus === 'done' || uploadFailed) ? (
              <button className="btn btn-success" onClick={() => modalRef.current?.close()}>Close</button>
            ) : uploadProgress < 100 ? (
              <button className="btn btn-error" onClick={handleCancelUpload}>Cancel Upload</button>
            ) : (
              <p className="text-warning">Processing... Please wait</p>
            )}
          </div>
        </div>
        <form method="dialog" className="modal-backdrop" onSubmit={(e) => {
          if (uploadInProgress) {
            e.preventDefault();
          }
        }}>
          <button disabled={uploadInProgress}>close</button>
        </form>
      </dialog>
    </section>
  );
}