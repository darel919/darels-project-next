"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/lib/authStore";
import { openLoginWindow } from "@/lib/authUtils";
import { useRouter } from "next/navigation";

export default function LoginButton({ redirectPath }) {
  const { isAuthenticated, clearAuth, isLoading, initializeAuth } = useAuthStore();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    initializeAuth();
  }, []);

  const handleLogout = async () => {
    await clearAuth();
    router.push('/');
  };

  const handleLogin = () => {
    setIsLoggingIn(true);
    setLoginError(null);
    
    const success = openLoginWindow(redirectPath || window.location.pathname, (reason) => {
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
        }, 250);
      }
    };
    
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  if (isLoading) {
    return (
      <button className="btn btn-ghost btn-sm loading"></button>
    );
  }

  if (isAuthenticated) {
    return (
      <button
        onClick={handleLogout}
        className="btn btn-error btn-sm"
      >
        Logout
      </button>
    );
  }
  
  return (
    <div className="flex flex-col items-center">
      {loginError && (
        <div className="text-error text-xs mb-1">{loginError}</div>
      )}
      <button
        onClick={handleLogin}
        className={`btn btn-primary btn-sm ${isLoggingIn ? 'loading' : ''}`}
        disabled={isLoggingIn}
      >
        {isLoggingIn ? 'Logging in...' : 'Login'}
      </button>
    </div>
  );
}