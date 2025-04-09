import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import Navbar from '../components/Navbar';


export const metadata = {
  title: "darel's Project ",
  description: "Where I share my projects and ideas",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="min-h-screen bg-background font-sans antialiased pt-16">
        <Navbar/>
        {children}
      </body>
    </html>
  );
}
