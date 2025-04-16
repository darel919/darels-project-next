"use client";

import { useAuthStore } from "./authStore";

export function openLoginWindow(currentPath, onAuthCancelled) {
  localStorage.setItem("redirectAfterAuth", currentPath);
  
  sessionStorage.removeItem("redirectionCompleted");
  sessionStorage.removeItem("authCancelled");
  localStorage.removeItem("authSuccess");
  
  const redirectUrl = encodeURIComponent(`${window.location.origin}/auth`);
  const authUrl = `${process.env.NEXT_PUBLIC_DARELISME_URL}/auth/login?redirectExternal=${redirectUrl}`;
  
  const loginWindow = window.open(authUrl, 'darelismeLogin', 'width=600,height=700');
  
  if (!loginWindow) {
    alert("Please allow popups for this site to enable login");
    if (onAuthCancelled) onAuthCancelled("Popup was blocked");
    return false;
  }
  
  let authDetected = false;
  
  const checkWindowClosed = setInterval(() => {
    if (authDetected) return;
    
    try {
      const isAuthenticated = useAuthStore.getState().isAuthenticated;
      
      if (isAuthenticated) {
        console.log("Authentication detected via store check");
        clearInterval(checkWindowClosed);
        authDetected = true;
        return;
      }
      
      if (localStorage.getItem('authSuccess') === 'true') {
        console.log("Authentication detected via localStorage flag");
        localStorage.removeItem('authSuccess');
        clearInterval(checkWindowClosed);
        authDetected = true;
        return;
      }
      
      if (loginWindow.closed) {
        clearInterval(checkWindowClosed);
        
        const finalAuthCheck = useAuthStore.getState().isAuthenticated;
        const finalStorageCheck = localStorage.getItem('authSuccess') === 'true';
        
        if (finalAuthCheck || finalStorageCheck) {
          console.log("Authentication detected after window closed");
          localStorage.removeItem('authSuccess');
          authDetected = true;
        } else {
          console.log("Login window was closed without completing authentication");
          sessionStorage.setItem("authCancelled", "true");
          if (onAuthCancelled) onAuthCancelled("Login window was closed");
        }
      }
    } catch (e) {
      console.error("Error checking auth status:", e);
    }
  }, 500);
  
  return true;
}

export function redirectToLogin(currentPath) {
  localStorage.setItem("redirectAfterAuth", currentPath);
  sessionStorage.removeItem("redirectionCompleted");
  const redirectUrl = encodeURIComponent(`${window.location.origin}/auth`);
  window.location.href = `${process.env.NEXT_PUBLIC_DARELISME_URL}/auth/login?redirectExternal=${redirectUrl}`;
}

export function useRequireAuth() {
  const { isAuthenticated } = useAuthStore();
  
  return {
    isAuthenticated,
    checkAuth: () => {
      return isAuthenticated;
    }
  };
}