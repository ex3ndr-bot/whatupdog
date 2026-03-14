import type { Metadata } from "next";
import Link from "next/link";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "What Up Dog",
  description: "Founder matching MVP for technical, business, and design co-founders.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} app-shell antialiased`}>
        <div className="mesh-orb left-[-5rem] top-12 h-40 w-40 bg-violet-500/30" />
        <div className="mesh-orb right-0 top-40 h-56 w-56 bg-indigo-500/30" />
        <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-4 sm:px-6 lg:px-8">
          <header className="sticky top-0 z-30 pt-4">
            <nav className="glass-card flex items-center justify-between rounded-full px-5 py-3">
              <Link href="/" className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 font-semibold text-white">
                  W
                </div>
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.28em] text-violet-200/80">
                    What Up Dog
                  </p>
                  <p className="text-sm text-slate-300">Find your next co-founder</p>
                </div>
              </Link>
              <div className="flex items-center gap-2 text-sm text-slate-200">
                <Link className="secondary-button rounded-full px-4 py-2" href="/matches">
                  Matches
                </Link>
                <Link className="cta-button rounded-full px-4 py-2" href="/create-profile">
                  Create profile
                </Link>
              </div>
            </nav>
          </header>
          <main className="flex-1 py-10">{children}</main>
        </div>
      </body>
    </html>
  );
}

