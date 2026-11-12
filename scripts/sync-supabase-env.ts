/**
 * GoDuet — Unified Supabase Environment Synchronizer
 * Distributes the single AWS Mumbai Supabase Project URL and Anon Key across all three websites.
 * Enforces strict security: Service-role key is NEVER written to the Vite frontend project.
 */

import fs from 'fs';
import path from 'path';

const customerDir = '/Users/siddharthsingh/Downloads/goduet customer ';
const deliveryDir = '/Users/siddharthsingh/Downloads/goduet delivery ';
const sellerDir = '/Users/siddharthsingh/Downloads/Goduet';

export function applySupabaseCredentials(supabaseUrl: string, anonKey: string, serviceRoleKey?: string) {
  if (!supabaseUrl || !anonKey) {
    throw new Error('Supabase URL and Anon Key are required.');
  }

  console.log('\n================================================================');
  console.log('⚡ SYNCHRONIZING SHARED SUPABASE BACKEND (AWS MUMBAI ap-south-1)');
  console.log(`URL: ${supabaseUrl}`);
  console.log('================================================================\n');

  // 1. Customer Web Portal (.env.local)
  const customerEnv = `# GoDuet Customer Web Portal — Shared Supabase (AWS Mumbai)
NEXT_PUBLIC_SUPABASE_URL=${supabaseUrl}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${anonKey}
${serviceRoleKey ? `SUPABASE_SERVICE_ROLE_KEY=${serviceRoleKey}` : '# SUPABASE_SERVICE_ROLE_KEY='}
ENCRYPTION_MASTER_KEY=goduet_aes_256_gcm_master_key_hyderabad_2026_secure
SESSION_SECRET=goduet_session_hmac_signing_secret_2026
ENABLE_LIVE_SMS_BILLING=false
`;
  fs.writeFileSync(path.join(customerDir, '.env.local'), customerEnv);
  console.log('✅ Updated goduet customer /.env.local');

  // 2. Delivery Partner Portal (.env.local)
  const deliveryEnv = `# GoDuet Delivery Partner Portal — Shared Supabase (AWS Mumbai)
NEXT_PUBLIC_SUPABASE_URL=${supabaseUrl}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${anonKey}
${serviceRoleKey ? `SUPABASE_SERVICE_ROLE_KEY=${serviceRoleKey}` : '# SUPABASE_SERVICE_ROLE_KEY='}
ENCRYPTION_MASTER_KEY=goduet_aes_256_gcm_master_key_hyderabad_2026_secure
SESSION_SECRET=goduet_session_hmac_signing_secret_2026
SUPABASE_DOCUMENTS_BUCKET=partner-vault-private
ENABLE_LIVE_SMS_BILLING=false
`;
  fs.writeFileSync(path.join(deliveryDir, '.env.local'), deliveryEnv);
  console.log('✅ Updated goduet delivery /.env.local');

  // 3. Seller Portal (Goduet/.env) — STRICTLY NO SERVICE ROLE KEY
  const sellerEnv = `# GoDuet Restaurant & Fresh Seller Portal (Vite SPA) — Shared Supabase (AWS Mumbai)
VITE_SUPABASE_URL=${supabaseUrl}
VITE_SUPABASE_ANON_KEY=${anonKey}
NEXT_PUBLIC_SUPABASE_URL=${supabaseUrl}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${anonKey}
VITE_SUPABASE_SELLER_BUCKET=seller-vault-private
VITE_SUPABASE_CATALOG_BUCKET=public-catalog-media
# NOTICE: Service role key is STRICTLY OMITTED from frontend Vite environment
`;
  fs.writeFileSync(path.join(sellerDir, '.env'), sellerEnv);
  console.log('✅ Updated Goduet/.env (Service Role key strictly excluded)');

  console.log('\nAll three websites are now configured with the SAME shared Supabase project credentials!\n');
}

// CLI execution handler
const args = process.argv.slice(2);
if (args.length >= 2) {
  const [url, anon, serviceRole] = args;
  applySupabaseCredentials(url, anon, serviceRole);
}
