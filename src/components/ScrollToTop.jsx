"use client";

import { useEffect } from 'react';

export default function ScrollToTop({ videoId }) {
  useEffect(() => {
    
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [videoId]);

  return null;
}