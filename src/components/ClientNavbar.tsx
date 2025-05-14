// components/ClientNavbar.tsx
"use client";

import { usePathname } from 'next/navigation';
import NewNavbar from '@/components/NewNavbar';

export default function ClientNavbar() {
  const pathname = usePathname();
  
  // Define paths where the Navbar should not be displayed
  const hideNavbarPaths = ['/signin', '/signup'];

  // Check if the current path is in the hideNavbarPaths array
  const showNavbar = !hideNavbarPaths.includes(pathname);

  return showNavbar ? <NewNavbar /> : null;
}