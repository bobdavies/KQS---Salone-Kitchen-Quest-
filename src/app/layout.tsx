import React from "react";
import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display, Ubuntu } from "next/font/google";
import HeritageAtmosphere from "./components/shared/HeritageAtmosphere";
import { GameProvider } from "@/lib/context";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const ubuntu = Ubuntu({
  variable: "--font-ubuntu",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Salone Kitchen: The Cassava Leaf Experience",
  description: "An immersive, gamified cooking journey for Sierra Leone's finest dish.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} ${playfair.variable} ${ubuntu.variable} bg-hearth-void overflow-x-hidden selection:bg-heritage-terracotta selection:text-white`}>
        <GameProvider>
          <div className="min-h-[100dvh] w-full bg-hearth-void text-salone-white font-inter antialiased overflow-x-hidden flex flex-col">
            {/* Global Persistence Layer: Heritage Atmosphere */}
            <HeritageAtmosphere />

            {/* HUD Frame (Subtle corner accents) */}
            <div className="fixed inset-0 pointer-events-none z-50 border-[20px] border-transparent">
              <div className="absolute top-0 left-0 w-32 h-32 border-t-2 border-l-2 border-heritage-terracotta/10 rounded-tl-3xl" />
              <div className="absolute top-0 right-0 w-32 h-32 border-t-2 border-r-2 border-heritage-terracotta/10 rounded-tr-3xl" />
              <div className="absolute bottom-0 left-0 w-32 h-32 border-b-2 border-l-2 border-heritage-terracotta/10 rounded-bl-3xl" />
              <div className="absolute bottom-0 right-0 w-32 h-32 border-b-2 border-r-2 border-heritage-terracotta/10 rounded-br-3xl" />
            </div>

            <main className="flex-grow flex flex-col items-center justify-center relative z-10">
              {children}
            </main>
          </div>
        </GameProvider>
      </body>
    </html>
  );
}
