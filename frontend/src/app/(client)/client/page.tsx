'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '../../../context/AppContext';
import { Home, Wrench, ArrowRight, ChevronRight, CheckCircle2, Clock, Inbox, Sparkles, AlertTriangle } from 'lucide-react';

export default function ClientOverviewPage() {
  const { currentUser, userProperties, userProjects, userRequests } = useApp();

  const clientFirstName = currentUser?.name
    ? currentUser.name.split(' ')[0]
    : 'Client';

  const pendingRequests = userRequests.filter(r => r.status !== 'Completed' && !r.isDisabled);

  return (
    <div className="space-y-8 pb-12">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
            Client Dashboard
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Welcome back, {clientFirstName}
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Track all property maintenance activities, view submitted requests, and monitor project status in real-time.
          </p>
        </div>
      </div>

      {/* Clean Guest / Empty State Banner if 0 requests & 0 properties */}
      {(!currentUser || (userProperties.length === 0 && userRequests.length === 0)) && (
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center mx-auto shadow-xs">
            <Sparkles className="w-8 h-8" />
          </div>

          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="text-lg font-bold text-slate-900">
              No Active Maintenance Requests
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              When you submit a service request, your property, request status, and technician proof-of-work photos will appear here automatically.
            </p>
          </div>

          <div className="pt-2 flex justify-center">
            <Link
              href="/client/request"
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
            >
              <Wrench className="w-4 h-4" />
              <span>+ Request a Property Service</span>
            </Link>
          </div>
        </div>
      )}

      {/* Submitted Service Requests Tracker */}
      {pendingRequests.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-500" />
              <span>Submitted Service Requests</span>
            </h2>
            <Link href="/client/history" className="text-xs font-bold text-emerald-600 hover:underline">
              View History →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingRequests.map(req => (
              <div
                key={req.id}
                className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-emerald-700 bg-white px-2.5 py-0.5 rounded-md border border-slate-200">
                      {req.referenceNumber}
                    </span>
                    <span className="text-xs font-bold text-slate-800">{req.serviceCategory}</span>
                  </div>

                  <span className="px-2.5 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 text-[11px] font-extrabold rounded-full flex items-center gap-1 animate-pulse">
                    <Clock className="w-3 h-3 text-amber-600" />
                    <span>{req.status}</span>
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-slate-900">{req.propertyName}</h3>
                  <p className="text-xs text-slate-600 line-clamp-2">{req.description}</p>
                </div>

                <div className="pt-2 border-t border-amber-200/50 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                  <span>Urgency: <strong className="text-slate-800">{req.urgency || 'Medium'}</strong></span>
                  <span>Submitted {new Date(req.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Property Cards */}
      {userProperties.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Home className="w-5 h-5 text-emerald-600" />
              <span>My Properties ({userProperties.length})</span>
            </h2>
            <Link href="/client/properties" className="text-xs font-bold text-emerald-600 hover:underline">
              Manage Properties & Notes →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userProperties.map(prop => {
              const displayImg = prop.imageUrl || '/assets/hero_property_main_1786614552025.jpg';
              return (
                <div key={prop.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow">
                  <div className="h-40 bg-slate-800 relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={displayImg}
                      alt={prop.name}
                      className="w-full h-full object-cover opacity-90"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                    <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
                      {prop.propertyType}
                    </div>
                  </div>
                  <div className="p-5 space-y-3">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">{prop.name}</h3>
                      <p className="text-xs text-slate-500">{prop.address}, {prop.city}, {prop.province}</p>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-100">
                      <span className="text-slate-600 font-medium">Active Maintenance:</span>
                      <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {prop.activeProjectsCount > 0 ? `${prop.activeProjectsCount} Active` : 'Up to Date'}
                      </span>
                    </div>

                    <Link
                      href={`/client/projects/${userProjects.find(p => p.propertyId === prop.id)?.id || 'proj-501'}`}
                      className="w-full py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                    >
                      <span>View Maintenance Record</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Active Projects Quick Summary */}
      {userProjects.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Wrench className="w-5 h-5 text-emerald-600" />
              <span>Active Maintenance Projects ({userProjects.length})</span>
            </h2>
            <Link href="/client/request" className="text-xs font-bold text-emerald-600 hover:underline">
              + Request New Service
            </Link>
          </div>

          <div className="space-y-4">
            {userProjects.map(proj => {
              const completedTasks = proj.tasks.filter(t => t.isCompleted).length;
              const totalTasks = proj.tasks.length;
              const pct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

              return (
                <div
                  key={proj.id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:border-emerald-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="space-y-2 max-w-xl">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        {proj.referenceNumber}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">{proj.serviceCategory}</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">{proj.title}</h3>
                    <p className="text-xs text-slate-600">Assigned Technician: <span className="font-semibold text-slate-800">{proj.workerName || 'Assigned Specialist'}</span></p>
                  </div>

                  {/* Progress Bar & CTA */}
                  <div className="w-full md:w-72 space-y-3">
                    <div>
                      <div className="flex justify-between text-xs mb-1 font-medium">
                        <span className="text-slate-600">Completion</span>
                        <span className="font-bold text-slate-900">{pct}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
                        <div className="bg-emerald-600 h-full transition-all duration-300" style={{ width: `${pct}%` }} />
                      </div>
                    </div>

                    <Link
                      href={`/client/projects/${proj.id}`}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-2xs flex items-center justify-center gap-1.5"
                    >
                      <span>Open Project Record</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
