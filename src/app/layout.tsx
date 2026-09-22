import type { Metadata } from "next";
import { Manrope, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { MotionProvider } from "@/components/motion-provider";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vaani Kavach - Action Protection",
  description: "From Voice Integrity to Action Protection",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${manrope.variable} ${geistMono.variable} font-sans antialiased min-h-full flex flex-col bg-background text-foreground`}
      >
        <MotionProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
        </MotionProvider>
      </body>
    </html>
  );
}
