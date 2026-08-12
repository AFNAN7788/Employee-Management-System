const authService = require('../services/authService');
const { sendSuccess, sendError } = require('../utils/responseHandler');

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const user = await authService.registerUser(req.body);
    const token = authService.signToken(user);

    return sendSuccess(res, { user, token }, 'Registration successful.', 201);
  } catch (error) {
    console.error('Register error:', error);
    return sendError(res, error.message || 'Registration failed.', error.statusCode || 500);
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const user = await authService.loginUser(req.body);
    const token = authService.signToken(user);

    return sendSuccess(res, { user, token }, 'Login successful.');
  } catch (error) {
    console.error('Login error:', error);
    return sendError(res, error.message || 'Login failed.', error.statusCode || 500);
  }
};

// GET /api/auth/me
const getMe = async (req, res) => {
  try {
    const user = await authService.getUserById(req.user.id);
    return sendSuccess(res, user);
  } catch (error) {
    console.error('GetMe error:', error);
    return sendError(res, error.message || 'Could not fetch user.', error.statusCode || 500);
  }
};

// PUT /api/auth/profile
const updateProfile = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await authService.updateProfile(req.user.id, { name, email, password });
    return sendSuccess(res, user, 'Profile updated successfully.');
  } catch (error) {
    console.error('UpdateProfile error:', error);
    return sendError(res, error.message || 'Failed to update profile.', error.statusCode || 500);
  }
};

module.exports = { register, login, getMe, updateProfile };
