import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('❌ BACKEND ERROR: Supabase Service Role Key or URL is missing.');
}

/**
 * A Supabase client using the Service Role Key for server-side operations.
 * This client bypasses RLS and should ONLY be used in secure server environments (API routes).
 */
export const supabaseService = createClient(
  supabaseUrl || 'https://missing-url.supabase.co', 
  supabaseServiceRoleKey || 'missing-key'
);
