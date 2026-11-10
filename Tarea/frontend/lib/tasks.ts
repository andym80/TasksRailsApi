import type { Task, TaskPriority, TaskStatus } from './api';

export const STATUS_LABEL: Record<TaskStatus, string> = {
  pending: 'Pendiente',
  in_progress: 'En curso',
  completed: 'Completada',
};

export const PRIORITY_LABEL: Record<TaskPriority, string> = {
  high: 'Alta',
  medium: 'Media',
  low: 'Baja',
};

const DAY = 24 * 60 * 60 * 1000;

// The API sends dates as YYYY-MM-DD. `new Date('2026-03-24')` reads that as UTC
// midnight, which is the previous day in Buenos Aires, so build it from its parts.
export function parseDate(value: string): Date {
  const [year, month, day] = value.slice(0, 10).split('-').map(Number);
  return new Date(year, month - 1, day);
}

function startOfToday(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

// Whole days from today to the due date: negative when it is overdue.
export function daysUntil(value: string): number {
  return Math.round((parseDate(value).getTime() - startOfToday().getTime()) / DAY);
}

export function dueLabel(task: Task): string {
  if (!task.due_date) return 'Sin fecha';
  const days = daysUntil(task.due_date);
  const date = parseDate(task.due_date).toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric', month: 'short' });
  if (task.status === 'completed') return date;
  if (days === 0) return 'Hoy';
  if (days === 1) return 'Mañana';
  if (days === -1) return 'Venció ayer';
  if (days < 0) return `Venció hace ${-days} días`;
  return date;
}

export type GroupKey = 'overdue' | 'today' | 'week' | 'later' | 'undated' | 'completed';

export const GROUP_LABEL: Record<GroupKey, string> = {
  overdue: 'Vencidas',
  today: 'Hoy',
  week: 'Próximos 7 días',
  later: 'Más adelante',
  undated: 'Sin fecha',
  completed: 'Completadas',
};

export const GROUP_ORDER: GroupKey[] = ['overdue', 'today', 'week', 'later', 'undated', 'completed'];

export function groupOf(task: Task): GroupKey {
  if (task.status === 'completed') return 'completed';
  if (!task.due_date) return 'undated';
  const days = daysUntil(task.due_date);
  if (days < 0) return 'overdue';
  if (days === 0) return 'today';
  if (days <= 7) return 'week';
  return 'later';
}

const PRIORITY_RANK: Record<TaskPriority, number> = { high: 0, medium: 1, low: 2 };

// Sorts by due date, then by priority, and splits the tasks into the agenda's groups.
export function groupTasks(tasks: Task[]): { key: GroupKey; tasks: Task[] }[] {
  const sorted = [...tasks].sort((a, b) => {
    const byDate = (a.due_date ?? '9999').localeCompare(b.due_date ?? '9999');
    return byDate || PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority] || a.id - b.id;
  });
  return GROUP_ORDER.map((key) => ({ key, tasks: sorted.filter((task) => groupOf(task) === key) })).filter(
    (group) => group.tasks.length > 0,
  );
}

export function progress(tasks: Task[] = []): { done: number; total: number; percent: number } {
  const done = tasks.filter((task) => task.status === 'completed').length;
  return { done, total: tasks.length, percent: tasks.length ? Math.round((done / tasks.length) * 100) : 0 };
}
