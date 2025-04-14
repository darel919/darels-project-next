"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Loading from '@/app/loading';

export default function LoadingRedirect({ url }) {
  const router = useRouter();
  
  useEffect(() => {
    router.push(url);
  }, [url, router]);
  
  return <Loading />;
}