const departmentService = require('../services/departmentService');
const { sendSuccess, sendError } = require('../utils/responseHandler');

// GET /api/departments
const getDepartments = async (req, res) => {
  try {
    const data = await departmentService.getDepartments();
    return sendSuccess(res, data);
  } catch (error) {
    console.error('GetDepartments error:', error);
    return sendError(res, 'Failed to fetch departments.');
  }
};

// GET /api/departments/:id
const getDepartment = async (req, res) => {
  try {
    const data = await departmentService.getDepartmentById(req.params.id);
    return sendSuccess(res, data);
  } catch (error) {
    console.error('GetDepartment error:', error);
    return sendError(res, error.message || 'Failed to fetch department.', error.statusCode || 500);
  }
};

// POST /api/departments
const createDepartment = async (req, res) => {
  try {
    const data = await departmentService.createDepartment(req.body);
    return sendSuccess(res, data, 'Department created successfully.', 201);
  } catch (error) {
    console.error('CreateDepartment error:', error);
    return sendError(res, error.message || 'Failed to create department.', error.statusCode || 500);
  }
};

// PUT /api/departments/:id
const updateDepartment = async (req, res) => {
  try {
    const data = await departmentService.updateDepartment(req.params.id, req.body);
    return sendSuccess(res, data, 'Department updated successfully.');
  } catch (error) {
    console.error('UpdateDepartment error:', error);
    return sendError(res, error.message || 'Failed to update department.', error.statusCode || 500);
  }
};

// DELETE /api/departments/:id
const deleteDepartment = async (req, res) => {
  try {
    await departmentService.deleteDepartment(req.params.id);
    return sendSuccess(res, null, 'Department deleted successfully.');
  } catch (error) {
    console.error('DeleteDepartment error:', error);
    return sendError(res, error.message || 'Failed to delete department.', error.statusCode || 500);
  }
};

module.exports = {
  getDepartments,
  getDepartment,
  createDepartment,
  updateDepartment,
  deleteDepartment,
};
