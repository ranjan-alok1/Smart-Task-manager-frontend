import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { getAIInsights } from '../../services/api';

const AIInsights = ({ tasks }) => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (tasks && tasks.length > 0) {
      fetchInsights();
    }
  }, [tasks]);

  const fetchInsights = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Filter out tasks that don't have required fields
      const validTasks = tasks.filter(task => 
        task.title && 
        task.dueDate && 
        (task.priority || task.priority === 0) && 
        task.status
      );

      if (validTasks.length === 0) {
        throw new Error('No valid tasks found for analysis');
      }

      const response = await getAIInsights(validTasks.map(task => ({
        title: task.title,
        description: task.description || '',
        dueDate: task.dueDate,
        priority: task.priority || 'medium',
        status: task.status || 'pending'
      })));

      if (response?.success && response?.data) {
        setInsights(response.data);
      } else {
        throw new Error(response?.message || 'No insights received from AI');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch AI insights');
      toast.error('Failed to fetch AI insights');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-red-500">{error}</p>
        <button 
          onClick={fetchInsights}
          className="mt-2 text-sm text-blue-600 hover:text-blue-800"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!insights) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-500">No insights available yet.</p>
      </div>
    );
  }

  const renderInsights = () => {
    if (typeof insights === 'string') {
      return insights.split('\n').map((paragraph, index) => (
        <p key={index} className="mb-3 text-gray-600">
          {paragraph}
        </p>
      ));
    }

    if (typeof insights === 'object') {
      return Object.entries(insights).map(([key, value], index) => (
        <div key={index} className="mb-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            {key.replace(/([A-Z])/g, ' $1').trim()}
          </h3>
          <p className="text-gray-600">
            {value}
          </p>
        </div>
      ));
    }

    return (
      <p className="text-gray-600">
        {String(insights)}
      </p>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">AI Insights</h2>
      <div className="prose prose-sm">
        {renderInsights()}
      </div>
    </div>
  );
};

export default AIInsights; 