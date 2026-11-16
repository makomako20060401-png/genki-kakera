-- =========================================================
-- 牛串 げんきのかけら  ホームページ用データベース
-- Supabase の「SQL Editor」にこのファイルを丸ごと貼り付けて Run してください。
-- 何度実行しても壊れないように作ってあります（初期データは空のときだけ入ります）。
-- =========================================================

-- ---------- テーブル ----------
create table if not exists public.site_settings (
  id int primary key default 1 check (id = 1),
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.story_sections (
  id uuid primary key default gen_random_uuid(),
  eyebrow text not null default '',
  title text not null default '',
  body text not null default '',
  image_url text not null default '',
  sort_order int not null default 0,
  visible boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.menu_items (
  id uuid primary key default gen_random_uuid(),
  category text not null default '',
  name text not null default '',
  description text not null default '',
  price int,
  image_url text not null default '',
  featured boolean not null default false,
  sort_order int not null default 0,
  visible boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.news (
  id uuid primary key default gen_random_uuid(),
  published_on date not null default current_date,
  tag text not null default 'お知らせ',
  title text not null default '',
  body text not null default '',
  published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.links (
  id uuid primary key default gen_random_uuid(),
  area text not null default 'public' check (area in ('public', 'staff')),
  label text not null default '',
  sublabel text not null default '',
  url text not null default '',
  icon text not null default 'link',
  sort_order int not null default 0,
  visible boolean not null default true,
  created_at timestamptz not null default now()
);

-- 従業員の役割（staff = スタッフタブを見られる / admin = HP運営ページも使える）
create table if not exists public.staff_roles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  role text not null default 'staff' check (role in ('staff', 'admin')),
  display_name text not null default '',
  created_at timestamptz not null default now()
);

-- ---------- 役割チェック関数 ----------
create or replace function public.is_staff() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.staff_roles where user_id = auth.uid());
$$;

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.staff_roles where user_id = auth.uid() and role = 'admin');
$$;

-- ---------- 行レベルセキュリティ ----------
alter table public.site_settings  enable row level security;
alter table public.story_sections enable row level security;
alter table public.menu_items     enable row level security;
alter table public.news           enable row level security;
alter table public.links          enable row level security;
alter table public.staff_roles    enable row level security;

drop policy if exists "settings read"  on public.site_settings;
drop policy if exists "settings admin" on public.site_settings;
create policy "settings read"  on public.site_settings for select using (true);
create policy "settings admin" on public.site_settings for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "story read"  on public.story_sections;
drop policy if exists "story admin" on public.story_sections;
create policy "story read"  on public.story_sections for select using (visible or public.is_admin());
create policy "story admin" on public.story_sections for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "menu read"  on public.menu_items;
drop policy if exists "menu admin" on public.menu_items;
create policy "menu read"  on public.menu_items for select using (visible or public.is_admin());
create policy "menu admin" on public.menu_items for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "news read"  on public.news;
drop policy if exists "news admin" on public.news;
create policy "news read"  on public.news for select using (published or public.is_admin());
create policy "news admin" on public.news for all using (public.is_admin()) with check (public.is_admin());

-- スタッフ用リンク（シフトアプリのURLなど）はログインしたスタッフにしか見えない
drop policy if exists "links read public" on public.links;
drop policy if exists "links read staff"  on public.links;
drop policy if exists "links admin"       on public.links;
create policy "links read public" on public.links for select using (area = 'public' and visible);
create policy "links read staff"  on public.links for select using (area = 'staff' and visible and public.is_staff());
create policy "links admin"       on public.links for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "roles read own" on public.staff_roles;
drop policy if exists "roles admin"    on public.staff_roles;
create policy "roles read own" on public.staff_roles for select using (user_id = auth.uid() or public.is_admin());
create policy "roles admin"    on public.staff_roles for all using (public.is_admin()) with check (public.is_admin());

-- ---------- 画像置き場（Storage） ----------
insert into storage.buckets (id, name, public)
values ('site-images', 'site-images', true)
on conflict (id) do nothing;

drop policy if exists "site-images read"   on storage.objects;
drop policy if exists "site-images insert" on storage.objects;
drop policy if exists "site-images update" on storage.objects;
drop policy if exists "site-images delete" on storage.objects;
create policy "site-images read"   on storage.objects for select using (bucket_id = 'site-images');
create policy "site-images insert" on storage.objects for insert with check (bucket_id = 'site-images' and public.is_admin());
create policy "site-images update" on storage.objects for update using (bucket_id = 'site-images' and public.is_admin());
create policy "site-images delete" on storage.objects for delete using (bucket_id = 'site-images' and public.is_admin());

-- ---------- 初期データ（空のときだけ） ----------
insert into public.site_settings (id, data) values (1, '{}'::jsonb) on conflict (id) do nothing;

insert into public.story_sections (eyebrow, title, body, image_url, sort_order)
select * from (values
  ('CONCEPT',   E'素材の個性を引き出す、\n妥協なき串打ち。', E'炭火の香りが食欲をそそる、\n自慢の一串をあなたに。', '/images/concept.jpg', 1),
  ('CHARCOAL',  E'炭火の力で、\n旨味を閉じ込める。', E'表面は香ばしく、中はふっくら。\n火の通りを見極め、一本ずつ焼き上げます。', '/images/hero.jpg', 2),
  ('OUR SPACE', E'仕事帰りにふらっと立ち寄れる、\n温かな隠れ家。', '今宵も、美味しいお酒と仲間たちが待っています。', '/images/space.jpg', 3)
) v where not exists (select 1 from public.story_sections);

insert into public.menu_items (category, name, description, price, image_url, featured, sort_order)
select * from (values
  ('牛串', '特選 牛串', '肩ロースを厚切りに。塩でもタレでも。', 580, '/images/menu-1.jpg', true, 1),
  ('牛串', 'ねぎ塩 牛串', 'たっぷりの青ねぎと特製塩だれで。', 520, '/images/menu-2.jpg', true, 2),
  ('牛串', '秘伝だれ 牛串', '継ぎ足しの甘辛だれを重ね焼き。', 520, '/images/menu-3.jpg', true, 3),
  ('牛串', 'おろしポン酢 牛串', '大根おろしでさっぱりと。', 540, '/images/menu-4.jpg', true, 4),
  ('逸品料理', '牛すじ煮込み', 'とろとろになるまで煮込んだ定番。', 680, '', false, 5),
  ('逸品料理', '炙り牛タン', '炭火で表面だけを香ばしく。', 880, '', false, 6),
  ('逸品料理', '〆のガーリックライス', '牛脂の旨味を吸わせた一品。', 650, '', false, 7),
  ('お酒・こだわり', '生ビール', 'キンキンに冷えた一杯を。', 550, '', false, 8),
  ('お酒・こだわり', '濃いめハイボール', '串との相性は抜群。', 500, '', false, 9),
  ('お酒・こだわり', '茨城の地酒', '季節ごとに入れ替わる地元の銘柄。', null::int, '', false, 10)
) v where not exists (select 1 from public.menu_items);

insert into public.news (published_on, tag, title, body)
select * from (values
  ('2025-11-01'::date, '新メニュー', '秋の味覚、きのこ串が登場しました！', '香り豊かなきのこを炭火で焼き上げた季節限定の串です。'),
  ('2025-10-15'::date, 'お知らせ', '営業時間変更のお知らせ（10/20〜）', '10月20日より営業時間を変更いたします。'),
  ('2025-09-30'::date, 'イベント', '研究学園まつりに出店します！', '当日は特製牛串を販売予定です。')
) v where not exists (select 1 from public.news);

insert into public.links (area, label, sublabel, url, icon, sort_order)
select * from (values
  ('public', '席を予約する', 'WEB予約', '#', 'calendar', 1),
  ('public', 'お席から簡単注文', 'モバイルオーダー', '#', 'order', 2),
  ('staff',  'シフト管理アプリ', 'シフトの確認・提出', '#', 'shift', 1)
) v where not exists (select 1 from public.links);

-- ---------- 管理者の登録（初回だけ手動で） ----------
-- 1) Supabase の Authentication > Users > "Add user" でメールとパスワードを作成
-- 2) 下の行のメールアドレスを書き換えて実行すると、その人が管理者になります
--
-- insert into public.staff_roles (user_id, role, display_name)
-- select id, 'admin', '店長' from auth.users where email = 'owner@example.com'
-- on conflict (user_id) do update set role = 'admin';
--
-- 一般スタッフ（シフトアプリだけ見せたい人）は 'admin' を 'staff' にして実行してください。
