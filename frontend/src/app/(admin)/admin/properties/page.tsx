'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '../../../../context/AppContext';
import { Home, ChevronRight, Archive, ShieldCheck, RotateCcw } from 'lucide-react';

export default function AdminPropertiesPage() {
  const { properties, projects, disableProperty, restoreProperty } = useApp();
  const [propertyViewTab, setPropertyViewTab] = React.useState<'active' | 'archived'>('active');

  const activeProperties = properties.filter(p => !p.isDisabled);
  const archivedProperties = properties.filter(p => p.isDisabled);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <Home className="w-6 h-6 text-emerald-600" />
            <span>Properties Directory</span>
          </h1>
          <p className="text-sm text-slate-600">All managed residential and commercial properties.</p>
        </div>

        {/* View Tabs */}
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <button
            type="button"
            onClick={() => setPropertyViewTab('active')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              propertyViewTab === 'active'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Active Portfolio ({activeProperties.length})
          </button>

          <button
            type="button"
            onClick={() => setPropertyViewTab('archived')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              propertyViewTab === 'archived'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Archive className="w-3.5 h-3.5 text-amber-400" />
            <span>Archived Vault ({archivedProperties.length})</span>
          </button>
        </div>
      </div>

      {propertyViewTab === 'active' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeProperties.length === 0 ? (
            <div className="col-span-full bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-2">
              <Home className="w-10 h-10 text-slate-400 mx-auto" />
              <p className="text-sm font-bold text-slate-700">No active properties found.</p>
            </div>
          ) : (
            activeProperties.map(prop => (
              <div key={prop.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
                <div>
                  <div className="h-44 bg-slate-800 relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={prop.imageUrl || '/assets/hero_property_main_1786614552025.jpg'} alt={prop.name} className="w-full h-full object-cover opacity-90" />
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
                  </div>
                </div>

                <div className="p-5 pt-0 space-y-2">
                  <Link
                    href={`/admin/projects/${projects.find(p => p.propertyId === prop.id)?.id || 'proj-501'}`}
                    className="w-full py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                  >
                    <span>View Maintenance Records</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>

                  <button
                    type="button"
                    onClick={() => disableProperty(prop.id)}
                    className="w-full py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    title="Archive Property (Legal Retention)"
                  >
                    <Archive className="w-3.5 h-3.5 text-rose-600" />
                    <span>Archive Property</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        /* Archived Properties Vault View */
        <div className="space-y-4">
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-3 text-amber-950 text-xs">
            <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0" />
            <p>
              <strong>Legal Record Compliance Notice:</strong> Per property management audit requirements, properties cannot be permanently destroyed once records exist. Deactivated properties are safely archived here and hidden from active maintenance dispatch.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {archivedProperties.length === 0 ? (
              <div className="col-span-full bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-2">
                <Archive className="w-10 h-10 text-slate-400 mx-auto" />
                <p className="text-sm font-bold text-slate-700">Archived Vault is empty.</p>
              </div>
            ) : (
              archivedProperties.map(prop => (
                <div key={prop.id} className="bg-slate-50 rounded-3xl border border-slate-300 p-6 space-y-4 shadow-xs relative">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-extrabold border border-amber-300 uppercase tracking-wider">
                      Archived / Disabled
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">Deactivated {prop.disabledAt || 'Recently'}</span>
                  </div>

                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">{prop.name}</h3>
                    <p className="text-xs text-slate-500">{prop.address}, {prop.city}</p>
                    <p className="text-xs text-slate-600 mt-1">Client: <span className="font-semibold">{prop.clientName}</span></p>
                  </div>

                  <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => restoreProperty(prop.id)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Re-activate Property</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
