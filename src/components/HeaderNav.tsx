'use client';

import React, { useState } from 'react';
import { BRAND_CONFIG } from '../utils/brandConfig';
import { Wrench, LogIn, ArrowRight, Menu, X } from 'lucide-react';
import Link from 'next/link';

export const HeaderNav: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 w-full overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-sky-400 shadow-md">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-slate-900 block leading-tight">
              {BRAND_CONFIG.shortName}
            </span>
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-widest block">
              Property Services
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <Link href="/#services" className="hover:text-sky-600 transition-colors py-2">
            Services
          </Link>
          <Link href="/#how-it-works" className="hover:text-sky-600 transition-colors py-2">
            How It Works
          </Link>
          <Link href="/#about" className="hover:text-sky-600 transition-colors py-2">
            About Us
          </Link>
          <Link href="/#contact" className="hover:text-sky-600 transition-colors py-2">
            Contact
          </Link>
        </nav>

        {/* Desktop Action CTAs */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/login"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-all border border-transparent"
          >
            <LogIn className="w-4 h-4 text-slate-500" />
            <span>Login</span>
          </Link>

          <Link
            href="/client/request"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 active:bg-sky-800 shadow-sm transition-all group"
          >
            <span>Request a Service</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Mobile Menu Hamburger Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          className="md:hidden p-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
          aria-label="Open Mobile Menu"
        >
          <Menu className="w-6 h-6" />
        </button>

      </div>

      {/* Fixed Overlay Mobile Navigation Drawer (Opens ON TOP of page without shifting content) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex justify-end transition-opacity duration-300">
          
          <div className="w-full max-w-sm bg-white h-full shadow-2xl p-6 sm:p-8 flex flex-col justify-between overflow-y-auto space-y-8 animate-in slide-in-from-right duration-300">
            
            <div className="space-y-6">
              {/* Drawer Header with Close Button */}
              <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-sky-400 shadow-xs">
                    <Wrench className="w-5 h-5" />
                  </div>
                  <span className="font-extrabold text-slate-900 text-lg tracking-tight">
                    {BRAND_CONFIG.shortName}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Navigation Links with Spacious Spacing */}
              <nav className="flex flex-col space-y-3">
                <Link
                  href="/#services"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 rounded-xl text-base font-bold text-slate-800 hover:bg-slate-50 hover:text-sky-600 transition-all"
                >
                  Services
                </Link>
                <Link
                  href="/#how-it-works"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 rounded-xl text-base font-bold text-slate-800 hover:bg-slate-50 hover:text-sky-600 transition-all"
                >
                  How It Works
                </Link>
                <Link
                  href="/#about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 rounded-xl text-base font-bold text-slate-800 hover:bg-slate-50 hover:text-sky-600 transition-all"
                >
                  About Us
                </Link>
                <Link
                  href="/#contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 rounded-xl text-base font-bold text-slate-800 hover:bg-slate-50 hover:text-sky-600 transition-all"
                >
                  Contact
                </Link>
              </nav>
            </div>

            {/* Mobile Action Buttons */}
            <div className="space-y-3 pt-6 border-t border-slate-100">
              <Link
                href="/client/request"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full min-h-[48px] flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-extrabold text-white bg-sky-600 hover:bg-sky-700 shadow-md transition-all"
              >
                <span>Request a Service</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full min-h-[48px] flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all"
              >
                <LogIn className="w-4 h-4 text-slate-500" />
                <span>Client & Staff Login</span>
              </Link>
            </div>

          </div>
        </div>
      )}

    </header>
  );
};
