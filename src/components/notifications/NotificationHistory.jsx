import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const NotificationHistory = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Load notifications from localStorage on mount
    const savedNotifications = localStorage.getItem('notificationHistory');
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
      const unread = JSON.parse(savedNotifications).filter(n => !n.read).length;
      setUnreadCount(unread);
    }

    // Listen for new notifications
    const handleNewNotification = (event) => {
      const notification = event.detail;
      setNotifications(prev => {
        const newNotifications = [{
          id: Date.now(),
          ...notification,
          timestamp: new Date().toISOString(),
          read: false
        }, ...prev].slice(0, 50); // Keep only last 50 notifications
        localStorage.setItem('notificationHistory', JSON.stringify(newNotifications));
        return newNotifications;
      });
      setUnreadCount(prev => prev + 1);
    };

    window.addEventListener('newNotification', handleNewNotification);
    return () => window.removeEventListener('newNotification', handleNewNotification);
  }, []);

  const markAllAsRead = () => {
    setNotifications(prev => {
      const updated = prev.map(n => ({ ...n, read: true }));
      localStorage.setItem('notificationHistory', JSON.stringify(updated));
      return updated;
    });
    setUnreadCount(0);
  };

  const clearAll = () => {
    setNotifications([]);
    setUnreadCount(0);
    localStorage.setItem('notificationHistory', JSON.stringify([]));
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2.5 rounded-xl bg-white shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 relative group"
        title="Notification History"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600 group-hover:text-indigo-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-3 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
          >
            <div className="p-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
                <div className="flex gap-2">
                  <button
                    onClick={markAllAsRead}
                    className="text-sm text-indigo-600 hover:text-indigo-800"
                  >
                    Mark all as read
                  </button>
                  <button
                    onClick={clearAll}
                    className="text-sm text-gray-600 hover:text-gray-800"
                  >
                    Clear all
                  </button>
                </div>
              </div>
            </div>

            <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No notifications yet
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-gray-50 transition-colors ${
                        !notification.read ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex justify-between items-start gap-3">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">
                            {notification.title}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {formatTime(notification.timestamp)}
                          </p>
                        </div>
                        {notification.task && (
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              notification.task.priority === 'high'
                                ? 'bg-red-100 text-red-800'
                                : notification.task.priority === 'medium'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-green-100 text-green-800'
                            }`}
                          >
                            {notification.task.priority}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationHistory; 