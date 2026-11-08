import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "BeeList — Minimal Game Backlog & Wishlist",
  description: "A lean and simple game tracker for your library and wishlist.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body className="min-h-full flex flex-col bg-neutral-950 text-neutral-100 font-sans selection:bg-amber-400 selection:text-black">
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-neutral-900/60 py-6 text-center text-xs text-neutral-600">
          <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
            <span className="font-medium text-neutral-500">BeeList</span>
            <span>Powered by RAWG API</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
