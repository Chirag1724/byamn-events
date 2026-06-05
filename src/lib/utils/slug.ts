const ALPHANUMERIC = 'abcdefghijklmnopqrstuvwxyz0123456789';

function randomSuffix(length: number): string {
  return Array.from({ length }, () =>
    ALPHANUMERIC.charAt(Math.floor(Math.random() * ALPHANUMERIC.length))
  ).join('');
}

export function generateSlug(title: string): string {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')   // remove non-alphanumeric (keep spaces & hyphens)
    .trim()
    .replace(/[\s-]+/g, '-')        // collapse spaces/hyphens to single hyphen
    .replace(/^-+|-+$/g, '');       // strip leading/trailing hyphens

  const suffix = randomSuffix(4);
  return `${base}-${suffix}`;
}
