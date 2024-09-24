import Task from './Task';

// eslint-disable-next-line react/prop-types
const TaskList = ({ taskCount, deleteTask }) => {
  return (
    <div className="task-list">
      {[...Array(taskCount)].map((_, index) => (
        <div key={index} className="task-card">
          <Task id={index} deleteTask={deleteTask} />
        </div>
      ))}
    </div>
  );
};

export default TaskList;
