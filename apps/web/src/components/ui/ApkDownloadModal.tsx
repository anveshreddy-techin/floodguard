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
    // Show popup automatically on load
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 600);

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
      clearTimeout(timer);
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
      <div className="md:hidden fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in select-none">
        <div 
          className="relative w-full max-w-md bg-gradient-to-b from-[#0e172e] via-[#091024] to-[#040817] border border-cyan-500/40 rounded-3xl p-5 shadow-[0_0_50px_rgba(6,182,212,0.25)] space-y-4 animate-scale-in text-slate-100"
          style={{ boxShadow: '0 0 40px rgba(6,182,212,0.25), inset 0 1px 0 rgba(255,255,255,0.1)' }}
        >
          {/* Top Floating Badge & Close Button */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700/80 text-[10px] font-mono font-bold flex items-center gap-1 shadow-[0_0_10px_rgba(16,185,129,0.4)]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                ANDROID RELEASE v1.0.4
              </span>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/60">
                SIH26192
              </span>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition active:scale-95"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* App Identity Hero */}
          <div className="flex items-center gap-3.5 pt-1">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 p-0.5 shadow-[0_0_20px_rgba(6,182,212,0.6)] shrink-0 flex items-center justify-center">
              <div className="w-full h-full bg-[#070d1e] rounded-[14px] flex items-center justify-center">
                <Smartphone className="w-6 h-6 text-cyan-300 animate-bounce" />
              </div>
            </div>
            <div>
              <h3 className="text-base font-black tracking-wide bg-gradient-to-r from-white via-slate-100 to-cyan-200 bg-clip-text text-transparent font-sans">
                FloodGuard AI Mobile App
              </h3>
              <p className="text-[11px] text-slate-400 font-sans">
                Hyper-Local Disaster Early Warning & Offline Evacuation HUD
              </p>
            </div>
          </div>

          {/* Feature Highlights Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
            <div className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-xl space-y-0.5">
              <div className="flex items-center gap-1.5 text-cyan-300 font-bold text-[11px]">
                <WifiOff className="w-3.5 h-3.5 text-cyan-400" />
                <span>Offline Ready</span>
              </div>
              <p className="text-[10px] text-slate-400 font-sans">Evacuation routes work without internet.</p>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-xl space-y-0.5">
              <div className="flex items-center gap-1.5 text-emerald-300 font-bold text-[11px]">
                <BellRing className="w-3.5 h-3.5 text-emerald-400" />
                <span>Siren Push</span>
              </div>
              <p className="text-[10px] text-slate-400 font-sans">Flash flood audio alerts.</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-2">
            <button
              onClick={handleDownloadApk}
              disabled={isInstalling}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:brightness-110 text-white font-mono text-xs font-black tracking-wider uppercase flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.5)] active:scale-98 transition"
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
              className="w-full py-2.5 rounded-2xl fp hover:border-cyan-400/80 text-cyan-300 hover:text-white font-mono text-xs font-bold flex items-center justify-center gap-2 transition active:scale-98"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>INSTALL PWA / ADD TO HOME SCREEN</span>
            </button>
          </div>

          {/* Footer info & Dismiss */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[10px] font-mono text-slate-400">
            <span>Package: 4.8 MB • Android 8.0+</span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-200 underline"
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
          className="bg-[#0b1638]/95 border border-cyan-500/40 rounded-2xl p-3.5 shadow-[0_8px_30px_rgba(0,0,0,0.7)] backdrop-blur-2xl text-slate-100 flex items-center gap-3 relative"
          style={{ boxShadow: '0 8px 30px rgba(6, 182, 212, 0.2), inset 0 1px 0 rgba(255,255,255,0.1)' }}
        >
          {/* App Icon */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5 shrink-0 flex items-center justify-center shadow-md">
            <div className="w-full h-full bg-[#070d1e] rounded-[10px] flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-cyan-300" />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-white font-sans truncate">
                FloodGuard Mobile
              </span>
              <span className="text-[9px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-700/60 px-1.5 py-0.2 rounded font-bold">
                v1.0.4 APK
              </span>
            </div>
            <p className="text-[10px] text-slate-400 truncate">
              Offline evacuation & alert siren for Android
            </p>
          </div>

          {/* Actions: Download Button + Close */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleDownloadApk}
              disabled={isInstalling}
              className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:brightness-110 text-white font-mono text-[10px] font-black flex items-center gap-1 shadow-sm active:scale-95 transition"
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
              className="w-7 h-7 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition active:scale-95 shrink-0"
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
