import type { Metadata } from "next";
import "./globals.css";
import { LocationProvider } from "@/context/LocationContext";

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
      <body className="antialiased bg-[#050a17] text-slate-100 min-h-screen selection:bg-cyan-500 selection:text-white">
        <LocationProvider>
          {children}
        </LocationProvider>
      </body>
    </html>
  );
}
