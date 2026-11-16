"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/admin", label: "基本情報・写真" },
  { href: "/admin/story", label: "写真と文章" },
  { href: "/admin/menu", label: "メニュー" },
  { href: "/admin/news", label: "ニュース" },
  { href: "/admin/links", label: "外部リンク" },
];

export default function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="admin-nav" aria-label="管理メニュー">
      {ITEMS.map((i) => (
        <Link key={i.href} href={i.href} className={pathname === i.href ? "is-active" : ""}>
          {i.label}
        </Link>
      ))}
    </nav>
  );
}
