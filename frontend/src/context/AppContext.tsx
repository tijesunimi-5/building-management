'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { RoleType, Property, ServiceRequest, Project, WorkerInfo, AppNotification, PhotoCategory } from '../types';
import { INITIAL_PROPERTIES, INITIAL_REQUESTS, INITIAL_PROJECTS, INITIAL_WORKERS, INITIAL_NOTIFICATIONS } from '../data/mockData';

interface AppContextType {
  currentRole: RoleType;
  setCurrentRole: (role: RoleType) => void;
  properties: Property[];
  requests: ServiceRequest[];
  projects: Project[];
  workers: WorkerInfo[];
  notifications: AppNotification[];
  selectedProjectId: string;
  setSelectedProjectId: (id: string) => void;
  
  // Actions
  submitServiceRequest: (requestData: Omit<ServiceRequest, 'id' | 'referenceNumber' | 'createdAt' | 'status'>) => ServiceRequest;
  convertRequestToProject: (requestId: string, workerId: string, priority: 'Low' | 'Medium' | 'High' | 'Urgent', observations: string, tasks: string[]) => Project;
  toggleTaskCompletion: (projectId: string, taskId: string) => void;
  uploadPhotoEvidence: (projectId: string, category: PhotoCategory, description: string, url: string) => void;
  addTimelineEvent: (projectId: string, title: string, description: string, photoUrl?: string) => void;
  updateProjectStatus: (projectId: string, newStatus: Project['status']) => void;
  markNotificationRead: (notificationId: string) => void;
  
  // Worker Management Actions
  addWorker: (workerData: Omit<WorkerInfo, 'id' | 'status'>) => WorkerInfo;
  removeWorker: (workerId: string) => void;

  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<RoleType>('public');
  const [properties, setProperties] = useState<Property[]>(INITIAL_PROPERTIES);
  const [requests, setRequests] = useState<ServiceRequest[]>(INITIAL_REQUESTS);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [workers, setWorkers] = useState<WorkerInfo[]>(INITIAL_WORKERS);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('proj-501');

  // Submit service request
  const submitServiceRequest = (requestData: Omit<ServiceRequest, 'id' | 'referenceNumber' | 'createdAt' | 'status'>) => {
    const refNum = `REQ-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newReq: ServiceRequest = {
      ...requestData,
      id: `req-${Date.now()}`,
      referenceNumber: refNum,
      status: 'Awaiting Review',
      createdAt: new Date().toISOString()
    };
    
    setRequests(prev => [newReq, ...prev]);

    // Push notification to Admin
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: 'New Service Request Submitted',
      message: `${requestData.clientName} requested ${requestData.serviceCategory} for ${requestData.propertyName} (${refNum}).`,
      timestamp: 'Just now',
      isRead: false,
      roleTarget: 'admin'
    };
    setNotifications(prev => [newNotif, ...prev]);

    return newReq;
  };

  // Convert request to project
  const convertRequestToProject = (
    requestId: string,
    workerId: string,
    priority: 'Low' | 'Medium' | 'High' | 'Urgent',
    observations: string,
    taskList: string[]
  ) => {
    const targetReq = requests.find(r => r.id === requestId);
    const worker = workers.find(w => w.id === workerId);
    if (!targetReq) throw new Error("Request not found");

    // Update request status
    setRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'Approved' } : r));

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

    const newProject: Project = {
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

    setProjects(prev => [newProject, ...prev]);
    setSelectedProjectId(newProjId);

    // Update worker status
    if (worker) {
      setWorkers(prev => prev.map(w => w.id === worker.id ? { ...w, status: 'On Job', activeJobId: newProjId } : w));
    }

    // Notify Client
    const clientNotif: AppNotification = {
      id: `notif-${Date.now()}-c`,
      title: 'Project Scheduled',
      message: `Your request (${targetReq.referenceNumber}) has been approved and assigned to ${worker?.name}.`,
      timestamp: 'Just now',
      isRead: false,
      projectId: newProjId,
      roleTarget: 'client'
    };
    setNotifications(prev => [clientNotif, ...prev]);

    return newProject;
  };

  // Toggle task completion percentage
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

  // Upload photo evidence
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

  // Add timeline entry
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

  // Update status
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

  // Worker Management Actions (Admin)
  const addWorker = (workerData: Omit<WorkerInfo, 'id' | 'status'>) => {
    const newWorker: WorkerInfo = {
      ...workerData,
      id: `worker-${Date.now()}`,
      status: 'Available'
    };
    setWorkers(prev => [...prev, newWorker]);
    return newWorker;
  };

  const removeWorker = (workerId: string) => {
    setWorkers(prev => prev.filter(w => w.id !== workerId));
    // Unassign worker from active projects if removed
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
      properties,
      requests,
      projects,
      workers,
      notifications,
      selectedProjectId,
      setSelectedProjectId,
      submitServiceRequest,
      convertRequestToProject,
      toggleTaskCompletion,
      uploadPhotoEvidence,
      addTimelineEvent,
      updateProjectStatus,
      markNotificationRead,
      addWorker,
      removeWorker,
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
