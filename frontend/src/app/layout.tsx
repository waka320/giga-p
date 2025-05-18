import type { Metadata } from "next";
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
  title: "IT用語パズルゲーム アクロバスター.",
  description: "IT用語を見つけて、タイムアタック形式でスコアを競うパズルゲーム",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="dark">
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
