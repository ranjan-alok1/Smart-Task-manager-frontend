import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const fetchTasks = async () => {
    const response = await axios.get(`${API_URL}/api/tasks`);
    return response.data;
};

export const createTask = async (taskData) => {
    const response = await axios.post(`${API_URL}/api/tasks`, taskData);
    return response.data;
};

export const updateTask = async (id, taskData) => {
    const response = await axios.put(`${API_URL}/api/tasks/${id}`, taskData);
    return response.data;
};

export const deleteTask = async (id) => {
    const response = await axios.delete(`${API_URL}/api/tasks/${id}`);
    return response.data;
};

export const updateTaskStatus = async (id, status) => {
    const response = await axios.patch(`${API_URL}/api/tasks/${id}/status`, { status });
    return response.data;
};