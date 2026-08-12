const express = require('express');
const router = express.Router();
const {
  getDepartments,
  getDepartment,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} = require('../controllers/departmentController');
const authMiddleware = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/roleMiddleware');
const { validate } = require('../middleware/validateMiddleware');

const departmentRules = {
  name: { required: true, label: 'Department name', minLength: 2 },
};

router.use(authMiddleware);

router.get('/', getDepartments);
router.get('/:id', getDepartment);
router.post('/', requireAdmin, validate(departmentRules), createDepartment);
router.put('/:id', requireAdmin, updateDepartment);
router.delete('/:id', requireAdmin, deleteDepartment);

module.exports = router;
