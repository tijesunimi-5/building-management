'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { RoleType, Property, ServiceRequest, Project, WorkerInfo, AppNotification, PhotoCategory, UserProfile } from '../types';
import { INITIAL_PROPERTIES, INITIAL_REQUESTS, INITIAL_PROJECTS, INITIAL_WORKERS, INITIAL_NOTIFICATIONS } from '../data/mockData';
import {
  fetchPropertiesFromApi,
  fetchRequestsFromApi,
  createRequestApi,
  fetchProjectsFromApi,
  triageProjectApi,
  fetchWorkersFromApi,
  addWorkerApi,
  removeWorkerApi
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
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  properties: Property[];
  requests: ServiceRequest[];
  projects: Project[];
  workers: WorkerInfo[];
  notifications: AppNotification[];
  selectedProjectId: string;
  setSelectedProjectId: (id: string) => void;
  isLoadingApi: boolean;
  
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
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(DEFAULT_CLIENT_USER);

  // Load persisted user profile from localStorage if available
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('apexcare_current_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        setCurrentUser(parsed);
        if (parsed.role) setCurrentRole(parsed.role);
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setCurrentUser(prev => {
      const updated = prev ? { ...prev, ...updates } : { ...DEFAULT_CLIENT_USER, ...updates };
      try {
        localStorage.setItem('apexcare_current_user', JSON.stringify(updated));
      } catch {
        // Ignore localStorage error
      }
      return updated;
    });
  };

  const handleSetCurrentUser = (user: UserProfile | null) => {
    setCurrentUser(user);
    try {
      if (user) {
        localStorage.setItem('apexcare_current_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('apexcare_current_user');
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

  // Submit service request connected to API
  const submitServiceRequest = async (requestData: Omit<ServiceRequest, 'id' | 'referenceNumber' | 'createdAt' | 'status'>): Promise<ServiceRequest> => {
    let newReq: ServiceRequest;
    try {
      newReq = await createRequestApi({
        propertyId: requestData.propertyId,
        propertyName: requestData.propertyName,
        propertyAddress: requestData.propertyAddress,
        clientName: requestData.clientName,
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
        id: `req-${Date.now()}`,
        referenceNumber: refNum,
        status: 'Awaiting Review',
        createdAt: new Date().toISOString()
      };
    }

    setRequests(prev => [newReq, ...prev]);

    // Push notification to Admin
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: 'New Service Request Submitted',
      message: `${requestData.clientName} requested ${requestData.serviceCategory} for ${requestData.propertyName} (${newReq.referenceNumber}).`,
      timestamp: 'Just now',
      isRead: false,
      roleTarget: 'admin'
    };
    setNotifications(prev => [newNotif, ...prev]);

    return newReq;
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
            authorName: 'ApexCare Admin',
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
      uploadedBy: currentRole === 'worker' ? 'Michael Carter (Technician)' : 'ApexCare Staff',
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
      authorName: currentRole === 'worker' ? 'Michael Carter' : (currentRole === 'admin' ? 'ApexCare Admin' : 'Michael Thompson'),
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
        authorName: currentRole === 'worker' ? 'Michael Carter' : 'ApexCare Admin',
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
      workers,
      notifications,
      selectedProjectId,
      setSelectedProjectId,
      isLoadingApi,
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
