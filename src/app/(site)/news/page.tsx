import type { Metadata } from "next";
import Link from "next/link";
import { formatDate, getNews } from "@/lib/data";

export const revalidate = 60;
export const metadata: Metadata = { title: "お知らせ" };

export default async function NewsPage() {
  const news = await getNews();
  return (
    <div className="page">
      <header className="section-head reveal">
        <h1 className="section-head__en">NEWS</h1>
        <p className="section-head__ja">お知らせ</p>
      </header>
      <ul className="news-list news-list--page">
        {news.map((n, i) => (
          <li key={n.id} className="reveal" style={{ ["--d" as string]: `${Math.min(i, 6) * 0.06}s` }}>
            <Link href={`/news/${n.id}`} className="news-row">
              <time dateTime={n.published_on}>{formatDate(n.published_on)}</time>
              <span className="tag" data-tag={n.tag}>
                {n.tag}
              </span>
              <span className="news-row__title">{n.title}</span>
            </Link>
          </li>
        ))}
        {news.length === 0 && <li className="muted">現在お知らせはありません。</li>}
      </ul>
    </div>
  );
}
