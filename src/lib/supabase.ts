import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  if (typeof window !== 'undefined') {
    console.error('❌ CRITICAL: Supabase Environment Variables are MISSING!');
    console.error('Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your deployment.');
  }
}

// Using createBrowserClient ensures that the auth state is automatically
// synced with cookies, allowing the server-side middleware to see the session.
export const supabase = createBrowserClient(
  supabaseUrl || 'https://missing-url.supabase.co', 
  supabaseAnonKey || 'missing-key'
);
