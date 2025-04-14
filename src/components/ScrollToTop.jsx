"use client";

import { useEffect } from 'react';

export default function ScrollToTop({ videoId }) {
  useEffect(() => {
    
    setTimeout(()=> {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }, 350)
  }, [videoId]);

  return null;
}