import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL');
}

/**
 * Creates a generic authorized client using the Anon key
 * This should be used for operations that respect Row Level Security (RLS)
 * Usually, you'd pass the user's access token to this, but for Phase 1 where we are mocking
 * auth via Google OAuth custom linking, we might have to bypass RLS or use the service key.
 */
export const createSupabaseClient = () => {
    if(!supabaseAnonKey) throw new Error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY")
    return createClient(supabaseUrl, supabaseAnonKey);
}

/**
 * Creates an admin client using the Service Role Key.
 * DANGER: This client BYPASSES Row Level Security (RLS).
 * Only use this on the server for admin tasks or when explicitly overriding RLS.
 */
export const createAdminClient = () => {
  if (!supabaseServiceKey) {
    throw new Error('Missing env.SUPABASE_SERVICE_ROLE_KEY');
  }
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};
