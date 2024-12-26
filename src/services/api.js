import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            return Promise.reject(error.response.data);
        }
        return Promise.reject(error);
    }
);

// Task endpoints
export const getTasks = async () => {
    try {
        const response = await api.get('/tasks');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createTask = async (taskData) => {
    try {
        const response = await api.post('/tasks', taskData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateTask = async (taskId, taskData) => {
    try {
        const response = await api.put(`/tasks/${taskId}`, taskData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteTask = async (taskId) => {
    try {
        const response = await api.delete(`/tasks/${taskId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// AI endpoints
export const getAIInsights = async (tasks) => {
    try {
        const response = await api.post('/ai/insights', { tasks });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export default api; 