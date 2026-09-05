'use client';

import React, { useState } from 'react';
import { FileText, Download, Filter, Search, Calendar, FileCheck, ExternalLink } from 'lucide-react';

export interface DocumentItem {
  id: string;
  title: string;
  category: 'SOP' | 'ADVISORY' | 'POLICY' | 'DATA_TEMPLATE' | 'RESEARCH_PAPER';
  publishedDate: string;
  issuingBody: string;
  language: 'English' | 'हिन्दी' | 'Bilingual (EN/HI)';
  fileFormat: 'PDF' | 'CSV' | 'GEOJSON' | 'DOCX';
  fileSize: string;
  summary: string;
}

export const SAMPLE_DOCUMENTS: DocumentItem[] = [
  {
    id: 'DOC-FG-2026-SOP-01',
    title: 'Standard Operating Procedure: Flash Flood Early Warning and Downstream Evacuation in Steep Catchments',
    category: 'SOP',
    publishedDate: '2026-08-15',
    issuingBody: 'FloodGuard Research Group (SIH26192 Theme 4)',
    language: 'Bilingual (EN/HI)',
    fileFormat: 'PDF',
    fileSize: '1.8 MB',
    summary: 'Operational protocols for community alert escalation, automated siren triggers, and panchayat-level response sequences.',
  },
  {
    id: 'DOC-FG-2026-TMPL-02',
    title: 'Pan-India Catchment Telemetry Upload Standard: CSV Specification and Schema v2.1',
    category: 'DATA_TEMPLATE',
    publishedDate: '2026-08-28',
    issuingBody: 'Data Ingestion & Interoperability Directorate',
    language: 'English',
    fileFormat: 'CSV',
    fileSize: '42 KB',
    summary: 'Standardized header schema for AWS rain gauges, river radar stages, and TDR soil moisture sensors compatible with FloodGuard ingestion.',
  },
  {
    id: 'DOC-FG-2026-ADV-03',
    title: 'Advisory Circular: Slope Saturation Thresholds & Debris Flow Precursors in Uttarakhand & HP',
    category: 'ADVISORY',
    publishedDate: '2026-09-01',
    issuingBody: 'Geotechnical & Hydrological Modeling Unit',
    language: 'English',
    fileFormat: 'PDF',
    fileSize: '2.4 MB',
    summary: 'Technical thresholds for antecedent rainfall accumulation (>150mm in 72h) triggering secondary mass wasting.',
  },
  {
    id: 'DOC-FG-2026-RES-04',
    title: 'Forensic Hindcast Analysis: 2021 Chamoli GLOF & Rock-Ice Avalanche Sequence',
    category: 'RESEARCH_PAPER',
    publishedDate: '2026-07-20',
    issuingBody: 'Cryosphere & Glacial Hazard Study Group',
    language: 'English',
    fileFormat: 'PDF',
    fileSize: '4.1 MB',
    summary: 'Detailed timeline of the Rishiganga-Dhauliganga catastrophe with multi-sensor validation against satellite and seismic data.',
  },
  {
    id: 'DOC-FG-2026-POL-05',
    title: 'Open Data & Non-Impersonation Charter: Guidelines for Community & Operational Decision-Support',
    category: 'POLICY',
    publishedDate: '2026-08-30',
    issuingBody: 'Legal, Privacy & Public Communication Committee',
    language: 'Bilingual (EN/HI)',
    fileFormat: 'PDF',
    fileSize: '820 KB',
    summary: 'Operational principles governing data transparency, source provenance, disclaimer requirements, and strict non-impersonation protocols.',
  },
];

export const DocumentList: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredDocs = SAMPLE_DOCUMENTS.filter((doc) => {
    if (selectedCategory !== 'ALL' && doc.category !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        doc.title.toLowerCase().includes(q) ||
        doc.id.toLowerCase().includes(q) ||
        doc.summary.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const categories = [
    { key: 'ALL', label: 'All Documents' },
    { key: 'SOP', label: 'Standard Operating Procedures' },
    { key: 'ADVISORY', label: 'Technical Advisories' },
    { key: 'DATA_TEMPLATE', label: 'Data Templates & Specs' },
    { key: 'RESEARCH_PAPER', label: 'Research Papers' },
    { key: 'POLICY', label: 'Charters & Policy' },
  ];

  const handleDownload = (doc: DocumentItem) => {
    alert(`Downloading "${doc.title}" (${doc.fileFormat}, ${doc.fileSize})...\n\nThis is a research/demonstration document provided under SIH26192.`);
  };

  return (
    <div className="space-y-4">
      {/* Search & Category Filter Toolbar */}
      <div className="bg-white border border-slate-300 rounded p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat.key}
              type="button"
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-3 py-1.5 rounded font-medium transition ${
                selectedCategory === cat.key
                  ? 'bg-[#0f172a] text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents..."
            className="w-full bg-white border border-slate-300 rounded pl-8 pr-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600"
          />
        </div>
      </div>

      {/* Document Items Table / Cards */}
      <div className="bg-white border border-slate-300 rounded shadow-xs divide-y divide-slate-200 overflow-hidden text-xs">
        {filteredDocs.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            No matching documents found in this directory.
          </div>
        ) : (
          filteredDocs.map((doc) => (
            <div key={doc.id} className="p-4 hover:bg-slate-50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-mono uppercase bg-slate-100 text-slate-700 border border-slate-300 px-1.5 py-0.5 rounded font-bold">
                    {doc.category.replace(/_/g, ' ')}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500 font-semibold">
                    {doc.id}
                  </span>
                  <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-200 px-1.5 py-0.5 rounded">
                    {doc.language}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900 leading-snug">
                  {doc.title}
                </h4>

                <p className="text-slate-600 text-[11px] leading-relaxed">
                  {doc.summary}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-[10px] text-slate-500 pt-1">
                  <span>Issued By: <strong>{doc.issuingBody}</strong></span>
                  <span>Published: <strong>{doc.publishedDate}</strong></span>
                  <span>Format: <strong>{doc.fileFormat} ({doc.fileSize})</strong></span>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex-shrink-0 self-start sm:self-center">
                <button
                  type="button"
                  onClick={() => handleDownload(doc)}
                  className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold px-3 py-2 rounded text-xs transition active:scale-95 shadow-xs"
                >
                  <Download className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Download {doc.fileFormat}</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
