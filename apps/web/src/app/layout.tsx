import type { Metadata, Viewport } from "next";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import { LocationProvider } from "@/context/LocationContext";
import { EnvironmentProvider } from "@/context/EnvironmentContext";
import { AdaptiveProvider } from "@/context/AdaptiveContext";
import { ToastProvider } from "@/context/ToastContext";
import { MobileNavigationWrapper } from "@/components/ui/MobileNavigationWrapper";

export const metadata: Metadata = {
  title: "FloodGuard AI — Flash Flood Early Warning & Response",
  description: "Hyper-Local Multi-Source Flash-Flood Intelligence Platform (SIH26192 Theme 4)",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "FloodGuard",
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/favicon.ico",
    apple: "/icon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
  themeColor: "#1B2A3B",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen overflow-x-hidden bg-[#F0F4F8]">
        <ToastProvider>
          <EnvironmentProvider>
            <AdaptiveProvider>
              <LocationProvider>
                {/* Application content */}
                <div className="min-h-screen flex flex-col pb-16 md:pb-0">
                  {children}
                </div>

                {/* Mobile Navigation HUD */}
                <MobileNavigationWrapper />
              </LocationProvider>
            </AdaptiveProvider>
          </EnvironmentProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
