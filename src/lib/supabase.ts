import { createClient } from "@supabase/supabase-js";

// We require these environment variables to be set for storage to work.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// We should use the service role key on the server to bypass RLS for uploads if needed,
// or anon key if RLS is properly configured.
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.warn("Supabase credentials not found. File uploads will fail.");
}

export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseKey || "placeholder-key",
);
