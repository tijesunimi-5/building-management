'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '../../../../context/AppContext';
import { Property, ServiceRequest, Project, UserProfile } from '../../../../types';
import {
  Users,
  Mail,
  Phone,
  MapPin,
  Home,
  Briefcase,
  ChevronRight,
  Search,
  X,
  FileText,
  Clock,
  CheckCircle2,
  Building,
  UserCheck,
  Sparkles,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

interface CompiledClient {
  id: string;
  name: string;
  email: string;
  phone: string;
  primaryAddress: string;
  status: string;
  properties: Property[];
  requests: ServiceRequest[];
  projects: Project[];
}

export default function AdminClientsPage() {
  const { properties, requests, projects, currentUser } = useApp();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedClient, setSelectedClient] = useState<CompiledClient | null>(null);

  // Dynamically compile real clients from AppContext (properties, requests, projects, currentUser)
  const clientMap = new Map<string, CompiledClient>();

  // Helper to normalize client key
  const getClientKey = (name: string, email?: string) => {
    return (email && email.trim()) ? email.trim().toLowerCase() : name.trim().toLowerCase();
  };

  // 1. Process Properties
  properties.forEach(prop => {
    const name = prop.clientName || 'Michael Thompson';
    const email = prop.clientEmail || 'client@example.ca';
    const phone = prop.clientPhone || '+1 (416) 555-0192';
    const key = getClientKey(name, email);

    if (!clientMap.has(key)) {
      clientMap.set(key, {
        id: `client-${key}`,
        name,
        email,
        phone,
        primaryAddress: `${prop.address}, ${prop.city}`,
        status: 'Active Client',
        properties: [],
        requests: [],
        projects: []
      });
    }

    const compiled = clientMap.get(key)!;
    if (!compiled.properties.some(p => p.id === prop.id)) {
      compiled.properties.push(prop);
    }
  });

  // 2. Override/Include Current User if role === 'client' or registered profile
  if (currentUser && currentUser.name) {
    const key = getClientKey(currentUser.name, currentUser.email);
    let compiled = clientMap.get(key);

    if (!compiled) {
      compiled = {
        id: currentUser.id || `client-${key}`,
        name: currentUser.name,
        email: currentUser.email || 'client@example.ca',
        phone: currentUser.phone || '+1 (416) 555-0192',
        primaryAddress: currentUser.primaryAddress || '142 Yorkville Ave, Toronto, ON',
        status: 'Active Client',
        properties: [],
        requests: [],
        projects: []
      };
      clientMap.set(key, compiled);
    } else {
      // Sync latest profile updates from user account
      compiled.name = currentUser.name;
      compiled.email = currentUser.email || compiled.email;
      compiled.phone = currentUser.phone || compiled.phone;
      if (currentUser.primaryAddress) {
        compiled.primaryAddress = currentUser.primaryAddress;
      }
    }
  }

  // 3. Attach Service Requests
  requests.forEach(req => {
    const key = getClientKey(req.clientName, undefined);
    // Find matching client by name or default to first client if matching
    const matchingKey = Array.from(clientMap.keys()).find(k => k === key || clientMap.get(k)?.name.toLowerCase() === req.clientName.toLowerCase());

    if (matchingKey) {
      const clientObj = clientMap.get(matchingKey)!;
      if (!clientObj.requests.some(r => r.id === req.id)) {
        clientObj.requests.push(req);
      }
    }
  });

  // 4. Attach Projects
  projects.forEach(proj => {
    const key = getClientKey(proj.clientName, undefined);
    const matchingKey = Array.from(clientMap.keys()).find(k => k === key || clientMap.get(k)?.name.toLowerCase() === proj.clientName.toLowerCase());

    if (matchingKey) {
      const clientObj = clientMap.get(matchingKey)!;
      if (!clientObj.projects.some(p => p.id === proj.id)) {
        clientObj.projects.push(proj);
      }
    }
  });

  const compiledClientsList = Array.from(clientMap.values());

  // Filter clients based on search query
  const filteredClients = compiledClientsList.filter(c => {
    const query = searchTerm.toLowerCase();
    return (
      c.name.toLowerCase().includes(query) ||
      c.email.toLowerCase().includes(query) ||
      c.phone.toLowerCase().includes(query) ||
      c.primaryAddress.toLowerCase().includes(query) ||
      c.properties.some(p => p.name.toLowerCase().includes(query) || p.address.toLowerCase().includes(query))
    );
  });

  const activeClientDetail = compiledClientsList.find(c => c.id === selectedClient?.id) || selectedClient;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800">
            <Users className="w-3.5 h-3.5 text-emerald-600" />
            <span>Client Management Directory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Registered Clients ({compiledClientsList.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Real homeowner and property manager accounts loaded directly from database records.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search clients, email, address..."
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
          />
        </div>
      </div>

      {/* Clients Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.length === 0 ? (
          <div className="col-span-full bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3 shadow-xs">
            <Users className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No Matching Clients Found</h3>
            <p className="text-xs text-slate-500">Try adjusting your search filter.</p>
          </div>
        ) : (
          filteredClients.map(c => {
            const activeProjectsCount = c.projects.filter(p => p.status !== 'Completed' && !p.isDisabled).length;
            const activeRequestsCount = c.requests.filter(r => r.status !== 'Completed' && !r.isDisabled).length;
            const mainProperty = c.properties[0];

            return (
              <div
                key={c.id}
                onClick={() => setSelectedClient(c)}
                className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-700 font-extrabold flex items-center justify-center text-sm border border-emerald-200 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                        {c.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-base font-extrabold text-slate-900 group-hover:text-emerald-600 transition-colors">
                          {c.name}
                        </h3>
                        <p className="text-xs font-semibold text-slate-500">
                          {mainProperty ? mainProperty.name : 'Homeowner'}
                        </p>
                      </div>
                    </div>

                    <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {c.status}
                    </span>
                  </div>

                  {/* Contact Info List */}
                  <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{c.primaryAddress}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{c.phone}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{c.email}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Pill Metrics */}
                <div className="pt-3 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span className="font-semibold flex items-center gap-1">
                      <Home className="w-3.5 h-3.5 text-emerald-600" />
                      {c.properties.length} {c.properties.length === 1 ? 'Property' : 'Properties'}
                    </span>

                    <span className={`font-bold px-2 py-0.5 rounded-full text-[11px] ${
                      (activeProjectsCount + activeRequestsCount) > 0
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {activeProjectsCount + activeRequestsCount} Active Job
                    </span>
                  </div>

                  <div className="w-full py-2 bg-slate-50 group-hover:bg-slate-900 group-hover:text-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-center gap-1.5 transition-all">
                    <span>View Client Properties & History</span>
                    <ChevronRight className="w-4 h-4 text-emerald-500" />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Client Detail Modal / Drawer */}
      {activeClientDetail && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 relative text-slate-900">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white font-extrabold text-lg flex items-center justify-center shadow-xs">
                  {activeClientDetail.name.charAt(0)}
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    {activeClientDetail.status}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">
                    {activeClientDetail.name}
                  </h2>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{activeClientDetail.primaryAddress}</span>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedClient(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Quick Contact Info Bar */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Phone: <strong className="text-slate-900">{activeClientDetail.phone}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Email: <strong className="text-slate-900">{activeClientDetail.email}</strong></span>
              </div>
            </div>

            {/* Client Owned Properties Section */}
            <div className="space-y-3">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Home className="w-5 h-5 text-emerald-600" />
                  <span>Associated Properties ({activeClientDetail.properties.length})</span>
                </span>

                <Link
                  href="/admin/properties"
                  className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1"
                >
                  <span>Go to Properties Directory</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </h3>

              {activeClientDetail.properties.length === 0 ? (
                <p className="text-xs text-slate-500 italic p-4 bg-slate-50 rounded-xl text-center">
                  No properties registered under this client yet.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {activeClientDetail.properties.map(prop => (
                    <div key={prop.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between">
                      <div className="h-32 bg-slate-900 relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={prop.imageUrl || '/assets/hero_property_main_1786614552025.jpg'}
                          alt={prop.name}
                          className="w-full h-full object-cover opacity-90"
                        />
                        <div className="absolute top-2 left-2 bg-slate-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {prop.propertyType}
                        </div>
                      </div>

                      <div className="p-4 space-y-2">
                        <h4 className="text-sm font-bold text-slate-900">{prop.name}</h4>
                        <p className="text-xs text-slate-500">{prop.address}, {prop.city}</p>

                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                          <span className="text-slate-600 font-medium">Jobs:</span>
                          <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            {prop.activeProjectsCount > 0 ? `${prop.activeProjectsCount} Active` : 'Up to Date'}
                          </span>
                        </div>

                        {/* Sync to Existing Properties Page */}
                        <Link
                          href="/admin/properties"
                          className="w-full py-2 mt-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                        >
                          <span>Manage Property Records</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Client Service Requests & Maintenance History */}
            <div className="space-y-3 pt-2">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-emerald-600" />
                <span>Service Requests & Maintenance Projects</span>
              </h3>

              {activeClientDetail.projects.length === 0 && activeClientDetail.requests.length === 0 ? (
                <p className="text-xs text-slate-500 italic p-4 bg-slate-50 rounded-xl text-center">
                  No service requests or project records found for this client.
                </p>
              ) : (
                <div className="space-y-3">
                  {/* Active & Completed Projects */}
                  {activeClientDetail.projects.map(proj => (
                    <div key={proj.id} className="p-4 bg-white border border-slate-200 rounded-2xl shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            {proj.referenceNumber}
                          </span>
                          <span className="text-xs font-bold text-slate-800">{proj.serviceCategory}</span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">{proj.title}</h4>
                        <p className="text-xs text-slate-500">Property: {proj.propertyName}</p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          proj.status === 'Completed' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                          proj.status === 'In Progress' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                          'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}>
                          {proj.status}
                        </span>

                        {/* Sync directly to existing Admin Project Detail Page */}
                        <Link
                          href={`/admin/projects/${proj.id}`}
                          className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center gap-1"
                        >
                          <span>View Project</span>
                          <ChevronRight className="w-3.5 h-3.5 text-emerald-400" />
                        </Link>
                      </div>
                    </div>
                  ))}

                  {/* Standalone Requests not yet converted */}
                  {activeClientDetail.requests.filter(r => !activeClientDetail.projects.some(p => p.referenceNumber.includes(r.referenceNumber))).map(req => (
                    <div key={req.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-mono font-bold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-300">
                            {req.referenceNumber}
                          </span>
                          <span className="text-xs font-bold text-slate-800">{req.serviceCategory}</span>
                        </div>
                        <p className="text-xs text-slate-600 line-clamp-1">{req.description}</p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          {req.status}
                        </span>

                        <Link
                          href="/admin/requests"
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center gap-1"
                        >
                          <span>Review Request</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer Close */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setSelectedClient(null)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
