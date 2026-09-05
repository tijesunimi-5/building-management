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
import { FileText, AlertCircle, Clock } from 'lucide-react';

export default function ClientProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { projects, toggleTaskCompletion } = useApp();
  const [lightboxPhoto, setLightboxPhoto] = useState<PhotoEvidence | null>(null);

  const selectedProject = projects.find(p => p.id === resolvedParams.id) || projects[0];

  if (!selectedProject) {
    return (
      <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center">
        <h2 className="text-lg font-bold text-slate-900">Project Not Found</h2>
        <Link href="/client/projects" className="text-xs font-bold text-sky-600 hover:underline mt-2 inline-block">
          ← Return to Active Projects List
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      {/* Header & Status Bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-sky-600 bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
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

        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {selectedProject.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Location: <span className="font-semibold text-slate-800">{selectedProject.propertyAddress}</span>
          </p>
        </div>

        {/* Technician Info Box */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between flex-wrap gap-4">
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
              <FileText className="w-5 h-5 text-sky-600" />
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
                  <p className="p-3 bg-sky-50/60 text-sky-950 rounded-xl border border-sky-200 leading-relaxed">
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
                <Clock className="w-5 h-5 text-sky-600" />
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

      {/* Lightbox Modal */}
      <LightboxModal photo={lightboxPhoto} onClose={() => setLightboxPhoto(null)} />

    </div>
  );
}
