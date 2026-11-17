import SubmitButton from "@/components/SubmitButton";
import Flash from "@/components/admin/Flash";
import GalleryEditor from "@/components/admin/GalleryEditor";
import ImageUpload from "@/components/admin/ImageUpload";
import { adminSettings } from "@/lib/admin-data";
import { saveSettings } from "./actions";

type Props = { searchParams: Promise<{ msg?: string; error?: string; t?: string }> };

export default async function AdminSettings({ searchParams }: Props) {
  const [{ msg, error, t }, s] = await Promise.all([searchParams, adminSettings()]);

  return (
    <div key={t}>
      <h1 className="admin-title">基本情報・写真</h1>
      <Flash msg={msg} error={error} />
      <form action={saveSettings} className="admin-form">
        <fieldset className="panel">
          <legend>ファーストビュー（一番上の大きな写真）</legend>
          <label className="field">
            <span>キャッチコピー（改行できます）</span>
            <textarea name="hero_title" rows={2} defaultValue={s.hero_title} />
          </label>
          <label className="field">
            <span>サブコピー</span>
            <input name="hero_subtitle" defaultValue={s.hero_subtitle} />
          </label>
          <ImageUpload name="hero_image" defaultValue={s.hero_image} label="背景の写真（横長がおすすめ）" />
        </fieldset>

        <fieldset className="panel">
          <legend>写真が流れる帯</legend>
          <p className="portal-muted small">ストーリーの下で横にゆっくり流れる写真です。料理や店内の写真を5〜8枚ほど。</p>
          <GalleryEditor initial={s.gallery_images} />
        </fieldset>

        <fieldset className="panel">
          <legend>予約・注文の誘導帯</legend>
          <label className="field">
            <span>ひとこと</span>
            <input name="cta_title" defaultValue={s.cta_title} />
          </label>
          <ImageUpload name="cta_image" defaultValue={s.cta_image} label="背景の写真" />
          <p className="portal-muted small">ボタンの文字やリンク先は「外部リンク」タブで編集できます。</p>
        </fieldset>

        <fieldset className="panel">
          <legend>店舗情報</legend>
          <div className="field-grid">
            <label className="field">
              <span>郵便番号</span>
              <input name="postal" defaultValue={s.postal} />
            </label>
            <label className="field">
              <span>電話番号（空欄なら非表示）</span>
              <input name="tel" defaultValue={s.tel} />
            </label>
          </div>
          <label className="field">
            <span>住所</span>
            <input name="address" defaultValue={s.address} />
          </label>
          <div className="field-grid">
            <label className="field">
              <span>営業時間</span>
              <input name="hours" defaultValue={s.hours} />
            </label>
            <label className="field">
              <span>定休日</span>
              <input name="holiday" defaultValue={s.holiday} />
            </label>
          </div>
          <label className="field">
            <span>地図の検索ワード（住所や店名。Googleマップで検索される文字）</span>
            <input name="map_query" defaultValue={s.map_query} />
          </label>
          <label className="field">
            <span>フッターのひとこと</span>
            <input name="tagline" defaultValue={s.tagline} />
          </label>
        </fieldset>

        <fieldset className="panel">
          <legend>SNS</legend>
          <label className="field">
            <span>Instagram のURL（空欄なら非表示）</span>
            <input name="instagram_url" type="url" defaultValue={s.instagram_url} />
          </label>
          <label className="field">
            <span>X（旧Twitter）のURL（空欄なら非表示）</span>
            <input name="x_url" type="url" defaultValue={s.x_url} />
          </label>
        </fieldset>

        <fieldset className="panel">
          <legend>メニューのカテゴリ</legend>
          <label className="field">
            <span>1行に1つ。上から順にタブとして並びます。</span>
            <textarea name="menu_categories" rows={4} defaultValue={s.menu_categories.join("\n")} />
          </label>
        </fieldset>

        <div className="admin-actions">
          <SubmitButton pendingText="保存中…">保存する</SubmitButton>
        </div>
      </form>
    </div>
  );
}
