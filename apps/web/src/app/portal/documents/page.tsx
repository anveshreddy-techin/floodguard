'use client';

import React from 'react';
import { DocumentList } from '@/design-system/components';
import { FileText, ShieldCheck, Download, BookOpen, Info } from 'lucide-react';

export default function PublicDocumentsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-300 rounded p-5 shadow-xs">
        <div className="flex items-center gap-2.5 border-b border-slate-200 pb-3 mb-3">
          <BookOpen className="w-5 h-5 text-blue-700" />
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Disaster Management Guidelines, SOPs & Research Publications
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Official document repository, technical circulars, emergency SOPs, and scientific research publications supporting SIH26192.
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-700 leading-relaxed">
          Access standardized documentation detailing community evacuation triggers, sensor calibration methodologies, and forensic disaster reconstructions developed for mountain basins in Northern and Northeastern India.
        </p>
      </div>

      {/* Main Document Registry List */}
      <section aria-labelledby="documents-registry-heading" className="space-y-3">
        <h3 id="documents-registry-heading" className="text-sm font-bold text-slate-900 uppercase tracking-wide">
          Official Documents & Technical Circulars Archive
        </h3>
        <DocumentList />
      </section>

      {/* Archive Policy Note */}
      <div className="bg-slate-50 border border-slate-300 rounded p-4 text-xs text-slate-600 space-y-1.5">
        <div className="flex items-center gap-2 font-semibold text-slate-900">
          <Info className="w-4 h-4 text-blue-700" />
          <span>Document Provenance & Academic Use Notice</span>
        </div>
        <p className="leading-relaxed">
          All publications in this portal are produced under the Smart India Hackathon research charter. Documents referencing official agencies (IMD, CWC, NDMA) cite publicly available datasets and operational standards for scientific demonstration.
        </p>
      </div>
    </div>
  );
}
