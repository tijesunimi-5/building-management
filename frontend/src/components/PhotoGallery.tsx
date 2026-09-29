'use client';

import React, { useState } from 'react';
import { PhotoEvidence } from '../types';
import { LightboxModal } from './LightboxModal';
import { Camera, Calendar, User, Eye, Image as ImageIcon, Plus } from 'lucide-react';

interface PhotoGalleryProps {
  photos: PhotoEvidence[];
  onUploadPhoto?: () => void;
}

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({ photos, onUploadPhoto }) => {
  const [filter, setFilter] = useState<'All' | 'Before' | 'During' | 'After'>('All');
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoEvidence | null>(null);

  const filteredPhotos = filter === 'All' 
    ? photos 
    : photos.filter(p => p.category === filter);

  const categories: ('All' | 'Before' | 'During' | 'After')[] = ['All', 'Before', 'During', 'After'];

  return (
    <div className="space-y-6">
      
      {/* Category Filter & Action Bar */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2">
          <Camera className="w-5 h-5 text-emerald-600" />
          <h3 className="text-base sm:text-lg font-bold text-slate-900">
            Property Photo Evidence ({photos.length})
          </h3>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Upload Button Trigger */}
          {onUploadPhoto && (
            <button
              type="button"
              onClick={onUploadPhoto}
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Camera className="w-4 h-4 text-emerald-400" />
              <span>Upload Photo (Camera/File)</span>
            </button>
          )}

          {/* Tab Filter Buttons */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
            {categories.map(cat => {
              const count = cat === 'All' ? photos.length : photos.filter(p => p.category === cat).length;
              const isActive = filter === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFilter(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-white text-slate-900 shadow-xs border border-slate-200 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                  }`}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grid of Photos or Empty State */}
      {filteredPhotos.length === 0 ? (
        <div className="bg-slate-50 rounded-2xl p-8 sm:p-12 text-center border border-dashed border-slate-300 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-100 shadow-xs">
            <ImageIcon className="w-6 h-6" />
          </div>

          <div>
            <p className="text-sm font-bold text-slate-800">No photos in this category yet</p>
            <p className="text-xs text-slate-500 mt-0.5">Technicians upload photo evidence as work progresses.</p>
          </div>

          {onUploadPhoto && (
            <div className="pt-2">
              <button
                type="button"
                onClick={onUploadPhoto}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-extrabold text-xs rounded-xl shadow-md transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span>Snap Camera or Select File</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPhotos.map(photo => (
            <div
              key={photo.id}
              onClick={() => setSelectedPhoto(photo)}
              className="group bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between"
            >
              {/* Photo Image with Category Tag */}
              <div className="relative aspect-4/3 bg-slate-900 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.url}
                  alt={photo.description}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Category Badge Overlay */}
                <div className="absolute top-3 left-3">
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider shadow-sm ${
                    photo.category === 'Before' ? 'bg-amber-500 text-white' :
                    photo.category === 'During' ? 'bg-blue-600 text-white' :
                    'bg-emerald-600 text-white'
                  }`}>
                    {photo.category}
                  </span>
                </div>

                {/* Hover Quick View Overlay */}
                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold gap-2">
                  <Eye className="w-4 h-4" />
                  <span>Inspect Photo</span>
                </div>
              </div>

              {/* Photo Details */}
              <div className="p-4 flex-1 flex flex-col justify-between bg-white">
                <div>
                  <p className="text-sm font-bold text-slate-900 line-clamp-2 mb-3 group-hover:text-emerald-600 transition-colors">
                    {photo.description}
                  </p>
                </div>

                <div className="space-y-1.5 pt-3 border-t border-slate-100 text-xs text-slate-500">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      {photo.uploadedBy}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{photo.timestamp}</span>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      <LightboxModal photo={selectedPhoto} onClose={() => setSelectedPhoto(null)} />
    </div>
  );
};
