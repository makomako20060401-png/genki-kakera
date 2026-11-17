/** 管理画面のタブ切り替え中：一覧の形をした骨組みを先に出す */
export default function Loading() {
  return (
    <div role="status" aria-live="polite" aria-label="読み込み中">
      <div className="skeleton skeleton--title" />
      <div className="skeleton skeleton--text" />
      <div className="skeleton-loading">
        <span className="spinner" aria-hidden /> 読み込み中…
      </div>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="skeleton skeleton--row" style={{ animationDelay: `${i * 0.08}s` }} />
      ))}
    </div>
  );
}
