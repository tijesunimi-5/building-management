'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Camera, RefreshCw, X, Check, Image as ImageIcon, Upload, Loader2, AlertCircle, Sparkles } from 'lucide-react';

interface CameraCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPhotoCaptured: (photoUrl: string) => void;
  folder?: string;
}

export default function CameraCaptureModal({
  isOpen,
  onClose,
  onPhotoCaptured,
  folder = 'ojutu/camera-captures'
}: CameraCaptureModalProps) {
  const [activeTab, setActiveTab] = useState<'camera' | 'file'>('camera');
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  
  const [capturedDataUri, setCapturedDataUri] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Start Camera Stream when modal opens
  const startCamera = async () => {
    setCameraError(null);
    stopCamera();

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsCameraActive(true);
      }
    } catch (err: any) {
      console.warn('Camera access error:', err);
      setIsCameraActive(false);
      setCameraError('Camera access denied or unavailable. You can upload from device files below.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    if (isOpen && activeTab === 'camera' && !capturedDataUri) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen, activeTab, facingMode, capturedDataUri]);

  // Handle Snap Photo
  const handleSnapPhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const width = video.videoWidth || 640;
    const height = video.videoHeight || 480;

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Flip horizontally if front camera
      if (facingMode === 'user') {
        ctx.translate(width, 0);
        ctx.scale(-1, 1);
      }
      ctx.drawImage(video, 0, 0, width, height);
      const dataUri = canvas.toDataURL('image/jpeg', 0.9);
      setCapturedDataUri(dataUri);
      stopCamera();
    }
  };

  // Upload snapped or selected photo to Cloudinary API
  const handleConfirmAndUpload = async () => {
    if (!capturedDataUri || isUploading) return;

    setIsUploading(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

    try {
      const res = await fetch(`${apiUrl}/upload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: capturedDataUri,
          folder
        })
      });

      const data = await res.json();
      const finalUrl = data.success && data.url ? data.url : capturedDataUri;
      onPhotoCaptured(finalUrl);
      handleCloseModal();
    } catch (err) {
      console.warn('Failed to upload via Cloudinary backend, using inline photo URI:', err);
      onPhotoCaptured(capturedDataUri);
      handleCloseModal();
    } finally {
      setIsUploading(false);
    }
  };

  // Handle File Selection
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();
    reader.onload = () => {
      setCapturedDataUri(reader.result as string);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleCloseModal = () => {
    stopCamera();
    setCapturedDataUri(null);
    setCameraError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 text-white rounded-3xl border border-slate-800 shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base sm:text-lg font-extrabold text-white">Camera & Photo Attachment</h3>
          </div>
          <button
            type="button"
            onClick={handleCloseModal}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toggle: Live Camera vs File Selector */}
        {!capturedDataUri && (
          <div className="flex border-b border-slate-800 bg-slate-950/50 p-1.5">
            <button
              type="button"
              onClick={() => { setActiveTab('camera'); setCapturedDataUri(null); }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'camera' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>Live Camera Viewfinder</span>
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('file'); setCapturedDataUri(null); }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'file' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>Select File / Gallery</span>
            </button>
          </div>
        )}

        {/* Content Body */}
        <div className="p-4 sm:p-6 flex-1 overflow-y-auto space-y-4 flex flex-col items-center justify-center min-h-[300px]">
          
          {/* 1. Captured Photo Preview Mode */}
          {capturedDataUri ? (
            <div className="w-full space-y-4 flex flex-col items-center">
              <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-500/60 shadow-lg max-h-[360px] w-full bg-slate-950 flex items-center justify-center">
                <img
                  src={capturedDataUri}
                  alt="Snapped preview"
                  className="max-h-[360px] w-full object-contain"
                />
              </div>

              <div className="flex items-center gap-3 w-full">
                <button
                  type="button"
                  onClick={() => { setCapturedDataUri(null); if (activeTab === 'camera') startCamera(); }}
                  className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Retake Photo</span>
                </button>

                <button
                  type="button"
                  disabled={isUploading}
                  onClick={handleConfirmAndUpload}
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Saving to DB...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Confirm & Attach Photo</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : activeTab === 'camera' ? (
            
            /* 2. Live Camera Viewfinder Mode */
            <div className="w-full space-y-4 flex flex-col items-center">
              {cameraError ? (
                <div className="p-6 bg-amber-950/40 border border-amber-800/60 rounded-2xl text-center space-y-3 text-amber-200 w-full">
                  <AlertCircle className="w-8 h-8 text-amber-400 mx-auto" />
                  <p className="text-xs font-semibold">{cameraError}</p>
                  
                  {/* Fallback Native Device Camera Input */}
                  <label className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-xs transition-colors cursor-pointer shadow-sm">
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <Camera className="w-4 h-4" />
                    <span>Open Device Native Camera</span>
                  </label>
                </div>
              ) : (
                <div className="relative rounded-2xl overflow-hidden border-2 border-slate-700 max-h-[360px] w-full bg-slate-950 flex items-center justify-center shadow-inner group">
                  <video
                    ref={videoRef}
                    playsInline
                    muted
                    className={`w-full max-h-[360px] object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
                  />

                  {/* Camera Controls Overlay */}
                  <button
                    type="button"
                    onClick={() => setFacingMode(prev => prev === 'environment' ? 'user' : 'environment')}
                    className="absolute top-3 right-3 p-2 bg-slate-900/80 hover:bg-slate-950 text-white rounded-full border border-slate-700 transition-colors shadow-xs"
                    title="Flip camera"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Shutter Button */}
              {isCameraActive && (
                <button
                  type="button"
                  onClick={handleSnapPhoto}
                  className="w-16 h-16 rounded-full bg-white hover:bg-slate-100 active:scale-95 text-slate-900 shadow-xl border-4 border-emerald-500 flex items-center justify-center transition-all group"
                  title="Snap photo"
                >
                  <div className="w-12 h-12 rounded-full bg-emerald-600 group-hover:bg-emerald-500 transition-colors" />
                </button>
              )}

              <canvas ref={canvasRef} className="hidden" />
            </div>
          ) : (
            
            /* 3. Select File / Gallery Mode */
            <div className="w-full space-y-4 text-center">
              <label className="border-2 border-dashed border-emerald-400/50 hover:border-emerald-400 bg-emerald-950/20 hover:bg-emerald-950/40 rounded-2xl p-8 transition-colors cursor-pointer block group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Upload className="w-10 h-10 text-emerald-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-xs font-bold text-white">Click or tap to choose photo file</p>
                <p className="text-[11px] text-slate-400 mt-1">PNG, JPG, WEBP up to 15MB</p>
              </label>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
