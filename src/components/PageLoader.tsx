/** 画面を読み込んでいる間に表示する、店のロゴ入りローディング */
export default function PageLoader({ label = "読み込み中…", full = false }: { label?: string; full?: boolean }) {
  return (
    <div className={`page-loader${full ? " page-loader--full" : ""}`} role="status" aria-live="polite">
      <svg className="page-loader__ring" viewBox="0 0 100 100" aria-hidden>
        <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(201,163,92,.18)" strokeWidth="3" />
        <path d="M50 10 A40 40 0 0 1 90 50" fill="none" stroke="#e6cc8f" strokeWidth="4" strokeLinecap="round" />
      </svg>
      <span className="page-loader__text">{label}</span>
    </div>
  );
}
