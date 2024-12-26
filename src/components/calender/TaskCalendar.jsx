import React from 'react';
import { format, isToday } from 'date-fns';
import { Calendar } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const TaskCalendar = ({ tasks, onDateSelect, selectedDate }) => {
  const getTileContent = ({ date }) => {
    const dayTasks = tasks.filter(task => {
      const taskDate = new Date(task.dueDate);
      return (
        taskDate.getDate() === date.getDate() &&
        taskDate.getMonth() === date.getMonth() &&
        taskDate.getFullYear() === date.getFullYear()
      );
    });

    if (dayTasks.length > 0) {
      return (
        <div className="flex justify-center mt-1">
          {dayTasks.slice(0, 3).map((task, index) => (
            <div
              key={index}
              className={`w-1.5 h-1.5 rounded-full mx-0.5 ${
                task.priority === 'high'
                  ? 'bg-red-500'
                  : task.priority === 'medium'
                  ? 'bg-yellow-500'
                  : 'bg-green-500'
              }`}
            />
          ))}
        </div>
      );
    }
    return null;
  };

  const tileClassName = ({ date }) => {
    if (isToday(date)) {
      return 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400';
    }
    return '';
  };

  return (
    <Calendar
      onChange={onDateSelect}
      value={selectedDate}
      tileContent={getTileContent}
      tileClassName={tileClassName}
      className="w-full rounded-lg shadow-lg bg-white dark:bg-gray-800 p-4 border-none"
    />
  );
};

export default TaskCalendar;