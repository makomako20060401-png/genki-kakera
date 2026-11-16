import Link from "next/link";
import { redirect } from "next/navigation";
import Icon from "@/components/Icon";
import { getCurrentUser } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { LinkItem } from "@/lib/types";
import { signOut } from "./actions";

export const dynamic = "force-dynamic";

export default async function StaffHome() {
  if (!isSupabaseConfigured) redirect("/staff/login");
  const { user, role, supabase } = await getCurrentUser();
  if (!user || !supabase) redirect("/staff/login");

  if (!role) {
    return (
      <main className="portal-main portal-main--center">
        <div className="login-card">
          <h1>権限がありません</h1>
          <p className="portal-muted">
            このアカウント（{user.email}）はスタッフとして登録されていません。店長に登録を依頼してください。
          </p>
          <form action={signOut}>
            <button className="btn btn--outline">ログアウト</button>
          </form>
        </div>
      </main>
    );
  }

  const { data } = await supabase.from("links").select("*").eq("area", "staff").eq("visible", true).order("sort_order");
  const links = (data as LinkItem[]) ?? [];

  return (
    <main className="portal-main">
      <div className="portal-top">
        <div>
          <p className="eyebrow">STAFF ONLY</p>
          <h1 className="portal-title">スタッフページ</h1>
          <p className="portal-muted">{user.email} でログイン中</p>
        </div>
        <form action={signOut}>
          <button className="btn btn--outline btn--sm">
            <Icon name="logout" size={16} /> ログアウト
          </button>
        </form>
      </div>

      <div className="portal-cards">
        {role === "admin" && (
          <Link href="/admin" className="portal-card portal-card--gold">
            <Icon name="admin" size={34} />
            <span className="portal-card__text">
              <strong>HP運営ページ</strong>
              <small>文章・写真・メニュー・ニュース・リンクの編集</small>
            </span>
            <Icon name="arrow" size={18} />
          </Link>
        )}
        {links.map((l) => (
          <a key={l.id} href={l.url} target="_blank" rel="noopener noreferrer" className="portal-card">
            <Icon name={l.icon} size={34} />
            <span className="portal-card__text">
              <strong>{l.label}</strong>
              {l.sublabel && <small>{l.sublabel}</small>}
            </span>
            <Icon name="external" size={18} />
          </a>
        ))}
        {links.length === 0 && role !== "admin" && <p className="portal-muted">表示できるリンクがありません。</p>}
      </div>
    </main>
  );
}
