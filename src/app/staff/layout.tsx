import Link from "next/link";
import Logo from "@/components/Logo";
import "../portal.css";

export const metadata = { title: "スタッフ", robots: { index: false, follow: false } };

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="portal">
      <header className="portal-header">
        <Logo size="sm" />
        <Link href="/" className="portal-back">
          サイトへ戻る
        </Link>
      </header>
      {children}
    </div>
  );
}
