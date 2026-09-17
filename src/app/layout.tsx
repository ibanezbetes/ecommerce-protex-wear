import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/Feedback/ToastProvider";
import { AppShell } from "@/components/layout/AppShell";
import { CookieBanner } from "@/components/UI/CookieBanner";
import { WhatsAppButton } from "@/components/common/WhatsAppButton";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Protex Wear - Ropa de Trabajo y EPIs",
  description: "Tienda online de equipamiento de protección individual, calzado de seguridad y vestuario laboral profesional.",
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
          <WhatsAppButton />
        </ToastProvider>
      </body>
    </html>
  );
}
