import Link from "next/link";
import Icon from "./Icon";
import Logo from "./Logo";
import type { Settings } from "@/lib/types";

export default function Footer({ s }: { s: Settings }) {
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(s.map_query || s.address)}&output=embed&hl=ja`;
  return (
    <footer className="site-footer" id="access">
      <div className="footer-grid">
        <div className="footer-brand reveal">
          <Logo size="lg" href={null} />
          <p className="footer-tagline pc-only">{s.tagline}</p>
        </div>

        <div className="footer-access reveal" style={{ ["--d" as string]: ".1s" }}>
          <h2 className="eyebrow">ACCESS</h2>
          <ul className="info-list">
            <li>
              <Icon name="pin" size={18} />
              <span>
                {s.postal && <>{s.postal}<br /></>}
                {s.address}
              </span>
            </li>
            <li>
              <Icon name="clock" size={18} />
              <span>営業時間 {s.hours}</span>
            </li>
            <li>
              <Icon name="closed" size={18} />
              <span>定休日 {s.holiday}</span>
            </li>
            {s.tel && (
              <li>
                <Icon name="phone" size={18} />
                <a href={`tel:${s.tel.replace(/[^0-9+]/g, "")}`}>{s.tel}</a>
              </li>
            )}
          </ul>
        </div>

        <div className="footer-map reveal" style={{ ["--d" as string]: ".2s" }}>
          <iframe src={mapSrc} title="地図" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
        </div>

        <div className="footer-sns reveal" style={{ ["--d" as string]: ".3s" }}>
          <h2 className="eyebrow pc-only">SNS</h2>
          <div className="sns-row">
            {s.instagram_url && (
              <a href={s.instagram_url} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <Icon name="instagram" size={26} />
              </a>
            )}
            {s.x_url && (
              <a href={s.x_url} target="_blank" rel="noopener noreferrer" aria-label="X">
                <Icon name="x" size={22} />
              </a>
            )}
          </div>
          <Link href="/staff" className="staff-portal">
            <Icon name="lock" size={16} />
            <span>Staff Portal</span>
            <Icon name="arrow" size={14} />
          </Link>
        </div>
      </div>
      <p className="copyright">© {new Date().getFullYear()} 牛串 げんきのかけら. All rights reserved.</p>
    </footer>
  );
}
