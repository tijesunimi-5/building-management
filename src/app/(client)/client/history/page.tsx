'use client';

import React from 'react';
import { History, CheckCircle2 } from 'lucide-react';

export default function ClientHistoryPage() {
  const completedServices = [
    { id: 'h-1', title: 'Thompson Residence — HVAC Annual Inspection', date: 'May 12, 2026', technician: 'Daniel Wilson', ref: 'PRJ-2026-1102' },
    { id: 'h-2', title: 'Thompson Residence — Main Floor Drywall Repair', date: 'March 04, 2026', technician: 'James Brown', ref: 'PRJ-2026-0988' },
    { id: 'h-3', title: 'Thompson Residence — Exterior Deck Sealant', date: 'August 19, 2025', technician: 'Michael Carter', ref: 'PRJ-2025-4421' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
          <History className="w-6 h-6 text-sky-600" />
          <span>Completed Service History</span>
        </h1>
        <p className="text-sm text-slate-600">Past maintenance records and verified photo evidence archives.</p>
      </div>

      <div className="space-y-3">
        {completedServices.map(item => (
          <div key={item.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-sky-600 text-xs">{item.ref}</span>
                <span className="text-slate-400">•</span>
                <span className="text-xs text-slate-500">{item.date}</span>
              </div>
              <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
              <p className="text-xs text-slate-600">Technician: <span className="font-semibold text-slate-800">{item.technician}</span></p>
            </div>

            <div className="text-right">
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Verified Complete
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
