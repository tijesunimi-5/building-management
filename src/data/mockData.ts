import { Property, ServiceRequest, Project, WorkerInfo, AppNotification } from '../types';

export const INITIAL_PROPERTIES: Property[] = [
  {
    id: 'prop-1',
    name: 'Thompson Residence',
    address: '142 Yorkville Avenue',
    city: 'Toronto',
    province: 'ON',
    postalCode: 'M5R 1C2',
    propertyType: 'Single Family Home',
    clientName: 'Michael Thompson',
    clientEmail: 'm.thompson@example.ca',
    clientPhone: '+1 (416) 555-0192',
    imageUrl: '/assets/hero_property_main_1786614552025.jpg',
    activeProjectsCount: 1,
    completedProjectsCount: 3
  },
  {
    id: 'prop-2',
    name: 'Williams Family Home',
    address: '88 Forest Hill Road',
    city: 'Toronto',
    province: 'ON',
    postalCode: 'M4V 2L7',
    propertyType: 'Single Family Home',
    clientName: 'Sarah Williams',
    clientEmail: 's.williams@example.ca',
    clientPhone: '+1 (416) 555-0184',
    imageUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80',
    activeProjectsCount: 0,
    completedProjectsCount: 5
  },
  {
    id: 'prop-3',
    name: 'Anderson Property',
    address: '320 Bay Street, Suite 1400',
    city: 'Toronto',
    province: 'ON',
    postalCode: 'M5H 4A6',
    propertyType: 'Condo / Apartment',
    clientName: 'David Anderson',
    clientEmail: 'd.anderson@example.ca',
    clientPhone: '+1 (416) 555-0137',
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
    activeProjectsCount: 1,
    completedProjectsCount: 2
  }
];

export const INITIAL_REQUESTS: ServiceRequest[] = [
  {
    id: 'req-101',
    referenceNumber: 'REQ-2026-8941',
    propertyId: 'prop-1',
    propertyName: 'Thompson Residence',
    propertyAddress: '142 Yorkville Avenue, Toronto, ON',
    clientName: 'Michael Thompson',
    serviceCategory: 'Plumbing',
    description: 'Leaking kitchen and bathroom taps causing water dripping under sink.',
    preferredDate: '2026-08-16',
    additionalNotes: 'Please call 15 minutes before arrival. Gate code is #4829.',
    photoUrls: ['/assets/plumbing_before_tap_1786614903733.jpg'],
    status: 'Approved',
    createdAt: '2026-08-13T09:00:00Z'
  },
  {
    id: 'req-102',
    referenceNumber: 'REQ-2026-9012',
    propertyId: 'prop-3',
    propertyName: 'Anderson Property',
    propertyAddress: '320 Bay Street, Suite 1400, Toronto, ON',
    clientName: 'David Anderson',
    serviceCategory: 'Electrical',
    description: 'Living room light switches tripping circuit breaker intermittently.',
    preferredDate: '2026-08-19',
    additionalNotes: 'Concierge desk has keys.',
    photoUrls: [],
    status: 'Awaiting Review',
    createdAt: '2026-08-13T10:15:00Z'
  }
];

