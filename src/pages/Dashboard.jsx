import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import TaskForm from '../components/tasks/TaskForm';
import TaskList from '../components/tasks/TaskList';
import Calendar from '../components/calendar/Calendar';
import AIInsights from '../components/ai/AIInsights';
import NotificationSettings from '../components/notifications/NotificationSettings';
import { getTasks, createTask, updateTask, deleteTask } from '../services/api';

const showNotification = (title, message) => {
  const settings = JSON.parse(localStorage.getItem('notificationSettings')) || {
    enabled: true,
    priorities: { high: true, medium: true, low: false }
  };

  if (!settings.enabled) return;

  toast(message);
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, {
      body: message,
      icon: '/notification-icon.png'
    });
  }
};

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState('list');
  const [showInsights, setShowInsights] = useState(true);
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);

  // Close notification settings when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const settingsPanel = document.getElementById('notification-settings-panel');
      const notificationIcon = document.getElementById('notification-icon');
      if (settingsPanel && !settingsPanel.contains(event.target) && 
          notificationIcon && !notificationIcon.contains(event.target)) {
        setShowNotificationSettings(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTasks();
      if (Array.isArray(data)) {
        setTasks(data);
      } else {
        setTasks([]);
        setError('Invalid response format');
      }
    } catch (error) {
      setError(error.message || 'Failed to fetch tasks');
      setTasks([]);
      toast.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      const newTask = await createTask(taskData);
      if (newTask && newTask._id) {
        setTasks(prev => [...prev, newTask]);
        toast.success('Task created successfully');
        if (taskData.priority === 'high') {
          showNotification(
            'High Priority Task Created',
            `New task "${taskData.title}" has been created with high priority`
          );
        }
      } else {
        throw new Error('Invalid task data received');
      }
    } catch (error) {
      toast.error('Failed to create task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId);
      setTasks(prev => prev.filter(task => task._id !== taskId));
      toast.success('Task deleted successfully');
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const { draggableId, source, destination } = result;
    if (source.droppableId === destination.droppableId) return;

    let newStatus;
    switch (destination.droppableId) {
      case 'Completed':
        newStatus = 'completed';
        break;
      case 'Due Today':
      case 'Overdue':
        newStatus = 'pending';
        break;
      default:
        return;
    }

    try {
      const updatedTasks = tasks.map(task =>
        task._id === draggableId ? { ...task, status: newStatus } : task
      );
      setTasks(updatedTasks);

      const updatedTask = await updateTask(draggableId, { status: newStatus });
      if (updatedTask && updatedTask._id) {
        toast.success(`Task moved to ${destination.droppableId}`);
        if (newStatus === 'completed') {
          const task = tasks.find(t => t._id === draggableId);
          if (task) {
            showNotification(
              'Task Completed',
              `Task "${task.title}" has been marked as completed`
            );
          }
        }
      } else {
        throw new Error('Invalid task update response');
      }
    } catch (error) {
      toast.error('Failed to update task status');
      fetchTasks();
    }
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
          <p className="text-red-600">{error}</p>
          <button
            onClick={fetchTasks}
            className="mt-2 text-sm text-blue-600 hover:text-blue-800"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with notification icon */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-2xl shadow-sm border border-gray-100 p-4 mb-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Smart Task Manager
            </h1>
            <div className="h-6 w-[2px] bg-gradient-to-b from-blue-200 to-purple-200 rounded-full"></div>
            <p className="text-gray-500 text-sm">Manage your tasks efficiently utilizing AI insights</p>
          </div>
          <div className="relative">
            <button
              id="notification-icon"
              onClick={() => setShowNotificationSettings(!showNotificationSettings)}
              className="p-2.5 rounded-xl bg-white shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 relative group"
              title="Notification Settings"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600 group-hover:text-indigo-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>

            {/* Notification Settings Panel */}
            {showNotificationSettings && (
              <div 
                id="notification-settings-panel"
                className="absolute right-0 mt-3 w-96 z-50 transform transition-all duration-300 ease-in-out animate-fade-in-down"
                style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}
              >
                <NotificationSettings onClose={() => setShowNotificationSettings(false)} />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mb-8">
        <TaskForm onSubmit={handleCreateTask} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {showInsights && (
          <div className="lg:col-span-1">
            <AIInsights tasks={tasks} />
          </div>
        )}
        
        <div className={showInsights ? "lg:col-span-3" : "lg:col-span-4"}>
          <div className="mb-4 flex justify-between items-center">
            <div className="flex gap-2">
              <button
                onClick={() => setShowInsights(!showInsights)}
                className={`px-4 py-2 rounded-lg ${
                  showInsights
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {showInsights ? 'Hide Insights' : 'Show Insights'}
              </button>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setView('list')}
                className={`px-4 py-2 rounded-lg ${
                  view === 'list'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                List View
              </button>
              <button
                onClick={() => setView('calendar')}
                className={`px-4 py-2 rounded-lg ${
                  view === 'calendar'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Calendar View
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading tasks...</p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No tasks found. Create one to get started!</p>
            </div>
          ) : view === 'list' ? (
            <TaskList
              tasks={tasks}
              onDragEnd={handleDragEnd}
              onDelete={handleDeleteTask}
            />
          ) : (
            <Calendar tasks={tasks} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;