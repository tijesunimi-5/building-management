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
    { href: '/client', label: 'Overview', icon: <LayoutDashboard className="w-5 h-5" /> },
    { href: '/client/properties', label: 'My Properties', icon: <Home className="w-5 h-5" /> },
    { href: '/client/request', label: 'Request Service', icon: <PlusCircle className="w-5 h-5" /> },
    { href: '/client/projects', label: 'Active Projects', icon: <Clock className="w-5 h-5" />, badge: projects.filter(p => p.status !== 'Completed').length },
    { href: '/client/history', label: 'Service History', icon: <History className="w-5 h-5" /> },
    { href: '/client/messages', label: 'Messages', icon: <MessageSquare className="w-5 h-5" /> },
    { href: '/client/account', label: 'Account', icon: <User className="w-5 h-5" /> }
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row font-sans overflow-x-hidden w-full">
      
      {/* Mobile Top Header (Fixed Height, No Content Shift) */}
      <div className="md:hidden bg-slate-900 text-white px-4 sm:px-6 py-4 border-b border-slate-800 flex items-center justify-between sticky top-0 z-40 shadow-md">
        <Link href="/client" className="font-extrabold text-white text-base tracking-tight">
          {BRAND_CONFIG.shortName} <span className="text-xs text-sky-400 font-medium">Client Portal</span>
        </Link>

        <div className="flex items-center gap-3">
          <div className="relative p-2 rounded-xl bg-slate-800 text-slate-300">
            <Bell className="w-5 h-5" />
            {unreadNotifCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-sky-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
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
                <Link href="/client" className="font-extrabold text-white text-lg tracking-tight">
                  {BRAND_CONFIG.shortName} <span className="text-xs text-sky-400 font-medium uppercase tracking-wider block">Client Portal</span>
                </Link>

                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Navigation Items */}
              <nav className="space-y-2">
                {navItems.map(item => {
                  const isActive = pathname === item.href || (pathname.startsWith('/client/projects') && item.href === '/client/projects');
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
                        <span className="bg-sky-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                          {item.badge}
                        </span>
                      ) : null}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Footer Support & Exit */}
            <div className="space-y-4 pt-6 border-t border-slate-800 text-xs">
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
              {BRAND_CONFIG.shortName} <span className="text-xs text-sky-400 font-medium uppercase tracking-wider block">Client Portal</span>
            </Link>
            <div className="relative p-2 rounded-xl bg-slate-800 text-slate-300">
              <Bell className="w-4 h-4" />
              {unreadNotifCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-sky-500 text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                  {unreadNotifCount}
                </span>
              )}
            </div>
          </div>

          <nav className="space-y-1">
            {navItems.map(item => {
              const isActive = pathname === item.href || (pathname.startsWith('/client/projects') && item.href === '/client/projects');
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
                    <span className="bg-sky-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
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

      {/* Main Content Body */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-x-hidden">
        {children}
      </main>

    </div>
  );
}
