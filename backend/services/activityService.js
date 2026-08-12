const { supabaseAdmin } = require('../config/supabase');

/**
 * Small helper service for writing to the activity_logs table.
 * Used by employee/department flows to keep an audit trail.
 */
const logActivity = async ({ action, entity, entity_id, description, user_id }) => {
  try {
    await supabaseAdmin.from('activity_logs').insert({
      action,
      entity,
      entity_id,
      description,
      user_id,
    });
  } catch (error) {
    // Logging should never break the main request.
    console.error('Activity log failed:', error.message);
  }
};

module.exports = { logActivity };
