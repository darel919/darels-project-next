"use client"
import React, { useEffect, useState } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function VideoState({ videoId, onDone }) {
  const [processingStatus, setProcessingStatus] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!videoId) return;
    let interval = null;
    const updateStatusMessage = (status) => {
      switch (status) {
        case "pending":
          setStatusMessage("Video is waiting in processing queue...");
          break;
        case "starting":
          setStatusMessage("Processing has started...");
          break;
        case "converting":
          setStatusMessage("Converting video...");
          break;
        case "done":
          setStatusMessage("Video is ready to view!");
          break;
        case "error":
          setStatusMessage("Video failed to be uploaded");
          break;
        default:
          setStatusMessage("Processing video...");
      }
    };
    const fetchStatus = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/upload/jobCheck?id=${videoId}`);
        const data = await response.json();
        const uploadStatus = data?.upload_status;
        if (uploadStatus && uploadStatus.status) {
          setProcessingStatus(uploadStatus.status);
          updateStatusMessage(uploadStatus.status);
          if (uploadStatus.status === "converting" && typeof uploadStatus.progress === "number") {
            setUploadProgress(Math.round(uploadStatus.progress));
          }
          if (uploadStatus.status === "done") {
            if (onDone) onDone();
            window.location.reload();
          }
        }
      } catch (err) {
        setError("Failed to fetch status");
      }
    };
    fetchStatus();
    interval = setInterval(fetchStatus, 1000);
    return () => clearInterval(interval);
  }, [videoId, onDone]);

  if (error) return <div className="alert alert-error">{error}</div>;

  return (
    <div className="w-full">
      {/* <h4 className="font-bold mb-2">Processing</h4> */}
      <ul className="steps w-full">
        <li className={`step ${["pending", "starting", "converting", "done"].includes(processingStatus) ? "step-success" : ""}`}>Waiting</li>
        <li className={`step ${["starting", "converting", "done"].includes(processingStatus) ? "step-success" : ""}`}>Starting</li>
        <li className={`step ${["converting", "done"].includes(processingStatus) ? "step-success" : ""}`}>Processing</li>
        <li className={`step ${["done"].includes(processingStatus) ? "step-success" : ""}`}>Done</li>
      </ul>
      {processingStatus === "starting" && (
        <div className="mt-4">
          <progress className="progress progress-success w-full"></progress>
        </div>
      )}
      {processingStatus === "converting" && (
        <div className="mt-4">
          <progress className="progress progress-success w-full" value={uploadProgress} max="100"></progress>
          <p className="mt-2">{uploadProgress}% complete</p>
        </div>
      )}
      <p className="text-lg mt-4">{processingStatus === "starting" ? statusMessage : (processingStatus === "converting" ? "" : statusMessage)}</p>
    </div>
  );
}
