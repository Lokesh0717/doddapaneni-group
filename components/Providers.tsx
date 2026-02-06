'use client';

import { SessionProvider } from 'next-auth/react';
import RoleThemeProvider from './RoleThemeProvider';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider
      // Reduce unnecessary refetches that might trigger errors
      refetchInterval={5 * 60} // Refetch every 5 minutes instead of default
      refetchOnWindowFocus={false}
      // Base URL for NextAuth endpoints
      basePath="/api/auth"
    >
      <RoleThemeProvider />
      {children}
    </SessionProvider>
  );
}
