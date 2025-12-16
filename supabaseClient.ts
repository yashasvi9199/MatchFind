import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Fallback for local development only (User Policy: No local .env files)
// These keys will need to be manually inserted here or via shell for local dev to work if not present
const finalUrl = supabaseUrl || 'https://qplqhkyndispzftctgqm.supabase.co'; 
const finalKey = supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFwbHFoa3luZGlzcHpmdGN0Z3FtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3OTI5MTUsImV4cCI6MjA4MTM2ODkxNX0.F2tCyGbzC5erfcyq6nQj_KYeslpJ_auMMwJ2F5cr-3M';

if (!finalUrl || !finalKey || finalUrl === 'https://xyz.supabase.co') {
  console.warn('Supabase Env Variables missing. Using placeholder/fallback. Auth/DB will fail.');
}

export const supabase = createClient(finalUrl, finalKey);
