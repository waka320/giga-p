import type { Metadata } from "next";
import Script from "next/script";
import { DotGothic16, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

// Pixel Fontの追加
const pixelFont = {
  variable: "--font-pixel",
};

// Geist SansをDotGothic16に変更
const dotGothic = DotGothic16({
  weight: "400", // DotGothic16は400のみサポート
  variable: "--font-dotgothic",
  subsets: ["latin"], // 日本語サブセットを追加
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | アクロアタック. - IT用語パズルゲーム",
    default: "アクロアタック. - IT用語パズルゲーム",
  },
  description:
    "IT用語のアクロニム（略語）を探すワードパズルゲーム。HTTP、CSS、JSONなどのIT略語を見つけて高得点を目指そう！",
  keywords:
    "IT用語, アクロニム, パズルゲーム, 略語学習, プログラミング用語, テック用語, IT学習, AcroAttack",
  authors: [{ name: "waka320_若松勇希" }],
  creator: "waka320_若松勇希",
  publisher: "waka320_若松勇希",
  formatDetection: {
    email: false,
    telephone: false,
  },
  metadataBase: new URL(
    "https://acro-attack.wakaport.com"
  ),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url: 'https://acro-attack.wakaport.com',
    title: 'アクロアタック. - IT用語パズルゲーム',
    description: 'IT用語のアクロニム（略語）を探すワードパズルゲーム。waka320',
    siteName: 'アクロアタック.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'アクロアタック. - IT用語パズルゲーム',
    description: 'IT用語のアクロニム（略語）を探すワードパズルゲーム。waka320',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "アクロアタック.",
              "applicationCategory": "GameApplication, EducationalApplication",
              "operatingSystem": "Web",
              "description": "IT用語のアクロニム（略語）を探すワードパズルゲーム",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "JPY"
              },
              "author": {
                "@type": "Organization",
                "name": "waka320_若松勇希",
              }
            })
          }}
        />
        {/* Google AdSenseスクリプト */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7708560999548450"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body
        className={cn(
          dotGothic.variable, // geistSans.variableをdotGothic.variableに変更
          geistMono.variable,
          pixelFont.variable,
          "font-sans antialiased bg-black"
        )}
      >
        {children}
      </body>
    </html>
  );
}
