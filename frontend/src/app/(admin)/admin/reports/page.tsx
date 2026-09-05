'use client';

import React from 'react';
import { BarChart3, TrendingUp, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function AdminReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-sky-600" />
          <span>Service Reports & Field Analytics</span>
        </h1>
        <p className="text-sm text-slate-600">Operational performance, completion speeds, and photo audit compliance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase">Avg Response Time</span>
          <span className="text-3xl font-extrabold text-slate-900 block">1.8 Hours</span>
          <span className="text-xs text-emerald-600 font-bold flex items-center gap-1"><TrendingUp className="w-3.5 h-3.5" /> 14% faster than target</span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase">Photo Evidence Compliance</span>
          <span className="text-3xl font-extrabold text-emerald-600 block">100%</span>
          <span className="text-xs text-emerald-600 font-bold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> All jobs include Before/After proof</span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase">Client Satisfaction</span>
          <span className="text-3xl font-extrabold text-amber-500 block">4.9 / 5.0 ★</span>
          <span className="text-xs text-slate-500 font-medium">Based on 1,420 client reviews</span>
        </div>
      </div>
    </div>
  );
}
