'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { useApp } from '../../../../../context/AppContext';
import { PropertyMap } from '../../../../../components/PropertyMap';
import { TaskChecklist } from '../../../../../components/TaskChecklist';
import { PhotoGallery } from '../../../../../components/PhotoGallery';
import { ProjectTimeline } from '../../../../../components/ProjectTimeline';
import { PhotoCategory } from '../../../../../types';
import {
  MapPin,
  Play,
  Camera,
  CheckCircle2,
  Plus,
  Phone,
  Navigation,
  ArrowLeft
} from 'lucide-react';

export default function WorkerJobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const {
    projects,
    workers,
    updateProjectStatus,
    toggleTaskCompletion,
    uploadPhotoEvidence,
    addTimelineEvent
  } = useApp();

  const worker = workers[0];
  const activeJob = projects.find(p => p.id === resolvedParams.id) || projects[0];

  const [activeJobTab, setActiveJobTab] = useState<'tasks' | 'photos' | 'timeline' | 'map'>('tasks');
  
  // Quick Upload Form state
  const [photoCategory, setPhotoCategory] = useState<PhotoCategory>('Before');
  const [photoDescription, setPhotoDescription] = useState<string>('');
  const [photoUrl, setPhotoUrl] = useState<string>('/assets/plumbing_after_tap_1786614934927.jpg');
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);

  // Observation State
  const [showObservationModal, setShowObservationModal] = useState<boolean>(false);
  const [observationText, setObservationText] = useState<string>('');

  if (!activeJob) {
    return (
      <div className="p-6 text-center text-slate-400">
        <p className="text-sm">Job record not found.</p>
        <Link href="/worker" className="text-xs font-bold text-sky-400 mt-2 block">← Back to Schedule</Link>
      </div>
    );
  }

  const handleQuickUpload = (e: React.FormEvent) => {
    e.preventDefault();
    uploadPhotoEvidence(
      activeJob.id,
      photoCategory,
      photoDescription || `${photoCategory} evidence uploaded by ${worker?.name || 'Technician'}`,
      photoUrl
    );
    setPhotoDescription('');
    setShowUploadModal(false);
  };

  const handleAddObservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!observationText.trim()) return;
    addTimelineEvent(
      activeJob.id,
      'Field Observation Added',
      `${observationText} — (Logged by ${worker?.name || 'Technician'})`
    );
    setObservationText('');
    setShowObservationModal(false);
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-slate-950">
      
      {/* Job Header & Action Bar */}
      <div className="p-4 bg-slate-900 border-b border-slate-800 space-y-3">
        
        <div className="flex items-center justify-between">
          <Link
            href="/worker"
            className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Jobs Schedule</span>
          </Link>

          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
            activeJob.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
            activeJob.status === 'In Progress' ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30' :
            'bg-amber-500/20 text-amber-300 border border-amber-500/30'
          }`}>
            {activeJob.status}
          </span>
        </div>

        <div>
          <span className="text-[10px] font-mono font-bold text-sky-400">{activeJob.referenceNumber}</span>
          <h2 className="text-base font-extrabold text-white">{activeJob.propertyName}</h2>
          <p className="text-xs text-slate-300 flex items-center gap-1 mt-0.5">
            <MapPin className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
            <span>{activeJob.propertyAddress}</span>
          </p>
        </div>

        {/* Quick Field Workflow Action Buttons */}
        <div className="pt-2 grid grid-cols-2 gap-2 text-xs">
          {activeJob.status === 'Scheduled' ? (
            <button
              onClick={() => updateProjectStatus(activeJob.id, 'In Progress')}
              className="col-span-2 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-md"
            >
              <Play className="w-4 h-4" />
              <span>Arrived & Start Work</span>
            </button>
          ) : activeJob.status === 'In Progress' ? (
            <>
              <button
                onClick={() => setShowUploadModal(true)}
                className="py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl flex items-center justify-center gap-1"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Upload Photo</span>
              </button>
              <button
                onClick={() => updateProjectStatus(activeJob.id, 'Completed')}
                className="py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center justify-center gap-1"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Complete Job</span>
              </button>
            </>
          ) : (
            <div className="col-span-2 py-2 bg-emerald-950 border border-emerald-700 text-emerald-300 font-bold text-center rounded-xl">
              ✓ Job Completed & Client Notified
            </div>
          )}
        </div>

      </div>

      {/* Secondary Actions Bar */}
      <div className="p-3 bg-slate-900/60 border-b border-slate-800 flex items-center justify-around text-[11px] text-slate-300">
        <button
          onClick={() => setShowObservationModal(true)}
          className="flex items-center gap-1 hover:text-white"
        >
          <Plus className="w-3.5 h-3.5 text-sky-400" />
          <span>Add Observation</span>
        </button>
        <span>•</span>
        <a
          href={`tel:${activeJob.workerPhone}`}
          className="flex items-center gap-1 hover:text-white"
        >
          <Phone className="w-3.5 h-3.5 text-emerald-400" />
          <span>Call Client</span>
        </a>
        <span>•</span>
        <button
          onClick={() => setActiveJobTab('map')}
          className="flex items-center gap-1 hover:text-white"
        >
          <Navigation className="w-3.5 h-3.5 text-amber-400" />
          <span>Directions</span>
        </button>
      </div>

      {/* Sub Tabs */}
      <div className="flex border-b border-slate-800 bg-slate-900 text-xs font-semibold text-slate-400">
        {(['tasks', 'photos', 'timeline', 'map'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveJobTab(tab)}
            className={`flex-1 py-2.5 text-center capitalize transition-colors ${
              activeJobTab === tab ? 'text-sky-400 border-b-2 border-sky-400 font-bold bg-slate-800/40' : 'hover:text-slate-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      <div className="p-4 flex-1 overflow-y-auto text-slate-800">
        {activeJobTab === 'tasks' && (
          <TaskChecklist
            tasks={activeJob.tasks}
            onToggleTask={taskId => toggleTaskCompletion(activeJob.id, taskId)}
            isEditable={true}
          />
        )}

        {activeJobTab === 'photos' && (
          <div className="bg-white p-4 rounded-2xl border border-slate-200">
            <PhotoGallery photos={activeJob.photos} />
          </div>
        )}

        {activeJobTab === 'timeline' && (
          <div className="bg-white p-4 rounded-2xl border border-slate-200">
            <ProjectTimeline events={activeJob.timeline} />
          </div>
        )}

        {activeJobTab === 'map' && (
          <PropertyMap
            address={activeJob.propertyAddress}
            propertyName={activeJob.propertyName}
            workerName={activeJob.workerName}
          />
        )}
      </div>

      {/* Upload Photo Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 text-slate-900 shadow-2xl">
            <h3 className="text-base font-bold flex items-center gap-2">
              <Camera className="w-5 h-5 text-sky-600" />
              <span>Upload Proof of Work Photo</span>
            </h3>

            <form onSubmit={handleQuickUpload} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold mb-1">Photo Category</label>
                <select
                  value={photoCategory}
                  onChange={e => setPhotoCategory(e.target.value as PhotoCategory)}
                  className="w-full p-2 rounded-lg border border-slate-300 font-medium"
                >
                  <option value="Before">Before Photo (Initial Condition)</option>
                  <option value="During">During Photo (In Progress)</option>
                  <option value="After">After Photo (Completion Proof)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold mb-1">Description / Note</label>
                <input
                  type="text"
                  value={photoDescription}
                  onChange={e => setPhotoDescription(e.target.value)}
                  placeholder="e.g. Kitchen tap cartridge installed & tested"
                  className="w-full p-2 rounded-lg border border-slate-300 font-medium"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 py-2 bg-slate-100 text-slate-700 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-sky-600 text-white rounded-lg font-bold shadow-xs"
                >
                  Upload Evidence
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Observation Modal */}
      {showObservationModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 text-slate-900 shadow-2xl">
            <h3 className="text-base font-bold flex items-center gap-2">
              <Plus className="w-5 h-5 text-sky-600" />
              <span>Add Field Observation</span>
            </h3>

            <form onSubmit={handleAddObservation} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold mb-1">Observation Details</label>
                <textarea
                  rows={3}
                  value={observationText}
                  onChange={e => setObservationText(e.target.value)}
                  placeholder="e.g. Additional corrosion found on bathroom tap washer..."
                  className="w-full p-2 rounded-lg border border-slate-300 font-medium"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowObservationModal(false)}
                  className="flex-1 py-2 bg-slate-100 text-slate-700 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-sky-600 text-white rounded-lg font-bold shadow-xs"
                >
                  Save Observation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
