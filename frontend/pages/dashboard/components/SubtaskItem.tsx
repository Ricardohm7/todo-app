import {useTasks} from '@/contexts/TaskContext';
import {TaskStatus} from '@/models/taskStatus.enums';
import React, {useState} from 'react';
import {FaChevronDown, FaEdit, FaTrash} from 'react-icons/fa';
import {Subtask} from '@/models/Subtask';

interface SubtaskItemProps {
  subtask: Subtask;
  taskId: string;
}

const SubtaskItem: React.FC<SubtaskItemProps> = ({subtask, taskId}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState(subtask.status);
  const {changeSubtaskStatus, deleteSubtask} = useTasks();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  const changeStatus = async (newStatus: TaskStatus) => {
    await changeSubtaskStatus({
      taskId,
      status: newStatus,
      subtaskId: subtask._id,
    });
    setStatus(newStatus);
    setIsOpen(false); // Close dropdown after selection
  };

  const onDeleteSubtask = async () => {
    debugger;
    await deleteSubtask(taskId, subtask._id);
  };

  return (
    <div className="items-center justify-between py-2 flex">
      <span>{subtask.title}</span>
      <div className="relative inline-block text-left">
        <button
          onClick={toggleDropdown}
          className={`px-2 py-1 rounded flex items-center ${
            subtask.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'
          } text-white`}
        >
          {subtask.status}
          <FaChevronDown size={10} className="ml-3" />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded shadow-lg z-20">
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
      <div className="flex justify-end gap-3">
        <FaTrash onClick={onDeleteSubtask} className="cursor-pointer" />
        <FaEdit onClick={() => {}} className="cursor-pointer" />
      </div>
    </div>
  );
};

export default SubtaskItem;
