'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '../../context/AppContext';
import { BRAND_CONFIG } from '../../utils/brandConfig';
import {
  LayoutDashboard,
  Home,
  PlusCircle,
  Clock,
  History,
  MessageSquare,
  User,
  LogOut,
  Bell,
  Menu,
  X
} from 'lucide-react';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { projects, notifications } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const unreadNotifCount = notifications.filter(n => !n.isRead).length;

  const navItems = [
    { href: '/client', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { href: '/client/properties', label: 'My Properties', icon: <Home className="w-4 h-4" /> },
    { href: '/client/request', label: 'Request Service', icon: <PlusCircle className="w-4 h-4" /> },
    { href: '/client/projects', label: 'Active Projects', icon: <Clock className="w-4 h-4" />, badge: projects.filter(p => p.status !== 'Completed').length },
    { href: '/client/history', label: 'Service History', icon: <History className="w-4 h-4" /> },
    { href: '/client/messages', label: 'Messages', icon: <MessageSquare className="w-4 h-4" /> },
    { href: '/client/account', label: 'Account', icon: <User className="w-4 h-4" /> }
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row font-sans">
      
      {/* Mobile Top Navigation Header */}
      <div className="md:hidden bg-slate-900 text-white px-4 py-3 border-b border-slate-800 flex items-center justify-between sticky top-0 z-40">
        <Link href="/client" className="font-extrabold text-white text-base tracking-tight">
          {BRAND_CONFIG.shortName} <span className="text-xs text-sky-400 font-medium">Client Portal</span>
        </Link>

        <div className="flex items-center gap-3">
          <div className="relative p-1.5 rounded-lg bg-slate-800 text-slate-300">
            <Bell className="w-4 h-4" />
            {unreadNotifCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-sky-500 text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
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

      {/* Client Sidebar (Desktop + Mobile Slide Overlay) */}
      <aside className={`w-full md:w-64 bg-slate-900 text-slate-300 flex-shrink-0 border-r border-slate-800 p-4 flex-col justify-between space-y-6 ${
        mobileMenuOpen ? 'flex' : 'hidden md:flex'
      }`}>
        
        <div className="space-y-6">
          
          {/* Brand Logo & Client Identity (Desktop) */}
          <div className="hidden md:flex items-center justify-between pb-4 border-b border-slate-800">
            <Link href="/" className="font-extrabold text-white text-lg tracking-tight block">
              {BRAND_CONFIG.shortName} <span className="text-xs text-sky-400 font-medium uppercase tracking-wider block">Client Portal</span>
            </Link>
            <div className="relative p-1.5 rounded-lg bg-slate-800 text-slate-300">
              <Bell className="w-4 h-4" />
              {unreadNotifCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-sky-500 text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                  {unreadNotifCount}
                </span>
              )}
            </div>
          </div>

          {/* User Profile Card */}
          <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/80 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-sky-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
              MT
            </div>
            <div>
              <h4 className="text-sm font-bold text-white leading-tight">Michael Thompson</h4>
              <span className="text-[11px] text-sky-400 font-medium">Homeowner Client</span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1">
            {navItems.map(item => {
              const isActive = pathname === item.href || (pathname.startsWith('/client/projects') && item.href === '/client/projects');
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
                    <span className="bg-sky-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </nav>

        </div>

        {/* Footer Support & Exit */}
        <div className="space-y-3 pt-4 border-t border-slate-800 text-xs">
          <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/60 space-y-1 text-slate-400">
            <p className="font-bold text-slate-200">ApexCare Support</p>
            <p className="text-sky-400 font-semibold">{BRAND_CONFIG.phone}</p>
          </div>

          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out to Website</span>
          </Link>
        </div>

      </aside>

      {/* Main Content Body */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {children}
      </main>

    </div>
  );
}
