'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { RoleType, Property, ServiceRequest, Project, WorkerInfo, AppNotification, PhotoCategory, UserProfile, TaskItem } from '../types';
import { INITIAL_PROPERTIES, INITIAL_REQUESTS, INITIAL_PROJECTS, INITIAL_WORKERS, INITIAL_NOTIFICATIONS } from '../data/mockData';
import {
  fetchPropertiesFromApi,
  fetchRequestsFromApi,
  createRequestApi,
  fetchProjectsFromApi,
  triageProjectApi,
  fetchWorkersFromApi,
  addWorkerApi,
  removeWorkerApi,
  updateUserProfileApi,
  fetchUserProfileApi
} from '../lib/api';

const DEFAULT_CLIENT_USER: UserProfile = {
  id: 'user-client-1',
  name: 'Client User',
  email: 'client@example.ca',
  phone: '+1 (416) 555-0192',
  role: 'client',
  roleTitle: 'Homeowner / Client',
  primaryAddress: '142 Yorkville Avenue, Toronto, ON',
  emergencyContact: '',
  preferredContactMethod: 'Email'
};

interface AppContextType {
  currentRole: RoleType;
  setCurrentRole: (role: RoleType) => void;
  currentUser: UserProfile | null;
  setCurrentUser: (user: UserProfile | null) => void;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
  properties: Property[];
  requests: ServiceRequest[];
  projects: Project[];
  workers: WorkerInfo[];
  notifications: AppNotification[];
  selectedProjectId: string;
  setSelectedProjectId: (id: string) => void;
  isLoadingApi: boolean;
  
  // Isolated Client Specific Data
  userProperties: Property[];
  userRequests: ServiceRequest[];
  userProjects: Project[];

  // Property Actions
  updatePropertyImage: (propertyId: string, imageUrl: string) => void;
  addPropertyNote: (propertyId: string, content: string, imageUrl?: string) => void;

  // Client Task Approval Actions
  addClientProjectTask: (projectId: string, title: string, photoUrl?: string) => void;
  approveClientProjectTask: (projectId: string, taskId: string) => void;
  declineClientProjectTask: (projectId: string, taskId: string, reason?: string) => void;

  // Legal Archiving & Pending Cancellation Actions
  cancelPendingRequest: (requestId: string) => void;
  disableProperty: (propertyId: string) => void;
  restoreProperty: (propertyId: string) => void;
  disableProject: (projectId: string) => void;
  restoreProject: (projectId: string) => void;
  deletePendingTask: (projectId: string, taskId: string) => void;
  disableTask: (projectId: string, taskId: string) => void;
  restoreTask: (projectId: string, taskId: string) => void;

  // Actions
  submitServiceRequest: (requestData: Omit<ServiceRequest, 'id' | 'referenceNumber' | 'createdAt' | 'status'>) => Promise<ServiceRequest>;
  convertRequestToProject: (requestId: string, workerId: string, priority: 'Low' | 'Medium' | 'High' | 'Urgent', observations: string, tasks: string[]) => Promise<Project>;
  toggleTaskCompletion: (projectId: string, taskId: string) => void;
  uploadPhotoEvidence: (projectId: string, category: PhotoCategory, description: string, url: string) => void;
  addTimelineEvent: (projectId: string, title: string, description: string, photoUrl?: string) => void;
  updateProjectStatus: (projectId: string, newStatus: Project['status']) => void;
  markNotificationRead: (notificationId: string) => void;
  
  // Worker Management Actions
  addWorker: (workerData: Omit<WorkerInfo, 'id' | 'status'>) => Promise<WorkerInfo>;
  removeWorker: (workerId: string) => Promise<void>;

