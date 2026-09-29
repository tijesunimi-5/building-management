'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '../context/AppContext';
import { X, Bell, CheckCheck, Inbox, Clock, ChevronRight } from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const { notifications, markNotificationRead, setSelectedProjectId, currentRole } = useApp();

  if (!isOpen) return null;

  // Filter notifications for current role or general
  const filteredNotifs = notifications.filter(n => !n.roleTarget || n.roleTarget === currentRole);
  const unreadCount = filteredNotifs.filter(n => !n.isRead).length;

  const handleNotificationClick = (n: typeof notifications[0]) => {
    markNotificationRead(n.id);
    
    if (n.projectId) {
      setSelectedProjectId(n.projectId);
      if (currentRole === 'admin') {
        router.push(`/admin/projects/${n.projectId}`);
      } else if (currentRole === 'worker') {
        router.push(`/worker/jobs/${n.projectId}`);
      } else {
        router.push(`/client/projects/${n.projectId}`);
      }
    } else {
      if (currentRole === 'admin') {
        router.push('/admin/requests');
      } else if (currentRole === 'worker') {
        router.push('/worker');
      } else {
        router.push('/client/history');
      }
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden bg-slate-950/70 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-sm sm:max-w-md bg-white shadow-2xl border-l border-slate-200 flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold relative">
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-600 rounded-full border-2 border-white" />
                )}
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Notifications
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {unreadCount > 0 ? `${unreadCount} unread alert${unreadCount > 1 ? 's' : ''}` : 'All caught up'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {filteredNotifs.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <Inbox className="w-6 h-6" />
                </div>
                <p className="text-sm font-medium text-slate-500">No active notifications for your account.</p>
              </div>
            ) : (
              filteredNotifs.map(n => (
                <div
                  key={n.id}
                  onClick={() => handleNotificationClick(n)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer hover:shadow-md ${
                    n.isRead
                      ? 'bg-slate-50/70 border-slate-200 text-slate-600'
                      : 'bg-emerald-50/60 border-emerald-200 text-slate-900 shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="text-sm font-bold text-slate-900 leading-snug">{n.title}</h4>
                    {!n.isRead && (
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 flex-shrink-0 mt-1 animate-pulse" />
                    )}
                  </div>

                  <p className="text-xs text-slate-600 mb-3 leading-relaxed">{n.message}</p>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium pt-2 border-t border-slate-100">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {n.timestamp}
                    </span>
                    <span className="text-emerald-600 font-bold hover:underline flex items-center gap-0.5">
                      <span>View Details</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-200 bg-slate-50">
            <button
              onClick={() => {
                filteredNotifs.forEach(n => markNotificationRead(n.id));
              }}
              disabled={unreadCount === 0}
              className="w-full py-2.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-2xs disabled:opacity-50"
            >
              <CheckCheck className="w-4 h-4 text-emerald-600" />
              <span>Mark All as Read</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
