import React, {useEffect, useMemo, useState} from 'react';
import TaskItem from './components/TaskItem';
import {Task, TaskInput} from '@/models/Task';
import TaskModal from './components/TaskModal';
import {TaskStatus} from '@/models/taskStatus.enums';
import {useTasks} from '@/contexts/TaskContext';
import {useAuth} from '@/contexts/AuthContext';

const DashboardPage = () => {
  const [isOpenAddTaskModal, setIsOpenAddTaskModal] = useState(false);
  const [currentColumn, setCurrentColumn] = useState<TaskStatus | null>(null);
  const {tasks, fetchTasks, createTask} = useTasks();
  const {user} = useAuth();

  useEffect(() => {
    fetchTasks();
  }, []);

  const groupedTasks = useMemo(() => {
    let newTasks: Record<Task['status'], Task[]> = {
      pending: [],
      completed: [],
    };
    tasks.forEach((task) => {
      if (!newTasks[task.status]) {
        newTasks[task.status] = [];
      }
      newTasks[task.status].push(task);
    });
    return newTasks;
  }, [tasks]);

  const isTaskStatus = (value: any): value is TaskStatus => {
    return Object.values(TaskStatus).includes(value);
  };

  const handleAddNewTaskModal = (listName: string) => {
    if (isTaskStatus(listName)) {
      setCurrentColumn(listName);
    }
    setIsOpenAddTaskModal(true);
  };

  const handleSave = async ({
    title,
    description,
  }: {
    title: string;
    description: string;
  }) => {
    const newTask: TaskInput = {
      title,
      description,
      status: currentColumn ?? TaskStatus.Pending,
      userId: user?.id ?? '',
    };
    await createTask(newTask);
  };

  return (
    <>
      <div className="mt-8">
        <div className="task-board grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {/* Columns */}
          {Object.keys(groupedTasks).map((key) => (
            <div key={key} className="task-column bg-gray-900 p-4 rounded-lg">
              <h2 className="text-white font-bold capitalize text-center mb-5">
                {key}
              </h2>
              {groupedTasks[key].map((task) => (
                <TaskItem
                  key={task._id}
                  task={task}
                  statusList={Object.keys(groupedTasks)}
                />
              ))}
              <button
                onClick={() => handleAddNewTaskModal(key)}
                className="add-card text-sm text-white bg-gray-700 p-2 rounded mt-2"
              >
                + Add New
              </button>
            </div>
          ))}
        </div>
      </div>
      <TaskModal
        isOpen={isOpenAddTaskModal}
        onClose={() => setIsOpenAddTaskModal(false)}
        section={currentColumn}
        onSave={handleSave}
        modalTitle="Add new Task"
      />
    </>
  );
};

export default DashboardPage;
