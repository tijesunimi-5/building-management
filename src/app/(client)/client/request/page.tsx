'use client';

import React, { useState } from 'react';
import { useApp } from '../../../../context/AppContext';
import { CheckCircle2, Upload, Building, MapPin, User, Tag } from 'lucide-react';

export default function ClientRequestServicePage() {
  const { properties, submitServiceRequest } = useApp();

  const [reqPropertyName, setReqPropertyName] = useState<string>(properties[0]?.name || '');
  const [reqAddress, setReqAddress] = useState<string>(properties[0]?.address || '');
  const [reqClientName, setReqClientName] = useState<string>(properties[0]?.clientName || '');
  const [reqPropertyId, setReqPropertyId] = useState<string>(properties[0]?.id || 'prop-1');
  
  const [reqServiceCategory, setReqServiceCategory] = useState<string>('Plumbing');
  const [reqDescription, setReqDescription] = useState<string>('');
  const [reqPreferredDate, setReqPreferredDate] = useState<string>('2026-09-10');
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

    const newReq = await submitServiceRequest({
      propertyId: reqPropertyId,
      propertyName: reqPropertyName || 'Client Property',
      propertyAddress: reqAddress || 'Toronto, ON',
      clientName: reqClientName || 'Homeowner Client',
      serviceCategory: reqServiceCategory,
      description: reqDescription,
      preferredDate: reqPreferredDate,
      additionalNotes: reqNotes,
      photoUrls: ['/assets/plumbing_before_tap_1786614903733.jpg']
    });

    setReqSubmittedRef(newReq.referenceNumber);
    setReqDescription('');
    setReqNotes('');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Request Property Service</h1>
          <p className="text-sm text-slate-600 mt-1">
            Type your property details or select an existing property below. Our technical dispatch will review your request and assign a technician.
          </p>
        </div>

        {reqSubmittedRef && (
          <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2 text-emerald-900">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span className="font-bold text-base">Service request submitted successfully!</span>
            </div>
            <p className="text-xs">
              Reference Code: <span className="font-mono font-bold text-emerald-800">{reqSubmittedRef}</span> • Status: <span className="font-bold">Awaiting Review</span>
            </p>
          </div>
        )}

        <form onSubmit={handleFormSubmit} className="space-y-5">
          
          {/* Property Name Input & Existing Quick Options */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Property Name
              </label>
              <span className="text-xs text-slate-500 font-normal">
                Type any property name or pick from existing
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
                    className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all ${
                      reqPropertyName === p.name 
                        ? 'bg-sky-600 text-white border-sky-600 shadow-2xs' 
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                    }`}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            )}

            {/* Editable Text Input with Datalist Autocomplete */}
            <div className="relative">
              <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                list="existing-properties-list"
                value={reqPropertyName}
                onChange={e => setReqPropertyName(e.target.value)}
                placeholder="e.g. Thompson Residence, Suite 402, 142 Yorkville Ave..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium text-slate-800 focus:ring-2 focus:ring-sky-500 focus:outline-none"
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
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium text-slate-800 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Service Category */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Service Category
              </label>
              <select
                value={reqServiceCategory}
                onChange={e => setReqServiceCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium text-slate-800 bg-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
              >
                <option value="Plumbing">Plumbing Services</option>
                <option value="Electrical">Electrical Services</option>
                <option value="Painting">Painting & Touch-ups</option>
                <option value="Repairs">General Repairs</option>
                <option value="Maintenance">Ongoing Maintenance</option>
                <option value="Inspection">Property Inspection</option>
              </select>
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
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium text-slate-800 focus:ring-2 focus:ring-sky-500 focus:outline-none"
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
              placeholder="Describe the issue (e.g. Kitchen tap leaking under sink cartridge)..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium text-slate-800 focus:ring-2 focus:ring-sky-500 focus:outline-none"
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
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium text-slate-800 focus:ring-2 focus:ring-sky-500 focus:outline-none"
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
                placeholder="Gate code, phone ahead instructions, etc."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium text-slate-800 focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Attach Photos or Videos (Optional)
            </label>
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
              <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-700">Click to upload or drop photos here</p>
              <p className="text-[11px] text-slate-400 mt-1">PNG, JPG, MP4 up to 25MB</p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200">
            <button
              type="submit"
              className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold text-sm shadow-sm transition-colors"
            >
              Submit Service Request
            </button>
          </div>

        </form>
      </div>

    </div>
  );
}
