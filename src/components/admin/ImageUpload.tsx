"use client";

import { useRef, useState } from "react";
import { IMAGE_BUCKET, isSupabaseConfigured } from "@/lib/supabase/config";
import { createBrowserSupabase } from "@/lib/supabase/client";

/** 画像を最大 1920px に縮小して JPEG にする（スマホ写真をそのまま上げても重くならないように） */
async function shrink(file: File, max = 1920): Promise<Blob> {
  if (!file.type.startsWith("image/") || file.type === "image/gif" || file.type === "image/svg+xml") return file;
  const bmp = await createImageBitmap(file);
  const scale = Math.min(1, max / Math.max(bmp.width, bmp.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bmp.width * scale);
  canvas.height = Math.round(bmp.height * scale);
  canvas.getContext("2d")!.drawImage(bmp, 0, 0, canvas.width, canvas.height);
  return await new Promise((resolve) => canvas.toBlob((b) => resolve(b ?? file), "image/jpeg", 0.86));
}

type Props = { name: string; defaultValue?: string; label?: string; onRemove?: () => void };

export default function ImageUpload({ name, defaultValue = "", label = "写真", onRemove }: Props) {
  const [url, setUrl] = useState(defaultValue);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const input = useRef<HTMLInputElement>(null);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setErr("");
    setBusy(true);
    try {
      const blob = await shrink(file);
      const ext = blob.type === "image/jpeg" ? "jpg" : file.name.split(".").pop() || "img";
      const path = `uploads/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const supabase = createBrowserSupabase();
      const { error } = await supabase.storage.from(IMAGE_BUCKET).upload(path, blob, {
        contentType: blob.type || file.type,
        cacheControl: "31536000",
      });
      if (error) throw error;
      setUrl(supabase.storage.from(IMAGE_BUCKET).getPublicUrl(path).data.publicUrl);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "アップロードに失敗しました");
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  }

  return (
    <div className="img-field">
      <span className="img-field__label">{label}</span>
      <div className="img-field__row">
        <div className="img-field__preview">{url ? <img src={url} alt="" /> : <span>写真なし</span>}</div>
        <div className="img-field__ctrl">
          <label className={`btn btn--outline btn--sm${busy || !isSupabaseConfigured ? " is-disabled" : ""}`}>
            {busy ? "アップロード中…" : "写真を選ぶ"}
            <input ref={input} type="file" accept="image/*" onChange={onFile} hidden disabled={busy || !isSupabaseConfigured} />
          </label>
          {url && (
            <button type="button" className="link-btn" onClick={() => (onRemove ? onRemove() : setUrl(""))}>
              写真を外す
            </button>
          )}
          <input
            className="img-field__url"
            type="text"
            name={name}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="または画像URLを貼り付け"
          />
          {err && <p className="portal-alert">{err}</p>}
        </div>
      </div>
    </div>
  );
}
