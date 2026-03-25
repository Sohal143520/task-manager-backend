require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

// Use the variable from .env
const dbURI = process.env.MONGO_URI;

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const Task = mongoose.model("Task", taskSchema);
mongoose
  .connect(dbURI)
  .then(() => {
    console.log("Connnected to Mongodb");
  })
  .catch((err) => console.error("Could not connect...", err));

app.get("/", (req, res) => {
  res.send("Hello From The BackEnd");
});

app.get("/tasks", async (req, res) => {
  try {
    const allTasks = await Task.find(); // Fetches every document in the "tasks" collection
    res.status(200).json(allTasks);
  } catch (error) {
    res.status(500).json({ error: "Could not retrieve tasks" });
  }
});

app.post("/tasks", async (req, res) => {
  try {
    const newTask = new Task({
      title: req.body.title,
    });

    const savedTask = await newTask.save(); // This line does the heavy lifting
    res.status(201).json(savedTask);
    console.log("Task saved to DB:", savedTask);
  } catch (error) {
    res.status(400).json({ error: "Could not save task" });
  }
});
app.delete("/tasks/:id", async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ error: "Delete failed" });
  }
});

app.put("/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { completed } = req.body;
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { completed },
      { new: true },
    );
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json(error);
  }
});
app.listen(port, () => {
  console.log(`Server is running at http://lo1calhost:${port}`);
});
