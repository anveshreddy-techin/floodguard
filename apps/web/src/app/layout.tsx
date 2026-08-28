import type { Metadata } from "next";
import "./globals.css";
import { LocationProvider } from "@/context/LocationContext";
import { EnvironmentProvider } from "@/context/EnvironmentContext";
import { EnvironmentLayer } from "@/components/ui/EnvironmentLayer";

export const metadata: Metadata = {
  title: "FloodGuard AI — Flash Flood Early Warning & Response",
  description: "Hyper-Local Multi-Source Flash-Flood Intelligence Platform (SIH26192)",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased min-h-screen overflow-x-hidden">
        <EnvironmentProvider>
          <LocationProvider>
            {/* 8-Layer living environment — always behind content */}
            <EnvironmentLayer />
            {/* Application content — floats over environment */}
            <div className="env-content min-h-screen flex flex-col">
              {children}
            </div>
          </LocationProvider>
        </EnvironmentProvider>
      </body>
    </html>
  );
}
