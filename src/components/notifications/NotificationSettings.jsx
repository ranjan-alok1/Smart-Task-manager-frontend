import React from 'react';
import { Bell, Clock } from 'lucide-react';
import { useNotifications } from '../../contexts/NotificationContext';

const NotificationSettings = () => {
  const { settings, updateSettings } = useNotifications();

  const handleChange = (field, value) => {
    updateSettings({ ...settings, [field]: value });
  };

  return (
    <div className="card space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Bell className="text-primary-500" />
          <h2 className="text-xl font-semibold">Notification Settings</h2>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.enabled}
            onChange={(e) => handleChange('enabled', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
        </label>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">Priority Levels</label>
          <div className="mt-2 space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={settings.highPriority}
                onChange={(e) => handleChange('highPriority', e.target.checked)}
                className="rounded text-primary-600 focus:ring-primary-500"
              />
              <span>High Priority Tasks</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={settings.mediumPriority}
                onChange={(e) => handleChange('mediumPriority', e.target.checked)}
                className="rounded text-primary-600 focus:ring-primary-500"
              />
              <span>Medium Priority Tasks</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={settings.lowPriority}
                onChange={(e) => handleChange('lowPriority', e.target.checked)}
                className="rounded text-primary-600 focus:ring-primary-500"
              />
              <span>Low Priority Tasks</span>
            </label>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Reminder Time</label>
          <div className="mt-2 flex items-center space-x-2">
            <input
              type="number"
              min="5"
              max="180"
              value={settings.reminderTime}
              onChange={(e) => handleChange('reminderTime', parseInt(e.target.value))}
              className="input w-24"
            />
            <span>minutes before deadline</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;
