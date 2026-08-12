const { supabaseAdmin } = require('../config/supabase');

/**
 * Business logic for the dashboard statistics.
 */

const getStats = async () => {
  // Employee counts by status
  const { count: totalEmployees } = await supabaseAdmin
    .from('employees')
    .select('*', { count: 'exact', head: true });

  const { count: activeEmployees } = await supabaseAdmin
    .from('employees')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'Active');

  const { count: onLeave } = await supabaseAdmin
    .from('employees')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'On Leave');

  const { count: inactiveEmployees } = await supabaseAdmin
    .from('employees')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'Inactive');

  // Full status breakdown (incl. Terminated) for the status chart
  const { data: statusRows } = await supabaseAdmin
    .from('employees')
    .select('status');

  const statusCounts = (statusRows || []).reduce((acc, row) => {
    acc[row.status] = (acc[row.status] || 0) + 1;
    return acc;
  }, {});

  const statusStats = Object.entries(statusCounts).map(([status, count]) => ({
    status,
    count,
  }));

  // Departments + per-department headcount
  const { data: departments } = await supabaseAdmin
    .from('departments')
    .select('id, name, employees(count)')
    .order('name');

  const departmentStats = (departments || []).map((d) => ({
    id: d.id,
    name: d.name,
    count: d.employees?.[0]?.count || 0,
  }));

  const { count: totalDepartments } = await supabaseAdmin
    .from('departments')
    .select('*', { count: 'exact', head: true });

  // Salary statistics over active employees
  const { data: salaryData } = await supabaseAdmin
    .from('employees')
    .select('salary')
    .eq('status', 'Active');

  const salaries = (salaryData || []).map((e) => e.salary);
  const totalSalary = salaries.reduce((a, b) => a + b, 0);
  const avgSalary = salaries.length > 0 ? totalSalary / salaries.length : 0;

  // Recent activity trail
  const { data: recentActivity } = await supabaseAdmin
    .from('activity_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10);

  return {
    totalEmployees: totalEmployees || 0,
    activeEmployees: activeEmployees || 0,
    onLeave: onLeave || 0,
    inactiveEmployees: inactiveEmployees || 0,
    totalDepartments: totalDepartments || 0,
    departmentStats,
    statusStats,
    salaryStats: {
      total: totalSalary,
      average: Math.round(avgSalary * 100) / 100,
      min: salaries.length > 0 ? Math.min(...salaries) : 0,
      max: salaries.length > 0 ? Math.max(...salaries) : 0,
    },
    recentActivity: recentActivity || [],
  };
};

module.exports = { getStats };
