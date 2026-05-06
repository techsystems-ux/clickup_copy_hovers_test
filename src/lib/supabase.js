import { createClient } from '@supabase/supabase-js';

const supabaseUrl     = import.meta.env.VITE_SUPABASE_URL     || 'https://pixgrkvanbxoceynyzoz.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_s-yQCIKFbpjzdzBB38-2XA_FK9HJ12P';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
