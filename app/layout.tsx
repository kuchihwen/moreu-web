import type { Metadata } from "next";
import "@fontsource/dm-sans/400.css";
import "@fontsource/dm-sans/500.css";
import "@fontsource/instrument-serif/400.css";
import "./globals.css";
import ScrollEffects from "@/components/ScrollEffects";

export const metadata: Metadata = {
  title: "MOREU — Generative workflows that scale",
  description: "A creative intelligence platform for ambitious teams.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body><ScrollEffects />{children}</body>
    </html>
  );
}
