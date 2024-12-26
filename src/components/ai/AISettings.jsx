import React, { useState } from 'react';
import { Brain, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const AISettings = () => {
  const [settings, setSettings] = useState({
    enableAIInsights: true,
    enableAutoScheduling: true,
    analysisFrequency: 'daily',
    productivityTracking: true
  });

  const handleChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    // Save settings to backend
    toast.success('AI settings updated successfully');
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Brain className="h-6 w-6 text-primary-500" />
          <h2 className="text-xl font-semibold">AI Features</h2>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={settings.enableAIInsights}
              onChange={(e) => handleChange('enableAIInsights', e.target.checked)}
              className="rounded text-primary-600 focus:ring-primary-500"
            />
            <span>Enable AI Insights</span>
          </label>
          <p className="text-sm text-gray-500 dark:text-gray-400 ml-6">
            Get AI-powered suggestions for better task management
          </p>
        </div>

        <div className="space-y-4">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={settings.enableAutoScheduling}
              onChange={(e) => handleChange('enableAutoScheduling', e.target.checked)}
              className="rounded text-primary-600 focus:ring-primary-500"
            />
            <span>Auto-Scheduling</span>
          </label>
          <p className="text-sm text-gray-500 dark:text-gray-400 ml-6">
            Let AI optimize your task schedule based on priorities and deadlines
          </p>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Analysis Frequency</label>
          <select
            value={settings.analysisFrequency}
            onChange={(e) => handleChange('analysisFrequency', e.target.value)}
            className="input"
          >
            <option value="realtime">Real-time</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
          </select>
        </div>

        <button
          onClick={handleSave}
          className="btn btn-primary w-full flex items-center justify-center space-x-2"
        >
          <Save size={20} />
          <span>Save Settings</span>
        </button>
      </div>
    </div>
  );
};

export default AISettings;