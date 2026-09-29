'use client';

import React, { useState } from 'react';
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
  UserCheck,
  Clock,
  AlertTriangle,
  FileText
} from 'lucide-react';

export default function ClientHistoryPage() {
  const { userProjects, userRequests, cancelPendingRequest, disableProject, restoreProject } = useApp();
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'completed' | 'archived'>('all');

  // Pending & In-Review requests (excluding archived)
  const pendingRequests = userRequests.filter(r => !r.isDisabled && r.status !== 'Completed');
  
  // Completed requests and projects (excluding archived)
  const completedProjects = userProjects.filter(p => !p.isDisabled && p.status === 'Completed');
  const completedRequests = userRequests.filter(r => !r.isDisabled && r.status === 'Completed');

  // Archived Vault items
  const archivedProjects = userProjects.filter(p => p.isDisabled);

  const activeRequests = userRequests.filter(r => !r.isDisabled);
  const activeProjects = userProjects.filter(p => !p.isDisabled && p.status === 'Completed');

  const filteredRequests = activeTab === 'pending'
    ? pendingRequests
    : (activeTab === 'completed' ? completedRequests : (activeTab === 'archived' ? [] : activeRequests));

  const filteredProjects = activeTab === 'pending'
    ? []
    : (activeTab === 'completed' ? completedProjects : (activeTab === 'archived' ? archivedProjects : activeProjects));

  const totalCount = activeRequests.length + activeProjects.length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Service Request Log</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Service Requests & History
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            View all submitted maintenance requests, dispatch status, and verified completion records.
          </p>
        </div>

        <Link
          href="/client/request"
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2 group"
        >
          <span>Request New Service</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'all'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          All Records ({totalCount})
        </button>

        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
            activeTab === 'pending'
              ? 'bg-amber-500 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Pending / In Review ({pendingRequests.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('completed')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
            activeTab === 'completed'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Completed ({completedProjects.length + completedRequests.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('archived')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
            activeTab === 'archived'
              ? 'bg-slate-800 text-amber-400 shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Archived Vault ({archivedProjects.length})</span>
        </button>
      </div>

      {activeTab === 'archived' && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-3 text-amber-950 text-xs">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
          <p>
            <strong>Legal Record Compliance Notice:</strong> Per property management audit requirements, active or historical service projects cannot be permanently deleted. Deactivated projects are archived here for audit retention and can be restored at any time.
          </p>
        </div>
      )}

      {/* Main List / Empty State */}
      {filteredRequests.length === 0 && filteredProjects.length === 0 ? (
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200/80 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center mx-auto shadow-xs">
            <History className="w-8 h-8" />
          </div>

          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="text-lg font-bold text-slate-900">
              {activeTab === 'archived' ? 'Archived Vault Empty' : 'No Service Records Found'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              {activeTab === 'archived'
                ? 'No service projects or records are currently archived.'
                : 'When you submit property maintenance requests, full request details and photo evidence will appear here.'}
            </p>
          </div>

          {activeTab !== 'archived' && (
            <div className="pt-2 flex flex-wrap justify-center items-center gap-3">
              <Link
                href="/client/request"
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
              >
                <Wrench className="w-4 h-4" />
                <span>Submit a Maintenance Request</span>
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          
          {/* Service Requests List */}
          {filteredRequests.map(req => {
            const isPendingReq = req.status === 'Awaiting Review' || req.status === 'Under Review';
            return (
              <div
                key={req.id}
                className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono font-bold text-emerald-600 text-xs px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200">
                      {req.referenceNumber}
                    </span>
                    <span className="text-xs font-bold text-slate-800">
                      {req.serviceCategory}
                    </span>
                    {req.urgency && (
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded border ${
                        req.urgency === 'Urgent' ? 'bg-rose-100 text-rose-800 border-rose-300' :
                        req.urgency === 'High' ? 'bg-amber-100 text-amber-800 border-amber-300' :
                        'bg-slate-100 text-slate-700 border-slate-200'
                      }`}>
                        {req.urgency} Urgency
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full w-fit ${
                      req.status === 'Completed' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                      req.status === 'Approved' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                      'bg-amber-50 text-amber-900 border border-amber-200 animate-pulse'
                    }`}>
                      {req.status === 'Completed' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Clock className="w-3.5 h-3.5 text-amber-600" />}
                      <span>{req.status}</span>
                    </span>

                    {/* Pending Request Cancellation (No work started: permanent delete) */}
                    {isPendingReq && (
                      <button
                        type="button"
                        onClick={() => cancelPendingRequest(req.id)}
                        className="px-3 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold rounded-full transition-colors flex items-center gap-1 cursor-pointer"
                        title="Cancel pending request (no work started)"
                      >
                        <span>Cancel Request</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    {req.propertyName} — {req.serviceCategory}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {req.description}
                  </p>
                  {req.additionalNotes && (
                    <p className="text-xs text-slate-500 italic bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      Note: &ldquo;{req.additionalNotes}&rdquo;
                    </p>
                  )}
                </div>

                {/* Photos attached to request */}
                {req.photoUrls && req.photoUrls.length > 0 && (
                  <div className="pt-2">
                    <span className="text-xs font-bold text-slate-700 block mb-2 flex items-center gap-1">
                      <Camera className="w-3.5 h-3.5 text-emerald-600" />
                      Attached Photo Evidence ({req.photoUrls.length})
                    </span>
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {req.photoUrls.map((url, i) => (
                        <div key={i} className="w-16 h-16 rounded-xl overflow-hidden border border-slate-200 shrink-0 bg-slate-100">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={url} alt={`Request photo ${i+1}`} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span>Submitted: <strong className="text-slate-800">{new Date(req.createdAt).toLocaleDateString()}</strong></span>
                  </div>
                  <span className="text-[11px] text-slate-500">Address: {req.propertyAddress}</span>
                </div>
              </div>
            );
          })}

          {/* Projects List (Active & Archived) */}
          {filteredProjects.map(proj => (
            <div
              key={proj.id}
              className={`p-6 rounded-3xl border transition-all space-y-4 ${
                proj.isDisabled
                  ? 'bg-slate-50 border-slate-300 opacity-90'
                  : 'bg-white border-slate-200/80 shadow-xs hover:shadow-md'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono font-bold text-emerald-600 text-xs px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200">
                    {proj.referenceNumber}
                  </span>
                  <span className="text-xs font-bold text-slate-800">
                    {proj.serviceCategory}
                  </span>
                  {proj.isDisabled && (
                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                      Archived / Disabled ({proj.disabledAt || 'Audit Vault'})
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold rounded-full w-fit">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    {proj.status}
                  </span>

                  {/* Disable / Archive vs Restore Buttons */}
                  {proj.isDisabled ? (
                    <button
                      type="button"
                      onClick={() => restoreProject(proj.id)}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-full transition-colors flex items-center gap-1 shadow-xs cursor-pointer"
                    >
                      <span>Re-activate Project</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => disableProject(proj.id)}
                      className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-xs font-bold rounded-full transition-colors flex items-center gap-1 cursor-pointer"
                      title="Archive Project (Legal retention rules apply)"
                    >
                      <span>Archive Record</span>
                    </button>
                  )}
                </div>
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
                  <span>Scheduled/Done: <strong className="text-slate-800">{proj.expectedCompletionDate || 'Recently'}</strong></span>
                </div>

                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-slate-400" />
                  <span>Technician: <strong className="text-slate-800">{proj.workerName || 'Assigned Specialist'}</strong></span>
                </div>

                {proj.photos && proj.photos.length > 0 && (
                  <div className="flex items-center gap-2 sm:justify-end text-emerald-600 font-semibold">
                    <Camera className="w-4 h-4" />
                    <span>{proj.photos.length} Photo Evidence Records</span>
                  </div>
                )}
              </div>
            </div>
          ))}

        </div>
      )}

    </div>
  );
}

