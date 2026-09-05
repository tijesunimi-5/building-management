'use client';

import React from 'react';
import { BRAND_CONFIG } from '../utils/brandConfig';
import { Wrench, LogIn, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const HeaderNav: React.FC = () => {
  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40">
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

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <Link href="/#services" className="hover:text-sky-600 transition-colors">
            Services
          </Link>
          <Link href="/#how-it-works" className="hover:text-sky-600 transition-colors">
            How It Works
          </Link>
          <Link href="/#about" className="hover:text-sky-600 transition-colors">
            About Us
          </Link>
          <Link href="/#contact" className="hover:text-sky-600 transition-colors">
            Contact
          </Link>
        </nav>

        {/* Action CTAs */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-all border border-transparent"
          >
            <LogIn className="w-4 h-4 text-slate-500" />
            <span>Login</span>
          </Link>

          <Link
            href="/client/request"
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 active:bg-sky-800 shadow-sm transition-all group"
          >
            <span>Request a Service</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

      </div>
    </header>
  );
};
