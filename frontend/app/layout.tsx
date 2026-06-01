import type { Metadata, Viewport } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SignSync – Real-Time Sign Language to English Translator",
  description:
    "AI-powered real-time gesture recognition that converts sign language into readable text directly from your webcam. Built with MediaPipe, OpenCV, and Machine Learning.",
  keywords: ["sign language", "ASL", "translator", "AI", "accessibility", "MediaPipe", "gesture recognition"],
  authors: [
    { name: "Vaishnavi Chaudhary" },
    { name: "Shresth Samyak" },
  ],
  openGraph: {
    title: "SignSync – Real-Time Sign Language to English Translator",
    description: "Translate sign language into English instantly using AI and your webcam.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#FAFAF8",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-background text-foreground">{children}</body>
    </html>
  );
}
