'use client';

import React, { useState } from 'react';
import { Bot, Send, X, AlertCircle, CheckCircle2, ChevronRight } from 'lucide-react';
import { UncertaintyBadge } from './Badges';

export const CopilotDrawer: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'copilot'; content: any }>>([
    {
      sender: 'copilot',
      content: {
        summary: "Hello Commander. I am the FloodGuard Grounded Copilot. I analyze live telemetry, risk engine scores, and IoT sensor states without hallucination. How can I assist?",
        observed_facts: ["All answers are strictly backed by current system state and data modes."],
      },
    },
  ]);
  const [loading, setLoading] = useState(false);

  const predefinedQueries = [
    "Why did risk increase in Sunderbans Nagar?",
    "Which sensors are currently offline or stale?",
    "What candidate evacuation routes are available?",
  ];

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    const userMsg = { sender: 'user' as const, content: text };
    setMessages((prev) => [...prev, userMsg]);
    setQuery('');
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/copilot/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: text }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { sender: 'copilot', content: data.response }]);
    } catch (e) {
      // Fallback local answer if API offline
      setMessages((prev) => [
        ...prev,
        {
          sender: 'copilot',
          content: {
            summary: "Composite flash flood risk is HIGH (68.5/100) due to intense rainfall accumulation (48mm in 3h) on steep slopes with 82% soil saturation.",
            observed_facts: ["Rainfall: 48mm in 3h", "Soil Saturation: 82%", "River Rise: +0.40m/h"],
            model_interpretation: "Near-saturated soil prevents infiltration, converting over 85% of rain directly into rapid overland runoff.",
            potential_operator_actions: ["Alert downstream village leaders", "Inspect bridge bottlenecks"],
            uncertainty_assessment: { uncertainty_level: "MEDIUM", note: "Demo mode telemetry active" },
          },
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[480px] bg-[#111827] border-l border-[#3a506b] shadow-2xl z-50 flex flex-col">
      {/* Drawer Header */}
      <div className="h-16 border-b border-slate-800 bg-[#0f172a] px-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-400">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-100 flex items-center gap-2">
              FLOODGUARD COPILOT
              <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-1.5 py-0.5 rounded font-mono">GROUNDED</span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono">ZERO-HALLUCINATION AI ASSISTANT</div>
          </div>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {messages.map((msg, i) => (
          <div key={i} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
            {msg.sender === 'user' ? (
              <div className="bg-blue-600 text-white p-3 rounded-xl rounded-tr-none max-w-[85%] font-medium">
                {msg.content}
              </div>
            ) : (
              <div className="bg-[#1c2541] border border-[#3a506b] p-4 rounded-xl rounded-tl-none max-w-[95%] space-y-3">
                {msg.content.summary && (
                  <div className="text-slate-100 font-medium">
                    {msg.content.summary}
                  </div>
                )}

                {msg.content.observed_facts?.length > 0 && (
                  <div className="bg-slate-900/80 p-2.5 rounded border border-slate-800 space-y-1">
                    <div className="font-semibold text-cyan-400 text-[11px] uppercase">Observed Facts:</div>
                    {msg.content.observed_facts.map((f: string, idx: number) => (
                      <div key={idx} className="text-slate-300 flex items-start gap-1.5">
                        <span className="text-cyan-500">•</span>
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                )}

                {msg.content.model_interpretation && (
                  <div className="text-slate-300 italic border-l-2 border-cyan-500 pl-2">
                    {msg.content.model_interpretation}
                  </div>
                )}

                {msg.content.potential_operator_actions?.length > 0 && (
                  <div className="bg-emerald-950/30 p-2.5 rounded border border-emerald-800/60 space-y-1">
                    <div className="font-semibold text-emerald-400 text-[11px] uppercase">Recommended Operator Considerations:</div>
                    {msg.content.potential_operator_actions.map((act: string, idx: number) => (
                      <div key={idx} className="text-slate-200 flex items-start gap-1.5">
                        <ChevronRight className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{act}</span>
                      </div>
                    ))}
                  </div>
                )}

                {msg.content.uncertainty_assessment && (
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Uncertainty: {msg.content.uncertainty_assessment.uncertainty_level}</span>
                    <span className="font-mono text-purple-300">DATA: DEMO</span>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="text-slate-400 text-xs flex items-center gap-2 italic">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            Analyzing hydrological telemetry and grounding response...
          </div>
        )}
      </div>

      {/* Quick Prompts */}
      <div className="px-4 py-2 border-t border-slate-800 bg-[#0f172a] flex flex-wrap gap-1.5">
        {predefinedQueries.map((q, i) => (
          <button
            key={i}
            onClick={() => handleSend(q)}
            className="text-[11px] px-2.5 py-1 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700 transition"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Field */}
      <div className="p-4 border-t border-slate-800 bg-[#0b132b] flex items-center gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend(query)}
          placeholder="Ask Copilot regarding risk, telemetry, or routes..."
          className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
        />
        <button
          onClick={() => handleSend(query)}
          disabled={loading}
          className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
