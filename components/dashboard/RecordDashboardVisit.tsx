'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

/**
 * Extracts dashboard path segment from pathname, e.g.:
 * /en/dashboard/super-admin -> super-admin
 * /en/dashboard/employees -> employees
 * /en/dashboard -> dashboard
 */
function getDashboardPath(pathname: string | null): string | null {
  if (!pathname) return null;
  const match = pathname.match(/\/dashboard(?:\/([^/]+))?/);
  if (!match) return null;
  return match[1] ?? 'dashboard';
}

export default function RecordDashboardVisit() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const lastPathRef = useRef<string | null>(null);

  useEffect(() => {
    if (status !== 'authenticated' || !session?.user?.role || !pathname) return;

    const path = getDashboardPath(pathname);
    if (!path) return;
    if (lastPathRef.current === path) return;
    lastPathRef.current = path;

    fetch('/api/dashboard-visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path }),
    }).catch(() => {});
  }, [pathname, session?.user?.role, status]);

  return null;
}
