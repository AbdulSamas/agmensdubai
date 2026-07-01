import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

let supabaseClient: ReturnType<typeof createClient>;

try {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials missing. Database features will be unavailable.');
  }
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
    },
  });
} catch (e) {
  console.error('Failed to initialize Supabase client:', e);
  // Create a minimal fallback that won't crash
  supabaseClient = createClient('https://placeholder.supabase.co', 'placeholder');
}

export const supabase = supabaseClient;
