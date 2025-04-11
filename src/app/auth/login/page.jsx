"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/authStore";
import LoginButton from "@/components/LoginButton";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/profile");
    }
  }, [isAuthenticated, router]);

  const handleLoginSuccess = () => {
    router.push("/profile");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-xl font-mono font-bold mb-6">Login to DWS using your Google Account</h1>
      <LoginButton />
    </div>
  );
}