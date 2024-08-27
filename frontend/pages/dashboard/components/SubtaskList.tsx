import React, {useState} from 'react';
import SubtaskItem from './SubtaskItem';
import {FaPlus} from 'react-icons/fa';
import {Subtask} from '@/models/Subtask';
import TaskModal from './TaskModal';
import {useTasks} from '@/contexts/TaskContext';

interface SubtaskListProps {
  taskId: string;
  subtasks: Subtask[];
  onAddSubtTask: () => void;
}

const SubtaskList: React.FC<SubtaskListProps> = ({
  taskId,
  subtasks,
  onAddSubtTask,
}) => {
  const [selectedSubtask, setSelectedSubtask] = useState<Subtask | null>(null);
  const [isOpenEditSubtaskModal, setIsOpenEditSubtaskModal] = useState(false);
  const {updateSubtask} = useTasks();

  const handleEditSubtaskModal = (subtask: Subtask) => {
    setIsOpenEditSubtaskModal(true);
    setSelectedSubtask(subtask);
  };

  const handleUpdateSubtask = async ({
    title,
    description,
  }: {
    title: string;
    description: string;
  }) => {
    await updateSubtask(taskId, selectedSubtask?._id ?? '', {
      title,
      description,
    });
    setIsOpenEditSubtaskModal(false);
  };

  return (
    <div className="mt-4 pl-4 border-l mb-4 bg-gray-600 p-4 rounded-md">
      <div className="flex items-center px-2 mb-2">
        <h4 className="flex-1 text-lg font-semibold mb-2">Subtasks</h4>{' '}
        <FaPlus className="cursor-pointer" onClick={onAddSubtTask} />
      </div>
      {subtasks.map((subtask) => (
        <SubtaskItem
          key={subtask._id}
          subtask={subtask}
          taskId={taskId}
          handleEditSubtaskModal={handleEditSubtaskModal}
        />
      ))}
      {isOpenEditSubtaskModal && (
        <TaskModal
          isOpen={isOpenEditSubtaskModal}
          onClose={() => setIsOpenEditSubtaskModal(false)}
          section={selectedSubtask?.status}
          onSave={handleUpdateSubtask}
          modalTitle="Update Subtask"
          taskData={selectedSubtask}
        />
      )}
    </div>
  );
};

export default SubtaskList;
