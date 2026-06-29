import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/Feedback/ToastProvider";
import { AppShell } from "@/components/layout/AppShell";
import { CookieBanner } from "@/components/UI/CookieBanner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Protex Wear - B2B/B2C",
  description: "Portal B2B/B2C para Protex Wear",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col relative">
        <ToastProvider>
          <AppShell>
            {children}
          </AppShell>
          <CookieBanner />
        </ToastProvider>
      </body>
    </html>
  );
}
