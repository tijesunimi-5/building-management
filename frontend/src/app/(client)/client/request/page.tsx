'use client';

import React, { useState } from 'react';
import { useApp } from '../../../../context/AppContext';
import { CheckCircle2, Upload } from 'lucide-react';

export default function ClientRequestServicePage() {
  const { properties, submitServiceRequest } = useApp();

  const [reqPropertyId, setReqPropertyId] = useState<string>(properties[0]?.id || '');
  const [reqServiceCategory, setReqServiceCategory] = useState<string>('Plumbing');
  const [reqDescription, setReqDescription] = useState<string>('');
  const [reqAddress, setReqAddress] = useState<string>(properties[0]?.address || '');
  const [reqPreferredDate, setReqPreferredDate] = useState<string>('2026-09-10');
  const [reqNotes, setReqNotes] = useState<string>('');
  const [reqSubmittedRef, setReqSubmittedRef] = useState<string | null>(null);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const prop = properties.find(p => p.id === reqPropertyId) || properties[0];

    const newReq = submitServiceRequest({
      propertyId: prop.id,
      propertyName: prop.name,
      propertyAddress: reqAddress || prop.address,
      clientName: prop.clientName,
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
            Submit service details below. Our technical dispatch will review your request, create a project, and assign a licensed worker.
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
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Select Property
              </label>
              <select
                value={reqPropertyId}
                onChange={e => {
                  setReqPropertyId(e.target.value);
                  const p = properties.find(prop => prop.id === e.target.value);
                  if (p) setReqAddress(p.address);
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium text-slate-800 bg-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
              >
                {properties.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.city})</option>
                ))}
              </select>
            </div>

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
                Property Address
              </label>
              <input
                type="text"
                required
                value={reqAddress}
                onChange={e => setReqAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium text-slate-800 focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Preferred Date
              </label>
              <input
                type="date"
                value={reqPreferredDate}
                onChange={e => setReqPreferredDate(e.target.value)}
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
