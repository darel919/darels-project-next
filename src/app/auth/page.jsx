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
        const cookieResponse = await fetch('/api/auth/set-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: accessToken }), 
        });

        if (!cookieResponse.ok) {
          throw new Error('Failed to set authentication cookie');
        }
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
    <div className="flex min-h-screen flex-col items-center justify-center p-8 font-mono">
      <div className="mt-4 text-center">
        {processing && !error ? (
          <>
            <span className="loading loading-spinner loading-lg mb-4"></span>
            <h1 className="font-bold text-4xl mt-8">Validating your authentication session, please wait...</h1>
          </>
        ) : error ? (
          <section className="flex flex-col items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-16 text-[red]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
            <h1 className="text-4xl font-bold my-8 ">Authentication failed.<br /><br />{error}</h1>
            <p>You will be redirected to Home.</p>

          </section>
         
        ) : (
          <section className="flex flex-col items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-16 text-[green]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            <h1 className="text-4xl font-bold mt-8">Login success.</h1>
          </section>
        )}
      </div>
    </div>
  );
}