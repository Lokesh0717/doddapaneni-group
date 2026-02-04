/**
 * Whenever any moment is recorded in the app, use date + time in IST and ET (24-hour).
 * All recorded timestamps should be stored/displayed with both time zones and the date.
 */
const IST_ZONE = 'Asia/Kolkata';
const ET_ZONE = 'America/New_York';

/** Date + time, 24-hour. Use for all recorded moments. */
const FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  dateStyle: 'medium',
  timeStyle: 'short',
  hour12: false,
};

/** Format date + time in IST (e.g. "1 Feb 2026, 15:45 IST"). */
export function formatInIST(date: Date): string {
  return date.toLocaleString('en-IN', { ...FORMAT_OPTIONS, timeZone: IST_ZONE }) + ' IST';
}

/** Format date + time in ET (e.g. "Feb 1, 2026, 05:15 ET"). */
export function formatInET(date: Date): string {
  return date.toLocaleString('en-US', { ...FORMAT_OPTIONS, timeZone: ET_ZONE }) + ' ET';
}

/** @deprecated Use formatInET. Kept for backward compatibility. */
export function formatInUSAEastern(date: Date): string {
  return formatInET(date);
}

/** Return date + time in both IST and ET for any recorded moment. */
export function formatDateISTAndET(date: Date): { ist: string; et: string } {
  return {
    ist: formatInIST(date),
    et: formatInET(date),
  };
}

/** @deprecated Use formatDateISTAndET. */
export function formatDateISTAndUSA(date: Date): { ist: string; usa: string } {
  const { ist, et } = formatDateISTAndET(date);
  return { ist, usa: et };
}
