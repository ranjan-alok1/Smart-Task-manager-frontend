import React from 'react';
import { Settings as SettingsIcon } from 'lucide-react';
import NotificationSettings from '../components/notifications/NotificationSettings';
import AISettings from '../components/ai/AISettings';

const Settings = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <SettingsIcon className="h-6 w-6 text-primary-500" />
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <NotificationSettings />
        <AISettings />
      </div>
    </div>
  );
};

export default Settings;