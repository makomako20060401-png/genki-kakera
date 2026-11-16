"use client";

import { useState } from "react";
import type { MenuItem } from "@/lib/types";
import { formatPrice } from "@/lib/format";

export default function MenuTabs({ categories, items }: { categories: string[]; items: MenuItem[] }) {
  const cats = categories.filter((c) => items.some((i) => i.category === c));
  const [active, setActive] = useState(cats[0] ?? "");
  const list = items.filter((i) => i.category === active);
  // トップでは「おすすめ」を優先して最大4品
  const shown = [...list.filter((i) => i.featured), ...list.filter((i) => !i.featured)].slice(0, 4);

  return (
    <div className="menu-tabs">
      <div className="menu-tabs__bar" role="tablist">
        {cats.map((c) => (
          <button
            key={c}
            role="tab"
            aria-selected={active === c}
            className={`menu-tabs__tab${active === c ? " is-active" : ""}`}
            onClick={() => setActive(c)}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="menu-cards" key={active}>
        {shown.map((m, i) => (
          <article key={m.id} className="menu-card" style={{ animationDelay: `${i * 0.08}s` }}>
            <div className="menu-card__img">
              {m.image_url ? (
                <img src={m.image_url} alt={m.name} loading="lazy" decoding="async" />
              ) : (
                <span className="menu-card__noimg">{m.name.slice(0, 1)}</span>
              )}
            </div>
            <div className="menu-card__body">
              <h3>{m.name}</h3>
              <p className="menu-card__price">{formatPrice(m.price)}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
