import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';

import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';


export const metadata = {
  title: "darel's Projects",
  description: "Welcome to darel's Projects. This is a collection of various projects and experiments.",
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
      <body className="font-sans">
        <Navbar/>
        <main>
          {children}
        </main>
        <Footer/>
      </body>
    </html>
  );
}
