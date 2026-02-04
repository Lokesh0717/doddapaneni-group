/**
 * Free translation using MyMemory API (no API key required).
 * https://mymemory.translated.net/doc/spec.php
 * Limit: ~500 bytes per request; daily limit without key. Uses chunking for long text.
 */

const MYMEMORY_URL = 'https://api.mymemory.translated.net/get';
const SOURCE_LOCALE = 'en';
const MAX_CHUNK_BYTES = 400;

function encodeUriComponentSafe(str: string): string {
  return encodeURIComponent(str);
}

function chunkText(text: string, maxBytes: number): string[] {
  const chunks: string[] = [];
  let remaining = text;
  while (remaining.length > 0) {
    if (Buffer.byteLength(remaining, 'utf8') <= maxBytes) {
      chunks.push(remaining);
      break;
    }
    let split = remaining.slice(0, Math.ceil(maxBytes / 2));
    const lastSpace = split.lastIndexOf(' ');
    if (lastSpace > maxBytes / 3) split = split.slice(0, lastSpace + 1);
    chunks.push(split);
    remaining = remaining.slice(split.length);
  }
  return chunks;
}

export async function translateText(
  text: string,
  targetLocale: string,
  sourceLocale: string = SOURCE_LOCALE
): Promise<string> {
  const trimmed = text.trim();
  if (!trimmed) return text;
  if (targetLocale === sourceLocale) return text;

  const langpair = `${sourceLocale}|${targetLocale}`;
  const chunks = chunkText(trimmed, MAX_CHUNK_BYTES);
  const translated: string[] = [];

  for (const chunk of chunks) {
    const url = `${MYMEMORY_URL}?q=${encodeUriComponentSafe(chunk)}&langpair=${encodeURIComponent(langpair)}`;
    const res = await fetch(url, { method: 'GET' });

    if (!res.ok) {
      throw new Error(`Translation failed (${res.status})`);
    }

    const data = (await res.json()) as { responseData?: { translatedText?: string }; responseStatus?: number };
    const translatedText = data?.responseData?.translatedText;
    if (typeof translatedText === 'string') {
      translated.push(translatedText);
    } else {
      translated.push(chunk);
    }
  }

  return translated.join(chunks.length > 1 ? ' ' : '');
}

/**
 * Delay helper to avoid rate limits.
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
