'use client';

import { SessionProvider } from 'next-auth/react';
import RoleThemeProvider from './RoleThemeProvider';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <RoleThemeProvider />
      {children}
    </SessionProvider>
  );
}
