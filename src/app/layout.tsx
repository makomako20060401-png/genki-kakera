import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ??
      (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000")
  ),
  title: {
    default: "牛串 げんきのかけら｜つくば・研究学園の炭火牛串",
    template: "%s｜牛串 げんきのかけら",
  },
  description:
    "茨城県つくば市研究学園の炭火牛串店「げんきのかけら」。素材の個性を引き出す串打ちと、仕事帰りに立ち寄れる温かな空間でお待ちしています。",
  openGraph: {
    title: "牛串 げんきのかけら",
    description: "研究学園の夜に、香ばしい煙と旨味を灯す。",
    images: ["/images/hero.jpg"],
    locale: "ja_JP",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0d0b09",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@400;500;600;700&family=Yuji+Syuku&family=Cormorant+Garamond:wght@500;600&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
