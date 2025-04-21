"use client";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import ErrorState from "@/components/ErrorState";

const VideoState = dynamic(() => import("@/components/VideoState"), { ssr: false });

export default function StatusPage() {
  const searchParams = useSearchParams();
  const videoId = searchParams.get("v");

  return (
    <section className="min-h-screen pt-20 px-6 sm:px-10 pb-20">
      <h1 className="text-4xl font-bold mb-8 font-mono">Video Processing Status</h1>
      {videoId ? (
        <VideoState videoId={videoId} />
      ) : (
        <ErrorState message="No video ID provided." />
      )}
    </section>
  );
}
