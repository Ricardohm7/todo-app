import {useTasks} from '@/contexts/TaskContext';
import {TaskStatus} from '@/models/taskStatus.enums';
import React, {useEffect, useRef, useState} from 'react';
import {FaChevronDown, FaEdit, FaTrash} from 'react-icons/fa';
import {Subtask} from '@/models/Subtask';

interface SubtaskItemProps {
  subtask: Subtask;
  taskId: string;
  handleEditSubtaskModal: (subtask: Subtask) => void;
}

const SubtaskItem: React.FC<SubtaskItemProps> = ({
  subtask,
  taskId,
  handleEditSubtaskModal,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const {changeSubtaskStatus, deleteSubtask} = useTasks();
  const dropdownRef = useRef<HTMLDivElement>(null); // Reference to the dropdown

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  const changeStatus = async (newStatus: TaskStatus) => {
    await changeSubtaskStatus({
      taskId,
      status: newStatus,
      subtaskId: subtask._id,
    });
    setIsOpen(false); // Close dropdown after selection
  };

  const onDeleteSubtask = async () => {
    await deleteSubtask(taskId, subtask._id);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="items-center justify-between py-2 flex border-2 p-1 mb-2 rounded-md">
      <div className="flex flex-col flex-1">
        <span>{subtask.title}</span>
        {subtask.description}
      </div>
      <div className="relative inline-block text-left" ref={dropdownRef}>
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
        <FaTrash onClick={onDeleteSubtask} className="cursor-pointer ml-2" />
        <FaEdit
          onClick={() => handleEditSubtaskModal(subtask)}
          className="cursor-pointer"
        />
      </div>
    </div>
  );
};

export default SubtaskItem;
