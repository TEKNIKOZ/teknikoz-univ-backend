import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

// Supabase configuration
export const supabaseConfig = {
  url: process.env.SUPABASE_URL || '',
  anonKey: process.env.SUPABASE_ANON_KEY || '',
  serviceKey: process.env.SUPABASE_SERVICE_KEY || ''
};

// Initialize Supabase client
export const supabase = createClient(supabaseConfig.url, supabaseConfig.serviceKey);

// Test database connection
const testConnection = async () => {
  try {
    const { data, error } = await supabase.from('contacts').select('count').limit(1);
    if (error) throw error;
    console.log('✅ Supabase database connection successful');
  } catch (error) {
    console.error('❌ Supabase database connection failed:', error);
  }
};

// Test connection on startup
testConnection();

console.log('Supabase configuration loaded');