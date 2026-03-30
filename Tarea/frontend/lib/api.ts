import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  headers: { 'Content-Type': 'application/json' },
});

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  due_date?: string;
  project_id: number;
  assigned_to_id?: number;
}

export interface Project {
  id: number;
  name: string;
  description?: string;
  user_id: number;
  created_at: string;
  tasks?: Task[];
}

// Projects
export const getProjects = () => api.get<Project[]>('/api/v1/projects');
export const getProject = (id: number) => api.get<Project>(`/api/v1/projects/${id}`);
export const createProject = (data: Partial<Project>) => api.post<Project>('/api/v1/projects', { project: data });
export const updateProject = (id: number, data: Partial<Project>) => api.put<Project>(`/api/v1/projects/${id}`, { project: data });
export const deleteProject = (id: number) => api.delete(`/api/v1/projects/${id}`);

// Tasks
export const getTasks = (params?: { status?: string; priority?: string }) =>
  api.get<Task[]>('/api/v1/tasks', { params });
export const createTask = (projectId: number, data: Partial<Task>) =>
  api.post<Task>(`/api/v1/projects/${projectId}/tasks`, { task: data });
export const updateTask = (id: number, data: Partial<Task>) =>
  api.put<Task>(`/api/v1/tasks/${id}`, { task: data });
export const updateTaskStatus = (id: number, status: string) =>
  api.patch<Task>(`/api/v1/tasks/${id}/status`, { status });
export const deleteTask = (id: number) => api.delete(`/api/v1/tasks/${id}`);

export default api;