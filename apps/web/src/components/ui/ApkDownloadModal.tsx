'use client';

import React, { useState, useEffect } from 'react';
import { 
  Download, 
  Smartphone, 
  X, 
  CheckCircle2, 
  ShieldAlert, 
  WifiOff, 
  BellRing, 
  Navigation, 
  ExternalLink,
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const ApkDownloadModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalling, setIsInstalling] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  useEffect(() => {
    // Modal opens only when explicitly requested (e.g. open-apk-modal event)

    // Listen for PWA beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for custom trigger event to re-open modal anytime
    const handleOpenModal = () => setIsOpen(true);
    window.addEventListener('open-apk-modal', handleOpenModal);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('open-apk-modal', handleOpenModal);
    };
  }, []);

  const handleInstallPwa = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setIsOpen(false);
      }
    } else {
      // Fallback instruction for browsers without deferredPrompt
      alert("To install on iOS or Chrome Mobile:\n1. Tap your browser's 'Share' or 'Menu' (⋮) icon\n2. Select 'Add to Home Screen'\n3. Enjoy full-screen offline access!");
    }
  };

  const handleDownloadApk = () => {
    setIsInstalling(true);
    const link = document.createElement('a');
    link.href = '/floodguard-ai-v1.0.4.apk';
    link.download = 'FloodGuard-AI-v1.0.4.apk';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      setIsInstalling(false);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    }, 800);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* ════════════════════════════════════════════════════════════════════
          MOBILE VIEW: FULL DISASTER SAFETY APP DOWNLOAD POPUP / MODAL
          ════════════════════════════════════════════════════════════════════ */}
      <div className="md:hidden fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in select-none">
        <div 
          className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl p-5 shadow-2xl space-y-4 animate-scale-in text-slate-900 font-sans"
        >
          {/* Top Floating Badge & Close Button */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-sans font-bold flex items-center gap-1 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                ANDROID RELEASE v1.0.4
              </span>
              <span className="text-[10px] font-sans font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                SIH26192
              </span>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition active:scale-95"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* App Identity Hero */}
          <div className="flex items-center gap-3.5 pt-1">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 p-0.5 shadow-md shrink-0 flex items-center justify-center">
              <div className="w-full h-full bg-blue-50 rounded-[14px] flex items-center justify-center">
                <Smartphone className="w-6 h-6 text-blue-600 animate-bounce" />
              </div>
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight text-slate-900 font-sans">
                FloodGuard AI Mobile App
              </h3>
              <p className="text-xs text-slate-500 font-sans mt-0.5">
                Hyper-Local Disaster Early Warning &amp; Offline Evacuation HUD
              </p>
            </div>
          </div>

          {/* Feature Highlights Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs font-sans pt-1">
            <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl space-y-0.5">
              <div className="flex items-center gap-1.5 text-blue-700 font-bold text-[11px]">
                <WifiOff className="w-3.5 h-3.5 text-blue-600" />
                <span>Offline Ready</span>
              </div>
              <p className="text-[11px] text-slate-600 font-sans">Evacuation routes work without internet.</p>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl space-y-0.5">
              <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-[11px]">
                <BellRing className="w-3.5 h-3.5 text-emerald-600" />
                <span>Siren Push</span>
              </div>
              <p className="text-[11px] text-slate-600 font-sans">Flash flood audio alerts.</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-2">
            <button
              onClick={handleDownloadApk}
              disabled={isInstalling}
              className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-sans text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 shadow-sm active:scale-98 transition"
            >
              {isInstalling ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>PACKAGING APK FILE...</span>
                </>
              ) : downloadSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>APK DOWNLOADED! (CHECK DOWNLOADS)</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>DOWNLOAD ANDROID APK (DIRECT)</span>
                </>
              )}
            </button>

            <button
              onClick={handleInstallPwa}
              className="w-full py-2.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-sans text-xs font-bold flex items-center justify-center gap-2 transition active:scale-98 shadow-sm"
            >
              <Smartphone className="w-3.5 h-3.5 text-blue-600" />
              <span>INSTALL PWA / ADD TO HOME SCREEN</span>
            </button>
          </div>

          {/* Footer info & Dismiss */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-[11px] font-sans text-slate-500">
            <span>Package: 4.8 MB • Android 8.0+</span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-blue-600 hover:text-blue-800 font-medium underline"
            >
              Continue in Browser →
            </button>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          DESKTOP / LAPTOP VIEW: SMALL, SLEEK NON-BLOCKING TOP POPUP TOAST
          ════════════════════════════════════════════════════════════════════ */}
      <div className="hidden md:block fixed top-16 right-4 lg:right-6 z-50 max-w-sm animate-slide-down select-none pointer-events-auto">
        <div 
          className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-xl text-slate-900 flex items-center gap-3 relative font-sans"
        >
          {/* App Icon */}
          <div className="w-10 h-10 rounded-xl bg-blue-600 p-0.5 shrink-0 flex items-center justify-center shadow-sm">
            <div className="w-full h-full bg-blue-50 rounded-[10px] flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-blue-600" />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-900 font-sans truncate">
                FloodGuard Mobile
              </span>
              <span className="text-[9px] font-sans bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.2 rounded font-bold">
                v1.0.4 APK
              </span>
            </div>
            <p className="text-[11px] text-slate-500 truncate mt-0.5 font-sans">
              Offline evacuation &amp; alert siren for Android
            </p>
          </div>

          {/* Actions: Download Button + Close */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleDownloadApk}
              disabled={isInstalling}
              className="px-2.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-sans text-[10px] font-bold flex items-center gap-1 shadow-sm active:scale-95 transition"
              title="Direct APK Download (4.8 MB)"
            >
              {isInstalling ? (
                <span className="w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
              ) : downloadSuccess ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              <span>{downloadSuccess ? 'DONE' : 'APK'}</span>
            </button>

            <button
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition active:scale-95 shrink-0"
              title="Dismiss Popup"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
