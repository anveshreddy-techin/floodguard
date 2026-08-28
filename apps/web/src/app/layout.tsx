import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FloodGuard AI — Flash Flood Early Warning & Response",
  description: "Hyper-Local Multi-Source Flash-Flood Intelligence Platform (SIH26192)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#0b132b] text-slate-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}
