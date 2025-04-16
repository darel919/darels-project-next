"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import Cookies from 'js-cookie';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      userSession: null,
      isLoading: true,
      
      isSuperadmin: (state) => {
        return state.userSession?.user_metadata?.role === 'superadmin';
      },

      handleAuthSuccess: (userSessionData) => {
        if (!userSessionData) return;
        
        set({ 
          userSession: userSessionData,
          isAuthenticated: true,
          isLoading: false
        });
        
        const userData = {
          id: userSessionData.user.id,
          email: userSessionData.user.email,
          provider_id: userSessionData.user.user_metadata.provider_id,
          user_metadata: {
            provider_id: userSessionData.user.user_metadata.provider_id,
            full_name: userSessionData.user.user_metadata.full_name,
            avatar_url: userSessionData.user.user_metadata.avatar_url,
            role: userSessionData.user.user_metadata.role
          }
        };

        const isSecureContext = window.location.protocol === 'https:';
        
        Cookies.set('user-session', JSON.stringify(userData), {
          path: '/',
          sameSite: 'lax',
          secure: isSecureContext
        });

        localStorage.setItem('user-session', JSON.stringify(userData));
      },

      clearAuth: async () => {
        const domains = ['.darelisme.my.id', 'localhost', 'server.drl'];
        const paths = ['/', '/auth'];
        
        domains.forEach(domain => {
          paths.forEach(path => {
            Cookies.remove('user-session', { domain, path });
          });
        });

        localStorage.removeItem('user-session');
        localStorage.removeItem('auth-storage');
        sessionStorage.clear();

        set({
          isAuthenticated: false,
          userSession: null,
          isLoading: false
        });
      },

      fetchUserSession: async () => {
        try {
          set({ isLoading: true });

          const storedSession = localStorage.getItem('user-session');
          if (storedSession) {
            try {
              const userData = JSON.parse(storedSession);
              if (userData?.id && userData?.provider_id) {
                set({
                  userSession: { user: userData },
                  isAuthenticated: true,
                  isLoading: false
                });
                return { user: userData };
              }
            } catch (e) {
              console.error('Invalid stored session:', e);
            }
          }

          const response = await fetch(process.env.NEXT_PUBLIC_API_BASE_PATH_URL+'/dws/user?loginWithCookies=true', {
            credentials: 'include'
          });

          if (!response.ok) {
            throw new Error('Failed to fetch user session');
          }

          const data = await response.json();
          const userSessionData = data.data;

          get().handleAuthSuccess(userSessionData);
          return userSessionData;
        } catch (error) {
          console.error('Error fetching user session:', error);
          await get().clearAuth();
          return null;
        } finally {
          set({ isLoading: false });
        }
      },

      initializeAuth: async () => {
        const currentStore = get();
        if (currentStore.isAuthenticated && currentStore.userSession) {
          set({ isLoading: false });
          return currentStore.userSession;
        }

        return await currentStore.fetchUserSession();
      }
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ 
        isAuthenticated: state.isAuthenticated,
        userSession: state.userSession
      })
    }
  )
);