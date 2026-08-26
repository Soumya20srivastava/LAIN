import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "LAIN — Understand the Wired",
  description:
    "AI-powered decoder for memes, slang, viral trends, phrases, and internet culture context.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${mono.variable} min-h-screen font-sans antialiased`}
      >
        <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
          <div className="bg-grid absolute inset-0" />
          <div className="absolute -top-32 left-1/2 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="absolute -right-24 top-48 h-64 w-64 rounded-full bg-fuchsia-500/[0.07] blur-3xl" />
          <div className="scanlines absolute inset-0" />
        </div>
        <div className="relative z-10 flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
