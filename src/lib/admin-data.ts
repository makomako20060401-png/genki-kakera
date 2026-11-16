import { getCurrentUser } from "./auth";
import { mergeSettings } from "./data";
import { DEFAULT_LINKS, DEFAULT_MENU, DEFAULT_NEWS, DEFAULT_STORY } from "./defaults";
import { isSupabaseConfigured } from "./supabase/config";
import type { LinkItem, MenuItem, NewsItem, Settings, StorySection } from "./types";

/** 管理画面用：非表示のものも含めて全件取得（未接続ならお試し用の初期データ） */
async function all<T>(table: string, order: string, ascending = true, fallback: T[]): Promise<T[]> {
  if (!isSupabaseConfigured) return fallback;
  const { supabase } = await getCurrentUser();
  if (!supabase) return [];
  const { data } = await supabase.from(table).select("*").order(order, { ascending });
  return (data as T[]) ?? [];
}

export async function adminSettings(): Promise<Settings> {
  if (!isSupabaseConfigured) return mergeSettings(null);
  const { supabase } = await getCurrentUser();
  const { data } = await supabase!.from("site_settings").select("data").eq("id", 1).maybeSingle();
  return mergeSettings(data?.data as Partial<Settings> | undefined);
}

export const adminStory = () => all<StorySection>("story_sections", "sort_order", true, DEFAULT_STORY);
export const adminMenu = () => all<MenuItem>("menu_items", "sort_order", true, DEFAULT_MENU);
export const adminNews = () => all<NewsItem>("news", "published_on", false, DEFAULT_NEWS);
export const adminLinks = () => all<LinkItem>("links", "sort_order", true, DEFAULT_LINKS);
