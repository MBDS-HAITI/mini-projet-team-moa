const express = require('express');
const { Student, Course, Grade, User } = require('../models');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth);

// Get statistics based on user role
router.get('/', async (req, res) => {
  try {
    const role = (req.user?.role || '').toLowerCase();
    let stats = {};

    if (role === 'admin') {
      // Admin: vision globale sur tout
      const [studentCount, courseCount, gradeCount, userCount] = await Promise.all([
        Student.countDocuments({}),
        Course.countDocuments({}),
        Grade.countDocuments({}),
        User.countDocuments({})
      ]);

      const grades = await Grade.find({}).lean();
      const gradeValues = grades.map(g => g.grade);
      const avgGrade = gradeValues.length > 0 
        ? (gradeValues.reduce((a, b) => a + b, 0) / gradeValues.length).toFixed(2)
        : 0;
      const maxGrade = gradeValues.length > 0 ? Math.max(...gradeValues) : 0;
      const minGrade = gradeValues.length > 0 ? Math.min(...gradeValues) : 0;

      // Répartition par cours
      const gradesByCourse = await Grade.aggregate([
        { $group: { _id: '$course', count: { $sum: 1 }, avgGrade: { $avg: '$grade' } } },
        { $lookup: { from: 'courses', localField: '_id', foreignField: '_id', as: 'course' } },
        { $unwind: '$course' },
        { $project: { courseName: '$course.name', count: 1, avgGrade: { $round: ['$avgGrade', 2] } } }
      ]);

      stats = {
        role: 'admin',
        totalStudents: studentCount,
        totalCourses: courseCount,
        totalGrades: gradeCount,
        totalUsers: userCount,
        avgGrade,
        maxGrade,
        minGrade,
        gradesByCourse
      };
    } else if (role === 'scolarite') {
      // Scolarité: vision sur étudiants, cours, notes
      const [studentCount, courseCount, gradeCount] = await Promise.all([
        Student.countDocuments({}),
        Course.countDocuments({}),
        Grade.countDocuments({})
      ]);

      const grades = await Grade.find({}).lean();
      const gradeValues = grades.map(g => g.grade);
      const avgGrade = gradeValues.length > 0 
        ? (gradeValues.reduce((a, b) => a + b, 0) / gradeValues.length).toFixed(2)
        : 0;
      const maxGrade = gradeValues.length > 0 ? Math.max(...gradeValues) : 0;
      const minGrade = gradeValues.length > 0 ? Math.min(...gradeValues) : 0;

      const gradesByCourse = await Grade.aggregate([
        { $group: { _id: '$course', count: { $sum: 1 }, avgGrade: { $avg: '$grade' } } },
        { $lookup: { from: 'courses', localField: '_id', foreignField: '_id', as: 'course' } },
        { $unwind: '$course' },
        { $project: { courseName: '$course.name', count: 1, avgGrade: { $round: ['$avgGrade', 2] } } }
      ]);

      stats = {
        role: 'scolarite',
        totalStudents: studentCount,
        totalCourses: courseCount,
        totalGrades: gradeCount,
        avgGrade,
        maxGrade,
        minGrade,
        gradesByCourse
      };
    } else if (role === 'student') {
      // Étudiant: ses propres notes
      const student = await Student.findOne({
        $or: [{ userId: req.user._id }, { email: req.user.email }]
      }).lean();

      if (!student) {
        return res.status(404).json({ error: 'Aucun dossier étudiant trouvé' });
      }

      const grades = await Grade.find({ student: student._id })
        .populate('course', 'name code')
        .lean();

      const gradeValues = grades.map(g => g.grade);
      const avgGrade = gradeValues.length > 0 
        ? (gradeValues.reduce((a, b) => a + b, 0) / gradeValues.length).toFixed(2)
        : 0;
      const maxGrade = gradeValues.length > 0 ? Math.max(...gradeValues) : 0;
      const minGrade = gradeValues.length > 0 ? Math.min(...gradeValues) : 0;

      stats = {
        role: 'student',
        studentName: `${student.firstName} ${student.lastName}`,
        totalGrades: grades.length,
        avgGrade,
        maxGrade,
        minGrade,
        grades: grades.map(g => ({
          courseName: g.course?.name || 'N/A',
          courseCode: g.course?.code || 'N/A',
          grade: g.grade,
          date: g.date
        }))
      };
    } else {
      return res.status(403).json({ error: 'Rôle non autorisé' });
    }

    res.json(stats);
  } catch (error) {
    console.error('Error in /stats:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
