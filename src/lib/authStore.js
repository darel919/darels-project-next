"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      userSession: null,

      storeAtAndRt: (accessToken, refreshToken) => {
        set({ 
          accessToken, 
          refreshToken, 
          isAuthenticated: true 
        });
        
        return useAuthStore.getState().fetchUserSession();
      },
      
      clearTokens: async () => {
        set({ 
          accessToken: null, 
          refreshToken: null, 
          isAuthenticated: false,
          userSession: null
        });
        
        localStorage.removeItem('auth-storage');
        sessionStorage.removeItem('auth-storage');

        
        setTimeout(() => {
          window.location.href = '/';
        }, 100);

        console.warn('User logged out.')
      },
      
      fetchUserSession: async () => {
        try {
          const response = await fetch('https://api.darelisme.my.id/dws/user?loginWithCookies=true', {
            method: 'GET',
            credentials: 'include',
          });
          
          if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
              set({ 
                accessToken: null, 
                refreshToken: null, 
                isAuthenticated: false,
                userSession: null
              });
            }
            throw new Error('Failed to fetch user session');
          }
          
          const userSession = await response.json();
          const userSessionData = userSession.data;

          set({ userSession: userSessionData, isAuthenticated: true });
          return userSessionData;
        } catch (error) {
          console.error('Error fetching user session:', error);
          return null;
        }
      },
    }),
    {
      name: "auth-storage",
    }
  )
);