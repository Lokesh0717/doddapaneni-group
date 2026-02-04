'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function RecordDeveloperPage() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const lastPathRef = useRef<string | null>(null);

  useEffect(() => {
    if (status !== 'authenticated' || session?.user?.role !== 'DEVELOPER' || !pathname) return;
    if (lastPathRef.current === pathname) return;
    lastPathRef.current = pathname;

    fetch('/api/developer-activity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: pathname }),
    }).catch(() => {});
  }, [pathname, session?.user?.role, status]);

  return null;
}
