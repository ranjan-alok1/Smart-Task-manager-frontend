import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const getTaskInsights = async (tasks) => {
    try {
        const response = await axios.post(`${API_URL}/api/ai/insights`, { tasks });
        return response.data;
    } catch (error) {
        console.error('Error getting AI insights:', error);
        throw error;
    }
};

export const getSchedulingSuggestions = async (tasks) => {
    try {
        const response = await axios.post(`${API_URL}/api/ai/schedule`, { tasks });
        return response.data;
    } catch (error) {
        console.error('Error getting scheduling suggestions:', error);
        throw error;
    }
};