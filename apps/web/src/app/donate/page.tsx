'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/ui/Header';
import { Sidebar } from '@/components/ui/Sidebar';
import { useAdaptive } from '@/context/AdaptiveContext';
import { useLocation } from '@/context/LocationContext';
import { 
  Heart, ShieldCheck, QrCode, Sparkles, Building2, 
  MapPin, Users, Droplets, ArrowRight, AlertTriangle, 
  CheckCircle2, Info, Landmark, HelpCircle, Gift 
} from 'lucide-react';
import { RELIEF_CAMPAIGNS, DONATION_PRESETS, ReliefCampaignData } from '@/data/reliefFunds';
import { ReliefCampaignCard } from '@/components/ui/donate/ReliefCampaignCard';
import { ImpactCalculator } from '@/components/ui/donate/ImpactCalculator';
import { DonationLedgerView } from '@/components/ui/donate/DonationLedgerView';
import { DonateModal } from '@/components/ui/donate/DonateModal';

export default function DonateReliefPage() {
  const { operatingMode } = useAdaptive();
  const { selectedLocation } = useLocation();

  const [selectedState, setSelectedState] = useState<string>('ALL');
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>('camp-uk-chamoli-2026');
  
  // Ledger state
  const [ledger, setLedger] = useState<any[]>([
    {
      receipt_id: 'RCPT-2026-89412',
      timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
      campaign_title: 'Chamoli & Upper Alaknanda Cloudburst Relief Fund',
      amount_inr: 5000,
      donor_name_masked: 'R****h S***a',
      transaction_hash: '3f78a84b8d9e29a98e1f57b28a9c345ef8a09b3c4d7e21a0f9e8d7c6b5a41234',
      relief_allocation: '2 Family Food & Water Kits + 1 High-Ground Tarp',
    },
    {
      receipt_id: 'RCPT-2026-89411',
      timestamp: new Date(Date.now() - 18 * 60000).toISOString(),
      campaign_title: 'Assam Brahmaputra Inundation & Majuli Flood Relief',
      amount_inr: 10000,
      donor_name_masked: 'A****a N***r',
      transaction_hash: '9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b',
      relief_allocation: '4 Life Jackets + 200 Water Purification Tablets',
    },
    {
      receipt_id: 'RCPT-2026-89410',
      timestamp: new Date(Date.now() - 42 * 60000).toISOString(),
      campaign_title: 'Wayanad Western Ghats Landslide Rehabilitation Fund',
      amount_inr: 2500,
      donor_name_masked: 'Anonymous Benefactor',
      transaction_hash: '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      relief_allocation: 'Emergency First-Aid & Trauma Care Support',
    },
    {
      receipt_id: 'RCPT-2026-89409',
      timestamp: new Date(Date.now() - 65 * 60000).toISOString(),
      campaign_title: 'Telangana Godavari Urban & Rural Flash Flood Response',
      amount_inr: 3500,
      donor_name_masked: 'S****n K***r',
      transaction_hash: 'abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
      relief_allocation: 'High-Capacity Dewatering Fuel + Slum Dry Rations',
    },
    {
      receipt_id: 'RCPT-2026-89408',
      timestamp: new Date(Date.now() - 110 * 60000).toISOString(),
      campaign_title: "Prime Minister's National Relief Fund (PMNRF) - Disaster Pool",
      amount_inr: 25000,
      donor_name_masked: 'T****h P***l',
      transaction_hash: '9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba',
      relief_allocation: 'Pan-India Ex-Gratia Disaster Relief & High-Ground Housing',
    },
  ]);

  const handleOpenDonate = (campaignId?: string) => {
    if (campaignId) setSelectedCampaignId(campaignId);
    setModalOpen(true);
  };

  const handleDonationSuccess = (receipt: any) => {
    const newEntry = {
      receipt_id: receipt.receipt_id,
      timestamp: receipt.timestamp,
      campaign_title: receipt.campaign_title,
      amount_inr: receipt.amount_inr,
      donor_name_masked: receipt.donor_name_masked,
      transaction_hash: receipt.transaction_hash,
      relief_allocation: receipt.impact_statement,
    };
    setLedger((prev) => [newEntry, ...prev]);
  };

  // Filter campaigns
  const filteredCampaigns = selectedState === 'ALL'
    ? RELIEF_CAMPAIGNS
    : RELIEF_CAMPAIGNS.filter(
        (c) => c.state.toLowerCase() === selectedState.toLowerCase() || c.state === 'National'
      );

  const totalRaised = RELIEF_CAMPAIGNS.reduce((acc, c) => acc + c.raisedAmountInr, 0);
  const totalDonors = RELIEF_CAMPAIGNS.reduce((acc, c) => acc + c.donorsCount, 0);
  const totalBeneficiaries = RELIEF_CAMPAIGNS.reduce((acc, c) => acc + c.beneficiariesAssisted, 0);

  return (
    <div className="flex flex-col min-h-screen bg-[#020714] text-slate-100 select-none">
      <Header dataMode={operatingMode} systemStatus="OPERATIONAL" />

      <div className="flex flex-1 min-h-0 relative">
        <Sidebar activeTab="donate" />

        <main className="flex-1 overflow-y-auto p-3 sm:p-5 lg:p-6 space-y-6 safe-bottom">
          
          {/* Hero Banner: Emergency Disaster Relief Pool */}
          <div className="fp fp-operational p-5 sm:p-7 rounded-3xl border border-rose-500/40 bg-gradient-to-br from-rose-950/40 via-slate-900/90 to-slate-950 shadow-2xl relative overflow-hidden space-y-5">
            
            <div className="absolute top-0 right-0 w-72 h-72 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950/90 border border-rose-600/60 text-xs font-mono font-bold text-rose-300">
                  <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-400 animate-pulse" />
                  <span>EMERGENCY DISASTER & FLOOD RELIEF FUND</span>
                  <span className="px-1.5 py-0.2 rounded bg-rose-900 text-[10px]">100% 80G TAX EXEMPT</span>
                </div>

                <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white font-sans tracking-tight leading-tight">
                  Direct Support for Families Impacted by Recent Flash Floods & Cloudbursts
                </h1>

                <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
                  Contribute directly to official Chief Minister's Relief Funds (CMRF), State Disaster Management Authorities, and the Prime Minister's National Relief Fund (PMNRF). 100% of contributions are routed to emergency rations, clean water, high-ground shelter kits, and early-warning IoT repair.
                </p>
              </div>

              {/* Quick Hero CTA Button */}
              <div className="shrink-0">
                <button
                  onClick={() => handleOpenDonate('camp-uk-chamoli-2026')}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-mono text-sm font-black flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(244,63,94,0.5)] active:scale-95 transition"
                >
                  <Heart className="w-4 h-4 fill-white" />
                  <span>DONATE TO ACTIVE RELIEF POOL</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Aggregated Relief Stats Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-800/80">
              <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Total Relief Raised:</span>
                <strong className="text-base sm:text-xl font-black font-mono text-emerald-300">
                  ₹{(totalRaised / 10000000).toFixed(2)} Cr
                </strong>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Benefactor Donors:</span>
                <strong className="text-base sm:text-xl font-black font-mono text-cyan-300">
                  {totalDonors.toLocaleString()}
                </strong>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Families Assisted:</span>
                <strong className="text-base sm:text-xl font-black font-mono text-amber-300">
                  {totalBeneficiaries.toLocaleString()}
                </strong>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Audited By:</span>
                <strong className="text-xs sm:text-sm font-black font-mono text-slate-200 block truncate">
                  CAG & USDMA/NDMA
                </strong>
              </div>
            </div>

          </div>

          {/* Disaster Region Filter Strip */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-mono font-bold text-white uppercase">
                ACTIVE DISASTER SECTORS:
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
              {[
                { id: 'ALL', label: '🇮🇳 Pan-India Active' },
                { id: 'Uttarakhand', label: '🏔️ Uttarakhand' },
                { id: 'Assam', label: '🌊 Assam' },
                { id: 'Kerala', label: '⛰️ Kerala' },
                { id: 'Telangana', label: '⛈️ Telangana' },
                { id: 'Himachal Pradesh', label: '🌲 Himachal' },
              ].map((st) => (
                <button
                  key={st.id}
                  onClick={() => setSelectedState(st.id)}
                  className={`px-3 py-1.5 rounded-xl transition font-bold border ${
                    selectedState === st.id
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-sm'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          {/* Active Disaster Campaign Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCampaigns.map((camp) => (
              <ReliefCampaignCard
                key={camp.id}
                campaign={camp}
                onDonate={handleOpenDonate}
              />
            ))}
          </div>

          {/* Interactive Relief Aid Impact Calculator */}
          <ImpactCalculator
            onSelectAmount={(amt) => {
              handleOpenDonate();
            }}
          />

          {/* Transparent Public Contribution Ledger */}
          <DonationLedgerView ledger={ledger} />

          {/* Official Verification & Statutory Governance FAQ */}
          <div className="fp fp-operational p-5 sm:p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Landmark className="w-5 h-5 text-indigo-400" />
              <h3 className="text-sm sm:text-base font-black font-mono text-white tracking-wide uppercase">
                GOVERNMENT RECOGNITION & STATUTORY TRANSPARENCY
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono text-slate-300">
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>100% Tax Exemption under 80G</span>
                </div>
                <p className="text-[11px] font-sans text-slate-400 leading-relaxed">
                  Donations to PMNRF and State Chief Minister's Relief Funds qualify for 100% deduction from taxable income under Section 80G of the Income Tax Act. Instant downloadable certificate provided.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <span>Direct Treasury Remittance</span>
                </div>
                <p className="text-[11px] font-sans text-slate-400 leading-relaxed">
                  No intermediary commissions or third-party platform cuts. Payments made via official State Bank of India (SBI) UPI and NEFT accounts go directly to the disaster management emergency accounts.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-amber-400" />
                  <span>Ground Relief Coordination</span>
                </div>
                <p className="text-[11px] font-sans text-slate-400 leading-relaxed">
                  Relief allocations are coordinated in tandem with National Disaster Response Force (NDRF) and State Disaster Response Force (SDRF) incident commanders for targeted, verified aid delivery.
                </p>
              </div>
            </div>
          </div>

        </main>
      </div>

      {/* Global Interactive Donation Modal */}
      <DonateModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialCampaignId={selectedCampaignId}
        onDonationSuccess={handleDonationSuccess}
      />
    </div>
  );
}
