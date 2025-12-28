const express = require('express');
const { Student } = require('../models');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

const router = express.Router();

// Require authentication for all student routes
router.use(auth);

// List students (students see only themselves, teachers/admins see all)
router.get('/', async (req, res) => {
  try {
    let query = {};
    const role = (req.user?.role || '').toLowerCase();
    
    // Si c'est un étudiant, voir uniquement son profil
    if (role === 'student') {
      // Chercher d'abord par userId, sinon par email
      const { User } = require('../models');
      const user = await User.findById(req.user.id).lean();
      
      query.$or = [
        { userId: req.user.id },
        { email: user?.email }
      ];
    }
    
    const students = await Student.find(query).lean();
    res.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Unable to fetch students' });
  }
});

// Create a student (admin only)
router.post('/', authorize('admin'), async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;
    const student = await Student.create({ firstName, lastName, email });
    res.status(201).json(student);
  } catch (error) {
    res.status(400).json({ error: error.message || 'Unable to create student' });
  }
});

// Update a student (admin/scolarite)
router.put('/:id', authorize('admin', 'scolarite'), async (req, res) => {
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
