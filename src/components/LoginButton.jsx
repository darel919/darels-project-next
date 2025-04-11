"use client";

import { useAuthStore } from "@/lib/authStore";
import { openLoginWindow } from "@/lib/authUtils";
import { useState, useEffect } from "react";

export default function LoginButton() {
  const { isAuthenticated, clearTokens } = useAuthStore();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState(null);

  const handleLogin = () => {
    setIsLoggingIn(true);
    setLoginError(null);
    
    const success = openLoginWindow(window.location.pathname, (reason) => {
      setIsLoggingIn(false);
      setLoginError("Login cancelled");
      
      setTimeout(() => {
        setLoginError(null);
      }, 3000);
    });
    
    if (!success) {
      setIsLoggingIn(false);
      setLoginError("Popup was blocked");
      
      setTimeout(() => {
        setLoginError(null);
      }, 3000);
    }
  };
  
  useEffect(() => {
    if (!isLoggingIn || isAuthenticated) return;
    
    const checkAuthInterval = setInterval(() => {
      const currentAuthState = useAuthStore.getState().isAuthenticated;
      
      if (currentAuthState) {

        clearInterval(checkAuthInterval);
        setIsLoggingIn(false);

        window.location.reload();
      }
      
      const authCancelled = sessionStorage.getItem("authCancelled");
      if (authCancelled === "true") {
        clearInterval(checkAuthInterval);
        setIsLoggingIn(false);
        sessionStorage.removeItem("authCancelled");
      }
    }, 500);
    
    return () => clearInterval(checkAuthInterval);
  }, [isLoggingIn, isAuthenticated]);
  
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.origin === window.location.origin && 
          event.data && event.data.type === 'AUTH_SUCCESS') {
        setIsLoggingIn(false);
        setTimeout(() => {
          window.location.reload();
        },250)
      }
    };
    
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  if (isAuthenticated) {
    return (
      <button
        onClick={() => {
          clearTokens();
          window.location.reload();
        }}
        className="btn btn-error btn-sm"
      >
        Logout
      </button>
    );
  }
  
  return (
    <div className="flex flex-col items-end">
      {loginError && (
        <div className="text-error text-xs mb-1">{loginError}</div>
      )}
      <button
        onClick={handleLogin}
        disabled={isLoggingIn}
        className="btn btn-primary btn-sm"
      >
        {isLoggingIn ? (
          <>
            <span className="loading loading-spinner loading-xs"></span>
            Logging in...
          </>
        ) : (
          "Login"
        )}
      </button>
    </div>
  );
}