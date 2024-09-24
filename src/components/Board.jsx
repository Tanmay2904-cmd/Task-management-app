import { useEffect, useState } from 'react';
import axios from 'axios'; // Import axios for making API requests
import TaskList from './TaskList';

const Board = () => {
  const [totalTasks, setTotalTasks] = useState(2);
  const [taskNames, setTaskNames] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null); // To store the selected task for cloning
  const [currentDate, setCurrentDate] = useState(''); // State for storing the fetched date

  // Load tasks from localStorage when component mounts
  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks'));
    if (storedTasks) {
      setTotalTasks(storedTasks.length);
      setTaskNames(storedTasks.map((taskId) => localStorage.getItem(`task-${taskId}-name`))); // Get task names from localStorage
    }
  }, []);

  // Fetch the current date from the API
  useEffect(() => {
    const fetchCurrentDate = async () => {
      try {
        const response = await axios.get('https://10000--main--fastapi--admin.dev.storewise.in/');
        const date = response.data.currentDate || response.data.date || response.data;
        setCurrentDate(date);
      } catch (error) {
        console.error('Error fetching date:', error);
      }
    };

    fetchCurrentDate();
  }, []);

  // Function to create a new task
  const increment = () => {
    setTimeout(() => {
      setTotalTasks((prevTasks) => {
        const newTotal = prevTasks + 1;
        const updatedTasks = [...Array(newTotal).keys()]; // Create array of task ids

        // Update localStorage with new total task count
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));

        // Add a default name for the new task
        localStorage.setItem(`task-${newTotal - 1}-name`, `Task #${newTotal}`);
        setTaskNames(updatedTasks.map((taskId) => localStorage.getItem(`task-${taskId}-name`)));

        return newTotal;
      });
    }, 500);
  };

  // Function to delete a task by its id
  const deleteTask = (id) => {
    const updatedTasks = JSON.parse(localStorage.getItem('tasks')).filter((taskId) => taskId !== id);

    // Remove task data from localStorage
    localStorage.removeItem(`task-${id}-name`);
    localStorage.removeItem(`task-${id}-status`);
    localStorage.removeItem(`task-${id}-details`);

    // Update localStorage and the task count
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    setTotalTasks(updatedTasks.length); // Update the totalTasks state
    setTaskNames(updatedTasks.map((taskId) => localStorage.getItem(`task-${taskId}-name`))); // Update task names
  };

  // Function to clone a selected task
  const cloneTask = () => {
    if (selectedTask !== null) {
      setTimeout(() => {
        setTotalTasks((prevTasks) => {
          const newTotal = prevTasks + 1;
          const updatedTasks = [...Array(newTotal).keys()];

          // Clone the selected task's data
          const selectedTaskId = selectedTask;
          const clonedTaskId = newTotal - 1;
          const taskName = localStorage.getItem(`task-${selectedTaskId}-name`);
          const taskStatus = localStorage.getItem(`task-${selectedTaskId}-status`);
          const taskDetails = localStorage.getItem(`task-${selectedTaskId}-details`);

          // Save cloned task data in localStorage
          localStorage.setItem(`task-${clonedTaskId}-name`, `${taskName} (Clone)`);
          localStorage.setItem(`task-${clonedTaskId}-status`, taskStatus);
          localStorage.setItem(`task-${clonedTaskId}-details`, taskDetails);

          // Update localStorage with new total task count
          localStorage.setItem('tasks', JSON.stringify(updatedTasks));

          // Update the task names
          setTaskNames(updatedTasks.map((taskId) => localStorage.getItem(`task-${taskId}-name`)));

          return newTotal;
        });
      }, 500);
    }
  };

  return (
    <div className="container">
      <header>
        <h1>Task Management App</h1>
        <p>Current Date: {currentDate ? currentDate : 'Loading...'}</p> {/* Display the current date */}
      </header>

      <h2>Tasks ({totalTasks})</h2>
      <button onClick={increment}>Create Task</button>

      {/* Clone Task Dropdown */}
      <div>
        <select onChange={(e) => setSelectedTask(e.target.value)} value={selectedTask || ''}>
          <option value="" disabled>Select a task to clone</option>
          {taskNames.map((name, index) => (
            <option key={index} value={index}>
              {name}
            </option>
          ))}
        </select>
        <button onClick={cloneTask} disabled={selectedTask === null}>Clone Task</button>
      </div>

      {/* Task List Container with Flexbox */}
      <div className="task-list-container">
        <TaskList taskCount={totalTasks} deleteTask={deleteTask} /> {/* Pass the deleteTask function */}
      </div>
    </div>
  );
};

export default Board;
