import React, { useState, useEffect } from 'react';
import { Lightbulb, Clock, TrendingUp } from 'lucide-react';
import { getTaskInsights } from '../../services/aiService';

const AIInsights = ({ tasks }) => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (tasks.length > 0) {
      fetchInsights();
    }
  }, [tasks]);

  const fetchInsights = async () => {
    try {
      setLoading(true);
      const data = await getTaskInsights(tasks);
      setInsights(data);
    } catch (error) {
      console.error('Error fetching insights:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="card">
        <div className="flex items-center space-x-3 mb-2">
          <Lightbulb className="text-yellow-500" />
          <h3 className="font-semibold">Task Suggestions</h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {insights?.suggestions || 'No suggestions available'}
        </p>
      </div>

      <div className="card">
        <div className="flex items-center space-x-3 mb-2">
          <Clock className="text-blue-500" />
          <h3 className="font-semibold">Optimal Times</h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {insights?.optimalTimes || 'No timing data available'}
        </p>
      </div>

      <div className="card">
        <div className="flex items-center space-x-3 mb-2">
          <TrendingUp className="text-green-500" />
          <h3 className="font-semibold">Productivity Insights</h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {insights?.productivity || 'No productivity data available'}
        </p>
      </div>
    </div>
  );
};

export default AIInsights;