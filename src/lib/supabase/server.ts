import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-goduet.supabase.co';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * GoDuet Server-Side Admin Supabase Client
 * STRICT SECURITY: Contains Service Role Key for privileged server actions.
 * NEVER IMPORT THIS IN CLIENT COMPONENTS OR EXPOSE TO BROWSER BUNDLES.
 */
export function getSupabaseAdmin() {
  if (!supabaseServiceRoleKey) {
    throw new Error(
      'CRITICAL SECURITY ERROR: SUPABASE_SERVICE_ROLE_KEY is not defined. Server admin client cannot be initialized.'
    );
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
