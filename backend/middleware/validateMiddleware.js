/**
 * Generic validation middleware factory.
 * Pass a schema object where keys are field names and values are validation rules.
 *
 * Supported rules:
 *  - required        field must be present and non-empty
 *  - minLength       minimum string length
 *  - maxLength       maximum string length
 *  - pattern         RegExp the value must match
 *  - isEmail         must look like an email
 *  - isNumber        must be numeric
 *  - isStrongPassword  8-16 chars, at least one uppercase letter + one special char
 *  - matches         must equal the value of another field (e.g. confirm password)
 *  - min             numeric minimum
 */
const validate = (rules) => {
  return (req, res, next) => {
    const errors = [];

    const STRONG_PASSWORD =
      /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;

    for (const [field, rule] of Object.entries(rules)) {
      const value = req.body[field];

      if (rule.required && (value === undefined || value === null || value === '')) {
        errors.push(`${rule.label || field} is required.`);
        continue;
      }

      if (value !== undefined && value !== null && value !== '') {
        if (rule.minLength && String(value).length < rule.minLength) {
          errors.push(`${rule.label || field} must be at least ${rule.minLength} characters.`);
        }
        if (rule.maxLength && String(value).length > rule.maxLength) {
          errors.push(`${rule.label || field} must be at most ${rule.maxLength} characters.`);
        }
        if (rule.pattern && !rule.pattern.test(String(value))) {
          errors.push(rule.patternMessage || `${rule.label || field} format is invalid.`);
        }
        if (rule.isEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value))) {
          errors.push(`${rule.label || field} must be a valid email address.`);
        }
        if (rule.isNumber && isNaN(Number(value))) {
          errors.push(`${rule.label || field} must be a number.`);
        }
        if (rule.min !== undefined && Number(value) < rule.min) {
          errors.push(`${rule.label || field} must be at least ${rule.min}.`);
        }
        if (rule.isStrongPassword && !STRONG_PASSWORD.test(String(value))) {
          errors.push(
            `${rule.label || field} must be 8-16 characters with at least one uppercase letter and one special character.`
          );
        }
        if (rule.matches && value !== req.body[rule.matches]) {
          errors.push(`${rule.label || field} does not match ${rule.matches}.`);
        }
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: 'Validation failed.', errors });
    }

    next();
  };
};

module.exports = { validate };
