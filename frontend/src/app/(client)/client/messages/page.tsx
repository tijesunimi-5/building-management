'use client';

import React from 'react';
import { MessageSquare, Send } from 'lucide-react';

export default function ClientMessagesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-sky-600" />
          <span>Messages & Support</span>
        </h1>
        <p className="text-sm text-slate-600">Direct message history with ApexCare dispatch and field technicians.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden h-[500px] flex flex-col justify-between">
        <div className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-sm text-slate-900">
          Thread: Thompson Residence Maintenance
        </div>

        <div className="p-4 flex-1 overflow-y-auto space-y-3 text-xs">
          <div className="bg-slate-100 p-3 rounded-xl max-w-sm">
            <span className="font-bold text-slate-900 block mb-0.5">ApexCare Dispatch</span>
            <span>Michael Carter has been dispatched for your plumbing repair request.</span>
            <span className="text-[10px] text-slate-400 block mt-1">Aug 15 — 08:31 AM</span>
          </div>

          <div className="bg-sky-600 text-white p-3 rounded-xl max-w-sm ml-auto">
            <span className="font-bold block mb-0.5">You (Michael Thompson)</span>
            <span>Great, thank you! The gate code is #4829.</span>
            <span className="text-[10px] text-sky-200 block mt-1">Aug 15 — 08:35 AM</span>
          </div>
        </div>

        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center gap-2">
          <input
            type="text"
            placeholder="Type your message to dispatch..."
            className="flex-1 px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
          />
          <button className="px-4 py-2.5 bg-sky-600 text-white rounded-xl text-xs font-bold flex items-center gap-1">
            <Send className="w-3.5 h-3.5" />
            <span>Send</span>
          </button>
        </div>
      </div>
    </div>
  );
}
