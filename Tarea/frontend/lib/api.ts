import axios from 'axios';

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

export type TaskStatus = 'pending' | 'in_progress' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface UserRef {
  id: number;
  name: string;
}

export interface User extends UserRef {
  email: string;
}

export interface Task {
  id: number;
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  due_date?: string | null;
  project_id: number;
  assigned_to_id?: number | null;
  project?: { id: number; name: string };
  assigned_to?: UserRef | null;
}

export interface Project {
  id: number;
  name: string;
  description?: string | null;
  user_id: number;
  created_at: string;
  user?: UserRef;
  tasks?: Task[];
}

export type TaskInput = Pick<Task, 'title' | 'description' | 'status' | 'priority' | 'due_date' | 'assigned_to_id'>;
export type ProjectInput = Pick<Project, 'name' | 'description' | 'user_id'>;

// The API pages its lists; 100 is the most it returns in one request.
const PAGE = { per_page: 100 };

// Users
export const getUsers = () => api.get<User[]>('/api/v1/users');

// Projects
export const getProjects = () => api.get<Project[]>('/api/v1/projects', { params: PAGE });
export const getProject = (id: number) => api.get<Project>(`/api/v1/projects/${id}`);
export const createProject = (data: ProjectInput) => api.post<Project>('/api/v1/projects', { project: data });
export const updateProject = (id: number, data: Partial<ProjectInput>) =>
  api.put<Project>(`/api/v1/projects/${id}`, { project: data });
export const deleteProject = (id: number) => api.delete(`/api/v1/projects/${id}`);

// Tasks
export const getTasks = (params?: { status?: string; priority?: string }) =>
  api.get<Task[]>('/api/v1/tasks', { params: { ...PAGE, ...params } });
export const createTask = (projectId: number, data: Partial<TaskInput>) =>
  api.post<Task>(`/api/v1/projects/${projectId}/tasks`, { task: data });
export const updateTask = (id: number, data: Partial<TaskInput>) =>
  api.put<Task>(`/api/v1/tasks/${id}`, { task: data });
export const updateTaskStatus = (id: number, status: TaskStatus) =>
  api.patch<Task>(`/api/v1/tasks/${id}/status`, { status });
export const deleteTask = (id: number) => api.delete(`/api/v1/tasks/${id}`);

// Reads the reasons the API gives for a rejected request, when it gives any.
export function apiErrors(error: unknown): string[] {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { errors?: string[]; error?: string } | undefined;
    if (data?.errors?.length) return data.errors;
    if (data?.error) return [data.error];
  }
  return [];
}

export default api;
