'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '../../../../context/AppContext';
import {
  User,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Edit3,
  Save,
  AlertCircle,
  Clock,
  Sparkles
} from 'lucide-react';

export default function ClientAccountPage() {
  const { currentUser, updateUserProfile } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form states initialized with currentUser data
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [primaryAddress, setPrimaryAddress] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [preferredContactMethod, setPreferredContactMethod] = useState<'Email' | 'Phone' | 'SMS'>('Email');

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setEmail(currentUser.email || '');
      setPhone(currentUser.phone || '');
      setPrimaryAddress(currentUser.primaryAddress || '');
      setEmergencyContact(currentUser.emergencyContact || '');
      setPreferredContactMethod(currentUser.preferredContactMethod || 'Email');
    }
  }, [currentUser]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      primaryAddress: primaryAddress.trim(),
      emergencyContact: emergencyContact.trim(),
      preferredContactMethod
    });

    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 4000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs font-bold text-sky-700">
            <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
            <span>Homeowner Profile & Preferences</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Account Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            View, add, or update your contact details and service preferences.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsEditing(!isEditing)}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2 ${
            isEditing
              ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              : 'bg-sky-600 text-white hover:bg-sky-700 active:bg-sky-800'
          }`}
        >
          {isEditing ? (
            <>
              <AlertCircle className="w-4 h-4" />
              <span>Cancel Editing</span>
            </>
          ) : (
            <>
              <Edit3 className="w-4 h-4" />
              <span>Edit Account Details</span>
            </>
          )}
        </button>
      </div>

      {/* Success Notification Banner */}
      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold flex items-center gap-3 animate-in fade-in duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>Account details updated successfully! Your preferences have been saved.</span>
        </div>
      )}

      {/* Profile Overview Badge Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none transform translate-x-4 -translate-y-4">
          <Sparkles className="w-48 h-48 text-sky-400" />
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-sky-500 text-white flex items-center justify-center font-extrabold text-2xl shadow-lg border-2 border-sky-400/40">
            {name ? name.charAt(0).toUpperCase() : 'C'}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                {name || 'Valued Homeowner'}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                Active Client
              </span>
            </div>
            <p className="text-xs text-slate-300 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-sky-400" />
              <span>{email || 'No email associated'}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Main Account Details Form / View */}
      <form onSubmit={handleSaveProfile} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-bold text-slate-900">
            Personal & Property Details
          </h3>
          <span className="text-xs text-slate-400 font-medium">
            {isEditing ? 'Editing Mode' : 'View Mode'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Full Name
            </label>
            {isEditing ? (
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            ) : (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-sm font-semibold text-slate-900">
                {name || <span className="text-slate-400 italic">Not added yet</span>}
              </div>
            )}
          </div>

          {/* Email Address */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Email Address
            </label>
            {isEditing ? (
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            ) : (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-sm font-semibold text-slate-900 flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400" />
                <span>{email || <span className="text-slate-400 italic">Not added yet</span>}</span>
              </div>
            )}
          </div>

          {/* Phone Number */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Phone Number
            </label>
            {isEditing ? (
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+1 (416) 555-0192"
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            ) : (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-sm font-semibold text-slate-900 flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-400" />
                <span>{phone ? phone : <span className="text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md text-xs font-bold border border-amber-200">Not added yet — Click Edit to add</span>}</span>
              </div>
            )}
          </div>

          {/* Primary Property Address */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Primary Property Address
            </label>
            {isEditing ? (
              <input
                type="text"
                value={primaryAddress}
                onChange={e => setPrimaryAddress(e.target.value)}
                placeholder="142 Yorkville Avenue, Toronto, ON"
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            ) : (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-sm font-semibold text-slate-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span>{primaryAddress ? primaryAddress : <span className="text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md text-xs font-bold border border-amber-200">Not added yet — Click Edit to add</span>}</span>
              </div>
            )}
          </div>

          {/* Emergency Contact */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Emergency Contact (Name & Phone)
            </label>
            {isEditing ? (
              <input
                type="text"
                value={emergencyContact}
                onChange={e => setEmergencyContact(e.target.value)}
                placeholder="e.g. Jane Doe (+1 416-555-0199)"
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            ) : (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-sm font-semibold text-slate-900">
                {emergencyContact ? emergencyContact : <span className="text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md text-xs font-bold border border-amber-200">Not added yet — Click Edit to add</span>}
              </div>
            )}
          </div>

          {/* Preferred Contact Method */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Preferred Contact Method
            </label>
            {isEditing ? (
              <select
                value={preferredContactMethod}
                onChange={e => setPreferredContactMethod(e.target.value as any)}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
              >
                <option value="Email">Email Notifications</option>
                <option value="Phone">Phone Calls</option>
                <option value="SMS">SMS Text Messages</option>
              </select>
            ) : (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-sm font-semibold text-slate-900">
                {preferredContactMethod}
              </div>
            )}
          </div>

        </div>

        {/* Submit Actions */}
        {isEditing && (
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-5 py-3 rounded-xl font-bold text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              className="px-6 py-3 rounded-xl font-bold text-xs text-white bg-sky-600 hover:bg-sky-700 active:bg-sky-800 shadow-md transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Account Changes</span>
            </button>
          </div>
        )}

      </form>
    </div>
  );
}
