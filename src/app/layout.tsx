/* eslint-disable @next/next/no-page-custom-font */
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nge-Sport — Platform Turnamen E-Sports",
  description:
    "Kelola turnamen e-sports kampus: bracket otomatis, matchmaking sponsor UMKM, LFG, dan live stream dalam satu platform.",
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
