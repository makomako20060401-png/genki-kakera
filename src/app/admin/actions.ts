"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";

type Table = "story_sections" | "menu_items" | "news" | "links";

const str = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();
const bool = (fd: FormData, k: string) => fd.get(k) === "on";
const int = (fd: FormData, k: string) => {
  const v = str(fd, k);
  if (v === "") return null;
  const n = Number(v.replace(/[^0-9-]/g, ""));
  return Number.isFinite(n) ? n : null;
};

function back(path: string, key: "msg" | "error", text: string): never {
  redirect(`${path}?${key}=${encodeURIComponent(text)}&t=${Date.now()}`);
}

async function requireAdmin(path: string) {
  if (!isSupabaseConfigured) back(path, "error", "Supabase が未接続のため保存できません");
  const { user, role, supabase } = await getCurrentUser();
  if (!user || !supabase) redirect("/staff/login?next=/admin");
  if (role !== "admin") back(path, "error", "管理者権限がありません");
  return supabase;
}

function refresh() {
  revalidatePath("/", "layout");
}

/* ---------- 基本情報 ---------- */
export async function saveSettings(fd: FormData) {
  const path = "/admin";
  const supabase = await requireAdmin(path);
  const keys = [
    "hero_title",
    "hero_subtitle",
    "hero_image",
    "cta_title",
    "cta_image",
    "tagline",
    "postal",
    "address",
    "hours",
    "holiday",
    "tel",
    "map_query",
    "instagram_url",
    "x_url",
  ];
  const data: Record<string, unknown> = {};
  for (const k of keys) data[k] = String(fd.get(k) ?? "").replace(/\r\n/g, "\n").trim();
  data.menu_categories = str(fd, "menu_categories")
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);
  data.gallery_images = fd
    .getAll("gallery_images")
    .map((v) => String(v).trim())
    .filter(Boolean);

  const { error } = await supabase
    .from("site_settings")
    .upsert({ id: 1, data, updated_at: new Date().toISOString() });
  if (error) back(path, "error", error.message);
  refresh();
  back(path, "msg", "基本情報を保存しました");
}

/* ---------- 一覧系の共通処理 ---------- */
async function saveRow(table: Table, path: string, fd: FormData, row: Record<string, unknown>) {
  const supabase = await requireAdmin(path);
  const id = str(fd, "id");
  const { error } = id
    ? await supabase.from(table).update(row).eq("id", id)
    : await supabase.from(table).insert(row);
  if (error) back(path, "error", error.message);
  refresh();
  back(path, "msg", id ? "保存しました" : "追加しました");
}

async function deleteRow(table: Table, path: string, fd: FormData) {
  const supabase = await requireAdmin(path);
  const id = str(fd, "id");
  if (!id) back(path, "error", "削除する項目が見つかりません");
  const { error } = await supabase.from(table).delete().eq("id", id);
  if (error) back(path, "error", error.message);
  refresh();
  back(path, "msg", "削除しました");
}

const multiline = (fd: FormData, k: string) => String(fd.get(k) ?? "").replace(/\r\n/g, "\n").trim();

/* ---------- ストーリー（写真と文章） ---------- */
export async function saveStory(fd: FormData) {
  await saveRow("story_sections", "/admin/story", fd, {
    eyebrow: str(fd, "eyebrow"),
    title: multiline(fd, "title"),
    body: multiline(fd, "body"),
    image_url: str(fd, "image_url"),
    sort_order: int(fd, "sort_order") ?? 0,
    visible: bool(fd, "visible"),
  });
}
export async function deleteStory(fd: FormData) {
  await deleteRow("story_sections", "/admin/story", fd);
}

/* ---------- メニュー ---------- */
export async function saveMenu(fd: FormData) {
  await saveRow("menu_items", "/admin/menu", fd, {
    category: str(fd, "category"),
    name: str(fd, "name"),
    description: multiline(fd, "description"),
    price: int(fd, "price"),
    image_url: str(fd, "image_url"),
    featured: bool(fd, "featured"),
    sort_order: int(fd, "sort_order") ?? 0,
    visible: bool(fd, "visible"),
  });
}
export async function deleteMenu(fd: FormData) {
  await deleteRow("menu_items", "/admin/menu", fd);
}

/* ---------- ニュース ---------- */
export async function saveNews(fd: FormData) {
  await saveRow("news", "/admin/news", fd, {
    published_on: str(fd, "published_on") || new Date().toISOString().slice(0, 10),
    tag: str(fd, "tag") || "お知らせ",
    title: str(fd, "title"),
    body: multiline(fd, "body"),
    published: bool(fd, "published"),
  });
}
export async function deleteNews(fd: FormData) {
  await deleteRow("news", "/admin/news", fd);
}

/* ---------- 外部リンク ---------- */
export async function saveLink(fd: FormData) {
  const area = str(fd, "area") === "staff" ? "staff" : "public";
  await saveRow("links", "/admin/links", fd, {
    area,
    label: str(fd, "label"),
    sublabel: str(fd, "sublabel"),
    url: str(fd, "url"),
    icon: str(fd, "icon") || "link",
    sort_order: int(fd, "sort_order") ?? 0,
    visible: bool(fd, "visible"),
  });
}
export async function deleteLink(fd: FormData) {
  await deleteRow("links", "/admin/links", fd);
}
