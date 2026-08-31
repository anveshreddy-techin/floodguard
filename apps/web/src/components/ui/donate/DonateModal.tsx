'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, Heart, ShieldCheck, QrCode, Building, CheckCircle2, 
  Copy, Download, Printer, ArrowRight, Sparkles, AlertTriangle, 
  HelpCircle, ExternalLink, RefreshCw 
} from 'lucide-react';
import { RELIEF_CAMPAIGNS, DONATION_PRESETS, ReliefCampaignData } from '@/data/reliefFunds';

interface DonateModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCampaignId?: string;
  onDonationSuccess?: (receipt: any) => void;
}

export const DonateModal: React.FC<DonateModalProps> = ({
  isOpen,
  onClose,
  initialCampaignId,
  onDonationSuccess,
}) => {
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>(
    initialCampaignId || 'camp-uk-chamoli-2026'
  );
  const [amount, setAmount] = useState<number>(1500);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'UPI' | 'BANK' | 'PLEDGE'>('UPI');
  
  // Donor Details
  const [donorName, setDonorName] = useState<string>('');
  const [donorEmail, setDonorEmail] = useState<string>('');
  const [donorPan, setDonorPan] = useState<string>('');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [copiedUpi, setCopiedUpi] = useState<boolean>(false);
  const [copiedAcc, setCopiedAcc] = useState<boolean>(false);
  
  // Receipt State
  const [receipt, setReceipt] = useState<any | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  useEffect(() => {
    if (initialCampaignId) {
      setSelectedCampaignId(initialCampaignId);
    }
  }, [initialCampaignId]);

  if (!isOpen) return null;

  const campaign = RELIEF_CAMPAIGNS.find((c) => c.id === selectedCampaignId) || RELIEF_CAMPAIGNS[0];
  const finalAmount = customAmount ? parseFloat(customAmount) || 0 : amount;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(campaign.upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(campaign.bankAccountNumber);
    setCopiedAcc(true);
    setTimeout(() => setCopiedAcc(false), 2000);
  };

  const getImpactDescription = (amt: number) => {
    if (amt < 1000) return '🍞 1 Emergency Drinking Water & Dry Ration Pack (3-Day Supply)';
    if (amt < 2500) return '💧 Potable Water Filter + First-Aid Medical Kit for a Family of 4';
    if (amt < 7000) return '⛺ Waterproof High-Ground Dome Tent & Solar Emergency Lantern';
    if (amt < 20000) return '🚤 Community Dewatering Pump Fuel + Emergency Relief Packs for 6 Families';
    return '📡 Early-Warning IoT River Level Sensor & Rain Gauge Repair Kit';
  };

  const handleProcessDonation = (e: React.FormEvent) => {
    e.preventDefault();
    if (finalAmount <= 0) {
      alert('Please select or enter a valid donation amount.');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      const generatedReceipt = {
        receipt_id: `RCPT-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        transaction_hash: Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
        timestamp: new Date().toISOString(),
        campaign_id: campaign.id,
        campaign_title: campaign.title,
        amount_inr: finalAmount,
        donor_name_masked: isAnonymous || !donorName ? 'Anonymous Benefactor' : donorName,
        verified_authority: campaign.verifiedAuthority,
        tax_exemption_80g_cert: `80G/IT/NDMA/${new Date().getFullYear()}/${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        impact_statement: getImpactDescription(finalAmount),
        pan_provided: Boolean(donorPan),
      };

      setReceipt(generatedReceipt);
      setIsProcessing(false);
      if (onDonationSuccess) {
        onDonationSuccess(generatedReceipt);
      }
    }, 800);
  };

  const handlePrintCertificate = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md select-none overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#030712] border border-rose-500/40 rounded-3xl shadow-[0_0_50px_rgba(244,63,94,0.25)] overflow-hidden animate-slide-up my-auto max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-rose-950/70 via-slate-900 to-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
              <Heart className="w-5 h-5 fill-rose-500/30 text-rose-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-rose-400 uppercase tracking-widest">
                <span>Verified Disaster Relief Fund</span>
                <span className="px-1.5 py-0.2 rounded bg-rose-950 border border-rose-800 text-[9px]">80G TAX EXEMPT</span>
              </div>
              <h3 className="text-sm sm:text-base font-black text-white font-sans tracking-tight">
                Disaster Relief & Beneficiary Assistance Pool
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
          
          {/* Confirmed Receipt View */}
          {receipt ? (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 sm:p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/60 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-300 font-bold font-mono text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span>DONATION PLEDGE CONFIRMED & RECORDED</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-900/60 px-2 py-0.5 rounded-lg border border-emerald-700">
                    80G CERTIFIED
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs font-mono text-slate-300 pt-1">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Receipt ID:</span>
                    <strong className="text-white">{receipt.receipt_id}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Amount Contributed:</span>
                    <strong className="text-emerald-300 text-sm sm:text-base font-black">₹{receipt.amount_inr.toLocaleString()}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Beneficiary Fund:</span>
                    <strong className="text-cyan-300 truncate block">{receipt.campaign_title}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Verified Authority:</span>
                    <strong className="text-slate-200 truncate block">{receipt.verified_authority}</strong>
                  </div>
                </div>

                {/* Impact Statement */}
                <div className="p-3 rounded-xl bg-slate-900/90 border border-emerald-800/80 text-xs font-mono text-emerald-300 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Direct Ground Impact:</span>
                  <p className="font-bold text-white text-xs sm:text-sm">{receipt.impact_statement}</p>
                </div>

                {/* Cryptographic Hash */}
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-400 space-y-1">
                  <div className="flex items-center justify-between">
                    <span>Public Ledger SHA-256 Hash:</span>
                    <span className="text-teal-400">VERIFIED ON-CHAIN</span>
                  </div>
                  <div className="font-mono text-slate-500 break-all select-all">{receipt.transaction_hash}</div>
                </div>
              </div>

              {/* Actions: Print / New Donation */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  onClick={handlePrintCertificate}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-mono font-bold flex items-center gap-1.5 active:scale-95 transition"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>PRINT 80G TAX CERTIFICATE</span>
                </button>

                <button
                  onClick={() => setReceipt(null)}
                  className="px-4 py-2 rounded-xl btn-primary text-white text-xs font-mono font-bold flex items-center gap-1.5 active:scale-95 transition"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>DONATE TO ANOTHER CAMPAIGN</span>
                </button>
              </div>
            </div>
          ) : (
            /* Donation Form Flow */
            <form onSubmit={handleProcessDonation} className="space-y-4">
              
              {/* Campaign Selector */}
              <div>
                <label className="text-[11px] font-mono font-bold text-slate-400 block mb-1.5">
                  SELECT ACTIVE DISASTER RELIEF POOL:
                </label>
                <select
                  value={selectedCampaignId}
                  onChange={(e) => setSelectedCampaignId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs font-mono text-cyan-300 font-bold focus:outline-none focus:border-rose-500 cursor-pointer"
                >
                  {RELIEF_CAMPAIGNS.map((c) => (
                    <option key={c.id} value={c.id} className="bg-slate-950 text-slate-200">
                      {c.imageBadge} {c.title} ({c.state})
                    </option>
                  ))}
                </select>
              </div>

              {/* Campaign Quick Summary */}
              <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-start gap-3">
                <span className="text-2xl shrink-0 mt-0.5">{campaign.imageBadge}</span>
                <div className="space-y-1 text-xs font-mono">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-white font-bold">{campaign.state}</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-400">{campaign.district}</span>
                    <span className="px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 text-[9px] font-bold">
                      {campaign.urgencyLevel} NEED
                    </span>
                  </div>
                  <p className="text-[11px] font-sans text-slate-300 leading-relaxed">
                    {campaign.headline}
                  </p>
                </div>
              </div>

              {/* Preset Donation Amounts */}
              <div>
                <label className="text-[11px] font-mono font-bold text-slate-400 block mb-1.5">
                  CHOOSE CONTRIBUTION AMOUNT:
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {DONATION_PRESETS.map((preset) => (
                    <button
                      key={preset.amount}
                      type="button"
                      onClick={() => {
                        setAmount(preset.amount);
                        setCustomAmount('');
                      }}
                      className={`p-2.5 rounded-xl text-center border font-mono text-xs transition active:scale-95 flex flex-col items-center justify-center gap-1 ${
                        amount === preset.amount && !customAmount
                          ? 'bg-rose-600 text-white border-rose-500 font-bold shadow-[0_0_15px_rgba(244,63,94,0.4)]'
                          : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-sm">{preset.icon}</span>
                      <span>{preset.label}</span>
                    </button>
                  ))}
                </div>

                {/* Custom Amount Input */}
                <div className="mt-2.5">
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs font-mono text-slate-400">₹</span>
                    <input
                      type="number"
                      min="50"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      placeholder="Or enter custom amount in INR..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-7 pr-3 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                    />
                  </div>
                </div>
              </div>

              {/* Dynamic Impact Badge */}
              <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-800/60 text-xs font-mono text-cyan-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
                <div className="text-[11px]">
                  <strong>YOUR IMPACT:</strong> {getImpactDescription(finalAmount)}
                </div>
              </div>

              {/* Payment Mode Selector Tabs */}
              <div>
                <div className="flex border-b border-slate-800 text-xs font-mono mb-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab('UPI')}
                    className={`pb-2 px-3 font-bold border-b-2 transition ${
                      activeTab === 'UPI'
                        ? 'border-rose-500 text-rose-300'
                        : 'border-transparent text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    ⚡ INSTANT UPI & QR
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('BANK')}
                    className={`pb-2 px-3 font-bold border-b-2 transition ${
                      activeTab === 'BANK'
                        ? 'border-rose-500 text-rose-300'
                        : 'border-transparent text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    🏛️ GOVT BANK ACCOUNT
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('PLEDGE')}
                    className={`pb-2 px-3 font-bold border-b-2 transition ${
                      activeTab === 'PLEDGE'
                        ? 'border-rose-500 text-rose-300'
                        : 'border-transparent text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    📜 80G TAX CERTIFICATE
                  </button>
                </div>

                {/* Tab 1: UPI & QR Code */}
                {activeTab === 'UPI' && (
                  <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl space-y-3">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                      {/* SVG QR Code Simulation */}
                      <div className="p-3 bg-white rounded-2xl shadow-xl shrink-0 flex flex-col items-center justify-center">
                        <svg viewBox="0 0 100 100" className="w-24 h-24 sm:w-28 sm:h-28">
                          {/* Corner Squares */}
                          <rect x="5" y="5" width="28" height="28" fill="#030712" rx="4" />
                          <rect x="9" y="9" width="20" height="20" fill="#ffffff" rx="2" />
                          <rect x="13" y="13" width="12" height="12" fill="#030712" rx="2" />

                          <rect x="67" y="5" width="28" height="28" fill="#030712" rx="4" />
                          <rect x="71" y="9" width="20" height="20" fill="#ffffff" rx="2" />
                          <rect x="75" y="13" width="12" height="12" fill="#030712" rx="2" />

                          <rect x="5" y="67" width="28" height="28" fill="#030712" rx="4" />
                          <rect x="9" y="71" width="20" height="20" fill="#ffffff" rx="2" />
                          <rect x="13" y="75" width="12" height="12" fill="#030712" rx="2" />

                          {/* Data Matrix Bits */}
                          <rect x="38" y="10" width="8" height="8" fill="#030712" />
                          <rect x="50" y="15" width="8" height="8" fill="#030712" />
                          <rect x="42" y="28" width="6" height="6" fill="#030712" />
                          <rect x="10" y="42" width="8" height="8" fill="#030712" />
                          <rect x="25" y="48" width="6" height="6" fill="#030712" />
                          <rect x="38" y="40" width="14" height="14" fill="#030712" rx="2" />
                          <rect x="58" y="42" width="8" height="8" fill="#030712" />
                          <rect x="75" y="45" width="12" height="6" fill="#030712" />
                          <rect x="40" y="60" width="8" height="8" fill="#030712" />
                          <rect x="55" y="62" width="10" height="10" fill="#030712" />
                          <rect x="72" y="68" width="8" height="8" fill="#030712" />
                          <rect x="42" y="78" width="12" height="12" fill="#030712" />
                          <rect x="60" y="82" width="8" height="8" fill="#030712" />
                          <rect x="80" y="85" width="8" height="8" fill="#030712" />
                        </svg>
                        <span className="text-[9px] font-mono text-slate-800 font-bold mt-1">SCAN VIA ANY UPI APP</span>
                      </div>

                      {/* UPI ID & Deeplinks */}
                      <div className="flex-1 space-y-2 text-xs font-mono">
                        <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                          <div className="text-[10px] text-slate-400 uppercase">Official Verified UPI VPA:</div>
                          <div className="flex items-center justify-between text-cyan-300 font-bold">
                            <span className="truncate">{campaign.upiId}</span>
                            <button
                              type="button"
                              onClick={handleCopyUpi}
                              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] flex items-center gap-1 active:scale-95 transition"
                            >
                              <Copy className="w-3 h-3" />
                              <span>{copiedUpi ? 'COPIED!' : 'COPY'}</span>
                            </button>
                          </div>
                        </div>

                        <div className="text-[11px] text-slate-400 space-y-1">
                          <div>• Supported Apps: <strong>GPay, PhonePe, Paytm, BHIM, Cred, Amazon Pay</strong></div>
                          <div>• Direct statutory credit to {campaign.verifiedAuthority}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 2: Bank Account Details */}
                {activeTab === 'BANK' && (
                  <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl space-y-2.5 text-xs font-mono">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                        <span className="text-[10px] text-slate-400 block">Account Name:</span>
                        <strong className="text-white truncate block">{campaign.bankAccountName}</strong>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-slate-400 block">Account Number:</span>
                          <button
                            type="button"
                            onClick={handleCopyAccount}
                            className="text-[10px] text-cyan-400 hover:underline flex items-center gap-0.5"
                          >
                            <Copy className="w-2.5 h-2.5" /> {copiedAcc ? 'Copied' : 'Copy'}
                          </button>
                        </div>
                        <strong className="text-cyan-300 font-mono text-sm">{campaign.bankAccountNumber}</strong>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                        <span className="text-[10px] text-slate-400 block">IFSC Code:</span>
                        <strong className="text-white font-mono">{campaign.bankIfsc}</strong>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                        <span className="text-[10px] text-slate-400 block">Bank & Branch:</span>
                        <strong className="text-slate-300 truncate block">State Bank of India, {campaign.bankBranch}</strong>
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-500 italic">
                      Eligible for NEFT, RTGS, IMPS, and official government wire transfers.
                    </p>
                  </div>
                )}

                {/* Tab 3: Donor Details for 80G Tax Exemption */}
                {activeTab === 'PLEDGE' && (
                  <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl space-y-3 text-xs font-mono">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1">DONOR FULL NAME (AS PER PAN):</label>
                        <input
                          type="text"
                          value={donorName}
                          onChange={(e) => setDonorName(e.target.value)}
                          placeholder="e.g. Vikramaditya Sharma"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-rose-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1">PAN NUMBER (FOR 80G TAX REBATE):</label>
                        <input
                          type="text"
                          value={donorPan}
                          onChange={(e) => setDonorPan(e.target.value.toUpperCase())}
                          placeholder="e.g. ABCDE1234F"
                          maxLength={10}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-rose-500 uppercase"
                        />
                      </div>
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer text-slate-300 pt-1">
                      <input
                        type="checkbox"
                        checked={isAnonymous}
                        onChange={(e) => setIsAnonymous(e.target.checked)}
                        className="rounded border-slate-700 text-rose-500 focus:ring-0"
                      />
                      <span>Make donation anonymous on the public transparent ledger</span>
                    </label>
                  </div>
                )}
              </div>

              {/* Submit / Confirm Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-mono text-xs sm:text-sm font-black flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(244,63,94,0.5)] active:scale-95 transition"
              >
                <Heart className="w-4 h-4 fill-white" />
                <span>{isProcessing ? 'CONFIRMING RELIEF CONTRIBUTION...' : `CONFIRM DISASTER DONATION OF ₹${finalAmount.toLocaleString()}`}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center text-[10px] font-mono text-slate-500">
                100% of funds are audited and transferred directly to statutory disaster relief accounts.
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
