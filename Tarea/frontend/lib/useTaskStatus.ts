'use client';

import { useCallback } from 'react';
import toast from 'react-hot-toast';
import { updateTaskStatus, type Task, type TaskStatus } from './api';
import { STATUS_LABEL } from './tasks';

// Changes a task's status on screen right away and puts it back if the API rejects it.
export function useTaskStatus(setTasks: (update: (tasks: Task[]) => Task[]) => void, onSettled?: () => void) {
  return useCallback(
    async (task: Task, status: TaskStatus) => {
      const set = (value: TaskStatus) =>
        setTasks((tasks) => tasks.map((item) => (item.id === task.id ? { ...item, status: value } : item)));

      set(status);
      try {
        await updateTaskStatus(task.id, status);
        toast.success(`“${task.title}” pasó a ${STATUS_LABEL[status].toLowerCase()}`);
        onSettled?.();
      } catch {
        set(task.status);
        toast.error('No se pudo cambiar el estado. Probá de nuevo.');
      }
    },
    [setTasks, onSettled],
  );
}
