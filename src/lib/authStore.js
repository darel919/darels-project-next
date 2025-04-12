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
      },

      fetchUserSession: async () => {
        try {
          const response = await fetch('https://api.darelisme.my.id/dws/user?loginWithCookies=true', {
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
               localStorage.removeItem('auth-storage');
               sessionStorage.removeItem('auth-storage');
            }
            throw new Error(`Failed to fetch user session: ${response.statusText}`);
          }

          const userSession = await response.json();
          const userSessionData = userSession.data;

          set({ userSession: userSessionData, isAuthenticated: true });
          return userSessionData;
        } catch (error) {
          set({
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            userSession: null
          });
          localStorage.removeItem('auth-storage');
          sessionStorage.removeItem('auth-storage');
          return null;
        }
      },
    }),
    {
      name: "auth-storage",
    }
  )
);