'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '../../context/AppContext';
import { BRAND_CONFIG } from '../../utils/brandConfig';
import {
  LayoutDashboard,
  Inbox,
  Briefcase,
  Home,
  HardHat,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  Menu,
  X
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { requests, notifications } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const pendingRequestsCount = requests.filter(r => r.status === 'Awaiting Review' || r.status === 'Under Review').length;
  const unreadNotifCount = notifications.filter(n => !n.isRead).length;

  const adminNav = [
    { href: '/admin', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { href: '/admin/requests', label: 'Service Requests', icon: <Inbox className="w-4 h-4" />, badge: pendingRequestsCount },
    { href: '/admin/projects', label: 'Projects Hub', icon: <Briefcase className="w-4 h-4" /> },
    { href: '/admin/properties', label: 'Properties', icon: <Home className="w-4 h-4" /> },
    { href: '/admin/workers', label: 'Field Technicians', icon: <HardHat className="w-4 h-4" /> },
    { href: '/admin/clients', label: 'Clients', icon: <Users className="w-4 h-4" /> },
    { href: '/admin/reports', label: 'Reports', icon: <BarChart3 className="w-4 h-4" /> },
    { href: '/admin/settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> }
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row font-sans">
      
      {/* Mobile Top Navigation Header */}
      <div className="md:hidden bg-slate-900 text-white px-4 py-3 border-b border-slate-800 flex items-center justify-between sticky top-0 z-40">
        <Link href="/admin" className="font-extrabold text-white text-base tracking-tight">
          {BRAND_CONFIG.shortName} <span className="text-xs text-amber-400 font-medium">Admin Console</span>
        </Link>

        <div className="flex items-center gap-3">
          <div className="relative p-1.5 rounded-lg bg-slate-800 text-slate-300">
            <Bell className="w-4 h-4" />
            {unreadNotifCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                {unreadNotifCount}
              </span>
            )}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-slate-800 text-slate-200 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Admin Sidebar (Desktop + Mobile Slide) */}
      <aside className={`w-full md:w-64 bg-slate-900 text-slate-300 flex-shrink-0 border-r border-slate-800 p-4 flex-col justify-between space-y-6 ${
        mobileMenuOpen ? 'flex' : 'hidden md:flex'
      }`}>
        
        <div className="space-y-6">
          
          {/* Brand & Admin Badge (Desktop) */}
          <div className="hidden md:flex items-center justify-between pb-4 border-b border-slate-800">
            <Link href="/" className="font-extrabold text-white text-lg tracking-tight block">
              {BRAND_CONFIG.shortName} <span className="text-xs text-amber-400 font-medium uppercase tracking-wider block">Admin Console</span>
            </Link>
            <div className="relative p-1.5 rounded-lg bg-slate-800 text-slate-300">
              <Bell className="w-4 h-4" />
              {unreadNotifCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                  {unreadNotifCount}
                </span>
              )}
            </div>
          </div>

          {/* User Badge Card */}
          <div className="p-3 bg-slate-800 rounded-xl border border-slate-700 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-sky-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
              AD
            </div>
            <div>
              <h4 className="text-sm font-bold text-white leading-tight">ApexCare Dispatch</h4>
              <span className="text-[11px] text-sky-400 font-medium">Operations Manager</span>
            </div>
          </div>

          {/* Admin Navigation */}
          <nav className="space-y-1">
            {adminNav.map(item => {
              const isActive = pathname === item.href || (pathname.startsWith('/admin/projects') && item.href === '/admin/projects');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-sky-600 text-white shadow-sm font-bold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.badge ? (
                    <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </nav>

        </div>

        {/* Exit link */}
        <div className="pt-4 border-t border-slate-800">
          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out to Website</span>
          </Link>
        </div>

      </aside>

      {/* Main Admin Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {children}
      </main>

    </div>
  );
}
