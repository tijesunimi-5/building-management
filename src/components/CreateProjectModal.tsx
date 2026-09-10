'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ServiceRequest } from '../types';
import { X, Plus, Trash2, CheckCircle2, UserCheck, AlertCircle } from 'lucide-react';

interface CreateProjectModalProps {
  request: ServiceRequest | null;
  onClose: () => void;
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ request, onClose }) => {
  const { workers, convertRequestToProject } = useApp();
  
  const [selectedWorkerId, setSelectedWorkerId] = useState<string>(workers[0]?.id || '');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High' | 'Urgent'>(
    request?.urgency || 'Medium'
  );
  const [adminObservations, setAdminObservations] = useState<string>(
    request ? `${request.serviceCategory} cartridge/hardware requires inspection and possible replacement.` : ''
  );
  const [tasks, setTasks] = useState<string[]>([
    `Inspect ${request?.serviceCategory || 'property'} connections`,
    `Replace damaged components & seals`,
    `Verify operational pressure and run leak test`
  ]);
  const [newTaskInput, setNewTaskInput] = useState<string>('');

  if (!request) return null;

  const handleAddTask = () => {
    if (newTaskInput.trim()) {
      setTasks(prev => [...prev, newTaskInput.trim()]);
      setNewTaskInput('');
    }
  };

  const handleRemoveTask = (index: number) => {
    setTasks(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWorkerId) return;

    await convertRequestToProject(
      request.id,
      selectedWorkerId,
      priority,
      adminObservations,
      tasks
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 my-8">
        
        {/* Header */}
        <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-sky-600 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200 uppercase tracking-wider">
              Service Request Triage ({request.referenceNumber})
            </span>
            <h3 className="text-xl font-bold text-slate-900 mt-1">
              Convert Request into Active Project
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Intake Overview Card */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Client:</span>
              <span className="font-bold text-slate-900">{request.clientName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Property:</span>
              <span className="font-bold text-slate-900">{request.propertyName} ({request.propertyAddress})</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Requested Service:</span>
              <span className="font-bold text-sky-600">{request.serviceCategory}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Client Urgency Flag:</span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold border ${
                request.urgency === 'Urgent' ? 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse' :
                request.urgency === 'High' ? 'bg-amber-100 text-amber-800 border-amber-300' :
                request.urgency === 'Low' ? 'bg-slate-100 text-slate-600 border-slate-200' :
                'bg-sky-50 text-sky-700 border-sky-200'
              }`}>
                {request.urgency || 'Medium'}
              </span>
            </div>
            <div>
              <span className="text-slate-500 font-medium block mb-1">Client Description:</span>
              <p className="text-slate-800 bg-white p-3 rounded-lg border border-slate-200 text-xs italic">
                &ldquo;{request.description}&rdquo;
              </p>
            </div>
          </div>

          {/* Admin Observations */}
          <div>
            <label className="block text-sm font-bold text-slate-900 mb-1.5">
              Admin Technical Observations & Scope
            </label>
            <textarea
              rows={3}
              value={adminObservations}
              onChange={e => setAdminObservations(e.target.value)}
              placeholder="Enter initial findings, cartridge models, or notes for technician..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm text-slate-800"
            />
          </div>

          {/* Worker Assignment & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-1.5 flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-sky-600" />
                Assign Worker / Technician
              </label>
              <select
                value={selectedWorkerId}
                onChange={e => setSelectedWorkerId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm text-slate-800 bg-white"
                required
              >
                {workers.map(w => (
                  <option key={w.id} value={w.id}>
                    {w.name} — {w.roleTitle} ({w.status})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-900 mb-1.5 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-500" />
                Project Priority Level
              </label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm text-slate-800 bg-white"
              >
                <option value="Low">Low Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="High">High Priority</option>
                <option value="Urgent">Urgent Priority</option>
              </select>
            </div>
          </div>

          {/* Task Checklist Generator */}
          <div>
            <label className="block text-sm font-bold text-slate-900 mb-1.5 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Define Technician Checklist
            </label>

            <div className="space-y-2 mb-3">
              {tasks.map((task, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-800">
                  <span>• {task}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTask(idx)}
                    className="text-rose-500 hover:text-rose-700 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Task Input */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newTaskInput}
                onChange={e => setNewTaskInput(e.target.value)}
                placeholder="Add checklist item (e.g., Replace faucet washer)"
                className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-xs text-slate-800"
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddTask(); } }}
              />
              <button
                type="button"
                onClick={handleAddTask}
                className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Add
              </button>
            </div>
          </div>

          {/* Footer Submit Buttons */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-sm font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold shadow-sm transition-colors"
            >
              Create & Assign Project
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
