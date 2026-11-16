export type Settings = {
  /** ヒーロー（ファーストビュー） */
  hero_title: string;
  hero_subtitle: string;
  hero_image: string;
  /** 予約・注文の誘導帯 */
  cta_title: string;
  cta_image: string;
  /** フッターのひとこと */
  tagline: string;
  /** 店舗情報 */
  postal: string;
  address: string;
  hours: string;
  holiday: string;
  tel: string;
  map_query: string;
  /** SNS */
  instagram_url: string;
  x_url: string;
  /** メニューのカテゴリ（表示順） */
  menu_categories: string[];
  /** 写真が流れる帯に使う画像 */
  gallery_images: string[];
};

export type StorySection = {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  image_url: string;
  sort_order: number;
  visible: boolean;
};

export type MenuItem = {
  id: string;
  category: string;
  name: string;
  description: string;
  price: number | null;
  image_url: string;
  featured: boolean;
  sort_order: number;
  visible: boolean;
};

export type NewsItem = {
  id: string;
  published_on: string;
  tag: string;
  title: string;
  body: string;
  published: boolean;
};

export type LinkArea = "public" | "staff";

export type LinkItem = {
  id: string;
  area: LinkArea;
  label: string;
  sublabel: string;
  url: string;
  icon: string;
  sort_order: number;
  visible: boolean;
};

export const LINK_ICONS: { value: string; label: string }[] = [
  { value: "calendar", label: "カレンダー（予約）" },
  { value: "order", label: "スマホ（注文）" },
  { value: "phone", label: "電話" },
  { value: "shift", label: "シフト" },
  { value: "link", label: "リンク" },
];
