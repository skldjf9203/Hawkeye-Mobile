import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://khsfsdkeifqncqgwpevg.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_aBMwSmnDkaL2is5tkizd5A_zsXMFfyg';

if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
  console.error('HawkSpot: Supabase URL is missing or using placeholder.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
