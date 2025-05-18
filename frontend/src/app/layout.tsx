import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

// Pixel Fontの追加
const pixelFont = {
  variable: "--font-pixel",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IT用語パズルゲーム GIGA.PE",
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
          geistSans.variable,
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
