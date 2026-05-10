import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || (!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY && !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)) {
  console.warn('⚠️ Supabase URL or Anon Key is missing. Auth will not sync correctly.');
}

// Using createBrowserClient ensures that the auth state is automatically
// synced with cookies, allowing the server-side middleware to see the session.
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
