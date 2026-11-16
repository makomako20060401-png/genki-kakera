import { isSupabaseConfigured } from "./supabase/config";
import { createSessionClient } from "./supabase/server";

export type Role = "staff" | "admin" | null;

/** ログイン中のユーザーと役割（staff / admin）を返す */
export async function getCurrentUser() {
  if (!isSupabaseConfigured) return { user: null, role: null as Role, supabase: null };
  const supabase = await createSessionClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { user: null, role: null as Role, supabase };
  const { data } = await supabase.from("staff_roles").select("role").eq("user_id", user.id).maybeSingle();
  return { user, role: ((data?.role as Role) ?? null) as Role, supabase };
}
