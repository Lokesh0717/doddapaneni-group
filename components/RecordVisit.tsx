'use client';

import { useEffect, useRef } from 'react';

export default function RecordVisit() {
  const recorded = useRef(false);

  useEffect(() => {
    if (recorded.current) return;
    recorded.current = true;
    fetch('/api/visit', { method: 'POST' }).catch(() => {});
  }, []);

  return null;
}
