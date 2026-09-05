'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '../../../context/AppContext';
import { MapPin, ArrowRight } from 'lucide-react';

export default function WorkerSchedulePage() {
  const { projects, setSelectedProjectId } = useApp();

  return (
    <div className="p-4 space-y-4 flex-1 overflow-y-auto">
      <h2 className="text-base font-extrabold text-white">Today&apos;s Field Schedule</h2>

      <div className="space-y-3">
        {projects.map(proj => (
          <Link
            key={proj.id}
            href={`/worker/jobs/${proj.id}`}
            onClick={() => setSelectedProjectId(proj.id)}
            className="block bg-slate-900 p-4 rounded-2xl border border-slate-800 hover:border-sky-500 transition-all space-y-3 shadow-sm"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono font-bold text-sky-400">{proj.referenceNumber}</span>
              <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-bold">
                {proj.status}
              </span>
            </div>

            <div>
              <h3 className="text-sm font-bold text-white">{proj.propertyName}</h3>
              <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                {proj.propertyAddress}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
              <span className="text-slate-400 font-medium">{proj.serviceCategory}</span>
              <span className="px-3 py-1 bg-sky-600 text-white rounded-lg font-bold text-[11px] flex items-center gap-1">
                Open Job <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
