import {useState} from 'react';
import {useApi} from '../services/api';
import {Task, mapTaskFromApi} from '../models/Task';
import {useAuth} from '@/contexts/AuthContext';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  console.log('tasks......', tasks);
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
    // setLoading(true);
    // setError(null);
    try {
      await api.delete(`/tasks/${id}`);
      const newTask = tasks.filter((task) => task._id !== id);
      setTasks(newTask);
    } catch (err) {
      // setError('Failed to delete task');
    } finally {
      // setLoading(false);
    }
  };

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
  };
};
