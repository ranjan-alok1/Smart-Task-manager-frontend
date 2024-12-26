import { useEffect, useRef } from 'react';
import io from 'socket.io-client';
import toast from 'react-hot-toast';

const SOCKET_URL = import.meta.env.VITE_API_URL;

export const useSocket = () => {
    const socket = useRef(null);

    useEffect(() => {
        socket.current = io(SOCKET_URL);

        socket.current.on('connect', () => {
            console.log('Socket connected');
        });

        socket.current.on('taskReminder', (task) => {
            toast(`Reminder: ${task.title} is due soon!`, {
                icon: '⏰',
            });
        });

        socket.current.on('taskUpdated', (task) => {
            toast.success(`Task "${task.title}" was updated`);
        });

        return () => {
            if (socket.current) {
                socket.current.disconnect();
            }
        };
    }, []);

    return socket.current;
};