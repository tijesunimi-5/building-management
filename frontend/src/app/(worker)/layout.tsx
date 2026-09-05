'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '../../context/AppContext';
import { LogOut } from 'lucide-react';

export default function WorkerLayout({ children }: { children: React.ReactNode }) {
  const { workers } = useApp();
  const worker = workers[0] || { name: 'Michael Carter', roleTitle: 'Senior Technician', avatarUrl: '/assets/worker_avatar_1786614986847.jpg', status: 'On Job' };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-start py-4 px-2 sm:px-4 font-sans">
      
      {/* Mobile Frame Outer Shell */}
      <div className="w-full max-w-md bg-slate-950 rounded-3xl border-4 border-slate-800 shadow-2xl overflow-hidden flex flex-col min-h-[800px]">
        
        {/* Mobile Header */}
        <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={worker.avatarUrl} alt={worker.name} className="w-9 h-9 rounded-full object-cover border border-sky-400" />
            <div>
              <h3 className="text-xs font-bold text-white leading-tight">{worker.name}</h3>
              <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {worker.status} • Field Tech
              </span>
            </div>
          </div>

          <Link
            href="/"
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Exit</span>
          </Link>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          {children}
        </div>

      </div>

    </div>
  );
}
