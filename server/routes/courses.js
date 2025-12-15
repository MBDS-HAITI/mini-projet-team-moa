const express = require('express');
const { Course } = require('../models');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

const router = express.Router();

router.use(auth);

router.get('/', async (req, res) => {
  try {
    const courses = await Course.find().lean();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch courses' });
  }
});

router.post('/', authorize('admin', 'teacher'), async (req, res) => {
  try {
    const { name, code } = req.body;
    const course = await Course.create({ name, code });
    res.status(201).json(course);
  } catch (error) {
    res.status(400).json({ error: error.message || 'Unable to create course' });
  }
});

router.put('/:id', authorize('admin', 'teacher'), async (req, res) => {
  try {
    const { name, code } = req.body;
    const updated = await Course.findByIdAndUpdate(
      req.params.id,
      { name, code },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: 'Course not found' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message || 'Unable to update course' });
  }
});

router.delete('/:id', authorize('admin'), async (req, res) => {
  try {
    const deleted = await Course.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Course not found' });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Unable to delete course' });
  }
});

module.exports = router;
