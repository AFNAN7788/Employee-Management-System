// Shared app-wide constants.

export const EMPLOYEE_STATUSES = ['Active', 'On Leave', 'Inactive', 'Terminated'];

export const USER_ROLES = ['admin', 'hr', 'manager'];

export const DEFAULT_PAGE_SIZE = 10;

export const SORT_OPTIONS = [
  { value: 'created_at', label: 'Date Added' },
  { value: 'first_name', label: 'First Name' },
  { value: 'last_name', label: 'Last Name' },
  { value: 'salary', label: 'Salary' },
  { value: 'hire_date', label: 'Hire Date' },
];

export const STATUS_COLORS = {
  Active: 'success',
  'On Leave': 'warning',
  Inactive: 'danger',
};
