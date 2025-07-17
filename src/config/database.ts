import dotenv from 'dotenv';

dotenv.config();

// Supabase configuration
export const supabaseConfig = {
  url: process.env.SUPABASE_URL || '',
  anonKey: process.env.SUPABASE_ANON_KEY || '',
  serviceKey: process.env.SUPABASE_SERVICE_KEY || ''
};

// TODO: Initialize Supabase client when we install the library
// import { createClient } from '@supabase/supabase-js';
// export const supabase = createClient(supabaseConfig.url, supabaseConfig.serviceKey);

console.log('Supabase configuration loaded');