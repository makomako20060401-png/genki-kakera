"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Icon from "./Icon";
import Logo from "./Logo";
import type { LinkItem } from "@/lib/types";

const NAV = [
  { href: "/#concept", en: "Concept", ja: "料理・空間について" },
  { href: "/#menu", en: "Menu", ja: "お品書き" },
  { href: "/#news", en: "News", ja: "お知らせ" },
  { href: "/#access", en: "Access", ja: "アクセス" },
];

export default function Header({ links }: { links: LinkItem[] }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const primary = links[0];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <>
      <header className={`site-header${scrolled || pathname !== "/" ? " is-scrolled" : ""}`}>
        <Logo size="sm" />
        <nav className="site-nav pc-only" aria-label="メインメニュー">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="site-nav__item">
              <span className="site-nav__en">{n.en}</span>
              <span className="site-nav__ja">{n.ja}</span>
            </Link>
          ))}
        </nav>
        <div className="site-header__actions">
          {primary && (
            <a className="btn btn--outline btn--sm pc-only" href={primary.url} target="_blank" rel="noopener noreferrer">
              <Icon name={primary.icon} size={18} />
              <span>{primary.sublabel || primary.label}</span>
              <Icon name="arrow" size={14} />
            </a>
          )}
          <Link href="/staff" className="staff-tab pc-only" aria-label="従業員用ページ">
            <Icon name="lock" size={18} />
            <span>Staff</span>
          </Link>
          <button
            className="hamburger sp-only"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "メニューを閉じる" : "メニューを開く"}
            aria-expanded={open}
          >
            <Icon name={open ? "close" : "menu"} size={24} />
          </button>
        </div>
      </header>

      <div className={`drawer${open ? " is-open" : ""}`} aria-hidden={!open}>
        <nav className="drawer__nav">
          {NAV.map((n, i) => (
            <Link key={n.href} href={n.href} style={{ transitionDelay: `${0.05 * i + 0.1}s` }} onClick={() => setOpen(false)}>
              <span className="drawer__en">{n.en}</span>
              <span className="drawer__ja">{n.ja}</span>
            </Link>
          ))}
        </nav>
        <div className="drawer__links">
          {links.map((l) => (
            <a key={l.id} href={l.url} target="_blank" rel="noopener noreferrer" className="btn btn--outline">
              <Icon name={l.icon} size={18} />
              <span>{l.sublabel || l.label}</span>
            </a>
          ))}
          <Link href="/staff" className="drawer__staff" onClick={() => setOpen(false)}>
            <Icon name="lock" size={16} /> Staff
          </Link>
        </div>
      </div>
    </>
  );
}
