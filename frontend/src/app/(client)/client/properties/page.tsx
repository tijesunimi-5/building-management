'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '../../../../context/AppContext';
import { Property, PropertyNote } from '../../../../types';
import {
  Home,
  ChevronRight,
  Camera,
  Plus,
  X,
  FileText,
  Clock,
  CheckCircle2,
  MapPin,
  Building,
  User,
  Image as ImageIcon,
  Sparkles,
  Upload,
  Archive,
  RotateCcw,
  AlertTriangle,
  ShieldCheck
} from 'lucide-react';
import CameraCaptureModal from '../../../../components/CameraCaptureModal';

export default function ClientPropertiesPage() {
  const { userProperties, userProjects, updatePropertyImage, addPropertyNote, disableProperty, restoreProperty } = useApp();

  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [propertyViewTab, setPropertyViewTab] = useState<'active' | 'archived'>('active');
  
  // Camera Modal modes: 'cover' for property image, 'note' for note attachment
  const [cameraMode, setCameraMode] = useState<'cover' | 'note' | null>(null);
  
  // Note form state inside property detail modal
  const [noteContent, setNoteContent] = useState<string>('');
  const [notePhotoUrl, setNotePhotoUrl] = useState<string>('');

  const activeProperties = userProperties.filter(p => !p.isDisabled);
  const archivedProperties = userProperties.filter(p => p.isDisabled);

  const activeProp = userProperties.find(p => p.id === selectedProperty?.id) || selectedProperty;

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProp || !noteContent.trim()) return;

    addPropertyNote(activeProp.id, noteContent.trim(), notePhotoUrl || undefined);
    setNoteContent('');
    setNotePhotoUrl('');
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 mb-2">
            <Home className="w-3.5 h-3.5 text-emerald-600" />
            <span>Real Estate Portfolio</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">My Properties</h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Click any property to update cover photos, report condition issues, or record property notes.
          </p>
        </div>

        {/* View Tabs */}
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 self-start sm:self-auto">
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
            <div className="col-span-full bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-4 shadow-xs">
              <Building className="w-12 h-12 text-slate-400 mx-auto" />
              <div className="space-y-1 max-w-md mx-auto">
                <p className="text-base font-bold text-slate-800">No Active Properties Registered</p>
                <p className="text-xs sm:text-sm text-slate-500">
                  When you configure and submit a service request, your property will automatically register here.
                </p>
              </div>
              <div className="pt-2 flex justify-center">
                <Link
                  href="/client/request"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                >
                  + Request Service to Register Property
                </Link>
              </div>
            </div>
          ) : (
            activeProperties.map(prop => {
              const displayImg = prop.imageUrl || '/assets/hero_property_main_1786614552025.jpg';
              return (
                <div
                  key={prop.id}
                  onClick={() => setSelectedProperty(prop)}
                  className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <div className="h-48 bg-slate-900 relative overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={displayImg}
                        alt={prop.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80';
                        }}
                      />
                      <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-bold px-3 py-1 rounded-full border border-slate-700">
                        {prop.propertyType}
                      </div>
                      <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-xs text-emerald-300 text-xs font-bold px-3 py-1 rounded-xl border border-slate-700 flex items-center gap-1">
                        <Camera className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Manage Photo & Notes</span>
                      </div>
                    </div>

                    <div className="p-5 space-y-3">
                      <div>
                        <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-emerald-600 transition-colors">
                          {prop.name}
                        </h3>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{prop.address}, {prop.city}</span>
                        </p>
                      </div>

                      {prop.notes && prop.notes.length > 0 && (
                        <div className="p-2.5 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs text-emerald-900">
                          <span className="font-bold flex items-center gap-1 text-[11px] uppercase tracking-wider text-emerald-700">
                            <FileText className="w-3 h-3" />
                            Latest Note:
                          </span>
                          <p className="line-clamp-1 italic font-medium mt-0.5">&ldquo;{prop.notes[0].content}&rdquo;</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-5 pt-0 space-y-3">
                    <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-100">
                      <span className="text-slate-600 font-medium">Active Maintenance:</span>
                      <span className="font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        {prop.activeProjectsCount > 0 ? `${prop.activeProjectsCount} Active` : 'Up to Date'}
                      </span>
                    </div>

                    <div className="w-full py-2.5 bg-slate-900 text-white hover:bg-slate-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-2xs">
                      <span>Open Property Details</span>
                      <ChevronRight className="w-4 h-4 text-emerald-400" />
                    </div>
                  </div>
                </div>
              );
            })
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
                  </div>

                  <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => restoreProperty(prop.id)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
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

      {/* Property Details & Condition Notes Modal */}
      {activeProp && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 relative text-slate-900">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {activeProp.propertyType}
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
                  {activeProp.name}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{activeProp.address}, {activeProp.city}, {activeProp.province} {activeProp.postalCode}</span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                {!activeProp.isDisabled && (
                  <button
                    type="button"
                    onClick={() => {
                      disableProperty(activeProp.id);
                      setSelectedProperty(null);
                    }}
                    className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1"
                    title="Archive Property (Legal Retention)"
                  >
                    <Archive className="w-3.5 h-3.5 text-rose-600" />
                    <span>Archive Property</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setSelectedProperty(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Legal Retention Info Banner */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2 text-[11px] text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Legal Retention Rule: Properties cannot be destroyed. Archiving hides the asset from active scheduling while preserving audit trail.</span>
            </div>

            {/* Property Cover Photo Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Property Cover Photo
                </label>
                <button
                  type="button"
                  onClick={() => setCameraMode('cover')}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5"
                >
                  <Camera className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Update Cover Photo</span>
                </button>
              </div>

              <div className="h-56 bg-slate-900 rounded-2xl overflow-hidden relative border border-slate-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={activeProp.imageUrl || '/assets/hero_property_main_1786614552025.jpg'}
                  alt={activeProp.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80';
                  }}
                />
              </div>
            </div>

            {/* Add Condition Note Form */}
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Plus className="w-4 h-4 text-emerald-600" />
                  <span>Add Property Condition Note / Issue</span>
                </h3>
                
                <button
                  type="button"
                  onClick={() => setCameraMode('note')}
                  className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                >
                  <Camera className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{notePhotoUrl ? 'Photo Attached ✓' : 'Attach Photo'}</span>
                </button>
              </div>

              <form onSubmit={handleSaveNote} className="space-y-3">
                <textarea
                  rows={3}
                  required
                  value={noteContent}
                  onChange={e => setNoteContent(e.target.value)}
                  placeholder="Describe property condition, minor damage, or maintenance observations..."
                  className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />

                {notePhotoUrl && (
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-slate-300 shadow-xs">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={notePhotoUrl} alt="Note Attachment" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setNotePhotoUrl('')}
                      className="absolute top-1 right-1 bg-slate-900/80 text-white p-1 rounded-full hover:bg-rose-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={!noteContent.trim()}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl text-xs font-extrabold transition-all shadow-xs disabled:opacity-50"
                  >
                    Save Condition Note
                  </button>
                </div>
              </form>
            </div>

            {/* List of Existing Condition Notes */}
            <div className="space-y-3">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600" />
                <span>Property Condition Notes ({activeProp.notes?.length || 0})</span>
              </h3>

              {(!activeProp.notes || activeProp.notes.length === 0) ? (
                <p className="text-xs text-slate-500 italic p-4 bg-slate-50 rounded-xl text-center">
                  No condition notes added yet for this property.
                </p>
              ) : (
                <div className="space-y-3">
                  {activeProp.notes.map(note => (
                    <div key={note.id} className="p-4 bg-white border border-slate-200 rounded-2xl space-y-2 shadow-2xs">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-800">{note.authorName} ({note.authorRole})</span>
                        <span className="text-[11px] text-slate-400">{note.createdAt}</span>
                      </div>

                      <p className="text-xs text-slate-700 leading-relaxed">{note.content}</p>

                      {note.imageUrl && (
                        <div className="mt-2 w-32 h-32 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={note.imageUrl} alt="Condition photo" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer Close */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <Link
                href={`/client/projects/${userProjects.find(p => p.propertyId === activeProp.id)?.id || 'proj-501'}`}
                className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1"
              >
                <span>View Full Maintenance Projects</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>

              <button
                type="button"
                onClick={() => setSelectedProperty(null)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Camera Capture Modal */}
      <CameraCaptureModal
        isOpen={cameraMode !== null}
        onClose={() => setCameraMode(null)}
        onPhotoCaptured={(url) => {
          if (cameraMode === 'cover' && activeProp) {
            updatePropertyImage(activeProp.id, url);
          } else if (cameraMode === 'note') {
            setNotePhotoUrl(url);
          }
          setCameraMode(null);
        }}
        folder={cameraMode === 'cover' ? 'ojutu/properties' : 'ojutu/property-notes'}
      />

    </div>
  );
}
