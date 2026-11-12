import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-goduet.supabase.co';
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  'placeholder-anon-key';

export interface SupabaseEnvValidation {
  isValid: boolean;
  url: string | null;
  hasAnonKey: boolean;
  errors: string[];
}

/**
 * Validates Supabase environment variables configured in .env.local
 */
export function validateSupabaseEnv(): SupabaseEnvValidation {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  )?.trim();
  const errors: string[] = [];

  if (!url) {
    errors.push('NEXT_PUBLIC_SUPABASE_URL is missing in .env.local');
  } else if (!url.startsWith('https://')) {
    errors.push('NEXT_PUBLIC_SUPABASE_URL must start with https://');
  } else if (url.includes('placeholder')) {
    errors.push('NEXT_PUBLIC_SUPABASE_URL contains placeholder value');
  }

  if (!key) {
    errors.push('NEXT_PUBLIC_SUPABASE_ANON_KEY is missing in .env.local');
  } else if (key.includes('placeholder')) {
    errors.push('NEXT_PUBLIC_SUPABASE_ANON_KEY contains placeholder value');
  } else if (key.length < 20) {
    errors.push('NEXT_PUBLIC_SUPABASE_ANON_KEY appears to be incomplete');
  }

  return {
    isValid: errors.length === 0,
    url: url || null,
    hasAnonKey: Boolean(key && !key.includes('placeholder')),
    errors,
  };
}

export const isSupabaseLiveConfigured = (): boolean => {
  return validateSupabaseEnv().isValid;
};

/**
 * GoDuet Browser Supabase Client (Next.js App Router)
 * Safe for client-side execution; uses public anonymous / publishable key.
 * Governed strictly by PostgreSQL Row-Level Security (RLS) policies.
 * Never includes service-role or secret keys.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});
