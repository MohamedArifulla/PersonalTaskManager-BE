const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const Task = require('../models/Task');
const mongoose = require('mongoose');

const router = express.Router();

// Fetch all tasks for the logged-in user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const tasks = await Task.find({ email: req.user.email });
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Fetch a single task by ID for the logged-in user
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid task ID' });
    }

    const task = await Task.findOne({ _id: id, email: req.user.email });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Create a new task for the logged-in user
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, description, dueDate, category, status, priority } = req.body;

    if (!title || !description || !dueDate || !category) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const duplicateTask = await Task.findOne({ title, dueDate, email: req.user.email });

    if (duplicateTask) {
      return res.status(400).json({ message: 'Task with the same title and due date already exists' });
    }

    const newTask = new Task({
      title,
      description,
      dueDate,
      category,
      status,
      priority,
      email: req.user.email
    });

    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Update a task for the logged-in user
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid task ID' });
    }

    const updatedTask = await Task.findOneAndUpdate(
      { _id: id, email: req.user.email },
      req.body,
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Delete a task for the logged-in user
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid task ID' });
    }

    const deletedTask = await Task.findOneAndDelete({ _id: id, email: req.user.email });

    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(204).end();
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
