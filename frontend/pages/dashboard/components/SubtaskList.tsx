import React from 'react';
import SubtaskItem from './SubtaskItem';
import {FaPlus, FaPlusCircle} from 'react-icons/fa';

const SubtaskList = ({taskId, subtasks, onSubtaskUpdated, onAddSubtTask}) => {
  return (
    <div className="mt-4 pl-4 border-l mb-4">
      <div className="flex items-center">
        <h4 className="flex-1 text-lg font-semibold mb-2">Subtasks</h4>{' '}
        <FaPlus className="cursor-pointer" onClick={onAddSubtTask} />
      </div>
      {subtasks.map((subtask) => (
        <SubtaskItem
          key={subtask._id}
          subtask={subtask}
          onSubtaskUpdated={onSubtaskUpdated}
        />
      ))}
    </div>
  );
};

export default SubtaskList;
