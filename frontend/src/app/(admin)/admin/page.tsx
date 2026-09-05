'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '../../../context/AppContext';
import { CreateProjectModal } from '../../../components/CreateProjectModal';
import { ServiceRequest } from '../../../types';
import {
  Briefcase,
  Inbox,
  CheckCircle2,
  HardHat,
  Plus,
  Search,
  ArrowUpRight
} from 'lucide-react';

export default function AdminOverviewPage() {
  const {
    requests,
    projects,
    workers,
    setSelectedProjectId
  } = useApp();

  const [selectedTriageReq, setSelectedTriageReq] = useState<ServiceRequest | null>(null);

  const pendingRequestsCount = requests.filter(r => r.status === 'Awaiting Review' || r.status === 'Under Review').length;
  const activeProjectsCount = projects.filter(p => p.status !== 'Completed').length;
  const completedProjectsCount = projects.filter(p => p.status === 'Completed').length;
  const availableWorkersCount = workers.filter(w => w.status === 'Available').length;

  return (
    <div className="space-y-8">
      
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Operations & Triage Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Manage client service requests, convert intakes into projects, and monitor technician field progress.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/requests"
            className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Triage Incoming Requests</span>
          </Link>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Active Projects</span>
            <span className="text-3xl font-extrabold text-slate-900 block mt-1">{activeProjectsCount}</span>
            <span className="text-[11px] text-emerald-600 font-semibold mt-1 inline-block">In Field Progress</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
            <Briefcase className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Pending Requests</span>
            <span className="text-3xl font-extrabold text-amber-600 block mt-1">{pendingRequestsCount}</span>
            <span className="text-[11px] text-amber-600 font-semibold mt-1 inline-block">Awaiting Review</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Inbox className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Completed Jobs</span>
            <span className="text-3xl font-extrabold text-emerald-600 block mt-1">{completedProjectsCount}</span>
            <span className="text-[11px] text-emerald-600 font-semibold mt-1 inline-block">Full Photo Records</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Available Workers</span>
            <span className="text-3xl font-extrabold text-slate-900 block mt-1">{availableWorkersCount}</span>
            <span className="text-[11px] text-slate-500 font-semibold mt-1 inline-block">Ready for Dispatch</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <HardHat className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Service Requests Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        
        <div className="p-6 border-b border-slate-200 flex items-center justify-between flex-wrap gap-4 bg-slate-50">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Incoming Service Requests</h3>
            <p className="text-xs text-slate-500">Review homeowner submissions, add technical observations, and assign technicians.</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search request or client..."
                className="pl-9 pr-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none w-48 sm:w-64"
              />
            </div>
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

      {/* Technician Roster Preview */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <h3 className="text-lg font-bold text-slate-900">Technician & Worker Roster</h3>
          <Link href="/admin/workers" className="text-xs font-bold text-sky-600 hover:underline">
            Manage Workers ({workers.length}) →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {workers.map(w => (
            <div key={w.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={w.avatarUrl} alt={w.name} className="w-10 h-10 rounded-full object-cover border border-slate-300" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{w.name}</h4>
                  <p className="text-xs text-slate-500">{w.roleTitle}</p>
                </div>
              </div>

              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                w.status === 'On Job' ? 'bg-blue-100 text-blue-800 border border-blue-200' : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
              }`}>
                {w.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Triage Modal */}
      <CreateProjectModal
        request={selectedTriageReq}
        onClose={() => setSelectedTriageReq(null)}
      />

    </div>
  );
}
