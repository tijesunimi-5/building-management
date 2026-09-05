'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '../../../../context/AppContext';
import { Home, ChevronRight } from 'lucide-react';

export default function AdminPropertiesPage() {
  const { properties, projects } = useApp();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
          <Home className="w-6 h-6 text-sky-600" />
          <span>Properties Directory</span>
        </h1>
        <p className="text-sm text-slate-600">All managed residential and commercial properties.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map(prop => (
          <div key={prop.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow">
            <div className="h-44 bg-slate-800 relative">
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
                <p className="text-xs text-slate-600 mt-1">Client: <span className="font-semibold">{prop.clientName}</span></p>
              </div>

              <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-100">
                <span className="text-slate-600 font-medium">Status:</span>
                <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {prop.activeProjectsCount > 0 ? `${prop.activeProjectsCount} Active Job` : 'Up to Date'}
                </span>
              </div>

              <Link
                href={`/admin/projects/${projects.find(p => p.propertyId === prop.id)?.id || 'proj-501'}`}
                className="w-full py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
              >
                <span>View Maintenance Records</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
