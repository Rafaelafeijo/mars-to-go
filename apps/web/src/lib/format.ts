/** "2024-05-20" → "20 MAY 2024" / "20 MAI 2024" (data badges, ADR-0023). */
export function badgeDate(iso: string, locale: string): string {
  const d = new Date(`${iso.slice(0, 10)}T12:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso;
  const month = new Intl.DateTimeFormat(locale, { month: 'short', timeZone: 'UTC' }).format(d).replace('.', '').toUpperCase();
  return `${d.getUTCDate()} ${month} ${d.getUTCFullYear()}`;
}

/** Long date for text: "May 10, 2024" / "10 de maio de 2024". */
export function longDate(iso: string, locale: string): string {
  const d = new Date(`${iso.slice(0, 10)}T12:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(d);
}

export function formatNumber(n: number, locale: string): string {
  return new Intl.NumberFormat(locale, { maximumFractionDigits: 4 }).format(n);
}

/** Respect the system "reduce motion" setting (CLAUDE.md rule 8). */
export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;
}
