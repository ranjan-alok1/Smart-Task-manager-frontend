import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    enabled: true,
    highPriority: true,
    mediumPriority: true,
    lowPriority: false,
    reminderTime: 60 // minutes before deadline
  });

  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('notificationSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }

    // Initialize socket connection
    const newSocket = io(import.meta.env.VITE_API_URL);
    setSocket(newSocket);

    // Socket event listeners
    newSocket.on('connect', () => {
      console.log('Socket connected');
    });

    newSocket.on('taskReminder', (task) => {
      if (settings.enabled && shouldNotify(task)) {
        toast(`Reminder: "${task.title}" is due soon!`, {
          icon: '⏰',
          duration: 5000
        });
      }
    });

    // Cleanup
    return () => {
      if (newSocket) newSocket.disconnect();
    };
  }, []);

  const shouldNotify = (task) => {
    switch (task.priority) {
      case 'high':
        return settings.highPriority;
      case 'medium':
        return settings.mediumPriority;
      case 'low':
        return settings.lowPriority;
      default:
        return false;
    }
  };

  const updateSettings = (newSettings) => {
    setSettings(newSettings);
    localStorage.setItem('notificationSettings', JSON.stringify(newSettings));
  };

  const sendTestNotification = () => {
    if (settings.enabled) {
      toast('This is a test notification!', {
        icon: '🔔',
        duration: 3000
      });
    }
  };

  return (
    <NotificationContext.Provider 
      value={{ 
        settings, 
        updateSettings,
        sendTestNotification,
        socket 
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};