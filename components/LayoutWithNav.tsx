'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RecordVisit from '@/components/RecordVisit';

export default function LayoutWithNav({
  children,
  initialPathname = '',
}: {
  children: React.ReactNode;
  initialPathname?: string;
}) {
  const pathnameFromHook = usePathname();
  const pathname = pathnameFromHook ?? initialPathname;
  const hideNav = pathname.includes('/dashboard') || pathname.includes('/login');

  if (hideNav) {
    return <>{children}</>;
  }

  return (
    <>
      <RecordVisit />
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </>
  );
}
