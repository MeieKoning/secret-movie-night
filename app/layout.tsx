import type { Metadata } from "next";
import { Bebas_Neue, Inter } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import ParticleCanvas from "@/components/ParticleCanvas";

const bebas = Bebas_Neue({
  weight: "400",
  variable: "--font-bebas",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Secret Movie Night — Haven",
  description: "Cast your vote. The genre stays secret until the night arrives.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bebas.variable} ${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
        <ParticleCanvas />
        <Nav />
        {children}
        <footer className="border-t border-[#1C1C2E] py-8 text-center text-sm" style={{ color: "var(--muted)" }}>
          <p>🎬 Secret Movie Night — Where every Friday is a surprise</p>
          <p className="mt-1 opacity-50 text-xs">Haven · Votes reset each week</p>
          <a href="/admin" className="mt-3 inline-block opacity-0 hover:opacity-20 transition-opacity duration-300 text-xs" style={{ color: "var(--muted)" }}>·</a>
        </footer>
      </body>
    </html>
  );
}
