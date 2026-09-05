'use client';

import React from 'react';
import Link from 'next/link';
import { PhoneCall, Shield, FileText, CheckCircle2 } from 'lucide-react';

export const PublicFooter: React.FC = () => {
  return (
    <footer className="w-full bg-[#0c1f38] text-slate-300 border-t border-slate-800 text-xs select-none">
      {/* 1. Subtle National Tricolour Line */}
      <div className="w-full flex h-[3px]" aria-hidden="true">
        <div className="flex-1 bg-[#ff9933]" />
        <div className="flex-1 bg-[#ffffff]" />
        <div className="flex-1 bg-[#138808]" />
      </div>

      {/* 2. 24x7 Emergency Helplines Strip */}
      <div className="bg-[#081526] border-b border-slate-800/80 py-2.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1600px] mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-white font-semibold">
            <PhoneCall className="w-4 h-4 text-red-500 animate-pulse" />
            <span>24x7 National & State Emergency Helpline Numbers</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 font-mono text-[11px]">
            <span className="text-slate-400">National Emergency:</span>
            <a href="tel:112" className="text-red-400 font-bold hover:underline">112</a>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">State EOC:</span>
            <a href="tel:1070" className="text-amber-300 font-bold hover:underline">1070</a>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">District EOC:</span>
            <a href="tel:1077" className="text-amber-300 font-bold hover:underline">1077</a>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">NDRF Control Room:</span>
            <a href="tel:01124363260" className="text-cyan-300 font-bold hover:underline">011-24363260</a>
          </div>
        </div>
      </div>

      {/* 3. Bottom Legal & Policy Bar (Matches Reference Image Exactly) */}
      <div className="bg-white text-slate-600 border-t border-slate-200 py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-[11px]">
          <div>
            © 2025 Ministry of Home Affairs, Government of India. All Rights Reserved.
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-slate-600">
            <Link href="/portal/about" className="hover:text-blue-900 transition">Privacy Policy</Link>
            <span className="text-slate-300">|</span>
            <Link href="/portal/about" className="hover:text-blue-900 transition">Terms of Use</Link>
            <span className="text-slate-300">|</span>
            <Link href="/portal/about" className="hover:text-blue-900 transition">Hyperlinking Policy</Link>
            <span className="text-slate-300">|</span>
            <Link href="/portal/contact" className="hover:text-blue-900 transition">Help</Link>
            <span className="text-slate-300">|</span>
            <Link href="/portal/contact" className="hover:text-blue-900 transition">Contact Us</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
