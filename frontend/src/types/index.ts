export type RoleType = 'public' | 'client' | 'admin' | 'worker';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: RoleType;
  roleTitle?: string;
  avatarUrl?: string;
  primaryAddress?: string;
  emergencyContact?: string;
  preferredContactMethod?: 'Email' | 'Phone' | 'SMS';
}

export type PropertyType = 'Single Family Home' | 'Townhouse' | 'Condo / Apartment' | 'Commercial Property';

export type RequestStatus = 'Awaiting Review' | 'Under Review' | 'Approved' | 'Declined' | 'Completed';

export type ProjectStatus = 'Scheduled' | 'In Progress' | 'Paused' | 'Completed' | 'Cancelled';

export type PriorityLevel = 'Low' | 'Medium' | 'High' | 'Urgent';

export type PhotoCategory = 'Before' | 'During' | 'After';

export interface PropertyNote {
  id: string;
  authorName: string;
  authorRole: 'Client' | 'Company Admin' | 'Worker Technician';
  content: string;
  imageUrl?: string;
  createdAt: string;
}

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
  notes?: PropertyNote[];
  isDisabled?: boolean;
  disabledAt?: string;
  disabledBy?: string;
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
  urgency?: PriorityLevel;
  additionalNotes?: string;
  photoUrls: string[];
  status: RequestStatus;
  createdAt: string;
  isDisabled?: boolean;
}

export interface TaskItem {
  id: string;
  title: string;
  isCompleted: boolean;
  completedAt?: string;
  status?: 'Pending Admin Review' | 'Approved' | 'Declined';
  requestedBy?: string;
  photoUrl?: string;
  adminNote?: string;
  isDisabled?: boolean;
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
  isDisabled?: boolean;
  disabledAt?: string;
  disabledBy?: string;
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

export interface ChatParticipant {
  userId: string;
  name: string;
  role: 'client' | 'admin' | 'worker';
  roleTitle?: string;
  avatarUrl?: string;
}

export interface ChatMessage {
  id: string;
  threadId: string;
  senderId: string;
  senderName: string;
  senderRole: 'client' | 'admin' | 'worker';
  content: string;
  attachmentUrls?: string[];
  createdAt: string;
}

export interface ChatThread {
  id: string;
  title: string;
  projectId?: string;
  propertyName?: string;
  clientId?: string;
  clientName: string;
  participants: ChatParticipant[];
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
  createdAt: string;
}
