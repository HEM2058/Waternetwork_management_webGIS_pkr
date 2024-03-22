import React, { useState, useEffect } from 'react';
import './Task.css';
import axios from 'axios'; // Import Axios for making HTTP requests

function Task() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    // Fetch tasks from the API when the component mounts
    fetchTasks();
  }, []); // Empty dependency array ensures this effect runs only once

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/tasks/');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleAddTask = () => {
    // TODO: Implement logic to add a new task
    console.log('Add Task clicked');
  };

  return (
    <div className="task-container">
      <h2>Task Manager</h2>
      <button className="add-task-button" onClick={handleAddTask}>
        <i className="fas fa-plus"></i> Add Task
      </button>
      <div className='tasks'>
        <div className="task-list">
          {tasks.map((task) => (
            <div key={task.id} className="task-item">
              <h3>{task.task_name}</h3>
              <p>Description: {task.description}</p>
              <p>Status: {task.status}</p>
              <p>Assigned to: {task.assigned_to}</p>
              <p>Start Date: {new Date(task.start_date).toLocaleDateString()}</p>
              <p>Deadline: {new Date(task.deadline).toLocaleDateString()}</p>
              <button className="view-more-button">Edit Task</button>
              <button className="view-map-button">View on Map</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Task;