  refreshData: () => Promise<void>;
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<RoleType>('public');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  // Load persisted user profile from localStorage if available, and verify with API
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('ojutu_current_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        setCurrentUser(parsed);
        if (parsed.role) setCurrentRole(parsed.role);

        // Fetch fresh profile from PostgreSQL DB backend
        if (parsed.id || parsed.email) {
          fetchUserProfileApi(parsed.id || parsed.email).then(freshUser => {
            if (freshUser) {
              setCurrentUser(freshUser);
              localStorage.setItem('ojutu_current_user', JSON.stringify(freshUser));
            }
          });
        }
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  const updateUserProfile = async (updates: Partial<UserProfile>): Promise<void> => {
    let targetId = 'user-client-1';

    setCurrentUser(prev => {
      const updated = prev ? { ...prev, ...updates } : { ...DEFAULT_CLIENT_USER, ...updates };
      targetId = updated.id || updated.email || targetId;
      try {
        localStorage.setItem('ojutu_current_user', JSON.stringify(updated));
      } catch {
        // Ignore localStorage error
      }
      return updated;
    });

    try {
      const persisted = await updateUserProfileApi(targetId, updates);
      if (persisted) {
        setCurrentUser(persisted);
        localStorage.setItem('ojutu_current_user', JSON.stringify(persisted));
      }
    } catch (err) {
      console.warn('Profile DB persistence warning:', err);
    }
  };

  const handleSetCurrentUser = (user: UserProfile | null) => {
    setCurrentUser(user);
    try {
      if (user) {
        localStorage.setItem('ojutu_current_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('ojutu_current_user');
      }
    } catch {
      // Ignore
    }
  };
  const [properties, setProperties] = useState<Property[]>([]);
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [workers, setWorkers] = useState<WorkerInfo[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [isLoadingApi, setIsLoadingApi] = useState<boolean>(true);

  // Fetch initial live data from backend REST API
  const refreshData = async () => {
    setIsLoadingApi(true);
    try {
      const [propsData, reqsData, projsData, wrksData] = await Promise.allSettled([
        fetchPropertiesFromApi(),
        fetchRequestsFromApi(),
        fetchProjectsFromApi(),
        fetchWorkersFromApi()
      ]);

      if (propsData.status === 'fulfilled') setProperties(propsData.value);
      if (reqsData.status === 'fulfilled') setRequests(reqsData.value);
      if (projsData.status === 'fulfilled') {
        setProjects(projsData.value);
        if (projsData.value.length > 0) setSelectedProjectId(projsData.value[0].id);
      }
      if (wrksData.status === 'fulfilled') setWorkers(wrksData.value);
    } catch (err) {
      console.warn('Error fetching live backend data:', err);
    } finally {
      setIsLoadingApi(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // User specific data filtering for Client Portal
  const userProperties = React.useMemo(() => {
    if (!currentUser) return [];
    const cName = currentUser.name?.toLowerCase().trim();
    const cEmail = currentUser.email?.toLowerCase().trim();

    return properties.filter(p => {
      const pName = p.clientName?.toLowerCase().trim();
      const pEmail = p.clientEmail?.toLowerCase().trim();
      return (cEmail && pEmail && cEmail === pEmail) || (cName && pName && cName === pName);
    });
  }, [properties, currentUser]);

  const userRequests = React.useMemo(() => {
    if (!currentUser) return [];
    const cName = currentUser.name?.toLowerCase().trim();
    return requests.filter(r => {
      const rName = r.clientName?.toLowerCase().trim();
      return (cName && rName && cName === rName) || userProperties.some(p => p.id === r.propertyId);
    });
  }, [requests, currentUser, userProperties]);

  const userProjects = React.useMemo(() => {
    if (!currentUser) return [];
    const cName = currentUser.name?.toLowerCase().trim();
    return projects.filter(p => {
      const pName = p.clientName?.toLowerCase().trim();
      return (cName && pName && cName === pName) || userProperties.some(prop => prop.id === p.propertyId);
    });
  }, [projects, currentUser, userProperties]);

  // Submit service request connected to API
  const submitServiceRequest = async (requestData: Omit<ServiceRequest, 'id' | 'referenceNumber' | 'createdAt' | 'status'>): Promise<ServiceRequest> => {
    const clientName = requestData.clientName || currentUser?.name || 'Client User';
    const clientEmail = (currentUser?.email && currentUser.email !== 'client@example.ca')
      ? currentUser.email
      : `${clientName.toLowerCase().replace(/\s+/g, '.')}@client.ca`;

    // 1. Ensure currentUser account is set up with client details
    const newProfile: UserProfile = {
      id: currentUser?.id || `user-${Date.now()}`,
      name: clientName,
      email: clientEmail,
      phone: currentUser?.phone || '+1 (416) 555-0192',
      role: 'client',
      roleTitle: 'Homeowner / Client',
      primaryAddress: requestData.propertyAddress || 'Toronto, ON',
      preferredContactMethod: 'Email'
    };

    setCurrentUser(newProfile);
    setCurrentRole('client');
    try {
      localStorage.setItem('ojutu_current_user', JSON.stringify(newProfile));
    } catch {}

    // 2. Ensure Property exists for client
    let propertyId: string = requestData.propertyId || `prop-${Date.now()}`;
    const existingProp = properties.find(p =>
      (p.name && requestData.propertyName && p.name.toLowerCase() === requestData.propertyName.toLowerCase()) ||
      (p.address && requestData.propertyAddress && p.address.toLowerCase() === requestData.propertyAddress.toLowerCase())
    );

    if (!existingProp) {
      propertyId = `prop-${Date.now()}`;
      const newProp: Property = {
        id: propertyId,
        name: requestData.propertyName || 'Client Property',
        address: requestData.propertyAddress || 'Toronto, ON',
        city: 'Toronto',
        province: 'ON',
        postalCode: 'M5R 1C2',
        propertyType: 'Single Family Home',
        clientName: clientName,
        clientEmail: clientEmail,
        clientPhone: newProfile.phone || '+1 (416) 555-0192',
        imageUrl: requestData.photoUrls?.[0] || '/assets/hero_property_main_1786614552025.jpg',
        activeProjectsCount: 1,
        completedProjectsCount: 0
      };
      setProperties(prev => [newProp, ...prev]);
    } else {
      propertyId = existingProp.id;
    }

    let newReq: ServiceRequest;
    try {
      newReq = await createRequestApi({
        propertyId,
        propertyName: requestData.propertyName,
        propertyAddress: requestData.propertyAddress,
        clientName: clientName,
        serviceCategory: requestData.serviceCategory,
        description: requestData.description,
        preferredDate: requestData.preferredDate,
        urgency: requestData.urgency,
        additionalNotes: requestData.additionalNotes,
        photoUrls: requestData.photoUrls
      });
    } catch (err) {
      console.warn('API request failed, submitting locally:', err);
      const refNum = `REQ-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      newReq = {
        ...requestData,
        propertyId,
        clientName,
        id: `req-${Date.now()}`,
        referenceNumber: refNum,
        status: 'Awaiting Review',
        createdAt: new Date().toISOString()
      };
    }

    setRequests(prev => [newReq, ...prev]);

    // Push notifications to both Admin and Client
    const adminNotif: AppNotification = {
      id: `notif-${Date.now()}-a`,
      title: 'New Service Request Submitted',
      message: `${clientName} requested ${requestData.serviceCategory} for ${requestData.propertyName} (${newReq.referenceNumber}).`,
      timestamp: 'Just now',
      isRead: false,
      roleTarget: 'admin'
    };
    const clientNotif: AppNotification = {
      id: `notif-${Date.now()}-c`,
      title: 'Service Request Received',
      message: `Your request for ${requestData.propertyName} (${newReq.referenceNumber}) has been submitted and is under review.`,
      timestamp: 'Just now',
      isRead: false,
      roleTarget: 'client'
    };
    setNotifications(prev => [adminNotif, clientNotif, ...prev]);

    return newReq;
  };

  const updatePropertyImage = (propertyId: string, imageUrl: string) => {
    setProperties(prev => prev.map(p => p.id === propertyId ? { ...p, imageUrl } : p));
  };

  const addPropertyNote = (propertyId: string, content: string, imageUrl?: string) => {
    const newNote = {
      id: `note-${Date.now()}`,
      authorName: currentUser?.name || (currentRole === 'client' ? 'Client' : 'Ojutu Admin'),
      authorRole: (currentRole === 'admin' ? 'Company Admin' : (currentRole === 'worker' ? 'Worker Technician' : 'Client')) as any,
      content,
      imageUrl,
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    };

    setProperties(prev => prev.map(p => {
      if (p.id !== propertyId) return p;
      return {
        ...p,
        notes: [newNote, ...(p.notes || [])]
      };
    }));
  };

  const addClientProjectTask = (projectId: string, title: string, photoUrl?: string) => {
    const targetProj = projects.find(p => p.id === projectId);
    const newTask: TaskItem = {
      id: `task-${Date.now()}`,
      title,
      isCompleted: false,
      status: 'Pending Admin Review',
      requestedBy: currentUser?.name || 'Client',
      photoUrl
    };

    setProjects(prev => prev.map(proj => {
      if (proj.id !== projectId) return proj;
      return {
        ...proj,
        tasks: [...proj.tasks, newTask]
      };
    }));

    addTimelineEvent(
      projectId,
      'Client Requested Additional Task',
      `"${title}" (Awaiting Admin Review)`,
      photoUrl
    );

    const adminNotif: AppNotification = {
      id: `notif-${Date.now()}-a`,
      title: 'New Client Task Request',
      message: `${currentUser?.name || 'Client'} requested additional task for ${targetProj?.referenceNumber || 'project'}: "${title}". Please review & approve.`,
      timestamp: 'Just now',
      isRead: false,
      projectId,
      roleTarget: 'admin'
    };
    setNotifications(prev => [adminNotif, ...prev]);
  };

  const approveClientProjectTask = (projectId: string, taskId: string) => {
    const targetProj = projects.find(p => p.id === projectId);
    const targetTask = targetProj?.tasks.find(t => t.id === taskId);
    if (!targetTask) return;

    setProjects(prev => prev.map(proj => {
      if (proj.id !== projectId) return proj;

      const updatedTasks = proj.tasks.map(t => {
        if (t.id !== taskId) return t;
        return {
          ...t,
          status: 'Approved' as const
        };
      });

      let updatedPhotos = proj.photos;
      if (targetTask.photoUrl && !proj.photos.some(p => p.url === targetTask.photoUrl)) {
        const now = new Date();
        const formattedDate = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        const formattedTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        updatedPhotos = [
          {
            id: `photo-task-${Date.now()}`,
            url: targetTask.photoUrl,
            category: 'Before',
            description: `Client task photo: ${targetTask.title}`,
            uploadedBy: targetTask.requestedBy || 'Client',
            timestamp: `${formattedDate} — ${formattedTime}`
          },
          ...proj.photos
        ];
      }

      return {
        ...proj,
        tasks: updatedTasks,
        photos: updatedPhotos
      };
    }));

    addTimelineEvent(
      projectId,
      'Task Request Approved by Admin',
      `"${targetTask.title}" approved and assigned to ${targetProj?.workerName || 'Staff Technician'}.`,
      targetTask.photoUrl
    );

    const clientNotif: AppNotification = {
      id: `notif-${Date.now()}-c`,
      title: 'Task Request Approved',
      message: `Your requested task "${targetTask.title}" was approved by Admin and passed down to field staff.`,
      timestamp: 'Just now',
      isRead: false,
      projectId,
      roleTarget: 'client'
    };

    const workerNotif: AppNotification = {
      id: `notif-${Date.now()}-w`,
      title: 'New Approved Task Added',
      message: `A new approved task "${targetTask.title}" was added to your job checklist for ${targetProj?.propertyName || 'project'}.`,
      timestamp: 'Just now',
      isRead: false,
      projectId,
      roleTarget: 'worker'
    };

    setNotifications(prev => [clientNotif, workerNotif, ...prev]);
  };

  const declineClientProjectTask = (projectId: string, taskId: string, reason?: string) => {
    const targetProj = projects.find(p => p.id === projectId);
    const targetTask = targetProj?.tasks.find(t => t.id === taskId);
    if (!targetTask) return;

    setProjects(prev => prev.map(proj => {
      if (proj.id !== projectId) return proj;
      return {
        ...proj,
        tasks: proj.tasks.map(t => t.id === taskId ? { ...t, status: 'Declined' as const, adminNote: reason } : t)
      };
    }));

    addTimelineEvent(
      projectId,
      'Task Request Declined by Admin',
      `"${targetTask.title}" was declined. ${reason ? `Reason: ${reason}` : ''}`
    );

    const clientNotif: AppNotification = {
      id: `notif-${Date.now()}-c`,
      title: 'Task Request Declined',
      message: `Your requested task "${targetTask.title}" was declined by Admin. ${reason ? `Note: ${reason}` : ''}`,
      timestamp: 'Just now',
      isRead: false,
      projectId,
      roleTarget: 'client'
    };
    setNotifications(prev => [clientNotif, ...prev]);
  };

  const cancelPendingRequest = (requestId: string) => {
    const targetReq = requests.find(r => r.id === requestId);
    if (!targetReq) return;
    
    setRequests(prev => prev.filter(r => r.id !== requestId));

    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: 'Pending Request Cancelled',
      message: `Pending request ${targetReq.referenceNumber} (${targetReq.serviceCategory}) has been cancelled and permanently removed.`,
      timestamp: 'Just now',
      isRead: false,
      roleTarget: 'client'
    };
    setNotifications(prev => [notif, ...prev]);
  };

  const disableProperty = (propertyId: string) => {
    if (currentRole === 'worker') return;

    const nowStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    
    setProperties(prev => prev.map(p => {
      if (p.id !== propertyId) return p;
      return {
        ...p,
        isDisabled: true,
        disabledAt: nowStr,
        disabledBy: currentUser?.name || (currentRole === 'admin' ? 'Company Admin' : 'Client')
      };
    }));

    setProjects(prev => prev.map(proj => {
      if (proj.propertyId !== propertyId) return proj;
      return {
        ...proj,
        isDisabled: true,
        disabledAt: nowStr,
        disabledBy: currentUser?.name || 'Client'
      };
    }));

    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: 'Property Deactivated & Archived',
      message: `Property record archived for legal compliance. Hidden from active views.`,
      timestamp: 'Just now',
      isRead: false,
      roleTarget: 'client'
    };
    setNotifications(prev => [notif, ...prev]);
  };

  const restoreProperty = (propertyId: string) => {
    if (currentRole === 'worker') return;

    setProperties(prev => prev.map(p => {
      if (p.id !== propertyId) return p;
      return {
        ...p,
        isDisabled: false,
        disabledAt: undefined,
        disabledBy: undefined
      };
    }));

    setProjects(prev => prev.map(proj => {
      if (proj.propertyId !== propertyId) return proj;
      return {
        ...proj,
        isDisabled: false
      };
    }));
  };

  const disableProject = (projectId: string) => {
    if (currentRole === 'worker') return;

    const nowStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    setProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;
      return {
        ...p,
        isDisabled: true,
        disabledAt: nowStr,
        disabledBy: currentUser?.name || (currentRole === 'admin' ? 'Company Admin' : 'Client')
      };
    }));
  };

  const restoreProject = (projectId: string) => {
    if (currentRole === 'worker') return;

    setProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;
      return {
        ...p,
        isDisabled: false
      };
    }));
  };

  const deletePendingTask = (projectId: string, taskId: string) => {
    setProjects(prev => prev.map(proj => {
      if (proj.id !== projectId) return proj;
      return {
        ...proj,
        tasks: proj.tasks.filter(t => t.id !== taskId)
      };
    }));
  };

  const disableTask = (projectId: string, taskId: string) => {
    if (currentRole === 'worker') return;

    setProjects(prev => prev.map(proj => {
      if (proj.id !== projectId) return proj;
      return {
        ...proj,
        tasks: proj.tasks.map(t => t.id === taskId ? { ...t, isDisabled: true } : t)
      };
    }));
  };

  const restoreTask = (projectId: string, taskId: string) => {
    if (currentRole === 'worker') return;

    setProjects(prev => prev.map(proj => {
      if (proj.id !== projectId) return proj;
      return {
        ...proj,
        tasks: proj.tasks.map(t => t.id === taskId ? { ...t, isDisabled: false } : t)
      };
    }));
  };

  // Convert request to project connected to API
  const convertRequestToProject = async (
    requestId: string,
    workerId: string,
    priority: 'Low' | 'Medium' | 'High' | 'Urgent',
    observations: string,
    taskList: string[]
  ): Promise<Project> => {
    let newProject: Project;
    const targetReq = requests.find(r => r.id === requestId);
    const worker = workers.find(w => w.id === workerId);

    try {
      newProject = await triageProjectApi({
        requestId,
        workerId,
        priority,
        adminObservations: observations,
        tasks: taskList
      });
    } catch (err) {
      console.warn('Triage API call failed, creating project locally:', err);
      if (!targetReq) throw new Error("Request not found");

      const projRef = `PRJ-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const newProjId = `proj-${Date.now()}`;
      const newTasks = taskList.map((t, idx) => ({
        id: `task-${Date.now()}-${idx}`,
        title: t,
        isCompleted: false
      }));

      const now = new Date();
      const formattedDate = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      const formattedTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

      newProject = {
        id: newProjId,
        title: `${targetReq.propertyName} — ${targetReq.serviceCategory} Maintenance`,
        referenceNumber: projRef,
        propertyId: targetReq.propertyId,
        propertyName: targetReq.propertyName,
        propertyAddress: targetReq.propertyAddress,
        clientName: targetReq.clientName,
        serviceCategory: targetReq.serviceCategory,
        status: 'Scheduled',
        priority,
        workerId: worker?.id,
        workerName: worker?.name,
        workerPhone: worker?.phone,
        workerAvatar: worker?.avatarUrl,
        clientRequestSummary: targetReq.description,
        adminObservations: observations,
        scheduledDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        expectedCompletionDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
        latitude: 43.6702,
        longitude: -79.3897,
        tasks: newTasks,
        photos: targetReq.photoUrls.map((url, i) => ({
          id: `photo-req-${i}`,
          url,
          category: 'Before',
          description: 'Client submitted request photo.',
          uploadedBy: targetReq.clientName,
          timestamp: `${formattedDate} — ${formattedTime}`
        })),
        timeline: [
          {
            id: `t-req-${Date.now()}`,
            date: formattedDate,
            time: formattedTime,
            title: 'Service Request Submitted',
            description: targetReq.description,
            authorName: targetReq.clientName,
            authorRole: 'Client',
            iconType: 'request'
          },
          {
            id: `t-proj-${Date.now()}`,
            date: formattedDate,
            time: formattedTime,
            title: 'Project Created & Assigned',
            description: `Converted to project (${projRef}). Assigned to ${worker?.name || 'Technician'}.`,
            authorName: 'Ojutu Admin',
            authorRole: 'Company Admin',
            iconType: 'project'
          }
        ]
      };
    }

    setRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'Approved' } : r));
    setProjects(prev => [newProject, ...prev]);
    setSelectedProjectId(newProject.id);

    if (worker) {
      setWorkers(prev => prev.map(w => w.id === worker.id ? { ...w, status: 'On Job', activeJobId: newProject.id } : w));
    }

    const clientNotif: AppNotification = {
      id: `notif-${Date.now()}-c`,
      title: 'Project Scheduled',
      message: `Your request has been approved and assigned to ${worker?.name || 'Technician'}.`,
      timestamp: 'Just now',
      isRead: false,
      projectId: newProject.id,
      roleTarget: 'client'
    };
    setNotifications(prev => [clientNotif, ...prev]);

    return newProject;
  };

  const toggleTaskCompletion = (projectId: string, taskId: string) => {
    setProjects(prev => prev.map(proj => {
      if (proj.id !== projectId) return proj;
      
      const updatedTasks = proj.tasks.map(t => {
        if (t.id !== taskId) return t;
        const now = new Date();
        const formattedTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        return {
          ...t,
          isCompleted: !t.isCompleted,
          completedAt: !t.isCompleted ? formattedTime : undefined
        };
      });

      const completedCount = updatedTasks.filter(t => t.isCompleted).length;
      const totalCount = updatedTasks.length;
      const allDone = completedCount === totalCount && totalCount > 0;

      return {
        ...proj,
        tasks: updatedTasks,
        status: allDone ? 'Completed' : (proj.status === 'Scheduled' ? 'In Progress' : proj.status)
      };
    }));
  };

  const uploadPhotoEvidence = (projectId: string, category: PhotoCategory, description: string, url: string) => {
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const formattedTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    
    const newPhoto = {
      id: `photo-${Date.now()}`,
      url,
      category,
      description,
      uploadedBy: currentRole === 'worker' ? 'Michael Carter (Technician)' : 'Ojutu Staff',
      timestamp: `${formattedDate} — ${formattedTime}`
    };

    setProjects(prev => prev.map(proj => {
      if (proj.id !== projectId) return proj;
      return {
        ...proj,
        photos: [newPhoto, ...proj.photos]
      };
    }));

    addTimelineEvent(
      projectId,
      `New ${category} Photo Uploaded`,
      description,
      url
    );
  };

  const addTimelineEvent = (projectId: string, title: string, description: string, photoUrl?: string) => {
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const formattedTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const newTimelineItem = {
      id: `time-${Date.now()}`,
      date: formattedDate,
      time: formattedTime,
      title,
      description,
      authorName: currentRole === 'worker' ? 'Michael Carter' : (currentRole === 'admin' ? 'Ojutu Admin' : 'Michael Thompson'),
      authorRole: (currentRole === 'worker' ? 'Worker Technician' : (currentRole === 'admin' ? 'Company Admin' : 'Client')) as any,
      photoUrl,
      iconType: 'progress' as const
    };

    setProjects(prev => prev.map(proj => {
      if (proj.id !== projectId) return proj;
      return {
        ...proj,
        timeline: [...proj.timeline, newTimelineItem]
      };
    }));

    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: title,
      message: `${description} for project`,
      timestamp: 'Just now',
      isRead: false,
      projectId,
      roleTarget: 'client'
    };
    setNotifications(prev => [notif, ...prev]);
  };

  const updateProjectStatus = (projectId: string, newStatus: Project['status']) => {
    setProjects(prev => prev.map(proj => {
      if (proj.id !== projectId) return proj;

      const now = new Date();
      const formattedDate = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      const formattedTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

      let title = `Project Status Changed to ${newStatus}`;
      let description = `Project marked as ${newStatus}.`;

      if (newStatus === 'In Progress') {
        title = 'Work Started';
        description = 'Technician arrived on site and commenced work.';
      } else if (newStatus === 'Completed') {
        title = 'Work Completed & Verified';
        description = 'All tasks have been finished and final quality checks passed.';
      }

      const timelineEvent = {
        id: `status-event-${Date.now()}`,
        date: formattedDate,
        time: formattedTime,
        title,
        description,
        authorName: currentRole === 'worker' ? 'Michael Carter' : 'Ojutu Admin',
        authorRole: (currentRole === 'worker' ? 'Worker Technician' : 'Company Admin') as any,
        iconType: (newStatus === 'Completed' ? 'completion' : 'work') as any
      };

      return {
        ...proj,
        status: newStatus,
        timeline: [...proj.timeline, timelineEvent]
      };
    }));
  };

  const markNotificationRead = (notificationId: string) => {
    setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n));
  };

