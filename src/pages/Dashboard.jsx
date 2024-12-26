import React, { useState, useEffect } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import { Plus } from 'lucide-react';
import TaskColumn from '../components/tasks/TaskColumn';
import TaskModal from '../components/tasks/TaskModal';
import AIInsights from '../components/ai/AIInsights';
import { fetchTasks, updateTaskStatus, createTask } from '../services/taskService';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [tasks, setTasks] = useState({
    'due-today': [],
    'completed': [],
    'overdue': []
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const allTasks = await fetchTasks();
      organizeTasks(allTasks);
    } catch (error) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const organizeTasks = (allTasks) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const organized = {
      'due-today': [],
      'completed': [],
      'overdue': []
    };

    allTasks.forEach(task => {
      const dueDate = new Date(task.dueDate);
      dueDate.setHours(0, 0, 0, 0);

      if (task.status === 'completed') {
        organized['completed'].push(task);
      } else if (dueDate < today) {
        organized['overdue'].push(task);
      } else if (dueDate.getTime() === today.getTime()) {
        organized['due-today'].push(task);
      }
    });

    setTasks(organized);
  };

  const handleDragEnd = async (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    try {
      const newStatus = destination.droppableId === 'completed' ? 'completed' : 'pending';
      await updateTaskStatus(draggableId, newStatus);
      
      const newTasks = { ...tasks };
      const sourceList = [...tasks[source.droppableId]];
      const destList = [...tasks[destination.droppableId]];
      
      const [movedTask] = sourceList.splice(source.index, 1);
      movedTask.status = newStatus;
      destList.splice(destination.index, 0, movedTask);
      
      newTasks[source.droppableId] = sourceList;
      newTasks[destination.droppableId] = destList;
      
      setTasks(newTasks);
      toast.success('Task updated successfully');
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      await createTask(taskData);
      toast.success('Task created successfully');
      loadTasks();
    } catch (error) {
      toast.error('Failed to create task');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>New Task</span>
        </button>
      </div>

      <AIInsights tasks={[...tasks['due-today'], ...tasks['overdue']]} />

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <TaskColumn
            title="Due Today"
            tasks={tasks['due-today']}
            id="due-today"
            loading={loading}
          />
          <TaskColumn
            title="Completed"
            tasks={tasks['completed']}
            id="completed"
            loading={loading}
          />
          <TaskColumn
            title="Overdue"
            tasks={tasks['overdue']}
            id="overdue"
            loading={loading}
          />
        </div>
      </DragDropContext>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateTask}
      />
    </div>
  );
};

export default Dashboard;