import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navbar from "@/components/ui/Navbar"



const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'True Feedback',
  description: 'Real feedback from real people.',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <Navbar/>
  );
}