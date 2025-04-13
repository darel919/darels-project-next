"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/authStore";
import LoginButton from "@/components/LoginButton";
import { useSearchParams, useRouter } from "next/navigation";

export default function LoginPage() {
  const { isAuthenticated } = useAuthStore();
  const searchParams = useSearchParams();
  const router = useRouter();
  const redirectPath = searchParams.get('redirect');

  useEffect(() => {
    if (isAuthenticated) {
      router.push(redirectPath || "/profile");
    }
  }, [isAuthenticated, redirectPath, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-xl font-mono font-bold mb-6">Login to DWS using your Google Account</h1>
      <LoginButton redirectPath={redirectPath} />
    </div>
  );
}