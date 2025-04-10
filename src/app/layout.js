import { Geist, Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const geist = Geist({ subsets: ['latin'] });

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

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={geist.className}>
        <Navbar/>
        <main>
          {children}
        </main>
        <Footer/>
      </body>
    </html>
  );
}
