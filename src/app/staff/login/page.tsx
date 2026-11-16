import Icon from "@/components/Icon";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { signIn } from "../actions";

type Props = { searchParams: Promise<{ error?: string; next?: string }> };

export default async function LoginPage({ searchParams }: Props) {
  const { error, next } = await searchParams;
  return (
    <main className="portal-main portal-main--center">
      <form action={signIn} className="login-card">
        <div className="login-card__icon">
          <Icon name="lock" size={28} />
        </div>
        <h1>スタッフログイン</h1>
        <p className="portal-muted">従業員専用ページです。</p>
        {!isSupabaseConfigured && (
          <p className="portal-alert">Supabase がまだ接続されていません（Vercel の環境変数を設定して再デプロイしてください。README 手順4）。</p>
        )}
        {error && <p className="portal-alert">メールアドレスまたはパスワードが違います。</p>}
        <input type="hidden" name="next" value={next ?? "/staff"} />
        <label className="field">
          <span>メールアドレス</span>
          <input type="email" name="email" required autoComplete="email" />
        </label>
        <label className="field">
          <span>パスワード</span>
          <input type="password" name="password" required autoComplete="current-password" />
        </label>
        <button className="btn btn--gold" type="submit" disabled={!isSupabaseConfigured}>
          ログイン
        </button>
      </form>
    </main>
  );
}
