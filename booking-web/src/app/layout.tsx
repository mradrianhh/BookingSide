import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ChatDialog from "@/components/ChatDialog";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Arctic Explorer - RIB Safari",
  description: "Experience unforgettable Arctic adventures with pristine waters, glaciers, and wildlife.",
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
                <span className="text-3xl">🧊</span>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Arctic Explorer</h1>
                  <p className="text-xs text-slate-400">RIB Safari Adventures</p>
                </div>
              </a>
              <div className="flex gap-8">
                <a href="/" className="text-slate-300 hover:text-cyan-400 transition-colors font-medium">Home</a>
                <a href="/about" className="text-slate-300 hover:text-cyan-400 transition-colors font-medium">About</a>
              </div>
            </div>
          </div>
        </nav>
        
        <main className="flex-1">{children}</main>

        <footer className="bg-slate-900/80 border-t border-slate-700 mt-24">
          <div className="max-w-7xl mx-auto px-4 py-16">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <h4 className="text-cyan-400 font-semibold mb-3">Arctic Explorer</h4>
                <ul className="space-y-2 text-slate-400 text-sm">
                  <li><a href="#" className="hover:text-cyan-400 transition-colors">Safety</a></li>
                  <li><a href="#" className="hover:text-cyan-400 transition-colors">Conservation</a></li>
                  <li><a href="#" className="hover:text-cyan-400 transition-colors">Adventure</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-cyan-400 font-semibold mb-3">Quick Links</h4>
                <ul className="space-y-2 text-slate-400 text-sm">
                  <li><a href="/" className="hover:text-cyan-400 transition-colors">Home</a></li>
                  <li><a href="/about" className="hover:text-cyan-400 transition-colors">About</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-cyan-400 font-semibold mb-3">Contact</h4>
                <ul className="space-y-2 text-slate-400 text-sm">
                  <li>📞 +1 (555) 123-4567</li>
                  <li>📧 info@arcticexplorer.com</li>
                </ul>
              </div>
              <div>
                <h4 className="text-cyan-400 font-semibold mb-3">Follow Us</h4>
                <ul className="space-y-2 text-slate-400 text-sm">
                  <li><a href="#" className="hover:text-cyan-400 transition-colors">Instagram</a></li>
                  <li><a href="#" className="hover:text-cyan-400 transition-colors">Facebook</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-slate-700 pt-8 text-center text-slate-400 text-sm">
              <p>&copy; 2024 Arctic Explorer. All rights reserved. | Safety First | Conservation Focused | Adventure Guaranteed</p>
            </div>
          </div>
        </footer>

        <ChatDialog />
      </body>
    </html>
  );
}
