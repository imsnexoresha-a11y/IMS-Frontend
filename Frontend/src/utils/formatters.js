/**
 * Format a date string to a readable format
 * @param {string|Date} date
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string}
 */
export function formatDate(date, options = {}) {
  if (!date) return '—';
  const defaults = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Intl.DateTimeFormat('en-US', { ...defaults, ...options }).format(
    new Date(date),
  );
}

/**
 * Format a date with time
 */
export function formatDateTime(date) {
  if (!date) return '—';
  return formatDate(date, { hour: '2-digit', minute: '2-digit' });
}

/**
 * Format a number as percentage
 * @param {number} value - 0 to 100
 * @param {number} decimals
 */
export function formatPercent(value, decimals = 1) {
  if (value == null) return '—';
  return `${Number(value).toFixed(decimals)}%`;
}

/**
 * Format large numbers with commas
 */
export function formatNumber(num) {
  if (num == null) return '—';
  return new Intl.NumberFormat('en-US').format(num);
}

/**
 * Format marks in the 30-100 scale
 */
export function formatMark(value) {
  if (value == null) return '—';
  return Number(value).toFixed(1);
}

/**
 * Get relative time string (e.g., "2 hours ago")
 */
export function timeAgo(date) {
  if (!date) return '—';
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
    }
  }
  return 'just now';
}

/**
 * Truncate a string to a max length
 */
export function truncate(str, maxLength = 50) {
  if (!str) return '';
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + '…';
}

/**
 * Get initials from a full name
 */
export function getInitials(name) {
  if (!name) return '?';
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Capitalize the first letter of a string
 */
export function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Format status strings for display (snake_case → Title Case)
 */
export function formatStatus(status) {
  if (!status) return '—';
  return status
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (l) => l.toUpperCase());
}
