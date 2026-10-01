const { createClient } = require('@supabase/supabase-js');
const env = require('./env');

if (!env.SUPABASE_URL || !env.SUPABASE_KEY) {
  console.warn('Missing SUPABASE_URL or SUPABASE_KEY. Database connections will fail.');
}

const supabase = createClient(env.SUPABASE_URL || 'https://placeholder.supabase.co', env.SUPABASE_KEY || 'placeholder');

module.exports = supabase;
