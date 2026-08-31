'use client';

import React from 'react';
import { 
  Heart, ShieldCheck, MapPin, Users, Activity, 
  ArrowRight, Sparkles, AlertCircle, Building2, Droplets 
} from 'lucide-react';
import { ReliefCampaignData } from '@/data/reliefFunds';

interface ReliefCampaignCardProps {
  campaign: ReliefCampaignData;
  onDonate: (campaignId: string) => void;
}

export const ReliefCampaignCard: React.FC<ReliefCampaignCardProps> = ({
  campaign,
  onDonate,
}) => {
  const pctRaised = Math.min(100, Math.round((campaign.raisedAmountInr / campaign.targetAmountInr) * 100));

  const formatInrCr = (val: number) => {
    if (val >= 10000000) {
      return `₹${(val / 10000000).toFixed(2)} Cr`;
    }
    return `₹${(val / 100000).toFixed(1)} Lakh`;
  };

  return (
    <div className="fp fp-operational p-4 sm:p-5 rounded-3xl border border-slate-800 hover:border-rose-500/50 shadow-xl transition-all duration-300 flex flex-col justify-between space-y-4 relative overflow-hidden group">
      
      {/* Background soft ambient glow */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-rose-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-rose-500/10 transition" />

      {/* Card Header */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-400">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{campaign.state} • {campaign.district}</span>
          </div>

          <span className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold border ${
            campaign.urgencyLevel === 'CRITICAL'
              ? 'bg-rose-950/80 text-rose-300 border-rose-700 animate-pulse'
              : 'bg-amber-950/80 text-amber-300 border-amber-700'
          }`}>
            {campaign.urgencyLevel} EMERGENCY
          </span>
        </div>

        <div className="flex items-start gap-2.5">
          <span className="text-2xl shrink-0">{campaign.imageBadge}</span>
          <h3 className="text-sm sm:text-base font-black text-white font-sans leading-tight">
            {campaign.title}
          </h3>
        </div>

        <p className="text-xs text-slate-300 font-sans leading-relaxed line-clamp-2">
          {campaign.headline}
        </p>
      </div>

      {/* Progress & Financial Metrics */}
      <div className="space-y-2 bg-slate-900/60 border border-slate-800/80 p-3 rounded-2xl">
        <div className="flex items-center justify-between text-xs font-mono">
          <div>
            <span className="text-[10px] text-slate-400 block">Funds Raised:</span>
            <strong className="text-emerald-300 font-bold">{formatInrCr(campaign.raisedAmountInr)}</strong>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block">Target Pool:</span>
            <span className="text-slate-300 font-bold">{formatInrCr(campaign.targetAmountInr)}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
          <div
            className="bg-gradient-to-r from-rose-500 via-amber-400 to-emerald-400 h-full rounded-full transition-all duration-500"
            style={{ width: `${pctRaised}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-0.5">
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3 text-cyan-400" />
            <strong className="text-slate-200">{campaign.donorsCount.toLocaleString()}</strong> Donors
          </span>
          <span>
            <strong className="text-cyan-300">{pctRaised}%</strong> Funded
          </span>
        </div>
      </div>

      {/* Authority Attribution & Action */}
      <div className="space-y-3 pt-1 border-t border-slate-800/60">
        <div className="text-[10px] font-mono text-slate-400 flex items-start gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
          <span className="truncate">Auth: {campaign.verifiedAuthority}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onDonate(campaign.id)}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-mono text-xs font-bold flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(244,63,94,0.3)] active:scale-95 transition"
          >
            <Heart className="w-3.5 h-3.5 fill-white" />
            <span>CONTRIBUTE RELIEF</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

    </div>
  );
};
