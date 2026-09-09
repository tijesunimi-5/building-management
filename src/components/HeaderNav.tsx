'use client';

import React, { useState } from 'react';
import { BRAND_CONFIG } from '../utils/brandConfig';
import { Wrench, LogIn, ArrowRight, Menu, X } from 'lucide-react';
import Link from 'next/link';

export const HeaderNav: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[64px] sm:h-20 py-2 sm:py-0 flex items-center justify-between gap-2">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 flex-shrink-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-900 flex items-center justify-center text-sky-400 shadow-md">
            <Wrench className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <span className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 block leading-tight">
              {BRAND_CONFIG.shortName}
            </span>
            <span className="text-[10px] sm:text-[11px] font-medium text-slate-500 uppercase tracking-widest block">
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

        {/* Mobile Action & Menu Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          <Link
            href="/client/request"
            className="px-3 py-2 rounded-xl text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 active:bg-sky-800 shadow-xs transition-all flex items-center gap-1"
          >
            <span>Request</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="p-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 active:bg-slate-300 transition-colors flex items-center justify-center"
            aria-label="Open Mobile Menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

      </div>

      {/* Fixed Overlay Mobile Navigation Drawer (Opens ON TOP of page smoothly) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex justify-end transition-opacity duration-300">
          
          <div className="w-full max-w-xs sm:max-w-sm bg-white h-full shadow-2xl p-5 sm:p-8 flex flex-col justify-between overflow-y-auto space-y-6 border-l border-slate-200">
            
            <div className="space-y-6">
              {/* Drawer Header with Close Button */}
              <div className="flex items-center justify-between pb-5 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-sky-400 shadow-xs">
                    <Wrench className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-extrabold text-slate-900 text-lg tracking-tight block">
                      {BRAND_CONFIG.shortName}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider block">
                      Property Services
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 transition-colors"
                  aria-label="Close Mobile Menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Navigation Links with Spacious Spacing */}
              <nav className="flex flex-col space-y-2">
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
            <div className="space-y-3 pt-5 border-t border-slate-100">
              <Link
                href="/client/request"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full min-h-[48px] flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-extrabold text-white bg-sky-600 hover:bg-sky-700 active:bg-sky-800 shadow-md transition-all"
              >
                <span>Request a Service</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full min-h-[48px] flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 transition-all"
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
