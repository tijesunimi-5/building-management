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
import { FileText, AlertCircle, Clock, Camera, Check, X, Sparkles, AlertTriangle } from 'lucide-react';
import CameraCaptureModal from '../../../../../components/CameraCaptureModal';

export default function AdminProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const {
    projects,
    workers,
    toggleTaskCompletion,
    updateProjectStatus,
    uploadPhotoEvidence,
    approveClientProjectTask,
    declineClientProjectTask,
    deletePendingTask,
    disableTask,
    restoreTask
  } = useApp();
  
  const [lightboxPhoto, setLightboxPhoto] = useState<PhotoEvidence | null>(null);
  const [showCameraModal, setShowCameraModal] = useState<boolean>(false);

  const selectedProject = projects.find(p => p.id === resolvedParams.id) || projects[0];

  if (!selectedProject) {
    return (
      <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center">
        <h2 className="text-lg font-bold text-slate-900">Project Not Found</h2>
        <Link href="/admin/projects" className="text-xs font-bold text-emerald-600 hover:underline mt-2 inline-block">
          ← Return to Projects Hub
        </Link>
      </div>
    );
  }

  const pendingClientTasks = selectedProject.tasks.filter(t => t.status === 'Pending Admin Review');

  return (
    <div className="space-y-8 pb-12">
      
      {/* Pending Client Scope Additions Alert Banner */}
      {pendingClientTasks.length > 0 && (
        <div className="p-6 bg-amber-50 border-2 border-amber-300 rounded-3xl space-y-4 shadow-sm animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-amber-950">
                  Client Requested Task Additions ({pendingClientTasks.length} Pending Review)
                </h3>
                <p className="text-xs text-amber-800 font-medium">
                  The client has submitted additional task scope for this project. Review and approve to pass down to {selectedProject.workerName || 'assigned technician'}.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {pendingClientTasks.map(task => (
              <div key={task.id} className="p-4 bg-white rounded-2xl border border-amber-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                      Requested by {task.requestedBy || 'Client'}
                    </span>
                  </div>
                  <h4 className="text-sm font-extrabold text-slate-900">{task.title}</h4>
                  
                  {task.photoUrl && (
                    <div className="pt-2 flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                        <Camera className="w-3.5 h-3.5 text-emerald-600" />
                        Client Photo Attached:
                      </span>
                      <div className="w-16 h-16 rounded-xl overflow-hidden border border-slate-300 bg-slate-100 shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={task.photoUrl} alt="Attached Evidence" className="w-full h-full object-cover" />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => approveClientProjectTask(selectedProject.id, task.id)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Approve & Pass to Staff</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => declineClientProjectTask(selectedProject.id, task.id, 'Task scope outside agreement')}
                    className="px-3 py-2 bg-rose-100 hover:bg-rose-200 text-rose-800 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
                  >
                    <X className="w-4 h-4" />
                    <span>Decline</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Header Bar & Admin Override Controls */}
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

          <Link href="/admin/projects" className="text-xs font-semibold text-slate-500 hover:text-slate-800">
            ← Back to Projects Hub
          </Link>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {selectedProject.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Client: <span className="font-semibold text-slate-800">{selectedProject.clientName}</span> • Address: <span className="font-semibold text-slate-800">{selectedProject.propertyAddress}</span>
            </p>
          </div>

          {/* Admin Status Override Controls */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-slate-700">Change Status:</label>
            <select
              value={selectedProject.status}
              onChange={e => updateProjectStatus(selectedProject.id, e.target.value as any)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none"
            >
              <option value="Scheduled">Scheduled</option>
              <option value="In Progress">In Progress</option>
              <option value="Paused">Paused</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Assigned Worker Info */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selectedProject.workerAvatar || '/assets/worker_avatar_1786614986847.jpg'}
              alt={selectedProject.workerName}
              className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-xs"
            />
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Assigned Technician</span>
              <h4 className="text-sm font-bold text-slate-900">{selectedProject.workerName}</h4>
              <p className="text-xs text-slate-500">{selectedProject.workerPhone}</p>
            </div>
          </div>

          <div className="text-right text-xs">
            <span className="text-slate-400 block">Expected Completion</span>
            <span className="font-bold text-slate-800">{selectedProject.expectedCompletionDate}</span>
          </div>
        </div>
      </div>

      {/* Grid: Tasks & Overview vs Map & Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <div className="lg:col-span-7 space-y-8">
          
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-600" />
              <span>Project Overview & Admin Notes</span>
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
                  <span className="font-bold text-slate-900 block mb-1">Admin Dispatch Notes:</span>
                  <p className="p-3 bg-emerald-50/60 text-emerald-950 rounded-xl border border-emerald-200 leading-relaxed">
                    {selectedProject.adminObservations}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Task Checklist with Admin Approval Controls */}
          <TaskChecklist
            tasks={selectedProject.tasks}
            onToggleTask={taskId => toggleTaskCompletion(selectedProject.id, taskId)}
            onApproveTask={taskId => approveClientProjectTask(selectedProject.id, taskId)}
            onDeclineTask={taskId => declineClientProjectTask(selectedProject.id, taskId)}
            onDeletePendingTask={taskId => deletePendingTask(selectedProject.id, taskId)}
            onDisableTask={taskId => disableTask(selectedProject.id, taskId)}
            onRestoreTask={taskId => restoreTask(selectedProject.id, taskId)}
            userRole="admin"
            isEditable={true}
          />

          {/* Photo Gallery */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Camera className="w-5 h-5 text-emerald-600" />
                <span>Project Photo Evidence</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowCameraModal(true)}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
              >
                <Camera className="w-3.5 h-3.5 text-emerald-400" />
                <span>Upload Evidence (Camera/File)</span>
              </button>
            </div>
            <PhotoGallery photos={selectedProject.photos} />
          </div>

        </div>

        {/* Right Column */}
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
                <span>Property Maintenance Audit Timeline</span>
              </h3>
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

      <LightboxModal photo={lightboxPhoto} onClose={() => setLightboxPhoto(null)} />

      <CameraCaptureModal
        isOpen={showCameraModal}
        onClose={() => setShowCameraModal(false)}
        onPhotoCaptured={(url) => {
          uploadPhotoEvidence(selectedProject.id, 'During', 'Admin uploaded evidence photo', url);
          setShowCameraModal(false);
        }}
        folder="ojutu/admin-evidence"
      />

    </div>
  );
}
