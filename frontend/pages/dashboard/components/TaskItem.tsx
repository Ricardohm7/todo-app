import React, {useState} from 'react';
import SubtaskList from './SubtaskList';
import {FaChevronDown, FaTrash} from 'react-icons/fa';
import {useTasks} from '@/contexts/TaskContext';
import {Task} from '@/models/Task';
import {TaskStatus} from '@/models/taskStatus.enums';

interface TaskItemProps {
  task: Task;
  statusList: TaskStatus[];
}

const TaskItem: React.FC<TaskItemProps> = ({task, statusList}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const {deleteTask, updateTaskStatus} = useTasks();
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState(task.status); // Initialize with default status

  // const toggleStatus = async (status: TaskStatus) => {
  //   await updateTaskStatus(task._id, status);
  // };

  const onDeleteTask = async () => {
    await deleteTask(task._id);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const changeStatus = async (newStatus: TaskStatus) => {
    await updateTaskStatus(task._id, newStatus);
    setStatus(newStatus);
    setIsOpen(false); // Close dropdown after selection
  };

  return (
    <div className="border p-4 mb-4 rounded bg-gray-800 hover:bg-gray-700">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">{task.title}</h3>
        <div className="relative inline-block text-left">
          <button
            onClick={toggleDropdown}
            className={`px-2 py-1 rounded flex items-center ${
              status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'
            } text-white`}
          >
            {status}
            <FaChevronDown size={10} className="ml-3" />
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded shadow-lg">
              <button
                onClick={() => changeStatus(TaskStatus.Pending)}
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left capitalize"
              >
                {TaskStatus.Pending}
              </button>
              <button
                onClick={() => changeStatus(TaskStatus.Completed)}
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left capitalize"
              >
                {TaskStatus.Completed}
              </button>
            </div>
          )}
        </div>
      </div>
      <p className="mt-2">{task.description}</p>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="mt-2 text-blue-500"
      >
        {isExpanded ? 'Hide Subtasks' : 'Show Subtasks'}
      </button>
      {isExpanded && (
        <SubtaskList
          taskId={task._id}
          subtasks={task.subtasks}
          onSubtaskUpdated={() => {}}
        />
      )}
      <div className="flex justify-end">
        <FaTrash onClick={onDeleteTask} className="cursor-pointer" />
      </div>
    </div>
  );
};

export default TaskItem;
