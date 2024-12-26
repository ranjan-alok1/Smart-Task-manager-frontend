import React from 'react';
import { motion } from 'framer-motion';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay, isPast } from 'date-fns';

const Calendar = ({ tasks }) => {
  const today = new Date();
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getTasksForDay = (date) => {
    return tasks.filter(task => isSameDay(new Date(task.dueDate), date));
  };

  const getDayStyle = (date) => {
    const isCurrentMonth = isSameMonth(date, today);
    const isCurrentDay = isToday(date);
    const isPastDay = isPast(date);

    let className = "relative h-24 p-1 border border-gray-200 ";
    
    if (!isCurrentMonth) {
      className += "bg-gray-50 text-gray-400";
    } else if (isCurrentDay) {
      className += "bg-blue-50 border-blue-200";
    } else if (isPastDay) {
      className += "bg-gray-50";
    } else {
      className += "bg-white";
    }

    return className;
  };

  const getTaskStyle = (task) => {
    const isPastDue = isPast(new Date(task.dueDate));
    const baseStyle = "text-xs rounded-full px-2 py-0.5 mb-1 truncate ";

    if (isPastDue && task.status === 'pending') {
      return baseStyle + "bg-red-100 text-red-800";
    }
    
    switch (task.priority) {
      case 'high':
        return baseStyle + "bg-rose-100 text-rose-800";
      case 'medium':
        return baseStyle + "bg-amber-100 text-amber-800";
      default:
        return baseStyle + "bg-emerald-100 text-emerald-800";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-lg p-4 mb-6"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">
          {format(today, 'MMMM yyyy')}
        </h2>
      </div>

      <div className="grid grid-cols-7 gap-px mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
        {days.map((day, idx) => (
          <div key={day.toISOString()} className={getDayStyle(day)}>
            <div className="text-right text-sm mb-1">
              {format(day, 'd')}
            </div>
            <div className="space-y-1 overflow-y-auto max-h-16">
              {getTasksForDay(day).map(task => (
                <div
                  key={task._id}
                  className={getTaskStyle(task)}
                  title={`${task.title} - ${task.priority} priority`}
                >
                  {task.title}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default Calendar; 