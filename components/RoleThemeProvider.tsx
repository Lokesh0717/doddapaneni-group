'use client';

import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { getThemeForRole } from '@/lib/theme';

const THEME_ATTR = 'data-theme';

/**
 * Applies role-based theme to the document by setting data-theme on <html>.
 * Theme CSS variables are defined in globals.css; use Tailwind classes
 * like bg-theme-primary, text-theme-accent, etc. in components.
 */
export default function RoleThemeProvider() {
  const { data: session, status } = useSession();

  useEffect(() => {
    const root = document.documentElement;
    const theme = status === 'authenticated' && session?.user?.role
      ? getThemeForRole(session.user.role)
      : undefined;

    if (theme) {
      root.setAttribute(THEME_ATTR, theme);
    } else {
      root.removeAttribute(THEME_ATTR);
    }
  }, [session?.user?.role, status]);

  return null;
}
