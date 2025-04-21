"use client";

import { openLoginWindow } from "@/lib/authUtils";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/lib/authStore";

export default function AuthWarning({ returnPath }) {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [authError, setAuthError] = useState(null);
  const { isAuthenticated } = useAuthStore();
  
  const handleLogin = () => {
    setIsRedirecting(true);
    setAuthError(null);
    
    openLoginWindow(returnPath, (reason) => {
      setIsRedirecting(false);
      setAuthError("Authentication was cancelled. Please try again.");
    });
  };
  
  useEffect(() => {
    if (!isRedirecting || isAuthenticated) return;
    
    const checkAuthSuccess = () => {
      const storeAuthenticated = useAuthStore.getState().isAuthenticated;
      const localStorageSuccess = localStorage.getItem('authSuccess') === 'true';
      
      if (storeAuthenticated || localStorageSuccess) {
        localStorage.removeItem('authSuccess');
        
        setIsRedirecting(false);
        window.location.reload();
        return true;
      }
      return false;
    };
    

    if (checkAuthSuccess()) return;
    
    const checkInterval = setInterval(() => {
      if (checkAuthSuccess()) {
        clearInterval(checkInterval);
      }
      
      const authCancelled = sessionStorage.getItem("authCancelled");
      if (authCancelled === "true") {
        clearInterval(checkInterval);
        setIsRedirecting(false);
        setAuthError("Authentication was cancelled. Please try again.");
        sessionStorage.removeItem("authCancelled");
      }
    }, 500);
    
    return () => clearInterval(checkInterval);
  }, [isRedirecting, isAuthenticated]);
  
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data && event.data.type === 'AUTH_SUCCESS') {
        // console.log("Received AUTH_SUCCESS message");
        setIsRedirecting(false);
        window.location.reload();
      }
    };
    
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div className="bg-base-200 p-6 rounded-lg shadow-lg max-w-md w-full mx-auto">
      <div className="flex items-center gap-4 mb-4">
        <div className="text-warning">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold">Authentication Required</h2>
      </div>
      
      {authError ? (
        <div className="alert alert-error mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{authError}</span>
        </div>
      ) : (
        <p className="mb-6">
          You need to log in to access this page. Would you like to proceed to the login page?
        </p>
      )}
      
      <div className="flex flex-col sm:flex-row gap-3 justify-end">
        <Link href="/" className="btn">
          Cancel
        </Link>
        <button 
          onClick={handleLogin}
          disabled={isRedirecting} 
          className="btn btn-primary"
        >
          {isRedirecting ? (
            <>
              <span className="loading loading-spinner loading-xs"></span>
              Opening Login...
            </>
          ) : (
            "Login to Continue"
          )}
        </button>
      </div>
    </div>
  );
}