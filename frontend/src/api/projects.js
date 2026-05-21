import api from "./client";

export const getProjects = () => api.get("/projects").then((res) => res.data);
export const createProject = (payload) => api.post("/projects", payload).then((res) => res.data);
export const getProject = (id) => api.get(`/projects/${id}`).then((res) => res.data);
export const updateProject = (id, payload) => api.put(`/projects/${id}`, payload).then((res) => res.data);
export const deleteProject = (id) => api.delete(`/projects/${id}`).then((res) => res.data);
export const addProjectMember = (id, payload) => api.post(`/projects/${id}/members`, payload).then((res) => res.data);
export const removeProjectMember = (id, userId) => api.delete(`/projects/${id}/members/${userId}`).then((res) => res.data);
