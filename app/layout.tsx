import type { Metadata } from "next";
import { Inter, Anton } from "next/font/google";
import { buildMetadata } from "@/lib/metadata";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-anton",
});

export const metadata: Metadata = buildMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} ${anton.variable} font-sans antialiased bg-[#0A0A0A] text-[#F5F5F5] selection:bg-white selection:text-black`}>
        {children}
      </body>
    </html>
  );
}
