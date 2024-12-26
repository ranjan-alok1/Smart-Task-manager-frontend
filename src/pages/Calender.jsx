import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { Calendar as CalendarIcon, Plus } from 'lucide-react';
import { fetchTasks } from '../services/taskService';
import TaskModal from '../components/tasks/TaskModal';
import TaskCard from '../components/tasks/TaskCard';
import toast from 'react-hot-toast';

const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await fetchTasks();
      setTasks(data);
    } catch (error) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const getDayTasks = (date) => {
    return tasks.filter(task => {
      const taskDate = new Date(task.dueDate);
      return (
        taskDate.getDate() === date.getDate() &&
        taskDate.getMonth() === date.getMonth() &&
        taskDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const renderCalendarDays = () => {
    const start = startOfMonth(selectedDate);
    const end = endOfMonth(selectedDate);
    const days = eachDayOfInterval({ start, end });

    return days.map(day => {
      const dayTasks = getDayTasks(day);
      const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

      return (
        <div
          key={day.toString()}
          className={`p-2 border dark:border-gray-700 min-h-[100px] ${
            isToday ? 'bg-primary-50 dark:bg-primary-900/20' : ''
          }`}
        >
          <div className="font-medium mb-1">{format(day, 'd')}</div>
          <div className="space-y-1">
            {dayTasks.map(task => (
              <div
                key={task._id}
                className={`text-xs p-1 rounded ${
                  task.priority === 'high'
                    ? 'bg-red-100 dark:bg-red-900/20'
                    : task.priority === 'medium'
                    ? 'bg-yellow-100 dark:bg-yellow-900/20'
                    : 'bg-green-100 dark:bg-green-900/20'
                }`}
              >
                {task.title}
              </div>
            ))}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <CalendarIcon className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Calendar</h1>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>New Task</span>
        </button>
      </div>

      <div className="card">
        <div className="grid grid-cols-7 gap-px">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-2 text-center font-semibold">
              {day}
            </div>
          ))}
          {renderCalendarDays()}
        </div>
      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={loadTasks}
      />
    </div>
  );
};

export default Calendar;