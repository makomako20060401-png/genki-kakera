import SubmitButton from "@/components/SubmitButton";
import DeleteButton from "@/components/admin/DeleteButton";
import Flash from "@/components/admin/Flash";
import ImageUpload from "@/components/admin/ImageUpload";
import { adminMenu, adminSettings } from "@/lib/admin-data";
import { formatPrice } from "@/lib/data";
import type { MenuItem } from "@/lib/types";
import { deleteMenu, saveMenu } from "../actions";

type Props = { searchParams: Promise<{ msg?: string; error?: string; t?: string }> };

function MenuForm({ item, categories, nextOrder }: { item?: MenuItem; categories: string[]; nextOrder: number }) {
  return (
    <form action={saveMenu} className="admin-form">
      {item && <input type="hidden" name="id" value={item.id} />}
      <ImageUpload name="image_url" defaultValue={item?.image_url} />
      <div className="field-grid">
        <label className="field">
          <span>品名</span>
          <input name="name" required defaultValue={item?.name ?? ""} />
        </label>
        <label className="field">
          <span>カテゴリ</span>
          <select name="category" defaultValue={item?.category ?? categories[0]}>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
            {item && !categories.includes(item.category) && <option value={item.category}>{item.category}</option>}
          </select>
        </label>
      </div>
      <label className="field">
        <span>ひとこと説明</span>
        <textarea name="description" rows={2} defaultValue={item?.description ?? ""} />
      </label>
      <div className="field-grid">
        <label className="field">
          <span>価格（円・空欄なら「時価」）</span>
          <input name="price" inputMode="numeric" defaultValue={item?.price ?? ""} />
        </label>
        <label className="field">
          <span>並び順（小さいほど上）</span>
          <input name="sort_order" type="number" defaultValue={item?.sort_order ?? nextOrder} />
        </label>
      </div>
      <div className="field-grid">
        <label className="check">
          <input type="checkbox" name="featured" defaultChecked={item?.featured ?? false} /> トップページでおすすめ表示
        </label>
        <label className="check">
          <input type="checkbox" name="visible" defaultChecked={item?.visible ?? true} /> サイトに表示する
        </label>
      </div>
      <div className="admin-actions">
        <SubmitButton className="btn btn--gold btn--sm" pendingText={item ? "保存中…" : "追加中…"}>{item ? "保存" : "追加する"}</SubmitButton>
        {item && <DeleteButton action={deleteMenu} />}
      </div>
    </form>
  );
}

export default async function AdminMenu({ searchParams }: Props) {
  const [{ msg, error, t }, items, s] = await Promise.all([searchParams, adminMenu(), adminSettings()]);
  const nextOrder = Math.max(0, ...items.map((i) => i.sort_order)) + 1;
  const extra = Array.from(new Set(items.map((i) => i.category))).filter((c) => !s.menu_categories.includes(c));
  const groups = [...s.menu_categories, ...extra];

  return (
    <div key={t}>
      <h1 className="admin-title">メニュー</h1>
      <p className="portal-muted">
        トップページには各カテゴリの「おすすめ」から最大4品が表示されます。カテゴリの追加・並び替えは「基本情報・写真」タブで。
      </p>
      <Flash msg={msg} error={error} />

      <details className="item item--new">
        <summary>＋ メニューを追加</summary>
        <MenuForm categories={s.menu_categories} nextOrder={nextOrder} />
      </details>

      {groups.map((g) => {
        const list = items.filter((i) => i.category === g);
        if (!list.length) return null;
        return (
          <section key={g} className="admin-group">
            <h2>{g}</h2>
            {list.map((it) => (
              <details key={it.id} className={`item${it.visible ? "" : " is-hidden"}`}>
                <summary>
                  <span className="item__thumb">{it.image_url && <img src={it.image_url} alt="" />}</span>
                  <span className="item__name">
                    {it.name}
                    <small>{formatPrice(it.price)}</small>
                  </span>
                  {it.featured && <span className="badge badge--gold">おすすめ</span>}
                  {!it.visible && <span className="badge">非表示</span>}
                </summary>
                <MenuForm item={it} categories={s.menu_categories} nextOrder={nextOrder} />
              </details>
            ))}
          </section>
        );
      })}
    </div>
  );
}
