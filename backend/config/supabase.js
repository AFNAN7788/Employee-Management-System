const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '⚠️  SUPABASE_URL or SUPABASE_ANON_KEY is not set. Database operations will fail.'
  );
}

// Public client (uses anon key, respects RLS)
const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Admin client (uses service role key, bypasses RLS)
const supabaseAdmin = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

module.exports = { supabase, supabaseAdmin };



// const { createClient } = require('@supabase/supabase-js');

// const supabaseUrl = process.env.SUPABASE_URL;
// const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

// if (!supabaseUrl || !supabaseAnonKey) {
//   console.warn(
//     '⚠️ SUPABASE_URL or SUPABASE_ANON_KEY is not set. Database operations will fail.'
//   );
// }

// // Public client using Supabase Publishable/Anon key
// const supabase =
//   supabaseUrl && supabaseAnonKey
//     ? createClient(supabaseUrl, supabaseAnonKey)
//     : null;

// module.exports = { supabase };