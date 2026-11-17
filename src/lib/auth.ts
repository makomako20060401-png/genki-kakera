import { cache } from "react";
import { isSupabaseConfigured } from "./supabase/config";
import { createSessionClient } from "./supabase/server";

export type Role = "staff" | "admin" | null;
export type SessionUser = { id: string; email: string };

/**
 * ログイン中のユーザーと役割（staff / admin）を返す。
 * - cache(): 1回の表示の中で何度呼んでも、問い合わせは1回だけ
 * - getClaims(): ログイン情報（JWT）をその場で検証するので、毎回認証サーバーに問い合わせず速い
 */
export const getCurrentUser = cache(async () => {
  if (!isSupabaseConfigured) return { user: null, role: null as Role, supabase: null };
  const supabase = await createSessionClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (!claims?.sub) return { user: null, role: null as Role, supabase };
  const user: SessionUser = { id: claims.sub, email: String(claims.email ?? "") };
  const { data: row } = await supabase.from("staff_roles").select("role").eq("user_id", user.id).maybeSingle();
  return { user, role: ((row?.role as Role) ?? null) as Role, supabase };
});
