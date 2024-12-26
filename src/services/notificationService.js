import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const updateNotificationSettings = async (settings) => {
    try {
        const response = await axios.put(`${API_URL}/api/notifications/settings`, settings);
        return response.data;
    } catch (error) {
        console.error('Error updating notification settings:', error);
        throw error;
    }
};

export const getNotificationSettings = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/notifications/settings`);
        return response.data;
    } catch (error) {
        console.error('Error fetching notification settings:', error);
        throw error;
    }
};