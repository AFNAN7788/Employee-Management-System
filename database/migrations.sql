-- =============================================
-- Migration: sync an older database to the current schema.sql
-- Run ONLY IF your tables were created before these columns existed.
-- Run in the Supabase SQL Editor.
-- =============================================

-- users: add the 'role' column (defaults to 'viewer' for new users;
-- the seeded admin user keeps role 'admin')
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'viewer'
  CHECK (role IN ('admin', 'manager', 'viewer'));

-- employees: add missing columns
-- (added nullable first so existing rows don't break the ALTER)
ALTER TABLE employees ADD COLUMN IF NOT EXISTS employee_id VARCHAR(20);
ALTER TABLE employees ADD COLUMN IF NOT EXISTS first_name VARCHAR(50);
ALTER TABLE employees ADD COLUMN IF NOT EXISTS last_name VARCHAR(50);
ALTER TABLE employees ADD COLUMN IF NOT EXISTS date_of_birth DATE;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS hire_date DATE DEFAULT CURRENT_DATE;

-- If the employees table is EMPTY, you can safely tighten the new columns:
-- ALTER TABLE employees ALTER COLUMN employee_id SET NOT NULL;
-- ALTER TABLE employees ALTER COLUMN first_name   SET NOT NULL;
-- ALTER TABLE employees ALTER COLUMN last_name    SET NOT NULL;
-- ALTER TABLE employees ALTER COLUMN hire_date    SET NOT NULL;
