import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { format } from 'date-fns';
import { fetchTasks } from '../../services/taskService';
import TaskList from '../tasks/TaskList';

const CalendarView = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    filterTasksByDate(selectedDate);
  }, [selectedDate, tasks]);

  const loadTasks = async () => {
    try {
      const data = await fetchTasks();
      setTasks(data);
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  const filterTasksByDate = (date) => {
    const filtered = tasks.filter(task => {
      const taskDate = new Date(task.dueDate);
      return (
        taskDate.getDate() === date.getDate() &&
        taskDate.getMonth() === date.getMonth() &&
        taskDate.getFullYear() === date.getFullYear()
      );
    });
    setFilteredTasks(filtered);
  };

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
        <div className="dot-container">
          {dayTasks.map(task => (
            <div
              key={task._id}
              className={`h-1 w-1 rounded-full mx-auto mt-1
                ${task.priority === 'high' ? 'bg-red-500' : 
                  task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'}`}
            />
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="md:w-1/2">
        <Calendar
          onChange={setSelectedDate}
          value={selectedDate}
          tileContent={getTileContent}
          className="rounded-lg shadow-lg bg-white dark:bg-gray-800 p-4"
        />
      </div>
      <div className="md:w-1/2">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
          <h2 className="text-xl font-semibold mb-4">
            Tasks for {format(selectedDate, 'MMMM d, yyyy')}
          </h2>
          <TaskList tasks={filteredTasks} onTasksChange={loadTasks} />
        </div>
      </div>
    </div>
  );
};

export default CalendarView;