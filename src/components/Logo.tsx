import Link from "next/link";

export default function Logo({ size = "md", href = "/" }: { size?: "sm" | "md" | "lg"; href?: string | null }) {
  const inner = (
    <span className={`logo logo--${size}`}>
      <svg className="logo__ring" viewBox="0 0 100 100" aria-hidden>
        <defs>
          <linearGradient id="logoGold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f1d9a0" />
            <stop offset=".55" stopColor="#c9a35c" />
            <stop offset="1" stopColor="#7d5f2c" />
          </linearGradient>
        </defs>
        <path d="M78 22 A40 40 0 1 0 86 68" fill="none" stroke="url(#logoGold)" strokeWidth="5.5" strokeLinecap="round" />
        <path d="M70 15 A42 42 0 0 0 14 40" fill="none" stroke="url(#logoGold)" strokeWidth="1.6" strokeLinecap="round" opacity=".7" />
        <path d="M30 88 A40 40 0 0 0 92 56" fill="none" stroke="url(#logoGold)" strokeWidth="1.4" strokeLinecap="round" opacity=".55" />
      </svg>
      <span className="logo__text">
        <span className="logo__sub">牛串</span>
        <span className="logo__main">
          げんき<small>の</small>かけら
        </span>
      </span>
    </span>
  );
  if (!href) return inner;
  return (
    <Link href={href} aria-label="牛串 げんきのかけら トップへ" className="logo-link">
      {inner}
    </Link>
  );
}
