// Formatting helpers used across the UI.

/** Format a date string/Date as a readable date, e.g. "12 Aug 2026". */
export function formatDate(value, options = {}) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    ...options,
  });
}

/** Format a number as currency (default USD). */
export function formatCurrency(value) {
  const num = Number(value);
  if (Number.isNaN(num)) return '—';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(num);
}

/** "John Doe" -> "JD". Used for avatars. */
export function getInitials(firstName, lastName) {
  return `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase() || '?';
}

/** Build a full display name from parts, skipping empties. */
export function getFullName(firstName, lastName) {
  return [firstName, lastName].filter(Boolean).join(' ') || '—';
}
