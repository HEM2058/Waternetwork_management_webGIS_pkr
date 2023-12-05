import React, { useState } from 'react';
import './Task.css';

function Task() {
  const [tasks, setTasks] = useState([
    { id: 1, name: 'Task 1', member: 'Member A' },
    { id: 2, name: 'Task 2', member: 'Member B' },
  ]);

  return (
    <div className="task-container">
      <h2>Task Management</h2>

      <button className="add-task-button">Add Task</button>

      <div className="task-list">
        {tasks.map((task) => (
          <div key={task.id} className="task-item">
            <h3>{task.name}</h3>
            <p>Member: {task.member}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Task;
