import type { Metadata, Viewport } from "next";
import { Comic_Neue, Lilita_One, Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

const display = Lilita_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display-family",
  display: "swap",
});

const comic = Comic_Neue({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-comic-family",
  display: "swap",
});

export const metadata: Metadata = {
  title: "O gibi dos dois",
  description:
    "Um gibi para a Aynara ler no celular. Nicolas atravessa um espelho mágico da Espanha até o Brasil.",
};

export const viewport: Viewport = {
  themeColor: "#d4eefb",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${nunito.variable} ${display.variable} ${comic.variable} h-full antialiased`}
    >
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
