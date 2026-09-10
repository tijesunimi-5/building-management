'use client';

import React, { useState } from 'react';
import { useApp } from '../../../../context/AppContext';
import { PriorityLevel } from '../../../../types';
import { CheckCircle2, Upload, Building, MapPin, User, Tag, AlertTriangle, Sparkles, Clock } from 'lucide-react';

export default function ClientRequestServicePage() {
  const { properties, submitServiceRequest } = useApp();

  const [reqPropertyName, setReqPropertyName] = useState<string>(properties[0]?.name || '');
  const [reqAddress, setReqAddress] = useState<string>(properties[0]?.address || '');
  const [reqClientName, setReqClientName] = useState<string>(properties[0]?.clientName || '');
  const [reqPropertyId, setReqPropertyId] = useState<string>(properties[0]?.id || 'prop-1');
  
  const [reqServiceCategory, setReqServiceCategory] = useState<string>('Plumbing');
  const [reqCustomCategory, setReqCustomCategory] = useState<string>('');
  const [reqUrgency, setReqUrgency] = useState<PriorityLevel>('Medium');
  const [reqDescription, setReqDescription] = useState<string>('');
  const [reqPreferredDate, setReqPreferredDate] = useState<string>('2026-09-12');
  const [reqNotes, setReqNotes] = useState<string>('');
  const [reqSubmittedRef, setReqSubmittedRef] = useState<string | null>(null);

  const handleSelectExistingProperty = (propId: string) => {
    const selected = properties.find(p => p.id === propId);
    if (selected) {
      setReqPropertyId(selected.id);
      setReqPropertyName(selected.name);
      setReqAddress(selected.address);
      if (selected.clientName) setReqClientName(selected.clientName);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const finalCategory = reqServiceCategory === 'Others' 
      ? (reqCustomCategory.trim() || 'Custom Service Request') 
      : reqServiceCategory;

    const newReq = await submitServiceRequest({
      propertyId: reqPropertyId,
      propertyName: reqPropertyName || 'Client Property',
      propertyAddress: reqAddress || 'Toronto, ON',
      clientName: reqClientName || 'Homeowner Client',
      serviceCategory: finalCategory,
      urgency: reqUrgency,
      description: reqDescription,
      preferredDate: reqPreferredDate,
      additionalNotes: reqNotes,
      photoUrls: ['/assets/plumbing_before_tap_1786614903733.jpg']
    });

    setReqSubmittedRef(newReq.referenceNumber);
    setReqDescription('');
    setReqNotes('');
    setReqCustomCategory('');
  };

  const urgencyOptions: { level: PriorityLevel; label: string; description: string; badgeStyle: string }[] = [
    { level: 'Low', label: 'Low', description: 'Flexible timeframe', badgeStyle: 'bg-slate-100 border-slate-300 text-slate-700' },
    { level: 'Medium', label: 'Medium', description: 'Standard service', badgeStyle: 'bg-sky-50 border-sky-300 text-sky-700' },
    { level: 'High', label: 'High', description: 'Priority attention needed', badgeStyle: 'bg-amber-50 border-amber-300 text-amber-800' },
    { level: 'Urgent', label: 'Urgent', description: 'Immediate emergency required!', badgeStyle: 'bg-rose-100 border-rose-400 text-rose-800 font-extrabold animate-pulse' }
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs font-bold text-sky-700 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-sky-600" />
            <span>Fast Digital Dispatch</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Request Property Service</h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Specify your property details, service category, and urgency level. Our technical dispatch team will prioritize your request.
          </p>
        </div>

        {reqSubmittedRef && (
          <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2 text-emerald-900 animate-in fade-in duration-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span className="font-bold text-base">Service request submitted successfully!</span>
            </div>
            <p className="text-xs">
              Reference Code: <span className="font-mono font-bold text-emerald-800">{reqSubmittedRef}</span> • Status: <span className="font-bold">Awaiting Review</span>
            </p>
          </div>
        )}

        <form onSubmit={handleFormSubmit} className="space-y-6">
          
          {/* Property Name Input & Existing Quick Options */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Property Name
              </label>
              <span className="text-xs text-slate-500 font-normal">
                Type any property name or pick existing
              </span>
            </div>

            {/* Quick Selector Pills if properties exist */}
            {properties.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 pb-1">
                <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5" />
                  <span>Existing Properties:</span>
                </span>
                {properties.map(p => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleSelectExistingProperty(p.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                      reqPropertyName === p.name 
                        ? 'bg-sky-600 text-white border-sky-600 shadow-2xs' 
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            )}

            {/* Editable Text Input */}
            <div className="relative">
              <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                list="existing-properties-list"
                value={reqPropertyName}
                onChange={e => setReqPropertyName(e.target.value)}
                placeholder="e.g. Thompson Residence, Suite 402, 142 Yorkville Ave..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 text-sm font-medium text-slate-800 focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
              <datalist id="existing-properties-list">
                {properties.map(p => (
                  <option key={p.id} value={p.name} />
                ))}
              </datalist>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Property Address Input */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Property Address
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  value={reqAddress}
                  onChange={e => setReqAddress(e.target.value)}
                  placeholder="142 Yorkville Avenue, Toronto, ON"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 text-sm font-medium text-slate-800 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Service Category Selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Service Category
              </label>
              <select
                value={reqServiceCategory}
                onChange={e => setReqServiceCategory(e.target.value)}
                className="w-full px-3.5 py-3 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 bg-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
              >
                <option value="Plumbing">Plumbing Services</option>
                <option value="Electrical">Electrical Services</option>
                <option value="Painting">Painting & Touch-ups</option>
                <option value="Repairs">General Repairs</option>
                <option value="Maintenance">Ongoing Maintenance</option>
                <option value="Inspection">Property Inspection</option>
                <option value="Others">Others (Specify Custom Category)</option>
              </select>
            </div>
          </div>

          {/* Custom Category Input if "Others" selected */}
          {reqServiceCategory === 'Others' && (
            <div className="p-4 bg-sky-50/70 border border-sky-200 rounded-2xl space-y-2 animate-in fade-in duration-200">
              <label className="block text-xs font-bold text-sky-900">
                Specify Custom Service Category
              </label>
              <input
                type="text"
                required
                value={reqCustomCategory}
                onChange={e => setReqCustomCategory(e.target.value)}
                placeholder="e.g. Pool Maintenance, HVAC Duct Sanitization, Gutter Repair..."
                className="w-full p-3 rounded-xl border border-sky-300 bg-white text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>
          )}

          {/* Urgency Level Selector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Request Urgency Level (Informs Admin Dispatch)
              </label>
              {reqUrgency === 'Urgent' && (
                <span className="text-xs font-extrabold text-rose-600 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Flagged as Emergency</span>
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {urgencyOptions.map(opt => (
                <button
                  key={opt.level}
                  type="button"
                  onClick={() => setReqUrgency(opt.level)}
                  className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                    reqUrgency === opt.level
                      ? 'border-sky-600 ring-2 ring-sky-500 shadow-sm bg-white'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-0.5 rounded-md text-xs font-extrabold border ${opt.badgeStyle}`}>
                      {opt.label}
                    </span>
                    {reqUrgency === opt.level && (
                      <CheckCircle2 className="w-4 h-4 text-sky-600" />
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500 mt-2 block font-medium">
                    {opt.description}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Client Contact Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Client / Contact Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                value={reqClientName}
                onChange={e => setReqClientName(e.target.value)}
                placeholder="Michael Thompson"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 text-sm font-medium text-slate-800 focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Problem Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Problem / Request Description
            </label>
            <textarea
              rows={4}
              required
              value={reqDescription}
              onChange={e => setReqDescription(e.target.value)}
              placeholder="Describe the issue in detail (e.g. Water leak under kitchen cartridge, breaker tripping)..."
              className="w-full px-3.5 py-3 rounded-xl border border-slate-300 text-sm font-medium text-slate-800 focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Preferred Service Date
              </label>
              <input
                type="date"
                value={reqPreferredDate}
                onChange={e => setReqPreferredDate(e.target.value)}
                className="w-full px-3.5 py-3 rounded-xl border border-slate-300 text-sm font-medium text-slate-800 focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Additional Notes & Instructions
              </label>
              <input
                type="text"
                value={reqNotes}
                onChange={e => setReqNotes(e.target.value)}
                placeholder="Gate code, call ahead instructions, etc."
                className="w-full px-3.5 py-3 rounded-xl border border-slate-300 text-sm font-medium text-slate-800 focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Attach Photos or Videos (Optional)
            </label>
            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
              <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-700">Click to upload or drop photos here</p>
              <p className="text-[11px] text-slate-400 mt-1">PNG, JPG, MP4 up to 25MB</p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200">
            <button
              type="submit"
              className="w-full py-3.5 bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white rounded-xl font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Submit Service Request</span>
            </button>
          </div>

        </form>
      </div>

    </div>
  );
}
