import SubmitButton from "@/components/SubmitButton";
import DeleteButton from "@/components/admin/DeleteButton";
import Flash from "@/components/admin/Flash";
import ImageUpload from "@/components/admin/ImageUpload";
import { adminStory } from "@/lib/admin-data";
import type { StorySection } from "@/lib/types";
import { deleteStory, saveStory } from "../actions";

type Props = { searchParams: Promise<{ msg?: string; error?: string; t?: string }> };

function StoryForm({ item, nextOrder }: { item?: StorySection; nextOrder: number }) {
  return (
    <form action={saveStory} className="admin-form">
      {item && <input type="hidden" name="id" value={item.id} />}
      <ImageUpload name="image_url" defaultValue={item?.image_url} />
      <label className="field">
        <span>小見出し（英字など）</span>
        <input name="eyebrow" defaultValue={item?.eyebrow ?? ""} placeholder="CONCEPT" />
      </label>
      <label className="field">
        <span>見出し（改行できます・スマホではこれだけ表示）</span>
        <textarea name="title" rows={2} required defaultValue={item?.title ?? ""} />
      </label>
      <label className="field">
        <span>本文（PCのみ表示）</span>
        <textarea name="body" rows={3} defaultValue={item?.body ?? ""} />
      </label>
      <div className="field-grid">
        <label className="field">
          <span>並び順（小さいほど上）</span>
          <input name="sort_order" type="number" defaultValue={item?.sort_order ?? nextOrder} />
        </label>
        <label className="check">
          <input type="checkbox" name="visible" defaultChecked={item?.visible ?? true} /> サイトに表示する
        </label>
      </div>
      <div className="admin-actions">
        <SubmitButton className="btn btn--gold btn--sm" pendingText={item ? "保存中…" : "追加中…"}>{item ? "保存" : "追加する"}</SubmitButton>
        {item && <DeleteButton action={deleteStory} />}
      </div>
    </form>
  );
}

export default async function AdminStory({ searchParams }: Props) {
  const [{ msg, error, t }, items] = await Promise.all([searchParams, adminStory()]);
  const nextOrder = Math.max(0, ...items.map((i) => i.sort_order)) + 1;

  return (
    <div key={t}>
      <h1 className="admin-title">写真と文章</h1>
      <p className="portal-muted">トップページでスクロールすると流れてくる「写真＋文章」のブロックです。左右交互に表示されます。</p>
      <Flash msg={msg} error={error} />

      <details className="item item--new">
        <summary>＋ 新しいブロックを追加</summary>
        <StoryForm nextOrder={nextOrder} />
      </details>

      {items.map((it) => (
        <details key={it.id} className={`item${it.visible ? "" : " is-hidden"}`}>
          <summary>
            <span className="item__thumb">{it.image_url && <img src={it.image_url} alt="" />}</span>
            <span className="item__name">
              <small>{it.eyebrow}</small>
              {it.title.replace(/\n/g, " ")}
            </span>
            {!it.visible && <span className="badge">非表示</span>}
          </summary>
          <StoryForm item={it} nextOrder={nextOrder} />
        </details>
      ))}
    </div>
  );
}
