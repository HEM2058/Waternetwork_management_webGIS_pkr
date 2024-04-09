import React, { useState, useEffect } from 'react';
import './Task.css';
import axios from 'axios'; // Import Axios for making HTTP requests

function Task({ onViewMap }) {
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

  const handleViewMap = (geometry) => {
    // Call the parent component's function with task geometry
    onViewMap(geometry);
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
              <p>Assigned to: {task.assigned_to}</p>
              <div className='feature-actions'> 
              <button title='Cancel the task' className="archive-button"> <i class="fas fa-times"></i></button>
              <button title='View on map' className="view-map-button" onClick={() => handleViewMap(task.geometry)}>  <i class="fas fa-map-marker-alt"></i></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Task;
