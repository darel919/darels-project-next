"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/authStore";
import AuthWarning from "./AuthWarning";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuthStore();
  const [showWarning, setShowWarning] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsChecking(false);
      if (!isAuthenticated) {
        setShowWarning(true);
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, [isAuthenticated]);
  
  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }
  
  if (showWarning) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <AuthWarning returnPath={typeof window !== 'undefined' ? window.location.pathname : '/'} />
      </div>
    );
  }
  
  return children;
}