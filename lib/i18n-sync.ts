/**
 * Utilities for syncing and translating locale JSON files.
 */

export type LeafEntry = { path: string; value: string };

/**
 * Collect all leaf string paths and values from a nested object.
 * Paths use dot notation, e.g. "Home.heroTitle".
 */
export function getLeafKeys(obj: unknown, prefix = ''): LeafEntry[] {
  const entries: LeafEntry[] = [];
  if (obj === null || obj === undefined) return entries;
  if (typeof obj === 'object' && !Array.isArray(obj)) {
    for (const [key, val] of Object.entries(obj)) {
      const path = prefix ? `${prefix}.${key}` : key;
      if (typeof val === 'string') {
        entries.push({ path, value: val });
      } else if (typeof val === 'object' && val !== null) {
        entries.push(...getLeafKeys(val, path));
      }
    }
  }
  return entries;
}

/**
 * Set a nested key in an object using dot path. Creates intermediate objects.
 */
export function setNestedKey(obj: Record<string, unknown>, path: string, value: string): void {
  const parts = path.split('.');
  let current: Record<string, unknown> = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const key = parts[i];
    if (!(key in current) || typeof current[key] !== 'object' || current[key] === null) {
      current[key] = {};
    }
    current = current[key] as Record<string, unknown>;
  }
  current[parts[parts.length - 1]] = value;
}

/**
 * Get a nested value by dot path.
 */
export function getNestedKey(obj: unknown, path: string): string | undefined {
  const parts = path.split('.');
  let current: unknown = obj;
  for (const key of parts) {
    if (current === null || current === undefined || typeof current !== 'object') return undefined;
    current = (current as Record<string, unknown>)[key];
  }
  return typeof current === 'string' ? current : undefined;
}
