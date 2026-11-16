import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Icon from "@/components/Icon";
import ScrollEffects from "@/components/ScrollEffects";
import { getPublicLinks, getSettings } from "@/lib/data";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, links] = await Promise.all([getSettings(), getPublicLinks()]);
  return (
    <>
      <Header links={links} />
      <main>{children}</main>
      <Footer s={settings} />
      {/* スマホ用：画面下に固定する予約・注文ボタン */}
      {links.length > 0 && (
        <nav className="sp-dock sp-only" aria-label="予約・注文">
          {links.slice(0, 2).map((l, i) => (
            <a key={l.id} href={l.url} target="_blank" rel="noopener noreferrer" className={i === 0 ? "is-primary" : ""}>
              <Icon name={l.icon} size={18} />
              <span>{l.sublabel || l.label}</span>
            </a>
          ))}
        </nav>
      )}
      <ScrollEffects />
    </>
  );
}
