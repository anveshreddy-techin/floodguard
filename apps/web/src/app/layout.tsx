import type { Metadata, Viewport } from "next";
import "./globals.css";
import { LocationProvider } from "@/context/LocationContext";
import { EnvironmentProvider } from "@/context/EnvironmentContext";
import { EnvironmentLayer } from "@/components/ui/EnvironmentLayer";
import { MobileNavigationWrapper } from "@/components/ui/MobileNavigationWrapper";

export const metadata: Metadata = {
  title: "FloodGuard AI — Flash Flood Early Warning & Response",
  description: "Hyper-Local Multi-Source Flash-Flood Intelligence Platform (SIH26192 Theme 4)",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "FloodGuard",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
  themeColor: "#050a17",
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
            <div className="env-content min-h-screen flex flex-col pb-16 md:pb-0">
              {children}
            </div>

            {/* Mobile Navigation HUD (Bottom Bar & Slide Drawer) */}
            <MobileNavigationWrapper />
          </LocationProvider>
        </EnvironmentProvider>
      </body>
    </html>
  );
}
