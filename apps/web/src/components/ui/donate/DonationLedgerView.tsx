'use client';

import React from 'react';
import { Database, ShieldCheck, CheckCircle2, Clock, Hash, Heart } from 'lucide-react';

interface LedgerItem {
  receipt_id: string;
  timestamp: string;
  campaign_title: string;
  amount_inr: number;
  donor_name_masked: string;
  transaction_hash: string;
  relief_allocation: string;
}

export const DonationLedgerView: React.FC<{
  ledger: LedgerItem[];
}> = ({ ledger = [] }) => {
  return (
    <div className="fp fp-operational p-4 sm:p-6 rounded-3xl border border-slate-800 shadow-2xl space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-teal-400" />
          <h3 className="text-sm sm:text-base font-black font-mono text-white tracking-wide uppercase">
            TRANSPARENT PUBLIC RELIEF CONTRIBUTION LEDGER
          </h3>
        </div>
        <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 px-2.5 py-1 rounded-xl border border-cyan-800/60 flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5" /> Cryptographically Verified Pledges
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800">
            <tr>
              <th className="p-3">Receipt / Time</th>
              <th className="p-3">Benefactor</th>
              <th className="p-3">Relief Campaign</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Allocated Aid</th>
              <th className="p-3">Transaction Hash</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {ledger.map((row, i) => (
              <tr key={i} className="hover:bg-slate-900/50 transition">
                <td className="p-3">
                  <div className="font-bold text-cyan-300">{row.receipt_id}</div>
                  <span className="text-[10px] text-slate-500">
                    {new Date(row.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </td>

                <td className="p-3">
                  <span className="font-bold text-white">{row.donor_name_masked}</span>
                </td>

                <td className="p-3 max-w-xs truncate text-slate-200">
                  {row.campaign_title}
                </td>

                <td className="p-3 font-bold text-emerald-400">
                  ₹{row.amount_inr.toLocaleString()}
                </td>

                <td className="p-3 text-[11px] text-slate-300">
                  {row.relief_allocation}
                </td>

                <td className="p-3">
                  <span className="text-[10px] text-slate-500 font-mono select-all bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                    {row.transaction_hash.substring(0, 12)}...
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-2xl text-[11px] font-mono text-slate-400 flex items-start gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-200">Statutory Audit Guarantee:</strong> All disaster contributions are logged to this public ledger and reconciled directly with State Disaster Relief Fund (SDRF) and PMNRF treasury accounts under CAG audit guidelines.
        </div>
      </div>
    </div>
  );
};