export const INITIAL_WORKERS: WorkerInfo[] = [
  {
    id: 'worker-1',
    name: 'Michael Carter',
    roleTitle: 'Senior Plumbing Technician',
    phone: '+1 (416) 555-0199',
    email: 'm.carter@apexcare-demo.ca',
    avatarUrl: '/assets/worker_avatar_1786614986847.jpg',
    status: 'On Job',
    activeJobId: 'proj-501'
  },
  {
    id: 'worker-2',
    name: 'Daniel Wilson',
    roleTitle: 'Electrical & HVAC Specialist',
    phone: '+1 (416) 555-0188',
    email: 'd.wilson@apexcare-demo.ca',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    status: 'Available'
  },
  {
    id: 'worker-3',
    name: 'James Brown',
    roleTitle: 'General Repairs & Carpentry',
    phone: '+1 (416) 555-0144',
    email: 'j.brown@apexcare-demo.ca',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    status: 'Available'
  }
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-501',
    title: 'Thompson Residence — Plumbing Repair',
    referenceNumber: 'PRJ-2026-7821',
    propertyId: 'prop-1',
    propertyName: 'Thompson Residence',
    propertyAddress: '142 Yorkville Avenue, Toronto, ON M5R 1C2',
    clientName: 'Michael Thompson',
    serviceCategory: 'Plumbing',
    status: 'In Progress',
    priority: 'High',
    workerId: 'worker-1',
    workerName: 'Michael Carter',
    workerPhone: '+1 (416) 555-0199',
    workerAvatar: '/assets/worker_avatar_1786614986847.jpg',
    clientRequestSummary: 'Client reported leaking kitchen and bathroom taps causing water dripping under sink.',
    adminObservations: 'Kitchen cartridge appears damaged. Requires cartridge replacement and seal inspection.',
    additionalIssuesDiscovered: 'Bathroom faucet washer worn out; recommended full cartridge swap to prevent future leak.',
    scheduledDate: '2026-08-16',
    expectedCompletionDate: '2026-08-18',
    latitude: 43.6702,
    longitude: -79.3897,
    workerCurrentLocation: { lat: 43.6705, lng: -79.3892 },
    tasks: [
      { id: 'task-1', title: 'Inspect kitchen tap & connections', isCompleted: true, completedAt: '2026-08-16 10:45 AM' },
      { id: 'task-2', title: 'Inspect bathroom tap', isCompleted: true, completedAt: '2026-08-16 11:10 AM' },
      { id: 'task-3', title: 'Replace kitchen tap cartridge', isCompleted: true, completedAt: '2026-08-17 02:30 PM' },
      { id: 'task-4', title: 'Replace bathroom faucet cartridge', isCompleted: false },
      { id: 'task-5', title: 'Test water pressure & verify no leaks', isCompleted: false }
    ],
    photos: [
      {
        id: 'photo-1',
        url: '/assets/plumbing_before_tap_1786614903733.jpg',
        category: 'Before',
        description: 'Kitchen Tap — Initial Inspection showing water corrosion around cartridge seal.',
        uploadedBy: 'Michael Carter (Technician)',
        timestamp: 'Aug 16, 2026 — 10:42 AM'
      },
      {
        id: 'photo-2',
        url: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=800&q=80',
        category: 'During',
        description: 'Disassembled cartridge housing during component replacement under sink.',
        uploadedBy: 'Michael Carter (Technician)',
        timestamp: 'Aug 17, 2026 — 01:20 PM'
      },
      {
        id: 'photo-3',
        url: '/assets/plumbing_after_tap_1786614934927.jpg',
        category: 'After',
        description: 'Kitchen Tap — High-arc chrome faucet successfully installed & pressure tested.',
        uploadedBy: 'Michael Carter (Technician)',
        timestamp: 'Aug 17, 2026 — 03:45 PM'
      }
    ],
    timeline: [
      {
        id: 'time-1',
        date: 'August 13, 2026',
        time: '09:00 AM',
        title: 'Service Request Created',
        description: 'Client reported leaking kitchen and bathroom taps via online portal.',
        authorName: 'Michael Thompson',
        authorRole: 'Client',
        iconType: 'request'
      },
      {
        id: 'time-2',
        date: 'August 14, 2026',
        time: '10:15 AM',
        title: 'Project Created & Reviewed',
        description: 'Service request reviewed by dispatch and converted into an active maintenance project.',
        authorName: 'ApexCare Dispatch',
        authorRole: 'Company Admin',
        iconType: 'project'
      },
      {
        id: 'time-3',
        date: 'August 15, 2026',
        time: '08:30 AM',
        title: 'Worker Assigned',
        description: 'Senior Technician Michael Carter assigned to lead property repairs.',
        authorName: 'ApexCare Admin',
        authorRole: 'Company Admin',
        iconType: 'worker'
      },
      {
        id: 'time-4',
        date: 'August 16, 2026',
        time: '10:42 AM',
        title: 'Initial Property Inspection',
        description: 'Kitchen tap cartridge damaged. Added recommendation to service bathroom faucet washer.',
        authorName: 'Michael Carter',
        authorRole: 'Worker Technician',
        photoUrl: '/assets/plumbing_before_tap_1786614903733.jpg',
        iconType: 'inspection'
      },
      {
        id: 'time-5',
        date: 'August 17, 2026',
        time: '01:15 PM',
        title: 'Work Started',
        description: 'Arrived on site and commenced kitchen tap cartridge replacement.',
        authorName: 'Michael Carter',
        authorRole: 'Worker Technician',
        iconType: 'work'
      },
      {
        id: 'time-6',
        date: 'August 17, 2026',
        time: '03:45 PM',
        title: 'Progress Update — Kitchen Tap Installed',
        description: 'New high-arc cartridge assembly mounted and verified zero leaks.',
        authorName: 'Michael Carter',
        authorRole: 'Worker Technician',
        photoUrl: '/assets/plumbing_after_tap_1786614934927.jpg',
        iconType: 'progress'
      }
    ]
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'Service Request Approved',
    message: 'Your service request (REQ-2026-8941) for Thompson Residence has been reviewed.',
    timestamp: 'Aug 14, 2026 — 10:15 AM',
    isRead: false,
    projectId: 'proj-501',
    roleTarget: 'client'
  },
  {
    id: 'notif-2',
    title: 'Technician Assigned',
    message: 'Michael Carter has been assigned to your plumbing repair project.',
    timestamp: 'Aug 15, 2026 — 08:30 AM',
    isRead: false,
    projectId: 'proj-501',
    roleTarget: 'client'
  },
  {
    id: 'notif-3',
    title: 'New Progress Photo Added',
    message: 'Michael Carter uploaded 2 new photographic updates for kitchen tap replacement.',
    timestamp: 'Aug 17, 2026 — 03:45 PM',
    isRead: false,
    projectId: 'proj-501',
    roleTarget: 'client'
  }
];
