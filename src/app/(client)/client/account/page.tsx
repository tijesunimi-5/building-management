'use client';

import React from 'react';
import { User, Shield } from 'lucide-react';

export default function ClientAccountPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
          <User className="w-6 h-6 text-sky-600" />
          <span>Account & Profile Settings</span>
        </h1>
        <p className="text-sm text-slate-600">Manage homeowner contact details and notification preferences.</p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 text-xs">
        <div>
          <label className="block font-bold text-slate-700 mb-1">Full Name</label>
          <input type="text" defaultValue="Michael Thompson" className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold text-slate-900" />
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Email Address</label>
          <input type="email" defaultValue="m.thompson@example.ca" className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold text-slate-900" />
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
          <input type="text" defaultValue="+1 (416) 555-0192" className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold text-slate-900" />
        </div>

        <div className="pt-2">
          <button className="px-5 py-2.5 bg-sky-600 text-white rounded-xl font-bold text-xs shadow-xs">
            Save Account Changes
          </button>
        </div>
      </div>
    </div>
  );
}
