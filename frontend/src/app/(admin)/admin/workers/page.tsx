'use client';

import React, { useState } from 'react';
import { useApp } from '../../../../context/AppContext';
import { HardHat, UserPlus, Trash2, Phone, Mail, X } from 'lucide-react';

export default function AdminWorkersPage() {
  const { workers, addWorker, removeWorker } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [roleTitle, setRoleTitle] = useState('Field Maintenance Specialist');
  const [phone, setPhone] = useState('+1 (416) 555-0100');
  const [email, setEmail] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('/assets/worker_avatar_1786614986847.jpg');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addWorker({
      name,
      roleTitle,
      phone,
      email: email || `${name.toLowerCase().replace(/\s+/g, '.')}@apexcare-demo.ca`,
      avatarUrl
    });

    setName('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <HardHat className="w-6 h-6 text-sky-600" />
            <span>Field Technicians & Worker Management</span>
          </h1>
          <p className="text-sm text-slate-600">
            Dispatch, manage, add, or remove licensed maintenance technicians.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold text-xs shadow-sm transition-colors flex items-center gap-1.5"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ Add New Technician</span>
        </button>
      </div>

      {/* Roster Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workers.map(w => (
          <div key={w.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={w.avatarUrl} alt={w.name} className="w-12 h-12 rounded-full object-cover border-2 border-slate-200" />
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{w.name}</h3>
                    <p className="text-xs text-slate-500">{w.roleTitle}</p>
                  </div>
                </div>

                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  w.status === 'On Job' ? 'bg-blue-100 text-blue-800 border border-blue-200' : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                }`}>
                  {w.status}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{w.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{w.email}</span>
                </div>
              </div>
            </div>

            {/* Remove Action */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
              <button
                onClick={() => {
                  if (confirm(`Are you sure you want to remove technician ${w.name}?`)) {
                    removeWorker(w.id);
                  }
                }}
                className="text-xs text-rose-600 hover:text-rose-800 font-semibold flex items-center gap-1 p-1.5 hover:bg-rose-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove Technician</span>
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* Add Worker Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 text-slate-900 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-sky-600" />
                <span>Add New Technician</span>
              </h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Technician Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Robert Miller"
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-medium focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Role & Specialty</label>
                <input
                  type="text"
                  required
                  value={roleTitle}
                  onChange={e => setRoleTitle(e.target.value)}
                  placeholder="e.g. Senior Carpentry Technician"
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-medium focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-medium focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Auto-generated if empty"
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-medium focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold shadow-xs"
                >
                  Add Technician
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
