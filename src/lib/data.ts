import { DEFAULT_LINKS, DEFAULT_MENU, DEFAULT_NEWS, DEFAULT_SETTINGS, DEFAULT_STORY } from "./defaults";
import { isSupabaseConfigured } from "./supabase/config";
import { createPublicClient } from "./supabase/server";
import type { LinkItem, MenuItem, NewsItem, Settings, StorySection } from "./types";

export function mergeSettings(data: Partial<Settings> | null | undefined): Settings {
  const merged = { ...DEFAULT_SETTINGS, ...(data ?? {}) } as Settings;
  if (!Array.isArray(merged.menu_categories)) merged.menu_categories = DEFAULT_SETTINGS.menu_categories;
  if (!Array.isArray(merged.gallery_images)) merged.gallery_images = DEFAULT_SETTINGS.gallery_images;
  return merged;
}

export async function getSettings(): Promise<Settings> {
  if (!isSupabaseConfigured) return DEFAULT_SETTINGS;
  const { data, error } = await createPublicClient().from("site_settings").select("data").eq("id", 1).maybeSingle();
  if (error) console.error("getSettings", error.message);
  return mergeSettings(data?.data as Partial<Settings> | undefined);
}

export async function getStory(): Promise<StorySection[]> {
  if (!isSupabaseConfigured) return DEFAULT_STORY;
  const { data, error } = await createPublicClient()
    .from("story_sections")
    .select("*")
    .eq("visible", true)
    .order("sort_order");
  if (error) console.error("getStory", error.message);
  return (data as StorySection[]) ?? [];
}

export async function getMenu(): Promise<MenuItem[]> {
  if (!isSupabaseConfigured) return DEFAULT_MENU;
  const { data, error } = await createPublicClient()
    .from("menu_items")
    .select("*")
    .eq("visible", true)
    .order("sort_order");
  if (error) console.error("getMenu", error.message);
  return (data as MenuItem[]) ?? [];
}

export async function getNews(limit?: number): Promise<NewsItem[]> {
  if (!isSupabaseConfigured) return limit ? DEFAULT_NEWS.slice(0, limit) : DEFAULT_NEWS;
  let q = createPublicClient()
    .from("news")
    .select("*")
    .eq("published", true)
    .order("published_on", { ascending: false });
  if (limit) q = q.limit(limit);
  const { data, error } = await q;
  if (error) console.error("getNews", error.message);
  return (data as NewsItem[]) ?? [];
}

export async function getNewsItem(id: string): Promise<NewsItem | null> {
  if (!isSupabaseConfigured) return DEFAULT_NEWS.find((n) => n.id === id) ?? null;
  const { data } = await createPublicClient().from("news").select("*").eq("id", id).eq("published", true).maybeSingle();
  return (data as NewsItem) ?? null;
}

export async function getPublicLinks(): Promise<LinkItem[]> {
  if (!isSupabaseConfigured) return DEFAULT_LINKS.filter((l) => l.area === "public");
  const { data, error } = await createPublicClient()
    .from("links")
    .select("*")
    .eq("area", "public")
    .eq("visible", true)
    .order("sort_order");
  if (error) console.error("getPublicLinks", error.message);
  return (data as LinkItem[]) ?? [];
}

export { formatDate, formatPrice } from "./format";
