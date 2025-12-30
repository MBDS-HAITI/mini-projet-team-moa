const express = require('express');
const studentRoutes = require('./students');
const courseRoutes = require('./courses');
const gradeRoutes = require('./grades');
const userRoutes = require('./users');
const statsRoutes = require('./stats');
const googleRoutes = require('./google'); 
const notificationsRoutes = require('./notifications');

const router = express.Router();

router.use('/students', studentRoutes);
router.use('/courses', courseRoutes);
router.use('/grades', gradeRoutes);
router.use('/users', userRoutes);
router.use('/stats', statsRoutes);
router.use('/notifications', notificationsRoutes);
router.use('/', googleRoutes); 

module.exports = router;
