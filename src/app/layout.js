import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { Suspense } from 'react';

import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Loading from './loading';

import Script from 'next/script';
import {GoogleAnalytics} from '@next/third-parties/google'
const clarityCode = `(function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_ANALYTICS_CLARITY_ID}");`


export const metadata = {
  title: "darel's Projects",
  description: "Welcome to darel's Projects. This is a collection of various projects and experiments.",
  metadataBase: new URL('https://projects.darelisme.my.id'),
  openGraph: {
    title: "darel's Projects",
    description: "Welcome to darel's Projects. This is a collection of various projects and experiments.",
    url: 'https://projects.darelisme.my.id',
    siteName: "darel's Projects",
    images: [
      {
        url: '/favicon.ico',
        width: 36,
        height: 36,
      },
    ],
  },
};

export default function RootLayout({ 
  children 
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <head>
        <Script id="ms-clarity" strategy="beforeInteractive">
          {clarityCode}
        </Script>
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_ANALYTICS_GA_ID} />
      </head>
      <body className="font-sans">
        <Navbar/>
        <Suspense fallback={<Loading />}>
          {children}
        </Suspense>
        <Footer/>
      </body>
    </html>
  );
}
