"use client";

import { useAuthStore } from "@/lib/authStore";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { formatRelativeTime } from "@/utils/timeUtils";

export default function DashboardPage() {
  const { clearAuth, userSession, initializeAuth } = useAuthStore();
  const [avatarError, setAvatarError] = useState(false);
  const router = useRouter();

  const formatLastSignIn = (dateString) => {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const formatCreatedAt = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return `${formatRelativeTime(dateString)} (${date.toLocaleDateString()})`;
  };

  useEffect(() => {
    initializeAuth();
  }, []);

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const handleLogout = async () => {
    await clearAuth();
    router.push('/');
  };

  if (!userSession) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return (
    <section className="flex min-h-screen flex-col items-center justify-center p-8">
    <h1 className="text-4xl font-bold mb-6">Your Profile</h1>
    <div className="bg-base-200 p-6 rounded-lg max-w-md w-full">
      <section>
        {userSession ? (
          <>
            <div className="mb-4">
              <h2 className="font-bold">Logged in as:</h2>
              <div className="mt-4 avatar flex items-center">
                {!avatarError ? (
                  <div className="w-16 rounded-full">
                    <img
                      src={userSession.user.user_metadata.avatar_url}
                      alt={userSession.user.user_metadata.full_name}
                      onError={() => setAvatarError(true)}
                    />
                  </div>
                ) : (
                  <div className="avatar avatar-placeholder">
                    <div className="bg-neutral text-neutral-content p-4 rounded-full w-16">
                      <span className="text-xl">{getInitials(userSession.user.user_metadata.full_name)}</span>
                    </div>
                  </div>
                )}
                <section className="ml-4 font-mono">
                  <p className="text-2xl">{userSession.user.user_metadata.full_name}</p>
                  <p className="text-xs my-1">{userSession.user.user_metadata.email}</p>
                  <section className="card bg-neutral py-2 px-4 rounded-lg my-2">
                    <p className="text-xs my-1">Last sign in: {formatLastSignIn(userSession.user.last_sign_in_at)}</p>
                    <p className="text-xs my-1">Created: {formatCreatedAt(userSession.user.created_at)}</p>
                  </section>
                </section>
              </div>
            </div>
            <button
              className="btn btn-error w-full mt-4"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <div className="alert alert-warning mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            <span>No user session data found in the current state.</span>
          </div>
        )}
      </section>
    </div>
  </section>
);
}