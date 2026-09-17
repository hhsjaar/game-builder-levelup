import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

if (!supabaseUrl || !serviceRoleKey) {
  console.warn(
    "WARNING: Supabase env vars are not fully set (NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)."
  );
}

// Fall back to harmless placeholders so the client can be constructed (and the
// app can build/boot) even before .env.local is filled in — real calls will
// simply fail with a clear network/auth error instead of crashing at import time.
const resolvedUrl = supabaseUrl || "https://placeholder.supabase.co";
const resolvedKey = serviceRoleKey || "placeholder-service-role-key";

/**
 * Server-only client using the service role key (full DB access, bypasses RLS).
 * Never import this from a Client Component — it must stay inside Route
 * Handlers only. Access is scoped by client_id inside our own API routes since
 * there is no per-user auth yet.
 */
export const supabaseServer = createClient(resolvedUrl, resolvedKey, {
  auth: { persistSession: false },
});

export const GENERATIONS_PER_DAY_LIMIT = 20;

export async function hasReachedGenerationLimit(clientId: string): Promise<boolean> {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const { data: conversations, error: convError } = await supabaseServer
    .from("conversations")
    .select("id")
    .eq("client_id", clientId);

  if (convError) throw convError;
  const conversationIds = (conversations ?? []).map((c) => c.id as string);
  if (conversationIds.length === 0) return false;

  const { count, error } = await supabaseServer
    .from("generated_games")
    .select("id", { count: "exact", head: true })
    .in("conversation_id", conversationIds)
    .gte("created_at", since);

  if (error) throw error;
  return (count ?? 0) >= GENERATIONS_PER_DAY_LIMIT;
}
