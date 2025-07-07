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
  title: "Project Manager | Modern Project Tracking",
  description: "A modern project management application for tracking and organizing your projects efficiently",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground`}
      >
        <div className="relative flex min-h-screen flex-col">
          <div className="flex-1">{children}</div>
          <footer className="w-full border-t bg-background py-4">
            <div className="container flex flex-col items-center justify-center gap-1 text-center text-xs text-muted-foreground">
              <p>© 2025 Project Manager. All rights reserved.</p>
              <p>Built with Next.js and Tailwind CSS</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
