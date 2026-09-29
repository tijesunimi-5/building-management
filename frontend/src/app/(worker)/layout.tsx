'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '../../context/AppContext';
import { BRAND_CONFIG } from '../../utils/brandConfig';
import { LogOut, Bell } from 'lucide-react';
import { NotificationDrawer } from '../../components/NotificationDrawer';

export default function WorkerLayout({ children }: { children: React.ReactNode }) {
  const { workers, notifications } = useApp();
  const [notifOpen, setNotifOpen] = useState(false);
  const worker = workers[0] || { name: 'Michael Carter', roleTitle: 'Senior Technician', avatarUrl: '/assets/worker_avatar_1786614986847.jpg', status: 'On Job' };

  const unreadNotifCount = notifications.filter(n => (!n.roleTarget || n.roleTarget === 'worker') && !n.isRead).length;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-start py-4 px-2 sm:px-4 font-sans">
      
      {/* Mobile Frame Outer Shell */}
      <div className="w-full max-w-md bg-dashboard-doodle rounded-3xl border-4 border-slate-800 shadow-2xl overflow-hidden flex flex-col min-h-[800px] relative">
        
        {/* Mobile Header */}
        <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={worker.avatarUrl} alt={worker.name} className="w-9 h-9 rounded-full object-cover border border-emerald-400" />
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-xs font-bold text-white leading-tight">{worker.name}</h3>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={BRAND_CONFIG.logoWhite} alt={BRAND_CONFIG.companyName} className="h-3.5 w-auto object-contain opacity-80" />
              </div>
              <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {worker.status} • Field Tech
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setNotifOpen(true)}
              className="relative p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                  {unreadNotifCount}
                </span>
              )}
            </button>

            <Link
              href="/"
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Exit</span>
            </Link>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          {children}
        </div>

        <NotificationDrawer isOpen={notifOpen} onClose={() => setNotifOpen(false)} />

      </div>

    </div>
  );
}
