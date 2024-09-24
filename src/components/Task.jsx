import { useEffect, useState } from 'react';

// eslint-disable-next-line react/prop-types
const Task = ({ id, deleteTask }) => {
  const [taskName, setTaskName] = useState('');
  const [taskStatus, setTaskStatus] = useState('Pending');
  const [taskDetails, setTaskDetails] = useState('');

  useEffect(() => {
    const storedName = localStorage.getItem(`task-${id}-name`);
    const storedStatus = localStorage.getItem(`task-${id}-status`);
    const storedDetails = localStorage.getItem(`task-${id}-details`);

    setTaskName(storedName || `Task #${id + 1}`);
    setTaskStatus(storedStatus || 'Pending');
    setTaskDetails(storedDetails || '');
  }, [id]);

  const updateTaskName = (name) => {
    setTaskName(name);
    localStorage.setItem(`task-${id}-name`, name);
  };

  const updateTaskStatus = (newStatus) => {
    setTaskStatus(newStatus);
    localStorage.setItem(`task-${id}-status`, newStatus);
  };

  const updateTaskDetails = (details) => {
    setTaskDetails(details);
    localStorage.setItem(`task-${id}-details`, details);
  };

  // Remove task from localStorage and call the deleteTask passed from Board
  const handleDeleteTask = () => {
    localStorage.removeItem(`task-${id}-name`);
    localStorage.removeItem(`task-${id}-status`);
    localStorage.removeItem(`task-${id}-details`);

    deleteTask(id);
  };

  return (
    <div className="task-card">
      <input
        type="text"
        value={taskName}
        onChange={(e) => updateTaskName(e.target.value)}
        placeholder="Enter task name"
      />
      <p>Status: {taskStatus}</p>
      <textarea
        placeholder="Enter task details..."
        value={taskDetails}
        onChange={(e) => updateTaskDetails(e.target.value)}
      />
      {/* Conditionally render status update buttons */}
      {taskStatus === 'Pending' && (
        <button onClick={() => updateTaskStatus('In Progress')}>In Progress</button>
      )}
      {taskStatus === 'In Progress' && (
        <button onClick={() => updateTaskStatus('Completed')}>Completed</button>
      )}
      <button onClick={handleDeleteTask}>Delete Task</button>
    </div>
  );
};

export default Task;
