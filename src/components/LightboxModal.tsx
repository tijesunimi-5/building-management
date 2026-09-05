'use client';

import React from 'react';
import { X, Calendar, User, Tag } from 'lucide-react';
import { PhotoEvidence } from '../types';

interface LightboxModalProps {
  photo: PhotoEvidence | null;
  onClose: () => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({ photo, onClose }) => {
  if (!photo) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md transition-opacity">
      <div className="bg-white rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl border border-slate-200 flex flex-col md:flex-row relative max-h-[90vh]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white flex items-center justify-center transition-colors"
          title="Close Lightbox"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Image Preview Container */}
        <div className="md:w-3/5 bg-slate-950 flex items-center justify-center p-4 min-h-[300px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photo.url}
            alt={photo.description}
            className="max-h-[70vh] w-auto max-w-full object-contain rounded-lg shadow-md"
          />
        </div>

        {/* Metadata Details Sidebar */}
        <div className="md:w-2/5 p-6 flex flex-col justify-between overflow-y-auto bg-slate-50">
          <div>
            {/* Category Tag */}
            <div className="mb-4">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                photo.category === 'Before' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                photo.category === 'During' ? 'bg-blue-100 text-blue-800 border border-blue-300' :
                'bg-emerald-100 text-emerald-800 border border-emerald-300'
              }`}>
                <Tag className="w-3.5 h-3.5" />
                {photo.category} Photo Evidence
              </span>
            </div>

            {/* Description */}
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              {photo.description}
            </h3>

            {/* Timestamp & Uploader Info */}
            <div className="space-y-3 py-4 border-y border-slate-200 text-sm text-slate-600">
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-slate-400" />
                <div>
                  <span className="text-xs text-slate-400 block font-medium">Timestamp</span>
                  <span className="font-semibold text-slate-800">{photo.timestamp}</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <User className="w-4 h-4 text-slate-400" />
                <div>
                  <span className="text-xs text-slate-400 block font-medium">Uploaded By</span>
                  <span className="font-semibold text-slate-800">{photo.uploadedBy}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <button
              onClick={onClose}
              className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold text-sm transition-colors shadow-sm"
            >
              Close Photo Inspection
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
