const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { supabaseAdmin } = require('../config/supabase');

/**
 * Business logic for authentication.
 * Controllers call these functions; services talk to Supabase.
 */

const SALT_ROUNDS = 12;

const registerUser = async ({ name, email, password }) => {
  // Check if user already exists
  const { data: existing } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('email', email)
    .single();

  if (existing) {
    const error = new Error('User with this email already exists.');
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const { data: user, error } = await supabaseAdmin
    .from('users')
    .insert([{ name, email, password: hashedPassword, role: 'viewer' }])
    .select('id, name, email, role, created_at')
    .single();

  if (error) throw error;

  return user;
};

const loginUser = async ({ email, password }) => {
  const { data: user, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error || !user) {
    const err = new Error('Invalid email or password.');
    err.statusCode = 401;
    throw err;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const err = new Error('Invalid email or password.');
    err.statusCode = 401;
    throw err;
  }

  const { password: _removed, ...safeUser } = user;
  return safeUser;
};

const getUserById = async (userId) => {
  const { data: user, error } = await supabaseAdmin
    .from('users')
    .select('id, name, email, role, created_at')
    .eq('id', userId)
    .single();

  if (error || !user) {
    const err = new Error('User not found.');
    err.statusCode = 404;
    throw err;
  }

  return user;
};

const signToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

const updateProfile = async (userId, { name, email, password }) => {
  // Check email uniqueness if changing email
  if (email) {
    const { data: existing } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', email)
      .neq('id', userId)
      .single();

    if (existing) {
      const error = new Error('Email is already taken by another user.');
      error.statusCode = 409;
      throw error;
    }
  }

  const updateData = {};
  if (name) updateData.name = name;
  if (email) updateData.email = email;
  if (password) updateData.password = await bcrypt.hash(password, SALT_ROUNDS);
  updateData.updated_at = new Date().toISOString();

  const { data: user, error } = await supabaseAdmin
    .from('users')
    .update(updateData)
    .eq('id', userId)
    .select('id, name, email, role, created_at')
    .single();

  if (error) throw error;
  if (!user) {
    const err = new Error('User not found.');
    err.statusCode = 404;
    throw err;
  }

  return user;
};

module.exports = {
  registerUser,
  loginUser,
  getUserById,
  signToken,
  updateProfile,
};

// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const { supabase } = require('../config/supabase');

// /**
//  * Business logic for authentication.
//  * Controllers call these functions; services talk to Supabase.
//  */

// const SALT_ROUNDS = 12;

// const registerUser = async ({ name, email, password }) => {
//   // Check if user already exists
//   const { data: existing } = await supabase
//     .from('users')
//     .select('id')
//     .eq('email', email)
//     .single();

//   if (existing) {
//     const error = new Error('User with this email already exists.');
//     error.statusCode = 409;
//     throw error;
//   }

//   const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

//   const { data: user, error } = await supabase
//     .from('users')
//     .insert([{ name, email, password: hashedPassword, role: 'admin' }])
//     .select('id, name, email, role, created_at')
//     .single();

//   if (error) throw error;

//   return user;
// };

// const loginUser = async ({ email, password }) => {
//   const { data: user, error } = await supabase
//     .from('users')
//     .select('*')
//     .eq('email', email)
//     .single();

//   if (error || !user) {
//     const err = new Error('Invalid email or password.');
//     err.statusCode = 401;
//     throw err;
//   }

//   const isMatch = await bcrypt.compare(password, user.password);

//   if (!isMatch) {
//     const err = new Error('Invalid email or password.');
//     err.statusCode = 401;
//     throw err;
//   }

//   const { password: _removed, ...safeUser } = user;
//   return safeUser;
// };

// const getUserById = async (userId) => {
//   const { data: user, error } = await supabase
//     .from('users')
//     .select('id, name, email, role, created_at')
//     .eq('id', userId)
//     .single();

//   if (error || !user) {
//     const err = new Error('User not found.');
//     err.statusCode = 404;
//     throw err;
//   }

//   return user;
// };

// const signToken = (user) => {
//   return jwt.sign(
//     { id: user.id, email: user.email, role: user.role },
//     process.env.JWT_SECRET,
//     { expiresIn: '24h' }
//   );
// };

// module.exports = {
//   registerUser,
//   loginUser,
//   getUserById,
//   signToken,
// };
