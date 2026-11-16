import type { LinkItem, MenuItem, NewsItem, Settings, StorySection } from "./types";

/**
 * Supabase 未接続のとき、または設定に項目が足りないときに使う初期値。
 * supabase/schema.sql の初期データと同じ内容です。
 */
export const DEFAULT_SETTINGS: Settings = {
  hero_title: "研究学園の夜に、\n香ばしい煙と旨味を灯す。",
  hero_subtitle: "串一本に、まごころをかけて。",
  hero_image: "/images/hero.jpg",
  cta_title: "今すぐ、楽しむ。",
  cta_image: "/images/cta.jpg",
  tagline: "一串に、まごころを。",
  postal: "〒305-0817",
  address: "茨城県つくば市研究学園〇丁目〇-〇",
  hours: "17:00 - 24:00（L.O. 23:30）",
  holiday: "月曜日",
  tel: "",
  map_query: "茨城県つくば市研究学園",
  instagram_url: "https://www.instagram.com/",
  x_url: "https://x.com/",
  menu_categories: ["牛串", "逸品料理", "お酒・こだわり"],
  gallery_images: [
    "/images/menu-1.jpg",
    "/images/concept.jpg",
    "/images/menu-2.jpg",
    "/images/space.jpg",
    "/images/menu-3.jpg",
    "/images/hero.jpg",
    "/images/menu-4.jpg",
  ],
};

export const DEFAULT_STORY: StorySection[] = [
  {
    id: "s1",
    eyebrow: "CONCEPT",
    title: "素材の個性を引き出す、\n妥協なき串打ち。",
    body: "炭火の香りが食欲をそそる、\n自慢の一串をあなたに。",
    image_url: "/images/concept.jpg",
    sort_order: 1,
    visible: true,
  },
  {
    id: "s2",
    eyebrow: "CHARCOAL",
    title: "炭火の力で、\n旨味を閉じ込める。",
    body: "表面は香ばしく、中はふっくら。\n火の通りを見極め、一本ずつ焼き上げます。",
    image_url: "/images/hero.jpg",
    sort_order: 2,
    visible: true,
  },
  {
    id: "s3",
    eyebrow: "OUR SPACE",
    title: "仕事帰りにふらっと立ち寄れる、\n温かな隠れ家。",
    body: "今宵も、美味しいお酒と仲間たちが待っています。",
    image_url: "/images/space.jpg",
    sort_order: 3,
    visible: true,
  },
];

export const DEFAULT_MENU: MenuItem[] = [
  { id: "m1", category: "牛串", name: "特選 牛串", description: "肩ロースを厚切りに。塩でもタレでも。", price: 580, image_url: "/images/menu-1.jpg", featured: true, sort_order: 1, visible: true },
  { id: "m2", category: "牛串", name: "ねぎ塩 牛串", description: "たっぷりの青ねぎと特製塩だれで。", price: 520, image_url: "/images/menu-2.jpg", featured: true, sort_order: 2, visible: true },
  { id: "m3", category: "牛串", name: "秘伝だれ 牛串", description: "継ぎ足しの甘辛だれを重ね焼き。", price: 520, image_url: "/images/menu-3.jpg", featured: true, sort_order: 3, visible: true },
  { id: "m4", category: "牛串", name: "おろしポン酢 牛串", description: "大根おろしでさっぱりと。", price: 540, image_url: "/images/menu-4.jpg", featured: true, sort_order: 4, visible: true },
  { id: "m5", category: "逸品料理", name: "牛すじ煮込み", description: "とろとろになるまで煮込んだ定番。", price: 680, image_url: "", featured: false, sort_order: 5, visible: true },
  { id: "m6", category: "逸品料理", name: "炙り牛タン", description: "炭火で表面だけを香ばしく。", price: 880, image_url: "", featured: false, sort_order: 6, visible: true },
  { id: "m7", category: "逸品料理", name: "〆のガーリックライス", description: "牛脂の旨味を吸わせた一品。", price: 650, image_url: "", featured: false, sort_order: 7, visible: true },
  { id: "m8", category: "お酒・こだわり", name: "生ビール", description: "キンキンに冷えた一杯を。", price: 550, image_url: "", featured: false, sort_order: 8, visible: true },
  { id: "m9", category: "お酒・こだわり", name: "濃いめハイボール", description: "串との相性は抜群。", price: 500, image_url: "", featured: false, sort_order: 9, visible: true },
  { id: "m10", category: "お酒・こだわり", name: "茨城の地酒", description: "季節ごとに入れ替わる地元の銘柄。", price: null, image_url: "", featured: false, sort_order: 10, visible: true },
];

export const DEFAULT_NEWS: NewsItem[] = [
  { id: "n1", published_on: "2025-11-01", tag: "新メニュー", title: "秋の味覚、きのこ串が登場しました！", body: "香り豊かなきのこを炭火で焼き上げた季節限定の串です。", published: true },
  { id: "n2", published_on: "2025-10-15", tag: "お知らせ", title: "営業時間変更のお知らせ（10/20〜）", body: "10月20日より営業時間を変更いたします。", published: true },
  { id: "n3", published_on: "2025-09-30", tag: "イベント", title: "研究学園まつりに出店します！", body: "当日は特製牛串を販売予定です。", published: true },
];

export const DEFAULT_LINKS: LinkItem[] = [
  { id: "l1", area: "public", label: "席を予約する", sublabel: "WEB予約", url: "#", icon: "calendar", sort_order: 1, visible: true },
  { id: "l2", area: "public", label: "お席から簡単注文", sublabel: "モバイルオーダー", url: "#", icon: "order", sort_order: 2, visible: true },
  { id: "l3", area: "staff", label: "シフト管理アプリ", sublabel: "シフトの確認・提出", url: "#", icon: "shift", sort_order: 1, visible: true },
];
