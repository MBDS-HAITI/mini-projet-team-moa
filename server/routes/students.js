const express = require('express');
const { Student } = require('../models');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

const router = express.Router();

// Require authentication for all student routes
router.use(auth);

// List students
router.get('/', async (req, res) => {
  try {
    const students = await Student.find().lean();
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch students' });
  }
});

// Create a student (admin/teacher)
router.post('/', authorize('admin', 'teacher'), async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;
    const student = await Student.create({ firstName, lastName, email });
    res.status(201).json(student);
  } catch (error) {
    res.status(400).json({ error: error.message || 'Unable to create student' });
  }
});

// Update a student (admin/teacher)
router.put('/:id', authorize('admin', 'teacher'), async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;
    const updated = await Student.findByIdAndUpdate(
      req.params.id,
      { firstName, lastName, email },
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ error: 'Student not found' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message || 'Unable to update student' });
  }
});

// Delete a student (admin only)
router.delete('/:id', authorize('admin'), async (req, res) => {
  try {
    const deleted = await Student.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Student not found' });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Unable to delete student' });
  }
});

module.exports = router;
