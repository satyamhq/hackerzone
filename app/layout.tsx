import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta",
});

export const metadata: Metadata = {
  title: "Hackerzone — The Premier Career Network for the AI Economy",
  description:
    "Connecting engineering talent, tech employers, and university career centers across India.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${plusJakarta.className} antialiased bg-[#FAFBFC] text-slate-900 selection:bg-blue-600 selection:text-white`}>
        {children}
      </body>
    </html>
  );
}

