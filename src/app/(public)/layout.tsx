'use client';

import React from 'react';
import { HeaderNav } from '../../components/HeaderNav';
import { BRAND_CONFIG } from '../../utils/brandConfig';
import { MapPin } from 'lucide-react';
import Link from 'next/link';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <HeaderNav />
      <div className="flex-1">{children}</div>

      {/* Public Footer */}
      <footer id="contact" className="bg-slate-950 text-slate-400 py-12 border-t border-slate-900 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-3">
            <h4 className="text-base font-bold text-white">{BRAND_CONFIG.companyName}</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {BRAND_CONFIG.tagline}
            </p>
            <p className="text-[11px] text-slate-500">
              {BRAND_CONFIG.prototypeDisclaimer}
            </p>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Service Areas</h5>
            <ul className="space-y-1.5 text-xs">
              <li className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-sky-400" /> Greater Toronto Area (GTA)</li>
              <li className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-sky-400" /> Vancouver & Lower Mainland</li>
              <li className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-sky-400" /> Calgary & Ottawa Region</li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Contact Information</h5>
            <ul className="space-y-1.5 text-xs">
              <li>Phone: {BRAND_CONFIG.phone}</li>
              <li>Email: {BRAND_CONFIG.email}</li>
              <li>HQ: {BRAND_CONFIG.address}</li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Quick Login</h5>
            <p className="text-xs text-slate-400 mb-3">Access your property dashboard, admin dispatch, or worker job list.</p>
            <Link
              href="/login"
              className="block text-center w-full py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-bold transition-colors"
            >
              Sign In to Platform
            </Link>
          </div>

        </div>
      </footer>
    </div>
  );
}
