import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import Navbar from "@/components/organisms/Navbar";

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
  title: "Andy Olarte — Senior Frontend Engineer",
  description:
    "Portfolio of Andy Olarte, Senior Frontend / Full-Stack Engineer with 10+ years of experience building scalable web applications.",
  metadataBase: new URL(
    process.env["NEXT_PUBLIC_SITE_URL"] ?? "https://andyolarte.dev"
  ),
  openGraph: {
    type: "website",
    title: "Andy Olarte — Senior Frontend Engineer",
    description:
      "Portfolio of Andy Olarte, Senior Frontend / Full-Stack Engineer with 10+ years of experience building scalable web applications.",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Andy Olarte — Senior Frontend Engineer",
    description:
      "Portfolio of Andy Olarte, Senior Frontend / Full-Stack Engineer with 10+ years of experience building scalable web applications.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.ReactNode {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function() {
  try {
    var stored = localStorage.getItem('theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (stored === 'dark' || (!stored && prefersDark)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch (e) {}
})()`,
          }}
        />
      </head>
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <Navbar />
        <main>{children}</main>
        <footer className="py-6 text-center text-sm text-muted-foreground">
          Andy Olarte — {new Date().getFullYear()}
        </footer>
      </body>
    </html>
  );
}
