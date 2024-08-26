import React, {useState} from 'react';
import SubtaskList from './SubtaskList';
import {FaTrash} from 'react-icons/fa';
import {useTasks} from '@/contexts/TaskContext';

const TaskItem = ({task, onTaskUpdated}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const {deleteTask} = useTasks();

  const toggleStatus = async () => {
    const newStatus = task.status === 'pending' ? 'completed' : 'pending';
    await fetch(`/api/tasks/${task._id}/status`, {
      method: 'PATCH',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({status: newStatus}),
    });
    onTaskUpdated();
  };

  const onDeleteTask = async () => {
    await deleteTask(task._id);
  };

  return (
    <div className="border p-4 mb-4 rounded bg-gray-800 hover:bg-gray-700">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">{task.title}</h3>
        <button
          onClick={toggleStatus}
          className={`px-2 py-1 rounded ${
            task.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'
          } text-white`}
        >
          {task.status}
        </button>
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
          onSubtaskUpdated={onTaskUpdated}
        />
      )}
      <div className="flex justify-end">
        <FaTrash onClick={onDeleteTask} className="cursor-pointer" />
      </div>
    </div>
  );
};

export default TaskItem;
