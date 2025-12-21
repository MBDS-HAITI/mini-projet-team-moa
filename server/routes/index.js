const express = require('express');
const studentRoutes = require('./students');
const courseRoutes = require('./courses');
const gradeRoutes = require('./grades');
const userRoutes = require('./users');
const statsRoutes = require('./stats');

const router = express.Router();

router.use('/students', studentRoutes);
router.use('/courses', courseRoutes);
router.use('/grades', gradeRoutes);
router.use('/users', userRoutes);
router.use('/stats', statsRoutes);

module.exports = router;
