const { supabaseAdmin } = require('../config/supabase');

/**
 * Business logic for department management.
 */

const getDepartments = async () => {
  const { data, error } = await supabaseAdmin
    .from('departments')
    .select('*, employees(count)')
    .order('name', { ascending: true });

  if (error) throw error;

  return (data || []).map((dept) => ({
    ...dept,
    employee_count: dept.employees?.[0]?.count || 0,
  }));
};

const getDepartmentById = async (departmentId) => {
  const { data, error } = await supabaseAdmin
    .from('departments')
    .select('*, employees(count)')
    .eq('id', departmentId)
    .single();

  if (error || !data) {
    const err = new Error('Department not found.');
    err.statusCode = 404;
    throw err;
  }

  return {
    ...data,
    employee_count: data.employees?.[0]?.count || 0,
  };
};

const createDepartment = async ({ name, description }) => {
  const { data, error } = await supabaseAdmin
    .from('departments')
    .insert([{ name, description }])
    .select()
    .single();

  if (error) {
    if (error.code === '23505') {
      const err = new Error('A department with this name already exists.');
      err.statusCode = 409;
      throw err;
    }
    throw error;
  }

  return data;
};

const updateDepartment = async (departmentId, { name, description }) => {
  const { data, error } = await supabaseAdmin
    .from('departments')
    .update({ name, description, updated_at: new Date().toISOString() })
    .eq('id', departmentId)
    .select()
    .single();

  if (error) throw error;
  if (!data) {
    const err = new Error('Department not found.');
    err.statusCode = 404;
    throw err;
  }

  return data;
};

const deleteDepartment = async (departmentId) => {
  // Do not allow deleting a department that still has employees.
  const { data: employees } = await supabaseAdmin
    .from('employees')
    .select('id')
    .eq('department_id', departmentId)
    .limit(1);

  if (employees && employees.length > 0) {
    const err = new Error('Cannot delete department with assigned employees. Reassign employees first.');
    err.statusCode = 400;
    throw err;
  }

  const { error } = await supabaseAdmin
    .from('departments')
    .delete()
    .eq('id', departmentId);

  if (error) throw error;
};

module.exports = {
  getDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
};
