'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '../../../../context/AppContext';
import { Wrench, ArrowRight } from 'lucide-react';

export default function ClientProjectsListPage() {
  const { projects } = useApp();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Active Maintenance Projects</h1>
          <p className="text-sm text-slate-600">Track real-time progress, task checklists, and photographic proof of work.</p>
        </div>

        <Link
          href="/client/request"
          className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-xs shadow-sm transition-colors"
        >
          + New Service Request
        </Link>
      </div>

      <div className="space-y-4">
        {projects.map(proj => {
          const completedCount = proj.tasks.filter(t => t.isCompleted).length;
          const totalCount = proj.tasks.length;
          const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

          return (
            <div
              key={proj.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:border-sky-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-2 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-sky-600 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
                    {proj.referenceNumber}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">{proj.serviceCategory}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">{proj.title}</h3>
                <p className="text-xs text-slate-600">Assigned Technician: <span className="font-semibold text-slate-800">{proj.workerName}</span></p>
              </div>

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
                  <span>Open Full Project Record</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}
