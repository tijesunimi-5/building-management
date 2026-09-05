'use client';

import React from 'react';
import { TimelineEvent } from '../types';
import { FileText, FolderPlus, UserCheck, Search, Wrench, Camera, CheckCircle2, Clock } from 'lucide-react';

interface ProjectTimelineProps {
  events: TimelineEvent[];
  onOpenPhoto?: (photoUrl: string) => void;
}

export const ProjectTimeline: React.FC<ProjectTimelineProps> = ({ events, onOpenPhoto }) => {
  const getEventIcon = (type?: TimelineEvent['iconType']) => {
    switch (type) {
      case 'request':
        return <FileText className="w-4 h-4 text-sky-600" />;
      case 'project':
        return <FolderPlus className="w-4 h-4 text-indigo-600" />;
      case 'worker':
        return <UserCheck className="w-4 h-4 text-emerald-600" />;
      case 'inspection':
        return <Search className="w-4 h-4 text-amber-600" />;
      case 'work':
        return <Wrench className="w-4 h-4 text-blue-600" />;
      case 'progress':
        return <Camera className="w-4 h-4 text-violet-600" />;
      case 'completion':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      default:
        return <Clock className="w-4 h-4 text-slate-500" />;
    }
  };

  const getEventBadge = (authorRole: TimelineEvent['authorRole']) => {
    switch (authorRole) {
      case 'Client':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'Company Admin':
        return 'bg-slate-100 text-slate-700 border-slate-300';
      case 'Worker Technician':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
      {events.map((evt, idx) => (
        <div key={evt.id || idx} className="relative group">
          {/* Icon Bubble */}
          <div className="absolute -left-6 sm:-left-8 top-0.5 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white border-2 border-slate-200 shadow-sm flex items-center justify-center group-hover:border-sky-500 transition-colors">
            {getEventIcon(evt.iconType)}
          </div>

          {/* Timeline Card */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-4 sm:p-5 shadow-xs hover:shadow-md transition-shadow">
            
            {/* Header / Timestamp */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-400 tracking-wide uppercase">
                  {evt.date}
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-xs text-slate-500 font-medium">{evt.time}</span>
              </div>

              <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${getEventBadge(evt.authorRole)}`}>
                {evt.authorName} ({evt.authorRole})
              </span>
            </div>

            {/* Title */}
            <h4 className="text-base font-bold text-slate-900 mb-1">
              {evt.title}
            </h4>

            {/* Description */}
            <p className="text-sm text-slate-600 leading-relaxed mb-3">
              {evt.description}
            </p>

            {/* Photo Evidence Thumbnail (if present) */}
            {evt.photoUrl && (
              <div className="mt-3">
                <div 
                  onClick={() => onOpenPhoto && onOpenPhoto(evt.photoUrl!)}
                  className="inline-block relative rounded-lg overflow-hidden border border-slate-200 cursor-pointer group/img max-w-xs shadow-xs"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={evt.photoUrl}
                    alt={evt.title}
                    className="w-full h-36 object-cover group-hover/img:scale-105 transition-transform duration-200"
                  />
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium gap-1.5">
                    <Camera className="w-4 h-4" />
                    <span>View Full Photo</span>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      ))}
    </div>
  );
};
