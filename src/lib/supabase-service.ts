import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-key';

/**
 * A Supabase client using the Service Role Key for server-side operations.
 * This client bypasses RLS and should ONLY be used in secure server environments (API routes).
 * Defaults to placeholders to avoid build-time crashes if environment variables are missing.
 */
export const supabaseService = createClient(supabaseUrl, supabaseServiceRoleKey);
