import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Loading from './loading';
import AnalyticsClient from '@/components/AnalyticsClient';
import ScrollToTop from "../components/ScrollToTop";
import './globals.css';

export const metadata = {
  title: "darel's Projects",
  description: "Welcome to darel's Projects. This is a collection of my various projects and experiments.",
  metadataBase: new URL('https://projects.darelisme.my.id'),
  openGraph: {
    title: "darel's Projects",
    description: "Welcome to darel's Projects. This is a collection of my various projects and experiments.",
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
        <AnalyticsClient />
      </head>
      <body>
        <Navbar/>
        <ScrollToTop />
        <Suspense fallback={<Loading />}>
          {children}
        </Suspense>
        <Footer/>
      </body>
    </html>
  );
}
