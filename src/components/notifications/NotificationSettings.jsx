import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const NotificationSettings = ({ onClose }) => {
  const [settings, setSettings] = useState({
    enabled: true,
    priorities: {
      high: true,
      medium: true,
      low: false
    },
    timing: {
      high: 60,
      medium: 120,
      low: 180
    }
  });

  useEffect(() => {
    const savedSettings = localStorage.getItem('notificationSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('notificationSettings', JSON.stringify(settings));
  }, [settings]);

  const handleToggleEnabled = () => {
    if (!settings.enabled && 'Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          setSettings(prev => ({ ...prev, enabled: true }));
          toast.success('Notifications enabled');
        } else {
          toast.error('Please allow notifications in your browser');
        }
      });
    } else {
      setSettings(prev => ({ ...prev, enabled: !prev.enabled }));
      toast.success(settings.enabled ? 'Notifications disabled' : 'Notifications enabled');
    }
  };

  const handlePriorityToggle = (priority) => {
    setSettings(prev => ({
      ...prev,
      priorities: {
        ...prev.priorities,
        [priority]: !prev.priorities[priority]
      }
    }));
  };

  const handleTimingChange = (priority, minutes) => {
    const value = Math.max(15, Math.min(1440, minutes));
    setSettings(prev => ({
      ...prev,
      timing: {
        ...prev.timing,
        [priority]: value
      }
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Notification Settings</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleEnabled}
            className={`px-4 py-2 rounded-lg transition-colors ${
              settings.enabled
                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {settings.enabled ? 'Enabled' : 'Disabled'}
          </button>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-3">Priority Levels</h3>
          <div className="space-y-3">
            {Object.entries(settings.priorities).map(([priority, enabled]) => (
              <div key={priority} className="flex items-center justify-between">
                <span className="text-gray-600 capitalize">{priority} Priority</span>
                <button
                  onClick={() => handlePriorityToggle(priority)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    enabled ? 'bg-indigo-600' : 'bg-gray-200'
                  }`}
                  disabled={!settings.enabled}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-3">Notification Timing</h3>
          <div className="space-y-3">
            {Object.entries(settings.timing).map(([priority, minutes]) => (
              <div key={priority} className="flex items-center justify-between">
                <span className="text-gray-600 capitalize">{priority} Priority</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="15"
                    max="1440"
                    value={minutes}
                    onChange={(e) => handleTimingChange(priority, parseInt(e.target.value))}
                    className="w-20 px-2 py-1 border border-gray-300 rounded-md text-sm"
                    disabled={!settings.enabled || !settings.priorities[priority]}
                  />
                  <span className="text-sm text-gray-500">minutes before</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {settings.enabled && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-600">
            Notifications will be sent based on your selected priorities and timing preferences.
            Make sure to keep the app open to receive notifications.
          </p>
        </div>
      )}
    </div>
  );
};

export default NotificationSettings; 