import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Arctic Explorer - Admin Dashboard",
  description: "Manage booking slots and reservations for RIB Safari adventures.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}>
      <body className="min-h-full flex flex-col bg-slate-900">
        <nav className="sticky top-0 z-50 bg-gradient-to-b from-slate-900/95 to-slate-900/80 backdrop-blur-md border-b border-cyan-500/20">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <a href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <span className="text-3xl">⚙️</span>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Admin Dashboard</h1>
                  <p className="text-xs text-slate-400">RIB Safari Management</p>
                </div>
              </a>
              <div>
                <a href="/" className="text-slate-300 hover:text-cyan-400 transition-colors font-medium">Dashboard</a>
              </div>
            </div>
          </div>
        </nav>
        
        <main className="flex-1">{children}</main>

        <footer className="bg-slate-900/80 border-t border-slate-700 mt-24">
          <div className="max-w-7xl mx-auto px-4 py-16">
            <div className="border-t border-slate-700 pt-8 text-center text-slate-400 text-sm">
              <p>&copy; 2024 Arctic Explorer Admin. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

