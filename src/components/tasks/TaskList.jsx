import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { motion, AnimatePresence } from 'framer-motion';

const TaskList = ({ tasks, onDragEnd, onDelete }) => {
  // Helper function to check if a date is today
  const isToday = (dateToCheck) => {
    const today = new Date();
    const date = new Date(dateToCheck);
    return date.toDateString() === today.toDateString();
  };

  // Helper function to check if a date is past
  const isPast = (dateToCheck) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const date = new Date(dateToCheck);
    return date < today;
  };

  if (!Array.isArray(tasks)) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error: Invalid tasks data</p>
      </div>
    );
  }

  const taskGroups = {
    'Due Today': {
      tasks: tasks.filter(task => {
        try {
          const isDueToday = isToday(task.dueDate);
          return task.status === 'pending' && isDueToday;
        } catch (error) {
          return false;
        }
      }),
      bgColor: 'bg-gradient-to-br from-sky-100 via-blue-100 to-indigo-100',
      headerBg: 'bg-gradient-to-r from-blue-600 to-indigo-600',
      countBg: 'bg-blue-100 text-blue-800'
    },
    'Completed': {
      tasks: tasks.filter(task => task.status === 'completed'),
      bgColor: 'bg-gradient-to-br from-emerald-100 via-green-100 to-teal-100',
      headerBg: 'bg-gradient-to-r from-emerald-600 to-green-600',
      countBg: 'bg-emerald-100 text-emerald-800'
    },
    'Overdue': {
      tasks: tasks.filter(task => {
        try {
          const isOverdue = isPast(task.dueDate);
          return task.status === 'pending' && isOverdue;
        } catch (error) {
          return false;
        }
      }),
      bgColor: 'bg-gradient-to-br from-rose-100 via-red-100 to-pink-100',
      headerBg: 'bg-gradient-to-r from-rose-600 to-red-600',
      countBg: 'bg-rose-100 text-rose-800'
    }
  };

  const handleDragEnd = (result) => {
    try {
      onDragEnd(result);
    } catch (error) {
      // Silent fail - error will be handled by parent component
    }
  };

  return (
    <div className="space-y-6">
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(taskGroups).map(([status, { tasks: groupTasks, bgColor, headerBg, countBg }]) => (
            <div key={status} 
                 className={`rounded-lg shadow-lg overflow-hidden ${bgColor} border border-gray-200/50 backdrop-blur-sm`}>
              <div className={`${headerBg} p-3 shadow-lg`}>
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-bold text-white tracking-wide">{status}</h2>
                  <span className={`${countBg} px-3 py-0.5 rounded-full text-sm font-semibold shadow-sm`}>
                    {groupTasks.length}
                  </span>
                </div>
              </div>
              <Droppable droppableId={status}>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`min-h-[100px] max-h-[calc(100vh-15rem)] overflow-y-auto p-3 transition-colors duration-300 ${
                      snapshot.isDraggingOver ? 'bg-gray-50/50' : ''
                    }`}
                  >
                    <AnimatePresence>
                      {groupTasks.map((task, index) => (
                        <Draggable
                          key={task._id}
                          draggableId={task._id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`bg-white/90 backdrop-blur-sm p-3 rounded-lg mb-2 shadow-sm 
                                hover:shadow-md transition-all duration-200 border border-gray-100
                                ${snapshot.isDragging ? 'shadow-lg scale-105 rotate-1' : ''}`}
                              style={provided.draggableProps.style}
                            >
                              <div className="flex justify-between items-start gap-3">
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-semibold text-gray-800 text-base mb-1 truncate">
                                    {task.title}
                                  </h3>
                                  {task.description && (
                                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                      {task.description}
                                    </p>
                                  )}
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold shadow-sm ${
                                      task.priority === 'high' ? 'bg-rose-100 text-rose-800' :
                                      task.priority === 'medium' ? 'bg-amber-100 text-amber-800' :
                                      'bg-emerald-100 text-emerald-800'
                                    }`}>
                                      {task.priority}
                                    </span>
                                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full shadow-sm">
                                      Due: {new Date(task.dueDate).toLocaleDateString()}
                                    </span>
                                  </div>
                                </div>
                                <button
                                  onClick={() => onDelete(task._id)}
                                  className="text-gray-400 hover:text-red-500 transition-colors p-1 
                                    rounded-full hover:bg-red-50"
                                  title="Delete task"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                  </svg>
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </Draggable>
                      ))}
                    </AnimatePresence>
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default TaskList; 