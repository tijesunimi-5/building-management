export type RoleType = 'public' | 'client' | 'admin' | 'worker';

export type PropertyType = 'Single Family Home' | 'Townhouse' | 'Condo / Apartment' | 'Commercial Property';

export type RequestStatus = 'Awaiting Review' | 'Under Review' | 'Approved' | 'Declined' | 'Completed';

export type ProjectStatus = 'Scheduled' | 'In Progress' | 'Paused' | 'Completed' | 'Cancelled';

export type PriorityLevel = 'Low' | 'Medium' | 'High' | 'Urgent';

export type PhotoCategory = 'Before' | 'During' | 'After';

export interface Property {
  id: string;
  name: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  propertyType: PropertyType;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  imageUrl?: string;
  activeProjectsCount: number;
  completedProjectsCount: number;
}

export interface ServiceRequest {
  id: string;
  referenceNumber: string;
  propertyId: string;
  propertyName: string;
  propertyAddress: string;
  clientName: string;
  serviceCategory: string;
  description: string;
  preferredDate: string;
  additionalNotes?: string;
  photoUrls: string[];
  status: RequestStatus;
  createdAt: string;
}

export interface TaskItem {
  id: string;
  title: string;
  isCompleted: boolean;
  completedAt?: string;
}

export interface PhotoEvidence {
  id: string;
  url: string;
  category: PhotoCategory;
  description: string;
  uploadedBy: string;
  timestamp: string;
}

export interface TimelineEvent {
  id: string;
  date: string;
  time: string;
  title: string;
  description: string;
  authorName: string;
  authorRole: 'Client' | 'Company Admin' | 'Worker Technician';
  photoUrl?: string;
  iconType?: 'request' | 'project' | 'worker' | 'inspection' | 'work' | 'progress' | 'completion';
}

export interface Project {
  id: string;
  title: string;
  referenceNumber: string;
  propertyId: string;
  propertyName: string;
  propertyAddress: string;
  clientName: string;
  serviceCategory: string;
  status: ProjectStatus;
  priority: PriorityLevel;
  workerId?: string;
  workerName?: string;
  workerPhone?: string;
  workerAvatar?: string;
  clientRequestSummary: string;
  adminObservations?: string;
  additionalIssuesDiscovered?: string;
  scheduledDate: string;
  expectedCompletionDate: string;
  tasks: TaskItem[];
  photos: PhotoEvidence[];
  timeline: TimelineEvent[];
  latitude?: number;
  longitude?: number;
  workerCurrentLocation?: { lat: number; lng: number };
}

export interface WorkerInfo {
  id: string;
  name: string;
  roleTitle: string;
  phone: string;
  email: string;
  avatarUrl: string;
  status: 'Available' | 'On Job' | 'Off Duty';
  activeJobId?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  projectId?: string;
  roleTarget: 'client' | 'admin' | 'worker';
}
