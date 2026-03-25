import "./App.css";

import React, { useState, useEffect } from "react";

function App() {
  const [tasks, setTasks] = useState([]); // A place to store our tasks
  const [taskInput, setTaskInput] = useState("");
  const API_URL = "https://task-manager-backend-b6xb.onrender.com";

  const toggleComplete = async (task) => {
    await fetch(`${API_URL}/tasks/${tasks._id}`, {
      method: "PUT",
      headers: { Content_Type: "application/json" },
      body: JSON.stringify({ completed: !task.completed }),
    });
    getTask();
  };

  const deleteTask = async (id) => {
    try {
      await fetch(`${API_URL}/tasks/${id}`, {
        method: "DELETE",
      });
      // This line updates the screen immediately without a refresh
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const addTask = async (e) => {
    e.preventDefault(); // Prevents the page from refreshing
    if (!taskInput) return;

    const response = await fetch(`${API_URL}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: taskInput }),
    });

    const newTask = await response.json();
    setTasks([...tasks, newTask]); // Adds the new task to the end of the list
    setTaskInput(""); // Clears the input box
  };

  // This runs automatically when the page loads
  useEffect(() => {
    fetch() // Pointing to your Express server
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => console.error("Error fetching:", err));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>My Task List</h1>
      <form onSubmit={addTask}>
        <input
          type="text"
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
          placeholder="Enter a new task..."
        />
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => toggleComplete(task)}
        />
        <span
          style={{ textDecoration: task.completed ? "line-through" : "none" }}
        >
          {task.name}
        </span>
        <button type="submit">Add Task</button>
      </form>
      <ul>
        {tasks.map((task) => (
          <li key={task._id} style={{ marginBottom: "10px" }}>
            {task.title}
            <button
              onClick={() => deleteTask(task._id)}
              style={{ marginLeft: "10px", color: "red" }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