  // Worker Management Actions connected to API
  const addWorker = async (workerData: Omit<WorkerInfo, 'id' | 'status'>): Promise<WorkerInfo> => {
    let newWorker: WorkerInfo;
    try {
      newWorker = await addWorkerApi({
        name: workerData.name,
        roleTitle: workerData.roleTitle,
        phone: workerData.phone,
        email: workerData.email,
        avatarUrl: workerData.avatarUrl
      });
    } catch (err) {
      console.warn('API addWorker failed, adding locally:', err);
      newWorker = {
        ...workerData,
        id: `worker-${Date.now()}`,
        status: 'Available'
      };
    }

    setWorkers(prev => [...prev, newWorker]);
    return newWorker;
  };

  const removeWorker = async (workerId: string): Promise<void> => {
    try {
      await removeWorkerApi(workerId);
    } catch (err) {
      console.warn('API removeWorker failed, removing locally:', err);
    }

    setWorkers(prev => prev.filter(w => w.id !== workerId));
    setProjects(prev => prev.map(p => p.workerId === workerId ? { ...p, workerId: undefined, workerName: 'Unassigned' } : p));
  };

  const resetDemoData = () => {
    setProperties(INITIAL_PROPERTIES);
    setRequests(INITIAL_REQUESTS);
    setProjects(INITIAL_PROJECTS);
    setWorkers(INITIAL_WORKERS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setSelectedProjectId('proj-501');
  };

  return (
    <AppContext.Provider value={{
      currentRole,
      setCurrentRole,
      currentUser,
      setCurrentUser: handleSetCurrentUser,
      updateUserProfile,
      properties,
      requests,
      projects,
      userProperties,
      userRequests,
      userProjects,
      workers,
      notifications,
      selectedProjectId,
      setSelectedProjectId,
      isLoadingApi,
      updatePropertyImage,
      addPropertyNote,
      addClientProjectTask,
      approveClientProjectTask,
      declineClientProjectTask,
      cancelPendingRequest,
      disableProperty,
      restoreProperty,
      disableProject,
      restoreProject,
      deletePendingTask,
      disableTask,
      restoreTask,
      submitServiceRequest,
      convertRequestToProject,
      toggleTaskCompletion,
      uploadPhotoEvidence,
      addTimelineEvent,
      updateProjectStatus,
      markNotificationRead,
      addWorker,
      removeWorker,
      refreshData,
      resetDemoData
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within an AppProvider");
  return context;
};
