"use client";

import { useAuthStore } from "@/lib/authStore";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { storeAtAndRt } = useAuthStore();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(true);

  async function handleAuth() {
    try {
      const accessToken = searchParams.get("at");
      const refreshToken = searchParams.get("rt");
      
      if (accessToken && refreshToken) {
        storeAtAndRt(accessToken, refreshToken);
        
        window.localStorage.setItem('authSuccess', 'true');
        
        if (window.opener) {
          console.log("Auth successful in popup, notifying parent window");
          
          try {
            window.opener.localStorage.setItem('authSuccess', 'true');
            
            window.opener.postMessage({ type: 'AUTH_SUCCESS' }, '*');
            
            console.log("Auth success notification sent to parent window");
          } catch (e) {
            console.error("Error notifying parent window:", e);
          }
          
          setTimeout(() => {
            window.close();
          }, 500);
          return;
        }
        
        console.log("Auth successful in main window, redirecting");
        
        if (sessionStorage.getItem("redirectionCompleted")) {
          console.log("Redirection already completed, preventing loop");
          setProcessing(false);
          return;
        }
        
        const redirectPath = localStorage.getItem("redirectAfterAuth") || "/";
        localStorage.removeItem("redirectAfterAuth");
        
        sessionStorage.setItem("redirectionCompleted", "true");
        
        setTimeout(() => {
          router.push(redirectPath);
        }, 300);
      } else {
        console.error("No access token!");
        setError("No access token!");
        setProcessing(false);
        
        if (window.opener) {
          setTimeout(() => {
            window.close();
          }, 3000);
        } else {
          setTimeout(() => {
            router.push("/");
          }, 3000);
        }
      }
    } catch (err) {
      console.error("Error in auth process:", err);
      setError(`Authentication error: ${err.message}`);
      setProcessing(false);
    }
  }
  
  useEffect(() => {
    handleAuth();
  }, []);
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="mt-4 text-center">
        {processing && !error ? (
          <>
            <span className="loading loading-spinner loading-lg mb-4"></span>
            <h1 className="font-bold text-2xl">Validating your authentication session, please wait...</h1>
          </>
        ) : error ? (
          <h1 className="text-4xl">Authentication failed.<br /><br />{error}</h1>
        ) : (
          <h1 className="text-2xl">You have been successfully authenticated!</h1>
        )}
      </div>
    </div>
  );
}