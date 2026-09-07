'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '../../../context/AppContext';
import { loginWithApi } from '../../../lib/api';
import { BRAND_CONFIG } from '../../../utils/brandConfig';
import { ShieldCheck, Mail, Lock, ArrowRight, Wrench, CheckCircle2, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { setCurrentRole } = useApp();

  const [activeTab, setActiveTab] = useState<'client' | 'admin'>('client');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!email.trim()) return;

    setIsLoading(true);
    try {
      const userData = await loginWithApi(email.trim(), activeTab === 'admin' ? password : undefined);
      setCurrentRole(userData.role);

      if (userData.role === 'admin') {
        router.push('/admin');
      } else if (userData.role === 'worker') {
        router.push('/worker');
      } else {
        router.push('/client');
      }
    } catch (err) {
      setErrorMessage((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoRole = (role: 'client' | 'admin' | 'worker', path: string) => {
    setCurrentRole(role);
    router.push(path);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50 flex items-center justify-center p-4 py-12">
      <div className="max-w-md w-full space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xl">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 text-sky-400 flex items-center justify-center mx-auto shadow-md">
            <Wrench className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Sign In to {BRAND_CONFIG.shortName}
          </h1>
          <p className="text-xs text-slate-600">
            Simple email access for clients & workers. Password protected for admin.
          </p>
        </div>

        {/* Auth Tab Switcher */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl text-xs font-bold">
          <button
            type="button"
            onClick={() => { setActiveTab('client'); setErrorMessage(null); }}
            className={`py-2 rounded-lg transition-all ${activeTab === 'client' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'}`}
          >
            Client / Worker Login
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('admin'); setErrorMessage(null); }}
            className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${activeTab === 'admin' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-500 hover:text-slate-900'}`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin Portal</span>
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={activeTab === 'admin' ? 'admin@apexcare.ca' : 'client@example.ca'}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          {/* Password Field (Only for Admin) */}
          {activeTab === 'admin' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Admin Security Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-xl font-bold text-sm text-white shadow-md transition-all flex items-center justify-center gap-2 ${
              activeTab === 'admin' ? 'bg-slate-900 hover:bg-slate-800' : 'bg-sky-600 hover:bg-sky-700'
            }`}
          >
            <span>{isLoading ? 'Authenticating...' : (activeTab === 'admin' ? 'Sign In as Admin' : 'Sign In with Email')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Fast Selector Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-2xs uppercase tracking-wider font-bold">
            <span className="bg-white px-3 text-slate-400">Or Quick Demo Selection</span>
          </div>
        </div>

        {/* Demo Buttons */}
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => handleQuickDemoRole('client', '/client')}
            className="p-2.5 rounded-xl border border-slate-200 hover:border-sky-500 text-xs font-bold text-slate-700 hover:text-sky-700 bg-slate-50 hover:bg-sky-50/50 transition-all text-center"
          >
            Client Demo
          </button>
          <button
            onClick={() => handleQuickDemoRole('admin', '/admin')}
            className="p-2.5 rounded-xl border border-slate-200 hover:border-slate-900 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 transition-all text-center"
          >
            Admin Demo
          </button>
          <button
            onClick={() => handleQuickDemoRole('worker', '/worker')}
            className="p-2.5 rounded-xl border border-slate-200 hover:border-emerald-500 text-xs font-bold text-slate-700 hover:text-emerald-700 bg-slate-50 hover:bg-emerald-50/50 transition-all text-center"
          >
            Worker Demo
          </button>
        </div>

      </div>
    </div>
  );
}
