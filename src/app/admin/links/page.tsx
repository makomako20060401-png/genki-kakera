import SubmitButton from "@/components/SubmitButton";
import DeleteButton from "@/components/admin/DeleteButton";
import Flash from "@/components/admin/Flash";
import Icon from "@/components/Icon";
import { adminLinks } from "@/lib/admin-data";
import { LINK_ICONS, type LinkArea, type LinkItem } from "@/lib/types";
import { deleteLink, saveLink } from "../actions";

type Props = { searchParams: Promise<{ msg?: string; error?: string; t?: string }> };

function LinkForm({ item, area, nextOrder }: { item?: LinkItem; area: LinkArea; nextOrder: number }) {
  return (
    <form action={saveLink} className="admin-form">
      {item && <input type="hidden" name="id" value={item.id} />}
      <div className="field-grid">
        <label className="field">
          <span>ボタンの文字</span>
          <input name="label" required defaultValue={item?.label ?? ""} placeholder="席を予約する" />
        </label>
        <label className="field">
          <span>補足（小さい文字）</span>
          <input name="sublabel" defaultValue={item?.sublabel ?? ""} placeholder="WEB予約" />
        </label>
      </div>
      <label className="field">
        <span>リンク先URL</span>
        <input name="url" type="url" required defaultValue={item?.url === "#" ? "" : item?.url ?? ""} placeholder="https://..." />
      </label>
      <div className="field-grid field-grid--3">
        <label className="field">
          <span>アイコン</span>
          <select name="icon" defaultValue={item?.icon ?? "link"}>
            {LINK_ICONS.map((i) => (
              <option key={i.value} value={i.value}>
                {i.label}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>表示場所</span>
          <select name="area" defaultValue={item?.area ?? area}>
            <option value="public">サイト（お客さま向け）</option>
            <option value="staff">スタッフページ（ログイン必須）</option>
          </select>
        </label>
        <label className="field">
          <span>並び順</span>
          <input name="sort_order" type="number" defaultValue={item?.sort_order ?? nextOrder} />
        </label>
      </div>
      <label className="check">
        <input type="checkbox" name="visible" defaultChecked={item?.visible ?? true} /> 表示する
      </label>
      <div className="admin-actions">
        <SubmitButton className="btn btn--gold btn--sm" pendingText={item ? "保存中…" : "追加中…"}>{item ? "保存" : "追加する"}</SubmitButton>
        {item && <DeleteButton action={deleteLink} />}
      </div>
    </form>
  );
}

function Group({ title, note, area, items }: { title: string; note: string; area: LinkArea; items: LinkItem[] }) {
  const nextOrder = Math.max(0, ...items.map((i) => i.sort_order)) + 1;
  return (
    <section className="admin-group">
      <h2>{title}</h2>
      <p className="portal-muted small">{note}</p>
      <details className="item item--new">
        <summary>＋ リンクを追加</summary>
        <LinkForm area={area} nextOrder={nextOrder} />
      </details>
      {items.map((it) => (
        <details key={it.id} className={`item${it.visible ? "" : " is-hidden"}`}>
          <summary>
            <span className="item__icon">
              <Icon name={it.icon} size={22} />
            </span>
            <span className="item__name">
              {it.label}
              <small>{it.url && it.url !== "#" ? it.url : "⚠ URL未設定"}</small>
            </span>
            {!it.visible && <span className="badge">非表示</span>}
          </summary>
          <LinkForm item={it} area={area} nextOrder={nextOrder} />
        </details>
      ))}
    </section>
  );
}

export default async function AdminLinks({ searchParams }: Props) {
  const [{ msg, error, t }, items] = await Promise.all([searchParams, adminLinks()]);
  return (
    <div key={t}>
      <h1 className="admin-title">外部リンク</h1>
      <Flash msg={msg} error={error} />
      <Group
        title="サイト（お客さま向け）"
        note="ヘッダー・予約帯・スマホ下部のボタンに表示されます。1つ目がメインのボタン（金色）になります。"
        area="public"
        items={items.filter((i) => i.area === "public")}
      />
      <Group
        title="スタッフページ"
        note="ログインしたスタッフだけに表示されます。シフトアプリなどのURLをここに登録してください。"
        area="staff"
        items={items.filter((i) => i.area === "staff")}
      />
    </div>
  );
}
