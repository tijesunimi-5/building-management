'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '../../../../context/AppContext';
import { CreateProjectModal } from '../../../../components/CreateProjectModal';
import { ServiceRequest } from '../../../../types';
import { Inbox, Search, ArrowUpRight } from 'lucide-react';

export default function AdminRequestsPage() {
  const { requests, projects, setSelectedProjectId } = useApp();
  const [selectedTriageReq, setSelectedTriageReq] = useState<ServiceRequest | null>(null);

  return (
    <div className="space-y-6">
      
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
          <Inbox className="w-6 h-6 text-sky-600" />
          <span>Service Requests Triage</span>
        </h1>
        <p className="text-sm text-slate-600">Review homeowner submissions, inspect photos, add technical observations, and assign field technicians.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between flex-wrap gap-4 bg-slate-50">
          <h3 className="text-base font-bold text-slate-900">All Submitted Service Intakes</h3>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search reference or client..."
              className="pl-9 pr-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none w-64"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-100 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">Ref Code</th>
                <th className="px-6 py-3.5">Client & Property</th>
                <th className="px-6 py-3.5">Service Category</th>
                <th className="px-6 py-3.5">Submitted Date</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {requests.map(req => (
                <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-sky-600">
                    {req.referenceNumber}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-slate-900 block">{req.clientName}</span>
                    <span className="text-slate-500 text-[11px]">{req.propertyName}</span>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-800">
                    {req.serviceCategory}
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {new Date(req.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                      req.status === 'Approved' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                      req.status === 'Awaiting Review' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {req.status === 'Approved' ? (
                      <Link
                        href={`/admin/projects/${projects.find(proj => proj.propertyId === req.propertyId)?.id || 'proj-501'}`}
                        onClick={() => {
                          const p = projects.find(proj => proj.propertyId === req.propertyId);
                          if (p) setSelectedProjectId(p.id);
                        }}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold inline-flex items-center gap-1 transition-colors"
                      >
                        <span>View Project</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    ) : (
                      <button
                        onClick={() => setSelectedTriageReq(req)}
                        className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold shadow-2xs transition-colors"
                      >
                        Convert to Project
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <CreateProjectModal
        request={selectedTriageReq}
        onClose={() => setSelectedTriageReq(null)}
      />

    </div>
  );
}
