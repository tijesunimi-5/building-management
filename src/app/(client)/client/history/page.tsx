'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '../../../../context/AppContext';
import {
  History,
  CheckCircle2,
  Calendar,
  Wrench,
  ArrowRight,
  Sparkles,
  Camera,
  UserCheck
} from 'lucide-react';

export default function ClientHistoryPage() {
  const { projects, requests } = useApp();

  // Completed projects from live state
  const completedProjects = projects.filter(p => p.status === 'Completed');

  // Completed service requests from live state
  const completedRequests = requests.filter(r => r.status === 'Completed');

  const totalCompletedCount = completedProjects.length + completedRequests.length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Verified Maintenance Records</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Completed Service History
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Archive of all completed maintenance jobs, technician details, and photographic proof.
          </p>
        </div>

        <Link
          href="/client/request"
          className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white rounded-xl font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2 group"
        >
          <span>Request New Service</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Main List / Empty State */}
      {totalCompletedCount === 0 ? (
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200/80 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-sky-50 text-sky-600 border border-sky-100 flex items-center justify-center mx-auto shadow-xs">
            <History className="w-8 h-8" />
          </div>

          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="text-lg font-bold text-slate-900">
              No Completed Services Yet
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              When your property maintenance requests are completed and verified by our technicians, full service details and photo evidence will be archived here.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap justify-center items-center gap-3">
            <Link
              href="/client/request"
              className="px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
            >
              <Wrench className="w-4 h-4" />
              <span>Submit a Maintenance Request</span>
            </Link>

            <Link
              href="/client/projects"
              className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all"
            >
              <span>View Active Projects</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          
          {/* Completed Projects List */}
          {completedProjects.map(proj => (
            <div
              key={proj.id}
              className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sky-600 text-xs px-2.5 py-1 rounded-lg bg-sky-50 border border-sky-200">
                    {proj.referenceNumber}
                  </span>
                  <span className="text-xs font-bold text-slate-800">
                    {proj.serviceCategory}
                  </span>
                </div>

                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold rounded-full w-fit">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Verified Complete
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  {proj.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600">
                  {proj.clientRequestSummary}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>Completed: <strong className="text-slate-800">{proj.expectedCompletionDate || 'Recently'}</strong></span>
                </div>

                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-slate-400" />
                  <span>Technician: <strong className="text-slate-800">{proj.workerName || 'Assigned Specialist'}</strong></span>
                </div>

                {proj.photos && proj.photos.length > 0 && (
                  <div className="flex items-center gap-2 sm:justify-end text-sky-600 font-semibold">
                    <Camera className="w-4 h-4" />
                    <span>{proj.photos.length} Photo Evidence Records</span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Completed Requests List */}
          {completedRequests.map(req => (
            <div
              key={req.id}
              className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sky-600 text-xs px-2.5 py-1 rounded-lg bg-sky-50 border border-sky-200">
                    {req.referenceNumber}
                  </span>
                  <span className="text-xs font-bold text-slate-800">
                    {req.serviceCategory}
                  </span>
                </div>

                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold rounded-full w-fit">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Service Complete
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  {req.propertyName} — {req.serviceCategory}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600">
                  {req.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>Submitted: <strong className="text-slate-800">{new Date(req.createdAt).toLocaleDateString()}</strong></span>
                </div>
              </div>
            </div>
          ))}

        </div>
      )}

    </div>
  );
}
