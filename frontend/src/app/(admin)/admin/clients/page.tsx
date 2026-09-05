'use client';

import React from 'react';
import { Users, Mail, Phone, MapPin } from 'lucide-react';

export default function AdminClientsPage() {
  const clientsList = [
    { id: 'c-1', name: 'Michael Thompson', property: 'Thompson Residence', address: '142 Yorkville Ave, Toronto', email: 'm.thompson@example.ca', phone: '+1 (416) 555-0192', status: 'Active Client' },
    { id: 'c-2', name: 'Sarah Williams', property: 'Williams Family Home', address: '88 Forest Hill Rd, Toronto', email: 's.williams@example.ca', phone: '+1 (416) 555-0184', status: 'Active Client' },
    { id: 'c-3', name: 'David Anderson', property: 'Anderson Property', address: '320 Bay St, Suite 1400, Toronto', email: 'd.anderson@example.ca', phone: '+1 (416) 555-0137', status: 'Active Client' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
          <Users className="w-6 h-6 text-sky-600" />
          <span>Clients Directory</span>
        </h1>
        <p className="text-sm text-slate-600">Registered homeowners and property manager accounts.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {clientsList.map(c => (
          <div key={c.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">{c.name}</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">{c.status}</span>
            </div>

            <p className="text-xs font-semibold text-sky-600">{c.property}</p>

            <div className="space-y-1.5 pt-3 border-t border-slate-100 text-xs text-slate-600">
              <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {c.address}</div>
              <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-slate-400" /> {c.phone}</div>
              <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-slate-400" /> {c.email}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
