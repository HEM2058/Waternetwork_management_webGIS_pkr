// Task.js
import React, { useState } from 'react';
import './Task.css';

function Task() {
  const [tasks, setTasks] = useState([
    { id: 1, name: 'Pipeline Installation (Mahendrapool)', assignedTo: ['Ram', 'Hari'] },
    { id: 2, name: 'Pipeline Installation (Lamachaour)', assignedTo: ['Laxman', 'Bharat'] },
    { id: 3, name: 'Pipeline Installation (Batulechour)', assignedTo: ['Laxman', 'Bharat'] },
    { id: 3, name: 'Pipeline Installation (Batulechour)', assignedTo: ['Laxman', 'Bharat'] },
  ]);

  const handleAddTask = () => {
    // TODO: Implement logic to add a new task
    console.log('Add Task clicked');
  };

  return (
    <div className="task-container">
      <h2>Task Management</h2>
      <button className="add-task-button" onClick={handleAddTask}>
        <i className="fas fa-plus"></i> Add Task
      </button>
     <div className='tasks'>
      <div className="task-list">
        {tasks.map((task) => (
          <div key={task.id} className="task-item">
            <h3>{task.name}</h3>
            <p>Assigned to: {task.assignedTo.join(', ')}</p>
          </div>
          
        ))}
        </div>
      </div>
    </div>
  );
}

export default Task;
