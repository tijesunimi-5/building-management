'use client';

import React from 'react';
import { Settings } from 'lucide-react';
import { BRAND_CONFIG } from '../../../../utils/brandConfig';

export default function AdminSettingsPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
          <Settings className="w-6 h-6 text-sky-600" />
          <span>Platform & Branding Settings</span>
        </h1>
        <p className="text-sm text-slate-600">Configure company identity, contact numbers, and dispatch settings.</p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 text-xs">
        <div>
          <label className="block font-bold text-slate-700 mb-1">Company Name</label>
          <input type="text" defaultValue={BRAND_CONFIG.companyName} className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold text-slate-900" />
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Support Phone</label>
          <input type="text" defaultValue={BRAND_CONFIG.phone} className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold text-slate-900" />
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">HQ Address</label>
          <input type="text" defaultValue={BRAND_CONFIG.address} className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold text-slate-900" />
        </div>

        <div className="pt-2">
          <button className="px-5 py-2.5 bg-sky-600 text-white rounded-xl font-bold text-xs shadow-xs">
            Save Platform Settings
          </button>
        </div>
      </div>
    </div>
  );
}
