'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { useApp } from '../../../../../context/AppContext';
import { ProjectTimeline } from '../../../../../components/ProjectTimeline';
import { PhotoGallery } from '../../../../../components/PhotoGallery';
import { TaskChecklist } from '../../../../../components/TaskChecklist';
import { PropertyMap } from '../../../../../components/PropertyMap';
import { LightboxModal } from '../../../../../components/LightboxModal';
import { PhotoEvidence } from '../../../../../types';
import { FileText, AlertCircle, Clock, Plus, Camera, X, CheckCircle2 } from 'lucide-react';
import CameraCaptureModal from '../../../../../components/CameraCaptureModal';

export default function ClientProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { projects, toggleTaskCompletion, addClientProjectTask, deletePendingTask, disableTask, restoreTask } = useApp();
  const [lightboxPhoto, setLightboxPhoto] = useState<PhotoEvidence | null>(null);

  // Client Request Task Modal state
  const [showAddTaskModal, setShowAddTaskModal] = useState<boolean>(false);
  const [newTaskTitle, setNewTaskTitle] = useState<string>('');
  const [newTaskPhotoUrl, setNewTaskPhotoUrl] = useState<string>('');
  const [showCameraModal, setShowCameraModal] = useState<boolean>(false);

  const selectedProject = projects.find(p => p.id === resolvedParams.id) || projects[0];

  if (!selectedProject) {
    return (
      <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center">
        <h2 className="text-lg font-bold text-slate-900">Project Not Found</h2>
        <Link href="/client/projects" className="text-xs font-bold text-emerald-600 hover:underline mt-2 inline-block">
          ← Return to Active Projects List
        </Link>
      </div>
    );
  }

  const handleCreateTaskRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    addClientProjectTask(
      selectedProject.id,
      newTaskTitle.trim(),
      newTaskPhotoUrl || undefined
    );

    setNewTaskTitle('');
    setNewTaskPhotoUrl('');
    setShowAddTaskModal(false);
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header & Status Bar */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              {selectedProject.referenceNumber}
            </span>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
              Status: {selectedProject.status}
            </span>
            <span className="text-xs font-semibold text-slate-500">
              Priority: {selectedProject.priority}
            </span>
          </div>

          <Link
            href="/client"
            className="text-xs font-semibold text-slate-500 hover:text-slate-800"
          >
            ← Back to Overview
          </Link>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {selectedProject.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Location: <span className="font-semibold text-slate-800">{selectedProject.propertyAddress}</span>
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAddTaskModal(true)}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs shadow-xs transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>+ Request Additional Task / Scope</span>
          </button>
        </div>

        {/* Technician Info Box */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selectedProject.workerAvatar || '/assets/worker_avatar_1786614986847.jpg'}
              alt={selectedProject.workerName}
              className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-xs"
            />
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Assigned Worker</span>
              <h4 className="text-sm font-bold text-slate-900">{selectedProject.workerName}</h4>
              <p className="text-xs text-slate-500">{selectedProject.workerPhone}</p>
            </div>
          </div>

          <div className="text-right text-xs">
            <span className="text-slate-400 block">Scheduled Date</span>
            <span className="font-bold text-slate-800">{selectedProject.scheduledDate}</span>
          </div>
        </div>
      </div>

      {/* Grid Layout: Tasks & Overview vs Location Map & Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <div className="lg:col-span-7 space-y-8">
          
          {/* Overview & Admin Observations */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-600" />
              <span>Project Overview & Assessment</span>
            </h3>

            <div className="space-y-3 text-xs text-slate-700">
              <div>
                <span className="font-bold text-slate-900 block mb-1">Client Request:</span>
                <p className="p-3 bg-slate-50 rounded-xl border border-slate-200 leading-relaxed italic">
                  &ldquo;{selectedProject.clientRequestSummary}&rdquo;
                </p>
              </div>

              {selectedProject.adminObservations && (
                <div>
                  <span className="font-bold text-slate-900 block mb-1">Initial Admin Assessment:</span>
                  <p className="p-3 bg-emerald-50/60 text-emerald-950 rounded-xl border border-emerald-200 leading-relaxed">
                    {selectedProject.adminObservations}
                  </p>
                </div>
              )}

              {selectedProject.additionalIssuesDiscovered && (
                <div>
                  <span className="font-bold text-amber-900 block mb-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                    Additional Issues Discovered on Site:
                  </span>
                  <p className="p-3 bg-amber-50 text-amber-900 rounded-xl border border-amber-200 leading-relaxed">
                    {selectedProject.additionalIssuesDiscovered}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Task Checklist */}
          <TaskChecklist
            tasks={selectedProject.tasks}
            onToggleTask={taskId => toggleTaskCompletion(selectedProject.id, taskId)}
            onAddTaskRequest={() => setShowAddTaskModal(true)}
            onDeletePendingTask={taskId => deletePendingTask(selectedProject.id, taskId)}
            onDisableTask={taskId => disableTask(selectedProject.id, taskId)}
            onRestoreTask={taskId => restoreTask(selectedProject.id, taskId)}
            userRole="client"
            isEditable={true}
          />

          {/* Photo Evidence Gallery */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <PhotoGallery photos={selectedProject.photos} />
          </div>

        </div>

        {/* Right Column: Map & Timeline */}
        <div className="lg:col-span-5 space-y-8">
          
          <PropertyMap
            address={selectedProject.propertyAddress}
            propertyName={selectedProject.propertyName}
            workerName={selectedProject.workerName}
            latitude={selectedProject.latitude}
            longitude={selectedProject.longitude}
          />

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-600" />
                <span>Property Maintenance Timeline</span>
              </h3>
              <span className="text-xs text-slate-400 font-medium">Real-Time Audit Trail</span>
            </div>

            <ProjectTimeline
              events={selectedProject.timeline}
              onOpenPhoto={url => {
                const found = selectedProject.photos.find(p => p.url === url);
                if (found) setLightboxPhoto(found);
              }}
            />
          </div>

        </div>

      </div>

      {/* Request Additional Task Modal */}
      {showAddTaskModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-5 text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-600" />
                <h3 className="text-lg font-extrabold text-slate-900">Request Additional Task</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddTaskModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Describe the additional work or fix required for this project. Once submitted, company admin will review and pass it down to your assigned technician.
            </p>

            <form onSubmit={handleCreateTaskRequest} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Task Title / Description
                </label>
                <input
                  type="text"
                  required
                  value={newTaskTitle}
                  onChange={e => setNewTaskTitle(e.target.value)}
                  placeholder="e.g. Inspect bathroom fan exhaust and replace filter..."
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Attach Image (Optional)
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowCameraModal(true)}
                    className="px-2.5 py-1 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 flex items-center gap-1"
                  >
                    <Camera className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Snap / Pick File</span>
                  </button>
                </div>

                {newTaskPhotoUrl ? (
                  <div className="relative w-full h-32 bg-slate-100 rounded-xl overflow-hidden border border-slate-300">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={newTaskPhotoUrl} alt="Task Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setNewTaskPhotoUrl('')}
                      className="absolute top-2 right-2 bg-slate-900/80 text-white rounded-full p-1 hover:bg-rose-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => setShowCameraModal(true)}
                    className="p-4 border-2 border-dashed border-emerald-300 hover:border-emerald-500 bg-emerald-50/40 rounded-xl text-center cursor-pointer transition-colors"
                  >
                    <p className="text-xs font-bold text-slate-700">Click to snap photo with camera or choose file</p>
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddTaskModal(false)}
                  className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newTaskTitle.trim()}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Submit Task Request</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      <LightboxModal photo={lightboxPhoto} onClose={() => setLightboxPhoto(null)} />

      {/* Camera Capture Modal */}
      <CameraCaptureModal
        isOpen={showCameraModal}
        onClose={() => setShowCameraModal(false)}
        onPhotoCaptured={(url) => {
          setNewTaskPhotoUrl(url);
          setShowCameraModal(false);
        }}
        folder="ojutu/client-task-requests"
      />

    </div>
  );
}
