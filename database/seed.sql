-- =============================================
-- Seed Data for Employee Management System
-- Run this AFTER schema.sql in Supabase SQL Editor
-- =============================================

-- Seed Departments
INSERT INTO departments (id, name, description) VALUES
  ('a1b2c3d4-e5f6-4a5b-8c7d-9e0f1a2b3c4d', 'Engineering', 'Software development and engineering team'),
  ('b2c3d4e5-f6a7-4b5c-8d7e-0f1a2b3c4d5e', 'Human Resources', 'HR management and recruitment'),
  ('c3d4e5f6-a7b8-4c5d-8e7f-1a2b3c4d5e6f', 'Marketing', 'Marketing strategy and brand management'),
  ('d4e5f6a7-b8c9-4d5e-8f70-2a3b4c5d6e7f', 'Finance', 'Financial planning and accounting'),
  ('e5f6a7b8-c9d0-4e5f-9071-3a4b5c6d7e8f', 'Operations', 'Business operations and logistics'),
  ('f6a7b8c9-d0e1-4f50-a172-4a5b6c7d8e9f', 'Sales', 'Sales team and client relations')
ON CONFLICT (id) DO NOTHING;

-- Seed Employees
INSERT INTO employees (employee_id, first_name, last_name, email, phone, department_id, position, salary, hire_date, status, date_of_birth, address) VALUES
  ('EMP-001', 'Rahul', 'Sharma', 'rahul.sharma@company.com', '+91-9876543210', 'a1b2c3d4-e5f6-4a5b-8c7d-9e0f1a2b3c4d', 'Senior Software Engineer', 95000.00, '2022-03-15', 'Active', '1992-05-14', '42 MG Road, Bangalore, Karnataka'),
  ('EMP-002', 'Priya', 'Patel', 'priya.patel@company.com', '+91-9876543211', 'b2c3d4e5-f6a7-4b5c-8d7e-0f1a2b3c4d5e', 'HR Manager', 78000.00, '2021-07-01', 'Active', '1990-11-22', '15 Park Street, Mumbai, Maharashtra'),
  ('EMP-003', 'Amit', 'Kumar', 'amit.kumar@company.com', '+91-9876543212', 'c3d4e5f6-a7b8-4c5d-8e7f-1a2b3c4d5e6f', 'Marketing Lead', 72000.00, '2023-01-10', 'Active', '1994-08-30', '88 Anna Salai, Chennai, Tamil Nadu'),
  ('EMP-004', 'Sneha', 'Reddy', 'sneha.reddy@company.com', '+91-9876543213', 'a1b2c3d4-e5f6-4a5b-8c7d-9e0f1a2b3c4d', 'Frontend Developer', 68000.00, '2023-06-20', 'Active', '1996-02-10', '23 Jubilee Hills, Hyderabad, Telangana'),
  ('EMP-005', 'Vikram', 'Singh', 'vikram.singh@company.com', '+91-9876543214', 'd4e5f6a7-b8c9-4d5e-8f70-2a3b4c5d6e7f', 'Financial Analyst', 65000.00, '2022-09-05', 'On Leave', '1993-12-18', '56 Sector 17, Chandigarh'),
  ('EMP-006', 'Ananya', 'Gupta', 'ananya.gupta@company.com', '+91-9876543215', 'e5f6a7b8-c9d0-4e5f-9071-3a4b5c6d7e8f', 'Operations Manager', 82000.00, '2020-11-12', 'Active', '1989-07-25', '12 Civil Lines, Delhi'),
  ('EMP-007', 'Rohan', 'Mehta', 'rohan.mehta@company.com', '+91-9876543216', 'f6a7b8c9-d0e1-4f50-a172-4a5b6c7d8e9f', 'Sales Executive', 55000.00, '2024-02-01', 'Active', '1997-03-08', '78 Law Garden, Ahmedabad, Gujarat'),
  ('EMP-008', 'Kavita', 'Nair', 'kavita.nair@company.com', '+91-9876543217', 'a1b2c3d4-e5f6-4a5b-8c7d-9e0f1a2b3c4d', 'Backend Developer', 72000.00, '2022-04-18', 'Active', '1995-09-14', '34 Marine Drive, Kochi, Kerala'),
  ('EMP-009', 'Arjun', 'Desai', 'arjun.desai@company.com', '+91-9876543218', 'c3d4e5f6-a7b8-4c5d-8e7f-1a2b3c4d5e6f', 'Content Strategist', 58000.00, '2023-08-22', 'Inactive', '1991-01-05', '90 FC Road, Pune, Maharashtra'),
  ('EMP-010', 'Deepika', 'Joshi', 'deepika.joshi@company.com', '+91-9876543219', 'b2c3d4e5-f6a7-4b5c-8d7e-0f1a2b3c4d5e', 'Recruiter', 52000.00, '2024-01-15', 'Active', '1998-06-20', '45 Banjara Hills, Hyderabad, Telangana')
ON CONFLICT (employee_id) DO NOTHING;

-- Seed a default admin user (password: admin123 - bcrypt hashed)
INSERT INTO users (name, email, password, role) VALUES
  ('Admin User', 'admin@company.com', '$2a$12$BEP.ckvBdTrrw.sC4tiAfOOkFCfFBbCVdhp.4OBIE6cnK3MiVpLja', 'admin')
ON CONFLICT (email) DO NOTHING;
