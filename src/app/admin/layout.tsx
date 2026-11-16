import Link from "next/link";
import { redirect } from "next/navigation";
import AdminNav from "@/components/admin/AdminNav";
import Logo from "@/components/Logo";
import { getCurrentUser } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import "../portal.css";

export const metadata = { title: "HP運営", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (isSupabaseConfigured) {
    const { user, role } = await getCurrentUser();
    if (!user) redirect("/staff/login?next=/admin");
    if (role !== "admin") redirect("/staff");
  }

  return (
    <div className="portal portal--admin">
      <header className="portal-header">
        <Logo size="sm" href="/admin" />
        <div className="portal-header__links">
          <Link href="/staff" className="portal-back">
            スタッフページ
          </Link>
          <Link href="/" className="portal-back" target="_blank">
            サイトを見る ↗
          </Link>
        </div>
      </header>
      {!isSupabaseConfigured && (
        <p className="demo-banner">
          お試し表示中：Supabase が未接続のため、ここでの変更は保存されません（README の手順を参照）。
        </p>
      )}
      <AdminNav />
      <main className="portal-main portal-main--admin">{children}</main>
    </div>
  );
}
