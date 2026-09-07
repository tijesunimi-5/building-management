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
    { href: '/admin', label: 'Overview', icon: <LayoutDashboard className="w-5 h-5" /> },
    { href: '/admin/requests', label: 'Service Requests', icon: <Inbox className="w-5 h-5" />, badge: pendingRequestsCount },
    { href: '/admin/projects', label: 'Projects Hub', icon: <Briefcase className="w-5 h-5" /> },
    { href: '/admin/properties', label: 'Properties', icon: <Home className="w-5 h-5" /> },
    { href: '/admin/workers', label: 'Field Technicians', icon: <HardHat className="w-5 h-5" /> },
    { href: '/admin/clients', label: 'Clients', icon: <Users className="w-5 h-5" /> },
    { href: '/admin/reports', label: 'Reports', icon: <BarChart3 className="w-5 h-5" /> },
    { href: '/admin/settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> }
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row font-sans overflow-x-hidden w-full">
      
      {/* Mobile Top Header (Fixed Height, No Content Shift) */}
      <div className="md:hidden bg-slate-900 text-white px-4 sm:px-6 py-4 border-b border-slate-800 flex items-center justify-between sticky top-0 z-40 shadow-md">
        <Link href="/admin" className="font-extrabold text-white text-base tracking-tight">
          {BRAND_CONFIG.shortName} <span className="text-xs text-amber-400 font-medium">Admin Console</span>
        </Link>

        <div className="flex items-center gap-3">
          <div className="relative p-2 rounded-xl bg-slate-800 text-slate-300">
            <Bell className="w-5 h-5" />
            {unreadNotifCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {unreadNotifCount}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="p-2.5 rounded-xl bg-slate-800 text-slate-200 hover:text-white transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Fixed Mobile Overlay Navigation Drawer (Does NOT shift content down) */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex justify-end transition-opacity">
          <div className="w-full max-w-xs bg-slate-900 text-slate-300 h-full p-6 sm:p-8 flex flex-col justify-between overflow-y-auto space-y-6 animate-in slide-in-from-right duration-300 border-l border-slate-800">
            
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-6 border-b border-slate-800">
                <Link href="/admin" className="font-extrabold text-white text-lg tracking-tight">
                  {BRAND_CONFIG.shortName} <span className="text-xs text-amber-400 font-medium uppercase tracking-wider block">Admin Console</span>
                </Link>

                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Admin Navigation */}
              <nav className="space-y-2">
                {adminNav.map(item => {
                  const isActive = pathname === item.href || (pathname.startsWith('/admin/projects') && item.href === '/admin/projects');
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                        isActive
                          ? 'bg-sky-600 text-white shadow-sm font-bold'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {item.icon}
                        <span>{item.label}</span>
                      </div>
                      {item.badge ? (
                        <span className="bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                          {item.badge}
                        </span>
                      ) : null}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Exit Link */}
            <div className="pt-6 border-t border-slate-800">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full min-h-[44px] flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out to Website</span>
              </Link>
            </div>

          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-slate-900 text-slate-300 flex-shrink-0 border-r border-slate-800 p-6 flex-col justify-between space-y-6">
        <div className="space-y-6">
          
          <div className="flex items-center justify-between pb-6 border-b border-slate-800">
            <Link href="/" className="font-extrabold text-white text-lg tracking-tight block">
              {BRAND_CONFIG.shortName} <span className="text-xs text-amber-400 font-medium uppercase tracking-wider block">Admin Console</span>
            </Link>
            <div className="relative p-2 rounded-xl bg-slate-800 text-slate-300">
              <Bell className="w-4 h-4" />
              {unreadNotifCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                  {unreadNotifCount}
                </span>
              )}
            </div>
          </div>

          <nav className="space-y-1">
            {adminNav.map(item => {
              const isActive = pathname === item.href || (pathname.startsWith('/admin/projects') && item.href === '/admin/projects');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-sky-600 text-white shadow-sm font-bold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
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

        <div className="pt-4 border-t border-slate-800">
          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out to Website</span>
          </Link>
        </div>
      </aside>

      {/* Main Admin Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-x-hidden">
        {children}
      </main>

    </div>
  );
}
