import React, { useEffect } from 'react';
import { io } from 'socket.io-client';
import { toast } from 'react-hot-toast';

const NotificationCenter = () => {
    useEffect(() => {
        const settings = JSON.parse(localStorage.getItem('notificationSettings')) || {
            enabled: true,
            priorities: { high: true, medium: true, low: false },
            timing: { high: 60, medium: 120, low: 180 }
        };

        if (!settings.enabled) return;

        // Use the full API URL for Socket.IO connection
        const BASE_URL = import.meta.env.VITE_API_URL.replace('/api/v1', '');
        const socket = io(BASE_URL, {
            path: '/socket.io',
            transports: ['websocket', 'polling'],
            secure: true, // Enable for HTTPS
            rejectUnauthorized: false, // Required for self-signed certificates
            withCredentials: true
        });

        const showNotification = (notification) => {
            // Check if notification should be shown based on settings
            if (!settings.enabled) return;

            const { type, title, message, task } = notification;

            // For task_due_soon notifications, check priority settings
            if (type === 'task_due_soon' && task) {
                const priority = task.priority.toLowerCase();
                if (!settings.priorities[priority]) return;
            }

            // Show toast notification
            toast(message);

            // Show browser notification if permission is granted
            if ('Notification' in window && Notification.permission === 'granted') {
                new Notification(title, {
                    body: message,
                    icon: '/notification-icon.png'
                });
            }

            // Dispatch event for notification history
            window.dispatchEvent(
                new CustomEvent('newNotification', {
                    detail: { type, title, message, task }
                })
            );
        };

        socket.on('connect', () => {
            toast.success('Connected to notification service');
        });

        socket.on('notification', showNotification);

        socket.on('connect_error', (error) => {
            toast.error('Failed to connect to notification service');
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    return null; // This component doesn't render anything
};

export default NotificationCenter; 