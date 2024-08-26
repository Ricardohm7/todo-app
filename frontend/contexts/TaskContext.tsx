import React, {createContext, useContext, ReactNode, useState} from 'react';
import {mapTaskFromApi, Task} from '../models/Task';
import {useApi} from '@/services/api';
import {useAuth} from './AuthContext';

interface TasksContextType {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  loading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  createTask: (taskData: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  updateTask: (id: string, taskData: Partial<Task>) => Promise<void>;
  // Add other functions as needed
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export const TasksProvider: React.FC<{children: ReactNode}> = ({children}) => {
  // const tasksData = useTasksHook(); // Use your original hook
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const api = useApi();
  const {user} = useAuth();

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.get(`/tasks/user/${user?.id}`);
      setTasks(data.map(mapTaskFromApi));
    } catch (err) {
      setError('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskData: Partial<Task>) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.post('/tasks', taskData);
      const newTasks = [...tasks, mapTaskFromApi(data)];
      setTasks(newTasks);
    } catch (err) {
      setError('Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (id: string, taskData: Partial<Task>) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.put(`/tasks/${id}`, taskData);
      setTasks((prev) =>
        prev.map((task) => (task._id === id ? mapTaskFromApi(data) : task)),
      );
    } catch (err) {
      setError('Failed to update task');
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/tasks/${id}`);
      const newTasks = tasks.filter((task) => task._id !== id);
      setTasks(newTasks);
    } catch (err) {
      setError('Failed to delete task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <TasksContext.Provider
      value={{
        tasks,
        setTasks,
        loading,
        error,
        fetchTasks,
        createTask,
        deleteTask,
        updateTask,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TasksContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TasksProvider');
  }
  return context;
};
