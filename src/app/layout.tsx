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
  title: "Cómic de los dos",
  description:
    "Un cómic para inventar y leer en voz alta entre tú y tu hija. Eligen los nombres, abren una aventura y cambian las frases.",
};

export const viewport: Viewport = {
  themeColor: "#d4eefb",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${nunito.variable} ${display.variable} ${comic.variable} h-full antialiased`}
    >
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
