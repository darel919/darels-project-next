"use client";

import { useEffect } from 'react';
import Script from 'next/script';
import { GoogleAnalytics } from '@next/third-parties/google';

const clarityCode = `(function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_ANALYTICS_CLARITY_ID}");`;

export default function AnalyticsClient() {
  useEffect(() => {}, []);
  if (typeof window === 'undefined') return null;
  const isProd = process.env.NODE_ENV === 'production';
  const extHost = process.env.NEXT_PUBLIC_APP_EXT_BASE_URL?.replace(/^https?:\/\//, '');
  const pathname = window.location.pathname;
  if (!isProd || window.location.hostname !== extHost) return null;
  if (pathname === '/manage' || pathname.startsWith('/manage/')) return null;
  return (
    <>
      <Script id="ms-clarity" strategy="beforeInteractive">{clarityCode}</Script>
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_ANALYTICS_GA_ID} />
    </>
  );
}
