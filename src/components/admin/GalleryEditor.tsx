"use client";

import { useState } from "react";
import ImageUpload from "./ImageUpload";

export default function GalleryEditor({ initial }: { initial: string[] }) {
  const [items, setItems] = useState(() => initial.map((url, i) => ({ key: `${i}-${url}`, url })));

  return (
    <div className="gallery-editor">
      {items.map((it, i) => (
        <div key={it.key} className="gallery-editor__item">
          <ImageUpload
            name="gallery_images"
            defaultValue={it.url}
            label={`写真 ${i + 1}`}
            onRemove={() => setItems((arr) => arr.filter((x) => x.key !== it.key))}
          />
        </div>
      ))}
      <button
        type="button"
        className="btn btn--outline btn--sm"
        onClick={() => setItems((arr) => [...arr, { key: `new-${Date.now()}`, url: "" }])}
      >
        ＋ 写真を追加
      </button>
    </div>
  );
}
