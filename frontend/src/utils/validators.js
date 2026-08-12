// Client-side form validation helpers.

export const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value));

export const isRequired = (value) =>
  value !== undefined && value !== null && String(value).trim() !== '';

export const isMinLength = (value, min) => String(value).length >= min;

export const isNumber = (value) => value !== '' && !Number.isNaN(Number(value));

/**
 * Validate a values object against a rules map.
 * rules shape: { field: { required, minLength, maxLength, email, number } }
 * @returns {object} errors keyed by field (empty when valid).
 */
export function validate(values, rules) {
  const errors = {};

  for (const [field, rule] of Object.entries(rules)) {
    const value = values[field];

    if (rule.required && !isRequired(value)) {
      errors[field] = `${rule.label || field} is required.`;
      continue;
    }

    if (value && String(value).trim() !== '') {
      if (rule.email && !isEmail(value)) {
        errors[field] = `${rule.label || field} must be a valid email address.`;
      }
      if (rule.minLength && !isMinLength(value, rule.minLength)) {
        errors[field] = `${rule.label || field} must be at least ${rule.minLength} characters.`;
      }
      if (rule.number && !isNumber(value)) {
        errors[field] = `${rule.label || field} must be a number.`;
      }
    }
  }

  return errors;
}
