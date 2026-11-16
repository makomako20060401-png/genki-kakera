import Link from "next/link";
import Icon from "@/components/Icon";
import MenuTabs from "@/components/MenuTabs";
import { formatDate, getMenu, getNews, getPublicLinks, getSettings, getStory } from "@/lib/data";

export const revalidate = 60;

function Lines({ text }: { text: string }) {
  return (
    <>
      {text.split("\n").map((line, i) => (
        <span key={i} className="line">
          {line}
        </span>
      ))}
    </>
  );
}

export default async function Home() {
  const [s, story, menu, news, links] = await Promise.all([
    getSettings(),
    getStory(),
    getMenu(),
    getNews(3),
    getPublicLinks(),
  ]);
  const gallery = s.gallery_images.filter(Boolean);

  return (
    <>
      {/* ===== ファーストビュー ===== */}
      <section className="hero">
        <div className="hero__bg" aria-hidden>
          <img src={s.hero_image} alt="" fetchPriority="high" />
        </div>
        <div className="hero__glow" aria-hidden />
        <div className="hero__inner">
          <h1 className="hero__title">
            {s.hero_title.split("\n").map((line, i) => (
              <span key={i} className="hero__line" style={{ animationDelay: `${0.35 + i * 0.45}s` }}>
                {line}
              </span>
            ))}
          </h1>
          <span className="hero__rule" aria-hidden />
          <p className="hero__sub">{s.hero_subtitle}</p>
        </div>
        <a href="#concept" className="hero__scroll" aria-label="下へスクロール">
          <span>Scroll</span>
          <span className="hero__scroll-line" />
        </a>
      </section>

      {/* ===== 写真とことばが流れてくるストーリー ===== */}
      <section className="story" id="concept">
        {story.map((sec, i) => (
          <article key={sec.id} className={`story__item${i % 2 ? " is-reverse" : ""}`}>
            <div className="story__media reveal reveal--side" data-from={i % 2 ? "right" : "left"}>
              <div className="story__frame">
                <div className="story__img" data-parallax="0.08">
                  {sec.image_url && <img src={sec.image_url} alt={sec.title.replace(/\n/g, "")} loading="lazy" decoding="async" />}
                </div>
              </div>
            </div>
            <div className="story__text">
              <p className="eyebrow reveal" style={{ ["--d" as string]: ".15s" }}>
                {sec.eyebrow}
              </p>
              <h2 className="story__title reveal" style={{ ["--d" as string]: ".3s" }}>
                <Lines text={sec.title} />
              </h2>
              {sec.body && (
                <p className="story__body reveal pc-only" style={{ ["--d" as string]: ".5s" }}>
                  <Lines text={sec.body} />
                </p>
              )}
            </div>
          </article>
        ))}
      </section>

      {/* ===== 写真が流れる帯 ===== */}
      {gallery.length > 0 && (
        <div className="marquee reveal" aria-hidden>
          <div className="marquee__track">
            {[...gallery, ...gallery].map((src, i) => (
              <div className="marquee__item" key={i}>
                <img src={src} alt="" loading="lazy" decoding="async" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===== メニュー ===== */}
      <section className="section" id="menu">
        <header className="section-head reveal">
          <h2 className="section-head__en">MENU</h2>
          <p className="section-head__ja">名物メニュー</p>
        </header>
        <div className="reveal" style={{ ["--d" as string]: ".15s" }}>
          <MenuTabs categories={s.menu_categories} items={menu} />
        </div>
        <div className="section-more reveal">
          <Link href="/menu" className="btn btn--outline btn--sm">
            全メニューを見る <Icon name="arrow" size={14} />
          </Link>
        </div>
      </section>

      {/* ===== ニュース ===== */}
      <section className="section section--news" id="news">
        <header className="section-head reveal">
          <h2 className="section-head__en">NEWS</h2>
          <p className="section-head__ja">お知らせ</p>
        </header>
        <ul className="news-list">
          {news.map((n, i) => (
            <li key={n.id} className="reveal" style={{ ["--d" as string]: `${i * 0.1}s` }}>
              <Link href={`/news/${n.id}`} className="news-row">
                <time dateTime={n.published_on}>{formatDate(n.published_on)}</time>
                <span className="tag pc-only" data-tag={n.tag}>
                  {n.tag}
                </span>
                <span className="news-row__title">{n.title}</span>
              </Link>
            </li>
          ))}
          {news.length === 0 && <li className="muted">現在お知らせはありません。</li>}
        </ul>
        <div className="section-more reveal">
          <Link href="/news" className="btn btn--outline btn--sm">
            一覧を見る <Icon name="arrow" size={14} />
          </Link>
        </div>
      </section>

      {/* ===== 予約・注文への入口 ===== */}
      <section className="cta">
        <div className="cta__bg" aria-hidden data-parallax="0.06">
          <img src={s.cta_image} alt="" loading="lazy" />
        </div>
        <div className="cta__inner">
          <p className="cta__title reveal reveal--side" data-from="left">
            {s.cta_title}
          </p>
          <div className="cta__buttons pc-only">
            {links.map((l, i) => (
              <a
                key={l.id}
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`cta-btn reveal${i === 0 ? " cta-btn--gold" : ""}`}
                style={{ ["--d" as string]: `${0.2 + i * 0.15}s` }}
              >
                <Icon name={l.icon} size={30} />
                <span className="cta-btn__text">
                  <strong>{l.label}</strong>
                  {l.sublabel && <small>（{l.sublabel}）</small>}
                </span>
                <Icon name="arrow" size={16} />
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
