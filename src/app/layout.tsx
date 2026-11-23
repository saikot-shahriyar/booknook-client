import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Suspense } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Home",
    template: "BookNook | %s",
  },
  description:
    "BookNook - A modern, user-friendly online library to discover, borrow, and manage books.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-primary/15 selection:text-primary">
        <Suspense fallback={<div className="h-16 w-full border-b border-border/80 bg-background" />}>
          <Navbar />
        </Suspense>
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
