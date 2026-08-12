const express = require('express');
const router = express.Router();
const { getStats } = require('../controllers/dashboardController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/stats', getStats);

module.exports = router;
