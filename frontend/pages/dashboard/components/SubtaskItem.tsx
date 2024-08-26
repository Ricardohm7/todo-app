import React from 'react';

const SubtaskItem = ({subtask, onSubtaskUpdated}) => {
  const toggleStatus = async () => {
    const newStatus = subtask.status === 'pending' ? 'completed' : 'pending';
    await fetch(`/api/subtasks/${subtask._id}/status`, {
      method: 'PATCH',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({status: newStatus}),
    });
    onSubtaskUpdated();
  };

  return (
    <div className="flex items-center justify-between py-2">
      <span>{subtask.title}</span>
      <button
        onClick={toggleStatus}
        className={`px-2 py-1 rounded ${
          subtask.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'
        } text-white text-sm`}
      >
        {subtask.status}
      </button>
    </div>
  );
};

export default SubtaskItem;
