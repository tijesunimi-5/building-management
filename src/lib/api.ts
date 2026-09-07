import { Property, ServiceRequest, Project, WorkerInfo } from '../types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://building-management-backend-0v3l.onrender.com/api/v1';

export async function fetchPropertiesFromApi(): Promise<Property[]> {
  const res = await fetch(`${API_BASE}/properties`, { cache: 'no-store' });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || 'Failed to fetch properties');
  return json.data;
}

export async function loginWithApi(email: string, password?: string): Promise<{
  id: string;
  name: string;
  email: string;
  role: 'client' | 'admin' | 'worker';
  roleTitle?: string;
  avatarUrl?: string;
}> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || 'Login failed');
  return json.data;
}

export async function fetchRequestsFromApi(): Promise<ServiceRequest[]> {
  const res = await fetch(`${API_BASE}/requests`, { cache: 'no-store' });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || 'Failed to fetch requests');
  return json.data;
}

export async function createRequestApi(requestData: {
  propertyId?: string;
  propertyName?: string;
  propertyAddress?: string;
  clientName?: string;
  serviceCategory: string;
  description: string;
  preferredDate?: string;
  additionalNotes?: string;
  photoUrls?: string[];
}): Promise<ServiceRequest> {
  const res = await fetch(`${API_BASE}/requests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestData)
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || 'Failed to create request');
  return json.data;
}

export async function fetchProjectsFromApi(): Promise<Project[]> {
  const res = await fetch(`${API_BASE}/projects`, { cache: 'no-store' });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || 'Failed to fetch projects');
  return json.data;
}

export async function fetchProjectByIdApi(id: string): Promise<Project> {
  const res = await fetch(`${API_BASE}/projects/${id}`, { cache: 'no-store' });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || 'Failed to fetch project');
  return json.data;
}

export async function triageProjectApi(data: {
  requestId: string;
  workerId: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  adminObservations: string;
  tasks: string[];
}): Promise<Project> {
  const res = await fetch(`${API_BASE}/projects/triage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || 'Failed to triage project');
  return json.data;
}

export async function fetchWorkersFromApi(): Promise<WorkerInfo[]> {
  const res = await fetch(`${API_BASE}/workers`, { cache: 'no-store' });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || 'Failed to fetch workers');
  return json.data;
}

export async function addWorkerApi(workerData: {
  name: string;
  roleTitle?: string;
  phone?: string;
  email?: string;
  avatarUrl?: string;
}): Promise<WorkerInfo> {
  const res = await fetch(`${API_BASE}/workers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(workerData)
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || 'Failed to add worker');
  return json.data;
}

export async function removeWorkerApi(workerId: string): Promise<void> {
  const res = await fetch(`${API_BASE}/workers/${workerId}`, {
    method: 'DELETE'
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || 'Failed to remove worker');
}
