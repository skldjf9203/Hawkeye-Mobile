import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'placeholder-key';

if (!process.env.VITE_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL) {
  console.error('HawkSpot: Supabase configuration is missing. Please add VITE_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL to your project secrets.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
