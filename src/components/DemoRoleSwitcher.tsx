'use client';

import React from 'react';
import { useApp } from '../context/AppContext';
import { BRAND_CONFIG } from '../utils/brandConfig';
import { ShieldCheck, UserCheck, Smartphone, Globe, RefreshCw, Bell } from 'lucide-react';
import { RoleType } from '../types';

interface DemoRoleSwitcherProps {
  onOpenNotifications: () => void;
}

export const DemoRoleSwitcher: React.FC<DemoRoleSwitcherProps> = ({ onOpenNotifications }) => {
  const { currentRole, setCurrentRole, notifications, resetDemoData } = useApp();
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const roles: { id: RoleType; label: string; icon: React.ReactNode; badge: string }[] = [
    { id: 'public', label: 'Public Website', icon: <Globe className="w-4 h-4" />, badge: 'Landing Page' },
    { id: 'client', label: 'Client Portal', icon: <UserCheck className="w-4 h-4" />, badge: 'Homeowner View' },
    { id: 'admin', label: 'Admin Portal', icon: <ShieldCheck className="w-4 h-4" />, badge: 'Company Dashboard' },
    { id: 'worker', label: 'Worker Portal', icon: <Smartphone className="w-4 h-4" />, badge: 'Mobile Field App' }
  ];

  return (
    <div className="bg-slate-900 border-b border-slate-800 text-slate-200 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        
        {/* Left: Brand Badge & Prototype Indicator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-semibold text-slate-100">{BRAND_CONFIG.shortName}</span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 bg-slate-700/60 px-1.5 py-0.5 rounded">
              Interactive Demo
            </span>
          </div>
          <p className="hidden md:block text-slate-400">
            Switch views to explore the 3-party workflow: <span className="text-slate-300 italic">{BRAND_CONFIG.trustValueProp}</span>
          </p>
        </div>

        {/* Right: Role Buttons & Controls */}
        <div className="flex items-center gap-2">
          {/* Role Switcher Pill Buttons */}
          <div className="flex items-center bg-slate-800 rounded-lg p-1 border border-slate-700">
            {roles.map(r => {
              const isActive = currentRole === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => setCurrentRole(r.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-sky-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                  }`}
                  title={`Switch to ${r.label}`}
                >
                  {r.icon}
                  <span className="hidden sm:inline">{r.label}</span>
                </button>
              );
            })}
          </div>

          {/* Notifications Button */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-colors"
            title="View Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-sky-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-slate-900">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Reset Demo State Button */}
          <button
            onClick={resetDemoData}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
            title="Reset demo state to initial dataset"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden lg:inline text-[11px]">Reset Demo</span>
          </button>
        </div>

      </div>
    </div>
  );
};
