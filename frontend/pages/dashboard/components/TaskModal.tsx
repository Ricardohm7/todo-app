import {useState} from 'react';
import {useAuth} from '@/contexts/AuthContext';
import {TaskInput} from '@/models/Task';
import {TaskStatus} from '@/models/taskStatus.enums';
import {useTasks} from '@/contexts/TaskContext';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  section: TaskStatus | null;
}

const TaskModal: React.FC<TaskModalProps> = ({isOpen, onClose, section}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [activity, setActivity] = useState([]);
  const [comment, setComment] = useState('');
  const {createTask} = useTasks();
  const {user} = useAuth();

  if (!isOpen) return null;

  const handleSave = async () => {
    const newTask: TaskInput = {
      title,
      description,
      status: section ?? TaskStatus.Pending,
      userId: user?.id ?? '',
    };
    await createTask(newTask);
    setTitle('');
    setDescription('');
    setActivity([]);
    onClose();
  };

  const handleAddComment = () => {
    // if (comment) {
    //   setActivity((prevActivity) => [...prevActivity, comment]);
    //   setComment('');
    // }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 text-white rounded-lg shadow-lg p-6 w-96">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Add a task in {section}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200"
          >
            &times;
          </button>
        </div>

        {/* Title */}
        <div>
          <label htmlFor="cardTitle" className="block text-sm mb-2">
            Title
          </label>
          <input
            id="cardTitle"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none"
          />
        </div>

        {/* Description */}
        <div className="mt-4">
          <label htmlFor="description" className="block text-sm mb-2">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none"
            rows={4}
            placeholder="Add a more detailed description..."
          />
        </div>

        {/* Activity Section */}
        {/* <div className="mt-4">
          <h3 className="text-sm font-semibold mb-2">Activity</h3>
          <div className="flex">
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none"
              placeholder="Write a comment..."
            />
            <button
              onClick={handleAddComment}
              className="ml-2 bg-green-700 text-sm px-4 py-2 rounded-lg hover:bg-green-500"
            >
              Send
            </button>
          </div>
          <div className="mt-2">
            {activity.map((item, index) => (
              <div
                key={index}
                className="text-sm bg-gray-800 p-2 rounded-lg mt-2"
              >
                {item}
              </div>
            ))}
          </div>
        </div> */}

        {/* Action Buttons */}
        <div className="flex justify-end mt-4">
          {/* <button
            onClick={onClose}
            className="bg-gray-700 text-sm px-4 py-2 rounded-lg mr-2 hover:bg-gray-600"
          >
            Cancel
          </button> */}
          <button
            onClick={handleSave}
            className="bg-blue-600 text-sm px-4 py-2 rounded-lg hover:bg-blue-500"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
