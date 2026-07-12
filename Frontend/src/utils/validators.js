import { GITHUB_URL_PATTERN, CSV_ACCEPT } from './constants';

/**
 * Validate email format
 */
export function isValidEmail(email) {
  if (!email) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Validate GitHub repository URL
 */
export function isValidGitHubUrl(url) {
  if (!url) return false;
  return GITHUB_URL_PATTERN.test(url);
}

/**
 * Validate that a file is a CSV
 */
export function isValidCSVFile(file) {
  if (!file) return false;
  const acceptTypes = CSV_ACCEPT.split(',');
  return (
    acceptTypes.includes(file.type) ||
    file.name.toLowerCase().endsWith('.csv')
  );
}

/**
 * Validate required field (non-empty string)
 */
export function isRequired(value) {
  if (typeof value === 'string') return value.trim().length > 0;
  return value != null;
}

/**
 * Validate minimum length
 */
export function hasMinLength(value, min) {
  if (!value) return false;
  return value.trim().length >= min;
}

/**
 * Validate a mark is within the 30-100 scale
 */
export function isValidMark(value) {
  const num = Number(value);
  return !isNaN(num) && num >= 30 && num <= 100;
}

/**
 * Validate phone number (basic)
 */
export function isValidPhone(phone) {
  if (!phone) return false;
  return /^\+?[\d\s-()]{7,15}$/.test(phone);
}

/**
 * React Hook Form validation rules factory
 */
export const validationRules = {
  required: (msg = 'This field is required') => ({
    required: msg,
  }),
  email: (msg = 'Invalid email address') => ({
    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: msg },
  }),
  githubUrl: (msg = 'Must be a valid GitHub URL') => ({
    pattern: { value: GITHUB_URL_PATTERN, message: msg },
  }),
  minLength: (min, msg) => ({
    minLength: { value: min, message: msg || `Minimum ${min} characters` },
  }),
  maxLength: (max, msg) => ({
    maxLength: { value: max, message: msg || `Maximum ${max} characters` },
  }),
  mark: () => ({
    min: { value: 30, message: 'Mark must be at least 30' },
    max: { value: 100, message: 'Mark cannot exceed 100' },
  }),
};
