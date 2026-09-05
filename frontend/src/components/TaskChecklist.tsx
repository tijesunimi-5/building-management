'use client';

import React from 'react';
import { TaskItem } from '../types';
import { CheckSquare, Square, CheckCircle2, Clock } from 'lucide-react';

interface TaskChecklistProps {
  tasks: TaskItem[];
  onToggleTask?: (taskId: string) => void;
  isEditable?: boolean;
}

export const TaskChecklist: React.FC<TaskChecklistProps> = ({ tasks, onToggleTask, isEditable = true }) => {
  const completedCount = tasks.filter(t => t.isCompleted).length;
  const totalCount = tasks.length;
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
      
      {/* Header & Live Progress Bar */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-sky-600" />
            <span>Project Task Checklist</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {completedCount} of {totalCount} completed
          </p>
        </div>

        {/* Percentage Badge */}
        <div className="text-right">
          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
            percentage === 100 ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
            percentage > 0 ? 'bg-sky-100 text-sky-800 border border-sky-300' :
            'bg-slate-100 text-slate-700 border border-slate-300'
          }`}>
            {percentage}% Complete
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mb-6 border border-slate-200">
        <div
          className={`h-full transition-all duration-500 ${
            percentage === 100 ? 'bg-emerald-500' : 'bg-sky-600'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Checklist Items */}
      <div className="space-y-2.5">
        {tasks.map(task => (
          <div
            key={task.id}
            onClick={() => isEditable && onToggleTask && onToggleTask(task.id)}
            className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
              task.isCompleted
                ? 'bg-slate-50/80 border-slate-200 text-slate-600'
                : 'bg-white border-slate-200 text-slate-900 hover:border-sky-300 hover:bg-sky-50/30'
            } ${isEditable ? 'cursor-pointer' : 'cursor-default'}`}
          >
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="text-slate-400 hover:text-sky-600 transition-colors"
                disabled={!isEditable}
              >
                {task.isCompleted ? (
                  <CheckSquare className="w-5 h-5 text-emerald-600 fill-emerald-50" />
                ) : (
                  <Square className="w-5 h-5 text-slate-300" />
                )}
              </button>
              <span className={`text-sm font-medium ${task.isCompleted ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                {task.title}
              </span>
            </div>

            {task.isCompleted ? (
              <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {task.completedAt ? `Done at ${task.completedAt}` : 'Completed'}
              </span>
            ) : (
              <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                <Clock className="w-3 h-3" />
                Pending
              </span>
            )}
          </div>
        ))}
      </div>

    </div>
  );
};
