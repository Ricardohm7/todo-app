import React, {createContext, useContext, ReactNode, useState} from 'react';
import {mapTaskFromApi, Task} from '../models/Task';
import {useApi} from '@/services/api';
import {useAuth} from './AuthContext';
import {TaskStatus} from '@/models/taskStatus.enums';
import {Subtask} from '@/models/Subtask';

interface TasksContextType {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  loading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  createTask: (taskData: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  updateTask: (id: string, taskData: Partial<Task>) => Promise<void>;
  updateTaskStatus: (taskId: string, status: TaskStatus) => Promise<void>;
  createSubtask: (subtaskData: Partial<Subtask>) => Promise<void>;
  changeSubtaskStatus: ({
    taskId,
    subtaskId,
    status,
  }: {
    taskId: string;
    subtaskId: string;
    status: TaskStatus;
  }) => Promise<void>;
  deleteSubtask: (taskId: string, subtaskId: string) => Promise<void>;
  updateSubtask: (
    taskId: string,
    subtaskId: string,
    subtask: Partial<Subtask>,
  ) => Promise<void>;

  // Add other functions as needed
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export const TasksProvider: React.FC<{children: ReactNode}> = ({children}) => {
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

  const updateTaskStatus = async (taskId: string, status: TaskStatus) => {
    setLoading(true);
    setError(null);
    try {
      await api.patch(`/tasks/${taskId}/status`, {status});
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId ? {...task, status} : task,
        ),
      );
    } catch (err) {
      setError('Failed to delete task');
    } finally {
      setLoading(false);
    }
  };

  const createSubtask = async (subtaskData: Partial<Subtask>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post(`/subtasks`, subtaskData);
      const updateTasks = tasks.map((task) =>
        task._id === subtaskData.task
          ? {
              ...task,
              subtasks: [
                ...task.subtasks,
                {...subtaskData, _id: response._id} as Subtask,
              ],
            }
          : task,
      );
      setTasks(updateTasks);
    } catch (err) {
      setError('Failed to create subtask');
    } finally {
      setLoading(false);
    }
  };

  const changeSubtaskStatus = async ({
    taskId,
    subtaskId,
    status,
  }: {
    taskId: string;
    subtaskId: string;
    status: TaskStatus;
  }) => {
    setLoading(true);
    setError(null);
    try {
      await api.patch(`/subtasks/${subtaskId}/status`, {status: status});
      const updateTasks = tasks.map((task) =>
        task._id === taskId
          ? {
              ...task,
              subtasks: task.subtasks.map((sub) =>
                sub._id === subtaskId ? {...sub, status: status} : sub,
              ),
            }
          : task,
      );
      setTasks(updateTasks);
    } catch (err) {
      setError('Failed to change subtask status');
    } finally {
      setLoading(false);
    }
  };

  const deleteSubtask = async (taskId: string, subtaskId: string) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/subtasks/${subtaskId}`);
      const updateTasks = tasks.map((task) =>
        task._id === taskId
          ? {
              ...task,
              subtasks: task.subtasks.filter((sub) => sub._id !== subtaskId),
            }
          : task,
      );
      setTasks(updateTasks);
    } catch (err) {
      setError('Failed to delete subtask');
    } finally {
      setLoading(false);
    }
  };

  const updateSubtask = async (
    taskId: string,
    subtaskId: string,
    subtask: Subtask,
  ) => {
    setLoading(true);
    setError(null);
    try {
      await api.put(`/subtasks/${subtaskId}`, subtask);
      const updateTasks = tasks.map((task) =>
        task._id === taskId
          ? {
              ...task,
              subtasks: task.subtasks.map((sub) =>
                sub._id === subtaskId ? {...sub, ...subtask} : sub,
              ),
            }
          : task,
      );
      setTasks(updateTasks);
    } catch (err) {
      setError('Failed to delete subtask');
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
        updateTaskStatus,
        createSubtask,
        changeSubtaskStatus,
        deleteSubtask,
        updateSubtask,
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
