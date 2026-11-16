import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Icon from "@/components/Icon";
import { formatDate, getNewsItem } from "@/lib/data";

export const revalidate = 60;

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const item = await getNewsItem(id);
  return { title: item?.title ?? "お知らせ" };
}

export default async function NewsDetail({ params }: Props) {
  const { id } = await params;
  const item = await getNewsItem(id);
  if (!item) notFound();

  return (
    <article className="page page--narrow">
      <p className="news-meta reveal">
        <time dateTime={item.published_on}>{formatDate(item.published_on)}</time>
        <span className="tag" data-tag={item.tag}>
          {item.tag}
        </span>
      </p>
      <h1 className="news-title reveal" style={{ ["--d" as string]: ".1s" }}>
        {item.title}
      </h1>
      <div className="news-body reveal" style={{ ["--d" as string]: ".2s" }}>
        {item.body.split("\n").map((p, i) => (p ? <p key={i}>{p}</p> : <br key={i} />))}
      </div>
      <Link href="/news" className="btn btn--outline btn--sm">
        <Icon name="arrow" size={14} className="flip" /> 一覧へ戻る
      </Link>
    </article>
  );
}
