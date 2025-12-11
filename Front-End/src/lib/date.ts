// Utilitários para parsing/formatacao de datas robusto
export function parseDateString(input?: string | null): Date | null {
  if (!input) return null;
  const s = String(input).trim();

  // Formato comum brasileiro: DD/MM/YYYY[ HH:mm:ss]
  const dmy = /^(\d{2})\/(\d{2})\/(\d{4})(?:[ T](\d{2}):(\d{2})(?::(\d{2}))?)?$/.exec(s);
  if (dmy) {
    const [, dd, mm, yyyy, hh = '00', min = '00', ss = '00'] = dmy;
    const iso = `${yyyy}-${mm}-${dd}T${hh}:${min}:${ss}`;
    const dt = new Date(iso);
    return isNaN(dt.getTime()) ? null : dt;
  }

  // Formato ISO sem 'T': YYYY-MM-DD HH:mm:ss
  const ymdSpace = /^(\d{4}-\d{2}-\d{2})[ T](\d{2}:\d{2}:\d{2})$/.exec(s);
  if (ymdSpace) {
    const iso = `${ymdSpace[1]}T${ymdSpace[2]}`;
    const dt = new Date(iso);
    return isNaN(dt.getTime()) ? null : dt;
  }

  // Microsoft JSON date: /Date(1234567890)/
  const msMatch = /\/Date\((\d+)(?:[+-]\d+)?\)\//.exec(s);
  if (msMatch) {
    const ms = Number(msMatch[1]);
    const dt = new Date(ms);
    return isNaN(dt.getTime()) ? null : dt;
  }

  // Try native parsing (ISO, RFC, etc.)
  const dt = new Date(s);
  if (!isNaN(dt.getTime())) return dt;

  const parsed = Date.parse(s);
  if (!isNaN(parsed)) return new Date(parsed);

  return null;
}

export function formatDateSafe(input?: string | null, options?: Intl.DateTimeFormatOptions, locale = 'pt-BR'): string {
  const d = parseDateString(input);
  if (!d) return input ?? '';
  return d.toLocaleString(locale, options as Intl.DateTimeFormatOptions);
}
