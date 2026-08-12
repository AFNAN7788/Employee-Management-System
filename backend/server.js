// server.js - Entry point for Express backend
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const { supabase } = require('./config/supabase');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/', (req, res) => {
  res.send('Employee Management System Backend is running');
});

// Test Supabase connection
async function testSupabaseConnection() {
  if (!supabase) {
    console.error('❌ Supabase client is not initialized. Check your .env file.');
    return;
  }

  const { error } = await supabase
    .from('departments')
    .select('id')
    .limit(1);

  if (error) {
    console.error('❌ Supabase connection failed:', error.message);
  } else {
    console.log('✅ Supabase connected successfully');
  }
}

app.listen(PORT, async () => {
  console.log(`Server listening on port ${PORT}`);
  await testSupabaseConnection();
});