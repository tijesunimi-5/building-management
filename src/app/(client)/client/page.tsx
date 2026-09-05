'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '../../../context/AppContext';
import { Home, Wrench, ArrowRight, ChevronRight, CheckCircle2 } from 'lucide-react';

export default function ClientOverviewPage() {
  const { properties, projects } = useApp();

  return (
    <div className="space-y-8">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-400 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
            Client Dashboard
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Welcome back, Michael
          </h1>
          <p className="text-sm text-slate-300">
            Know what is happening at your property without having to call. All updates, photos, and progress are tracked in real-time below.
          </p>
        </div>
      </div>

      {/* Property Cards */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Home className="w-5 h-5 text-sky-600" />
          <span>My Properties</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map(prop => (
            <div key={prop.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow">
              <div className="h-40 bg-slate-800 relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={prop.imageUrl} alt={prop.name} className="w-full h-full object-cover opacity-90" />
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
                  href={`/client/projects/${projects.find(p => p.propertyId === prop.id)?.id || 'proj-501'}`}
                  className="w-full py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                >
                  <span>View Maintenance Record</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Projects Quick Summary */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Wrench className="w-5 h-5 text-sky-600" />
            <span>Active Maintenance Projects</span>
          </h2>
          <Link href="/client/request" className="text-xs font-bold text-sky-600 hover:underline">
            + Request New Service
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500 text-sm">
            No active projects right now.
          </div>
        ) : (
          <div className="space-y-4">
            {projects.map(proj => {
              const completedTasks = proj.tasks.filter(t => t.isCompleted).length;
              const totalTasks = proj.tasks.length;
              const pct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

              return (
                <div
                  key={proj.id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:border-sky-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="space-y-2 max-w-xl">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-sky-600 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
                        {proj.referenceNumber}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">{proj.serviceCategory}</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">{proj.title}</h3>
                    <p className="text-xs text-slate-600">Assigned Technician: <span className="font-semibold text-slate-800">{proj.workerName}</span></p>
                  </div>

                  {/* Progress Bar & CTA */}
                  <div className="w-full md:w-72 space-y-3">
                    <div>
                      <div className="flex justify-between text-xs mb-1 font-medium">
                        <span className="text-slate-600">Completion</span>
                        <span className="font-bold text-slate-900">{pct}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
                        <div className="bg-sky-600 h-full transition-all duration-300" style={{ width: `${pct}%` }} />
                      </div>
                    </div>

                    <Link
                      href={`/client/projects/${proj.id}`}
                      className="w-full py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition-colors shadow-2xs flex items-center justify-center gap-1.5"
                    >
                      <span>Open Project Record</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
