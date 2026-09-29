'use client';

import React from 'react';
import { TaskItem, RoleType } from '../types';
import { CheckSquare, Square, CheckCircle2, Clock, Check, X, Camera, Plus, AlertCircle, Sparkles, Archive, RotateCcw, Trash2 } from 'lucide-react';

interface TaskChecklistProps {
  tasks: TaskItem[];
  onToggleTask?: (taskId: string) => void;
  onApproveTask?: (taskId: string) => void;
  onDeclineTask?: (taskId: string) => void;
  onAddTaskRequest?: () => void;
  onDeletePendingTask?: (taskId: string) => void;
  onDisableTask?: (taskId: string) => void;
  onRestoreTask?: (taskId: string) => void;
  userRole?: RoleType;
  isEditable?: boolean;
}

export const TaskChecklist: React.FC<TaskChecklistProps> = ({
  tasks,
  onToggleTask,
  onApproveTask,
  onDeclineTask,
  onAddTaskRequest,
  onDeletePendingTask,
  onDisableTask,
  onRestoreTask,
  userRole = 'client',
  isEditable = true
}) => {
  // Workers cannot see disabled tasks
  const visibleTasks = userRole === 'worker' ? tasks.filter(t => !t.isDisabled) : tasks;

  // Active tasks for completion calculation (excluding disabled, declined, or pending review tasks)
  const approvedTasks = visibleTasks.filter(t => (!t.status || t.status === 'Approved') && !t.isDisabled);
  const completedCount = approvedTasks.filter(t => t.isCompleted).length;
  const totalCount = approvedTasks.length;
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
      
      {/* Header & Live Progress Bar */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>Project Task Checklist</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {completedCount} of {totalCount} completed
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Client Add Task Trigger */}
          {onAddTaskRequest && (
            <button
              type="button"
              onClick={onAddTaskRequest}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-400" />
              <span>+ Request Additional Task</span>
            </button>
          )}

          {/* Percentage Badge */}
          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
            percentage === 100 ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
            percentage > 0 ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
            'bg-slate-100 text-slate-700 border border-slate-300'
          }`}>
            {percentage}% Complete
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
        <div
          className={`h-full transition-all duration-500 ${
            percentage === 100 ? 'bg-emerald-500' : 'bg-emerald-600'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Checklist Items */}
      <div className="space-y-3 pt-2">
        {visibleTasks.map(task => {
          const isPending = task.status === 'Pending Admin Review';
          const isDeclined = task.status === 'Declined';
          const isApprovedAddon = task.status === 'Approved' && task.requestedBy;

          return (
            <div
              key={task.id}
              className={`p-4 rounded-2xl border transition-all space-y-2 ${
                task.isDisabled
                  ? 'bg-slate-100 border-slate-300 opacity-70'
                  : isPending
                  ? 'bg-amber-50/70 border-amber-300 shadow-xs'
                  : isDeclined
                  ? 'bg-slate-50 border-slate-200 opacity-60'
                  : task.isCompleted
                  ? 'bg-slate-50/80 border-slate-200 text-slate-600'
                  : 'bg-white border-slate-200 text-slate-900 hover:border-emerald-300'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {!isPending && !isDeclined && !task.isDisabled && (
                    <button
                      type="button"
                      onClick={() => isEditable && onToggleTask && onToggleTask(task.id)}
                      className="text-slate-400 hover:text-emerald-600 transition-colors"
                      disabled={!isEditable}
                    >
                      {task.isCompleted ? (
                        <CheckSquare className="w-5 h-5 text-emerald-600 fill-emerald-50" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-300" />
                      )}
                    </button>
                  )}

                  <div className="space-y-0.5">
                    <span className={`text-sm font-bold ${task.isCompleted ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                      {task.title}
                    </span>

                    {/* Status Badges */}
                    {task.isDisabled && (
                      <span className="block text-[11px] text-amber-800 font-extrabold flex items-center gap-1">
                        <Archive className="w-3 h-3 text-amber-600" />
                        <span>Disabled / Archived Task</span>
                      </span>
                    )}

                    {isPending && !task.isDisabled && (
                      <span className="block text-[11px] text-amber-800 font-extrabold flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-600" />
                        <span>Awaiting Admin Review (Requested by {task.requestedBy || 'Client'})</span>
                      </span>
                    )}

                    {isApprovedAddon && !task.isDisabled && (
                      <span className="block text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-emerald-600" />
                        <span>Client Task Approved by Admin</span>
                      </span>
                    )}

                    {isDeclined && !task.isDisabled && (
                      <span className="block text-[11px] text-rose-700 font-bold">
                        Request Declined by Admin {task.adminNote ? `(${task.adminNote})` : ''}
                      </span>
                    )}
                  </div>
                </div>

                {/* Right Status / Action Controls */}
                <div className="flex items-center gap-2">
                  {/* Cancel Pending Request Action (Permanent Delete for unstarted tasks) */}
                  {isPending && onDeletePendingTask && (
                    <button
                      type="button"
                      onClick={() => onDeletePendingTask(task.id)}
                      className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                      title="Cancel pending request (no work started)"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Cancel Request</span>
                    </button>
                  )}

                  {/* Admin Approval Actions */}
                  {isPending && onApproveTask && onDeclineTask && (
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => onApproveTask(task.id)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve & Assign</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onDeclineTask(task.id)}
                        className="px-2.5 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-800 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Decline</span>
                      </button>
                    </div>
                  )}

                  {/* Legal Archiving / Disabling Actions (Client / Admin only) */}
                  {userRole !== 'worker' && !isPending && (
                    <>
                      {task.isDisabled ? (
                        onRestoreTask && (
                          <button
                            type="button"
                            onClick={() => onRestoreTask(task.id)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1 shadow-xs cursor-pointer"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Restore Task</span>
                          </button>
                        )
                      ) : (
                        onDisableTask && (
                          <button
                            type="button"
                            onClick={() => onDisableTask(task.id)}
                            className="px-2 py-1 text-slate-400 hover:text-amber-700 hover:bg-amber-50 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                            title="Disable Task (Legal Audit Rule)"
                          >
                            <Archive className="w-3.5 h-3.5" />
                            <span>Disable</span>
                          </button>
                        )
                      )}
                    </>
                  )}

                  {!isPending && !isDeclined && !task.isDisabled && task.isCompleted && (
                    <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      {task.completedAt ? `Done at ${task.completedAt}` : 'Completed'}
                    </span>
                  )}
                </div>
              </div>

              {/* Attached Photo Evidence Thumbnail if present */}
              {task.photoUrl && (
                <div className="pt-2 flex items-center gap-2">
                  <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                    <Camera className="w-3 h-3 text-emerald-600" />
                    Attached Image:
                  </span>
                  <div className="w-14 h-14 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={task.photoUrl} alt="Attached task evidence" className="w-full h-full object-cover" />
                  </div>
                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
};

