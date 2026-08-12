const { supabaseAdmin } = require('../config/supabase');

/**
 * Business logic for employee management.
 * All Supabase queries for employees live here.
 */

// Human-friendly employee code, e.g. EMP-M8X2K4T9
const generateEmployeeId = () => {
  const datePart = Date.now().toString(36).toUpperCase();
  return `EMP-${datePart.slice(-6)}${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
};

const getEmployees = async ({ page = 1, limit = 10, search = '', department = '', status = '', sortBy = 'created_at', sortOrder = 'desc' }) => {
  const offset = (parseInt(page) - 1) * parseInt(limit);

  // A malformed UUID would make PostgREST throw; guard it with a clean empty result.
  const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (department && !UUID_PATTERN.test(department)) {
    return { data: [], count: 0 };
  }

  let query = supabaseAdmin
    .from('employees')
    .select('*, departments(name)', { count: 'exact' });

  if (search) {
    // Split into words so a full name like "Ali Khan" matches employees
    // whose first/last name/email/employee_id contain EVERY word.
    // Each chained .or() is ANDed by PostgREST, so all words must match.
    const words = String(search).trim().split(/\s+/).filter(Boolean);
    for (const word of words) {
      query = query.or(
        `first_name.ilike.%${word}%,last_name.ilike.%${word}%,email.ilike.%${word}%,employee_id.ilike.%${word}%`
      );
    }
  }

  if (department) {
    query = query.eq('department_id', department);
  }

  if (status) {
    query = query.eq('status', status);
  }

  query = query
    .order(sortBy, { ascending: sortOrder === 'asc' })
    .range(offset, offset + parseInt(limit) - 1);

  const { data, error, count } = await query;

  if (error) throw error;

  return { data, count };
};

const getEmployeeById = async (employeeId) => {
  const { data, error } = await supabaseAdmin
    .from('employees')
    .select('*, departments(name)')
    .eq('id', employeeId)
    .single();

  if (error || !data) {
    const err = new Error('Employee not found.');
    err.statusCode = 404;
    throw err;
  }

  return data;
};

const createEmployee = async (payload) => {
  const employeeId = generateEmployeeId();

  const { data, error } = await supabaseAdmin
    .from('employees')
    .insert([
      {
        employee_id: employeeId,
        first_name: payload.first_name,
        last_name: payload.last_name,
        email: payload.email,
        phone: payload.phone,
        department_id: payload.department_id,
        position: payload.position,
        salary: parseFloat(payload.salary),
        hire_date: payload.hire_date || new Date().toISOString().slice(0, 10),
        status: payload.status || 'Active',
        date_of_birth: payload.date_of_birth,
        address: payload.address,
      },
    ])
    .select('*, departments(name)')
    .single();

  if (error) {
    if (error.code === '23505') {
      const err = new Error('An employee with this email already exists.');
      err.statusCode = 409;
      throw err;
    }
    throw error;
  }

  return data;
};

const updateEmployee = async (employeeId, payload) => {
  const updateData = {};
  if (payload.first_name !== undefined) updateData.first_name = payload.first_name;
  if (payload.last_name !== undefined) updateData.last_name = payload.last_name;
  if (payload.email !== undefined) updateData.email = payload.email;
  if (payload.phone !== undefined) updateData.phone = payload.phone;
  if (payload.department_id !== undefined) updateData.department_id = payload.department_id;
  if (payload.position !== undefined) updateData.position = payload.position;
  if (payload.salary !== undefined) updateData.salary = parseFloat(payload.salary);
  if (payload.hire_date !== undefined) updateData.hire_date = payload.hire_date;
  if (payload.status !== undefined) updateData.status = payload.status;
  if (payload.date_of_birth !== undefined) updateData.date_of_birth = payload.date_of_birth;
  if (payload.address !== undefined) updateData.address = payload.address;
  updateData.updated_at = new Date().toISOString();

  const { data, error } = await supabaseAdmin
    .from('employees')
    .update(updateData)
    .eq('id', employeeId)
    .select('*, departments(name)')
    .single();

  if (error) throw error;
  if (!data) {
    const err = new Error('Employee not found.');
    err.statusCode = 404;
    throw err;
  }

  return data;
};

const deleteEmployee = async (employeeId) => {
  // Grab the name first so we can build a meaningful audit message.
  const { data: employee } = await supabaseAdmin
    .from('employees')
    .select('first_name, last_name')
    .eq('id', employeeId)
    .single();

  const { error } = await supabaseAdmin
    .from('employees')
    .delete()
    .eq('id', employeeId);

  if (error) throw error;

  return employee;
};

module.exports = {
  generateEmployeeId,
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};
