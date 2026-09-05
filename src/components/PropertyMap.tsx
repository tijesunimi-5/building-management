'use client';

import React from 'react';
import { MapPin, Navigation, ExternalLink, ShieldCheck } from 'lucide-react';

interface PropertyMapProps {
  address: string;
  propertyName: string;
  workerName?: string;
  latitude?: number;
  longitude?: number;
}

export const PropertyMap: React.FC<PropertyMapProps> = ({
  address,
  propertyName,
  workerName = 'Michael Carter',
  latitude = 43.6702,
  longitude = -79.3897
}) => {
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${propertyName}, ${address}`)}`;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
      
      {/* Header Bar */}
      <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-rose-500" />
          <div>
            <h4 className="text-sm font-bold text-slate-900">{propertyName}</h4>
            <p className="text-xs text-slate-500">{address}</p>
          </div>
        </div>

        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold border border-slate-200 shadow-2xs transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5 text-sky-600" />
          <span>Open in Google Maps</span>
        </a>
      </div>

      {/* Simulated Vector Map Area */}
      <div className="relative h-64 bg-slate-900 overflow-hidden flex items-center justify-center">
        {/* Map Grid Pattern background */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(#38bdf8 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}
        />

        {/* Vector Road lines SVG graphics */}
        <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
          <path d="M -50,120 Q 150,80 400,160 T 900,100" stroke="#0284c7" strokeWidth="6" fill="none" />
          <path d="M 120,-20 L 140,300" stroke="#64748b" strokeWidth="4" fill="none" />
          <path d="M 320,-20 L 300,300" stroke="#64748b" strokeWidth="4" fill="none" />
          <path d="M -20,200 L 800,200" stroke="#64748b" strokeWidth="3" fill="none" />
        </svg>

        {/* Property Pin */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer z-10">
          <div className="bg-rose-600 text-white p-2 rounded-full shadow-lg border-2 border-white animate-bounce">
            <MapPin className="w-5 h-5" />
          </div>
          <div className="bg-slate-900/90 text-white text-[11px] font-bold px-2.5 py-1 rounded-md mt-1 shadow-md border border-slate-700 whitespace-nowrap">
            {propertyName}
          </div>
        </div>

        {/* Worker Location Marker */}
        <div className="absolute top-1/3 left-2/3 flex items-center gap-2 bg-sky-600/95 text-white text-xs font-semibold px-2.5 py-1.5 rounded-full shadow-lg border border-sky-400 backdrop-blur-xs z-10">
          <Navigation className="w-3.5 h-3.5 animate-pulse text-amber-300" />
          <span>{workerName} (En Route)</span>
        </div>

        {/* Map Overlay Badge */}
        <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur-md text-slate-300 text-[11px] px-3 py-1.5 rounded-lg border border-slate-700 flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>GPS Coordinates: {latitude.toFixed(4)}° N, {longitude.toFixed(4)}° W</span>
        </div>
      </div>

    </div>
  );
};
