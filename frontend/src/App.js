import "./App.css";
import React, { useState, useEffect } from "react";

function App() {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState("");
  const API_URL = "https://task-manager-backend-b6xb.onrender.com";

  // FIX 1: Defined as getTasks (plural)
  const getTasks = async () => {
    try {
      const res = await fetch(`${API_URL}/tasks`);
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error("Error fetching:", err);
    }
  };

  useEffect(() => {
    getTasks();
  }, []);

  const toggleComplete = async (task) => {
    try {
      await fetch(`${API_URL}/tasks/${task._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !task.completed }),
      });
      getTasks(); // FIX 2: Corrected the typo here from getTask to getTasks
    } catch (err) {
      console.error("Toggle failed:", err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await fetch(`${API_URL}/tasks/${id}`, {
        method: "DELETE",
      });
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
  const incompleteTasks = tasks.filter((task) => !task.completed).length;
  return (
    <div style={{ padding: "20px" }}>
      <h1>My Task List</h1>
      <h3 style={{ color: incompleteTasks == 0 ? "green" : "orange" }}>
        {incompleteTasks === 0
          ? "All done! Nice work."
          : `you have ${incompleteTasks} tasks remainning.`}
      </h3>
      <form onSubmit={addTask} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
          placeholder="Enter a new task..."
        />
        <button type="submit">Add Task</button>
      </form>

      <ul>
        {/* FIX 3: Moved everything inside the .map() loop */}
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
