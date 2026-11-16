import type { Metadata } from "next";
import { formatPrice, getMenu, getSettings } from "@/lib/data";

export const revalidate = 60;
export const metadata: Metadata = { title: "メニュー" };

export default async function MenuPage() {
  const [s, menu] = await Promise.all([getSettings(), getMenu()]);
  const others = Array.from(new Set(menu.map((m) => m.category))).filter((c) => !s.menu_categories.includes(c));
  const cats = [...s.menu_categories, ...others].filter((c) => menu.some((m) => m.category === c));

  return (
    <div className="page">
      <header className="section-head reveal">
        <h1 className="section-head__en">MENU</h1>
        <p className="section-head__ja">お品書き</p>
      </header>

      <nav className="cat-jump reveal">
        {cats.map((c) => (
          <a key={c} href={`#cat-${encodeURIComponent(c)}`}>
            {c}
          </a>
        ))}
      </nav>

      {cats.map((c) => (
        <section key={c} id={`cat-${encodeURIComponent(c)}`} className="menu-cat">
          <h2 className="menu-cat__title reveal">{c}</h2>
          <ul className="menu-list">
            {menu
              .filter((m) => m.category === c)
              .map((m, i) => (
                <li key={m.id} className="menu-row reveal" style={{ ["--d" as string]: `${(i % 4) * 0.08}s` }}>
                  {m.image_url && (
                    <div className="menu-row__img">
                      <img src={m.image_url} alt={m.name} loading="lazy" decoding="async" />
                    </div>
                  )}
                  <div className="menu-row__body">
                    <div className="menu-row__head">
                      <h3>{m.name}</h3>
                      <span className="menu-row__dots" aria-hidden />
                      <span className="menu-row__price">{formatPrice(m.price)}</span>
                    </div>
                    {m.description && <p className="menu-row__desc">{m.description}</p>}
                  </div>
                </li>
              ))}
          </ul>
        </section>
      ))}
      <p className="note">※ 価格はすべて税込です。仕入れ状況により内容が変わる場合があります。</p>
    </div>
  );
}
