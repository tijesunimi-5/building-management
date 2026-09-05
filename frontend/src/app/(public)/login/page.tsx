'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '../../../context/AppContext';
import { BRAND_CONFIG } from '../../../utils/brandConfig';
import { UserCheck, ShieldCheck, Smartphone, ArrowRight, Wrench, CheckCircle2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { setCurrentRole } = useApp();

  const handleRoleSelect = (role: 'client' | 'admin' | 'worker', path: string) => {
    setCurrentRole(role);
    router.push(path);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50 flex items-center justify-center p-4 py-12">
      <div className="max-w-xl w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xl">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 text-sky-400 flex items-center justify-center mx-auto shadow-md">
            <Wrench className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Sign In to {BRAND_CONFIG.shortName}
          </h1>
          <p className="text-sm text-slate-600">
            Select your role to access your dedicated property portal.
          </p>
        </div>

        {/* Role Quick Selection Cards */}
        <div className="space-y-4">
          
          {/* Client Portal Button */}
          <div
            onClick={() => handleRoleSelect('client', '/client')}
            className="group p-5 rounded-2xl border-2 border-slate-200 hover:border-sky-500 bg-white hover:bg-sky-50/40 transition-all duration-200 cursor-pointer flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                <UserCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
                  Client Portal
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Homeowner login (Michael Thompson) • Monitor property repairs & history
                </p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-sky-600 group-hover:translate-x-1 transition-all" />
          </div>

          {/* Admin Operations Button */}
          <div
            onClick={() => handleRoleSelect('admin', '/admin')}
            className="group p-5 rounded-2xl border-2 border-slate-200 hover:border-slate-900 bg-white hover:bg-slate-50 transition-all duration-200 cursor-pointer flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 transition-colors">
                  Company Admin Portal
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Dispatch & Management • Triage requests, assign & manage field workers
                </p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-1 transition-all" />
          </div>

          {/* Worker Mobile App Button */}
          <div
            onClick={() => handleRoleSelect('worker', '/worker')}
            className="group p-5 rounded-2xl border-2 border-slate-200 hover:border-emerald-500 bg-white hover:bg-emerald-50/40 transition-all duration-200 cursor-pointer flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  Worker Field Portal
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Technician view (Michael Carter) • Field checklist, photo evidence & job updates
                </p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
          </div>

        </div>

        {/* Security Note */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>Demo Authentication Mode — Instant 1-click role selection active.</span>
        </div>

      </div>
    </div>
  );
}
