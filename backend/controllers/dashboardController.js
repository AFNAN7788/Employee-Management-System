const dashboardService = require('../services/dashboardService');
const { sendSuccess, sendError } = require('../utils/responseHandler');

// GET /api/dashboard/stats
const getStats = async (req, res) => {
  try {
    const data = await dashboardService.getStats();
    return sendSuccess(res, data);
  } catch (error) {
    console.error('GetStats error:', error);
    return sendError(res, 'Failed to fetch dashboard statistics.');
  }
};

module.exports = { getStats };
