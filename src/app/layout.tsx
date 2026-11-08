import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "GameVault — Video Game Library & Wishlist",
  description:
    "Organize your gaming backlog, track what you're playing, and build your game wishlist.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body className="min-h-full flex flex-col bg-neutral-950 text-neutral-100 font-sans selection:bg-violet-600 selection:text-white">
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-neutral-900 bg-neutral-950/80 py-8 text-center text-xs text-neutral-500">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>GameVault &copy; {new Date().getFullYear()}. Data powered by RAWG API.</p>
            <div className="flex items-center gap-6">
              <span className="hover:text-neutral-400 transition">Next.js App Router</span>
              <span>•</span>
              <span className="hover:text-neutral-400 transition">Supabase PostgreSQL</span>
              <span>•</span>
              <span className="hover:text-neutral-400 transition">Tailwind CSS</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
