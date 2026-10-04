import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LombaEsport",
  description:
    "LombaEsport: Auto-Bracket, Sponsor Directory, LFG, Stream + slot iklan UMKM. Style Neobrutalism gelap + Retro Pop, font Lexend Mega.",
  icons: {
    icon: "/images.jpeg",
    apple: "/images.jpeg",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Lexend+Mega:wght@600;700;800;900&family=Space+Grotesk:wght@400;500;600;700&family=Bangers&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-void text-cream antialiased">
        {children}
      </body>
    </html>
  );
}
