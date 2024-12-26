import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TaskForm = ({ onSubmit }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [task, setTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    dueTime: '12:00' // Default time
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Combine date and time for the complete dueDate
    const [year, month, day] = task.dueDate.split('-');
    const [hours, minutes] = task.dueTime.split(':');
    const dueDateTime = new Date(year, month - 1, day, hours, minutes);

    onSubmit({
      ...task,
      dueDate: dueDateTime.toISOString()
    });

    // Reset form and close it
    setTask({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: '',
      dueTime: '12:00'
    });
    setIsExpanded(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Get today's date in YYYY-MM-DD format for min attribute
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header/Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white flex justify-between items-center"
      >
        <span className="text-lg font-semibold">
          {isExpanded ? 'Create New Task' : 'Click to Add New Task'}
        </span>
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </motion.svg>
      </button>

      {/* Form Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Task Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={task.title}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter task title"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                    Priority
                  </label>
                  <select
                    id="priority"
                    name="priority"
                    value={task.priority}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
                    Due Date
                  </label>
                  <input
                    type="date"
                    id="dueDate"
                    name="dueDate"
                    value={task.dueDate}
                    onChange={handleChange}
                    min={today}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="dueTime" className="block text-sm font-medium text-gray-700">
                    Due Time
                  </label>
                  <input
                    type="time"
                    id="dueTime"
                    name="dueTime"
                    value={task.dueTime}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={task.description}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter task description (optional)"
                  ></textarea>
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white py-2 px-4 rounded-md hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                >
                  Create Task
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TaskForm; 