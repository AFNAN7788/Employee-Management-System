const employeeService = require('../services/employeeService');
const activityService = require('../services/activityService');
const { sendSuccess, sendError, sendPaginated } = require('../utils/responseHandler');

// GET /api/employees
const getEmployees = async (req, res) => {
  try {
    const { data, count } = await employeeService.getEmployees(req.query);
    return sendPaginated(res, data, count, parseInt(req.query.page) || 1, parseInt(req.query.limit) || 10);
  } catch (error) {
    console.error('GetEmployees error:', error);
    return sendError(res, 'Failed to fetch employees.');
  }
};

// GET /api/employees/:id
const getEmployee = async (req, res) => {
  try {
    const data = await employeeService.getEmployeeById(req.params.id);
    return sendSuccess(res, data);
  } catch (error) {
    console.error('GetEmployee error:', error);
    return sendError(res, error.message || 'Failed to fetch employee.', error.statusCode || 500);
  }
};

// POST /api/employees
const createEmployee = async (req, res) => {
  try {
    const data = await employeeService.createEmployee(req.body);

    await activityService.logActivity({
      action: 'CREATE',
      entity: 'employee',
      entity_id: data.id,
      description: `New employee ${data.first_name} ${data.last_name} added.`,
      user_id: req.user.id,
    });

    return sendSuccess(res, data, 'Employee created successfully.', 201);
  } catch (error) {
    console.error('CreateEmployee error:', error);
    return sendError(res, error.message || 'Failed to create employee.', error.statusCode || 500);
  }
};

// PUT /api/employees/:id
const updateEmployee = async (req, res) => {
  try {
    const data = await employeeService.updateEmployee(req.params.id, req.body);

    await activityService.logActivity({
      action: 'UPDATE',
      entity: 'employee',
      entity_id: data.id,
      description: `Employee ${data.first_name} ${data.last_name} updated.`,
      user_id: req.user.id,
    });

    return sendSuccess(res, data, 'Employee updated successfully.');
  } catch (error) {
    console.error('UpdateEmployee error:', error);
    return sendError(res, error.message || 'Failed to update employee.', error.statusCode || 500);
  }
};

// DELETE /api/employees/:id
const deleteEmployee = async (req, res) => {
  try {
    const deleted = await employeeService.deleteEmployee(req.params.id);

    if (deleted) {
      await activityService.logActivity({
        action: 'DELETE',
        entity: 'employee',
        entity_id: req.params.id,
        description: `Employee ${deleted.first_name} ${deleted.last_name} removed.`,
        user_id: req.user.id,
      });
    }

    return sendSuccess(res, null, 'Employee deleted successfully.');
  } catch (error) {
    console.error('DeleteEmployee error:', error);
    return sendError(res, 'Failed to delete employee.');
  }
};

module.exports = {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};
