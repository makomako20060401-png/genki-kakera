import DeleteButton from "@/components/admin/DeleteButton";
import Flash from "@/components/admin/Flash";
import { adminNews } from "@/lib/admin-data";
import { formatDate } from "@/lib/data";
import type { NewsItem } from "@/lib/types";
import { deleteNews, saveNews } from "../actions";

type Props = { searchParams: Promise<{ msg?: string; error?: string; t?: string }> };

const TAGS = ["お知らせ", "新メニュー", "イベント", "営業情報"];

function NewsForm({ item }: { item?: NewsItem }) {
  const today = new Date(Date.now() + 9 * 3600e3).toISOString().slice(0, 10);
  return (
    <form action={saveNews} className="admin-form">
      {item && <input type="hidden" name="id" value={item.id} />}
      <div className="field-grid">
        <label className="field">
          <span>日付</span>
          <input type="date" name="published_on" required defaultValue={item?.published_on ?? today} />
        </label>
        <label className="field">
          <span>ラベル</span>
          <input name="tag" list="news-tags" defaultValue={item?.tag ?? "お知らせ"} />
        </label>
      </div>
      <label className="field">
        <span>タイトル</span>
        <input name="title" required defaultValue={item?.title ?? ""} />
      </label>
      <label className="field">
        <span>本文</span>
        <textarea name="body" rows={6} defaultValue={item?.body ?? ""} />
      </label>
      <label className="check">
        <input type="checkbox" name="published" defaultChecked={item?.published ?? true} /> 公開する（外すと下書き）
      </label>
      <div className="admin-actions">
        <button className="btn btn--gold btn--sm" type="submit">
          {item ? "保存" : "投稿する"}
        </button>
        {item && <DeleteButton action={deleteNews} />}
      </div>
    </form>
  );
}

export default async function AdminNews({ searchParams }: Props) {
  const [{ msg, error, t }, items] = await Promise.all([searchParams, adminNews()]);
  return (
    <div key={t}>
      <h1 className="admin-title">ニュース</h1>
      <p className="portal-muted">新しい日付のものから表示されます。トップページには最新3件が出ます。</p>
      <Flash msg={msg} error={error} />
      <datalist id="news-tags">
        {TAGS.map((t) => (
          <option key={t} value={t} />
        ))}
      </datalist>

      <details className="item item--new" open={items.length === 0}>
        <summary>＋ ニュースを投稿</summary>
        <NewsForm />
      </details>

      {items.map((it) => (
        <details key={it.id} className={`item${it.published ? "" : " is-hidden"}`}>
          <summary>
            <span className="item__date">{formatDate(it.published_on)}</span>
            <span className="item__name">
              <small>{it.tag}</small>
              {it.title}
            </span>
            {!it.published && <span className="badge">下書き</span>}
          </summary>
          <NewsForm item={it} />
        </details>
      ))}
    </div>
  );
}
