import { useState } from 'react';
import { createTask, updateTask, deleteTask } from '../services/taskService';
import toast from 'react-hot-toast';

export const useTaskOperations = (onTasksChange) => {
    const [loading, setLoading] = useState(false);

    const handleCreateTask = async (taskData) => {
        setLoading(true);
        try {
            await createTask(taskData);
            toast.success('Task created successfully');
            onTasksChange?.();
        } catch (error) {
            toast.error('Failed to create task');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateTask = async (id, taskData) => {
        setLoading(true);
        try {
            await updateTask(id, taskData);
            toast.success('Task updated successfully');
            onTasksChange?.();
        } catch (error) {
            toast.error('Failed to update task');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteTask = async (id) => {
        setLoading(true);
        try {
            await deleteTask(id);
            toast.success('Task deleted successfully');
            onTasksChange?.();
        } catch (error) {
            toast.error('Failed to delete task');
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        handleCreateTask,
        handleUpdateTask,
        handleDeleteTask
    };
};