const express = require('express');
const router = express.Router();
const {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} = require('../controllers/employeeController');
const authMiddleware = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/roleMiddleware');
const { validate } = require('../middleware/validateMiddleware');

const employeeRules = {
  first_name: { required: true, label: 'First name', minLength: 2 },
  last_name: { required: true, label: 'Last name', minLength: 2 },
  email: { required: true, label: 'Email', isEmail: true },
  department_id: { required: true, label: 'Department' },
  position: { required: true, label: 'Position' },
  salary: { required: true, label: 'Salary', isNumber: true, min: 0 },
};

router.use(authMiddleware);

router.get('/', getEmployees);
router.get('/:id', getEmployee);
router.post('/', requireAdmin, validate(employeeRules), createEmployee);
router.put('/:id', requireAdmin, updateEmployee);
router.delete('/:id', requireAdmin, deleteEmployee);

module.exports = router;
