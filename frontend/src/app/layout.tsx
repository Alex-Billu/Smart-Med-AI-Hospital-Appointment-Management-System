import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "KMCH SmartMed AI — Hospital Appointment Management",
    template: "%s | KMCH SmartMed AI",
  },
  description:
    "Book appointments with KMCH Hospital's top specialist doctors. Real-time slot availability, AI symptom triage, and instant digital appointment passes.",
  keywords: ["KMCH", "hospital", "doctor appointment", "healthcare", "SmartMed"],
  authors: [{ name: "KMCH Hospital" }],
  openGraph: {
    title: "KMCH SmartMed AI",
    description: "Next-generation hospital appointment management for KMCH Hospital.",
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-slate-50 font-sans text-slate-900">
        {children}
      </body>
    </html>
  );
}
