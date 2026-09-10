'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '../../../context/AppContext';
import { loginWithApi } from '../../../lib/api';
import { BRAND_CONFIG } from '../../../utils/brandConfig';
import { Mail, ArrowRight, Wrench, AlertCircle, ShieldCheck, CheckCircle2, UserCheck } from 'lucide-react';

export default function PublicLoginPage() {
  const router = useRouter();
  const { currentRole, currentUser, setCurrentRole, setCurrentUser } = useApp();

  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [persistedUserEmail, setPersistedUserEmail] = useState<string | null>(null);

  // Auto-fill and check for persistent login
  useEffect(() => {
    try {
      const savedEmail = localStorage.getItem('apexcare_last_email');
      if (savedEmail) {
        setEmail(savedEmail);
        setPersistedUserEmail(savedEmail);
      }
      if (currentUser && currentUser.email) {
        setPersistedUserEmail(currentUser.email);
      }
    } catch {
      // Ignore
    }
  }, [currentUser]);

  const handleClientLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!email.trim()) return;

    setIsLoading(true);
    try {
      const userData = await loginWithApi(email.trim());
      if (userData.role === 'admin') {
        setErrorMessage('Admin accounts must log in via the Secure Admin Access portal.');
        setIsLoading(false);
        return;
      }

      // Save email and user profile to localStorage for persistent PWA access
      try {
        localStorage.setItem('apexcare_last_email', userData.email);
      } catch {
        // Ignore
      }

      const userProfile = {
        id: userData.id,
        name: userData.name || email.split('@')[0],
        email: userData.email,
        role: userData.role,
        roleTitle: userData.roleTitle || (userData.role === 'worker' ? 'Technician' : 'Client'),
        avatarUrl: userData.avatarUrl
      };

      setCurrentRole(userData.role);
      setCurrentUser(userProfile);

      if (userData.role === 'worker') {
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

  const handleQuickResume = () => {
    if (currentUser?.role === 'worker') {
      router.push('/worker');
    } else {
      router.push('/client');
    }
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
            Secure homeowner & client access. Enter your email to sign in or get started.
          </p>
        </div>

        {/* Quick Resume Active Session Card */}
        {persistedUserEmail && (
          <div className="p-4 bg-sky-50 border border-sky-200 rounded-2xl space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-sky-600 text-white">
                <UserCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-sky-900 block">Saved Session Found</span>
                <span className="text-[11px] text-sky-700 font-medium">{persistedUserEmail}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleQuickResume}
              className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5"
            >
              <span>Continue as {persistedUserEmail.split('@')[0]}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Client Login Form */}
        <form onSubmit={handleClientLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Your Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white font-extrabold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            <span>{isLoading ? 'Authenticating...' : 'Sign In / Register with Email'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Dedicated Hidden Link to Admin Login */}
        <div className="pt-4 border-t border-slate-100 text-center">
          <a
            href="/admin/login"
            className="inline-flex items-center gap-1.5 text-2xs font-semibold text-slate-400 hover:text-slate-700 transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Staff & Admin Portal Sign In</span>
          </a>
        </div>

      </div>
    </div>
  );
}
