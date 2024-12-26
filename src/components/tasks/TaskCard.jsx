import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Calendar, Clock, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

const TaskCard = ({ task, index }) => {
  const priorityColors = {
    low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
  };

  return (
    <Draggable draggableId={task._id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`card mb-3 ${
            snapshot.isDragging ? 'shadow-lg' : ''
          } hover:shadow-md transition-shadow`}
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold">{task.title}</h3>
            <span className={`px-2 py-1 rounded-full text-xs ${priorityColors[task.priority]}`}>
              {task.priority}
            </span>
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            {task.description}
          </p>
          
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-4">
            <div className="flex items-center">
              <Calendar size={14} className="mr-1" />
              {format(new Date(task.dueDate), 'MMM dd')}
            </div>
            <div className="flex items-center">
              <Clock size={14} className="mr-1" />
              {format(new Date(task.dueDate), 'HH:mm')}
            </div>
            {new Date(task.dueDate) < new Date() && task.status !== 'completed' && (
              <div className="flex items-center text-red-500">
                <AlertCircle size={14} className="mr-1" />
                Overdue
              </div>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;