const express = require('express');
const studentRoutes = require('./students');
const courseRoutes = require('./courses');
const gradeRoutes = require('./grades');
const userRoutes = require('./users');

const router = express.Router();

router.use('/students', studentRoutes);
router.use('/courses', courseRoutes);
router.use('/grades', gradeRoutes);
router.use('/users', userRoutes);

module.exports = router;
