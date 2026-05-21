import api from "./client";

export const getProjectTasks = (projectId) => api.get(`/projects/${projectId}/tasks`).then((res) => res.data);
export const createTask = (projectId, payload) => api.post(`/projects/${projectId}/tasks`, payload).then((res) => res.data);
export const updateTask = (taskId, payload) => api.put(`/tasks/${taskId}`, payload).then((res) => res.data);
export const deleteTask = (taskId) => api.delete(`/tasks/${taskId}`).then((res) => res.data);
export const updateTaskStatus = (taskId, status) => api.patch(`/tasks/${taskId}/status`, { status }).then((res) => res.data);
