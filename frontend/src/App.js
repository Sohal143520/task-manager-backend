import "./App.css";
import React, { useState, useEffect } from "react";

function App() {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState("");
  const API_URL = "https://task-manager-backend-b6xb.onrender.com";

  // FIX 1: Rename to getTasks (plural) and define it so you can call it later
  const getTasks = async () => {
    try {
      const res = await fetch(`${API_URL}/tasks`);
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error("Error fetching:", err);
    }
  };

  // Run automatically when the page loads
  useEffect(() => {
    getTasks();
  }, []);

  const toggleComplete = async (task) => {
    // FIX 2: Use task._id (single item), not tasks._id (the whole array)
    // FIX 3: Header key should be "Content-Type" (with a hyphen)
    await fetch(`${API_URL}/tasks/${task._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !task.completed }),
    });
    getTasks(); // Call the correct function name here
  };

  const deleteTask = async (id) => {
    try {
      await fetch(`${API_URL}/tasks/${id}`, {
        method: "DELETE",
      });
      // Updates the state locally for a fast UI feel
      setTasks(tasks.filter((t) => t._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!taskInput) return;

    const response = await fetch(`${API_URL}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: taskInput }),
    });

    const newTask = await response.json();
    setTasks([...tasks, newTask]);
    setTaskInput("");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>My Task List</h1>

      {/* FORM: For adding new tasks */}
      <form onSubmit={addTask} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
          placeholder="Enter a new task..."
        />
        <button type="submit">Add Task</button>
      </form>

      {/* LIST: Loop through tasks and show buttons for EACH one */}
      <ul>
        {tasks.map((task) => (
          <li
            key={task._id}
            style={{ marginBottom: "10px", listStyle: "none" }}
          >
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleComplete(task)}
            />
            <span
              style={{
                marginLeft: "10px",
                textDecoration: task.completed ? "line-through" : "none",
              }}
            >
              {task.title}
            </span>
            <button
              onClick={() => deleteTask(task._id)}
              style={{ marginLeft: "10px", color: "red", cursor: "pointer" }}
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
