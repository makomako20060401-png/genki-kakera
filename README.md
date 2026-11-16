# 牛串 げんきのかけら ホームページ

Next.js（App Router）＋ Supabase ＋ Vercel で動くお店のホームページです。

| ページ | 内容 |
| --- | --- |
| `/` | トップ（ファーストビュー → 写真と文章が流れてくるストーリー → 写真の帯 → メニュー → ニュース → 予約・注文 → アクセス） |
| `/menu` | 全メニュー |
| `/news`・`/news/[id]` | お知らせ一覧・詳細 |
| `/staff` | **スタッフ専用**（ログイン必須）。HP運営ページとシフトアプリへの入口 |
| `/admin` | **HP運営ページ**（管理者のみ）。基本情報・写真／写真と文章／メニュー／ニュース／外部リンクの編集 |

Supabase を接続していない状態でも、初期データでサイトの見た目を確認できます（管理画面は「お試し表示」になり、保存はできません）。

---

## 公開までの手順（はじめの1回だけ）

### 1. Supabase でプロジェクトを作る

1. <https://supabase.com> で **New project** を作成（リージョンは Tokyo がおすすめ）
2. 左メニュー **SQL Editor** → **New query** を開き、`supabase/schema.sql` の中身を全部貼り付けて **Run**
   - テーブル・権限・画像置き場（`site-images`）・初期データがまとめて作られます
3. **Authentication → Sign In / Providers** で「Allow new users to sign up」を **オフ**にする
   （スタッフのアカウントは店長が手動で作る運用にするため）

### 2. 管理者（店長）アカウントを作る

1. **Authentication → Users → Add user → Create new user** でメールアドレスとパスワードを入力（Auto Confirm にチェック）
2. **SQL Editor** で次を実行（メールアドレスは書き換えてください）

```sql
insert into public.staff_roles (user_id, role, display_name)
select id, 'admin', '店長' from auth.users where email = 'owner@example.com'
on conflict (user_id) do update set role = 'admin';
```

一般スタッフ（シフトアプリへの入口だけ見せたい人）は、同じ手順で `'admin'` を `'staff'` に変えて実行します。

### 3. GitHub にアップロード

GitHub で空のリポジトリ（例：`genki-no-kakera`、Private 推奨）を作り、このフォルダで次を実行します。

```bash
git remote add origin https://github.com/<あなたのユーザー名>/genki-no-kakera.git
```

```bash
git push -u origin main
```

### 4. Vercel にデプロイ

1. Vercel で **Add New → Project** → 上のリポジトリを Import
2. **Environment Variables** に次の2つを登録（値は Supabase の **Project Settings → API** にあります）

| 名前 | 値 |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL（`https://xxxx.supabase.co`） |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon public key（または Publishable key） |

3. **Deploy** を押せば公開されます
4. 独自ドメインを使う場合は Vercel の **Settings → Domains** で追加し、環境変数 `NEXT_PUBLIC_SITE_URL` に `https://（ドメイン）` を入れると SNS で共有したときの画像が正しく出ます

### 5. 公開後にやること（すべて管理画面から）

`https://（サイト）/staff` からログイン → **HP運営ページ**

- **外部リンク**：WEB予約・モバイルオーダーの URL、**シフトアプリの URL**（スタッフページ欄）を入力
- **基本情報・写真**：住所・営業時間・電話・SNS・地図の検索ワード
- **写真と文章／メニュー**：今入っている写真は LP の画像から切り出した仮のものです。実際の写真に差し替えてください（スマホで撮った写真をそのまま選んで大丈夫。自動で縮小されます）
- **メニュー**：価格は仮の値です。実際の価格に直してください

変更は保存後 1 分以内にサイトへ反映されます。

---

## 演出・レスポンシブについて

- スクロールすると各要素が**グラデーションのマスクがゆっくり開くように**現れます（ぼかし→くっきり）。写真は左右から流れ込み、スクロールに合わせてわずかに動きます（パララックス）
- 「動きを減らす」設定の端末では、演出なしですぐ表示されます
- **スマホ版**では文字を最小限にしています
  - 写真を大きく見せ、見出しだけを写真に重ねる（本文は非表示）
  - メニューは横スワイプのカード、ニュースは日付とタイトルのみ
  - 画面下に「WEB予約／モバイルオーダー」ボタンを固定、ナビはハンバーガーメニュー

## 手元で動かす場合

```bash
npm install
```

```bash
cp .env.example .env.local
```

```bash
npm run dev
```

`.env.local` に Supabase の値を入れると、手元でも実データで動きます（入れなければ初期データで表示）。

## フォルダ構成

```
src/app/(site)/      公開ページ（トップ・メニュー・ニュース）
src/app/staff/       スタッフページとログイン
src/app/admin/       HP運営ページと保存処理（actions.ts）
src/components/      ヘッダー・フッター・スクロール演出など
src/lib/defaults.ts  Supabase 未接続時の初期データ
supabase/schema.sql  データベースの作成 SQL
public/images/       仮の写真
```

## セキュリティ

- データの書き換えは Supabase の行レベルセキュリティ（RLS）で **admin 役割のユーザーのみ**に制限しています
- スタッフ用リンク（シフトアプリの URL）はログインしたスタッフにしか取得できません
- `/staff`・`/admin` は検索エンジンに載らない設定です
