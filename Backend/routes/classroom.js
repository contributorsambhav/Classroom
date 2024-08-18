const express = require('express');
const { check, validationResult } = require('express-validator');
const {restrictToLoginUserOnly} = require('../middleware/auth');
const Classroom = require('../models/Classroom');
const User = require('../models/User');
const router = express.Router();

// Create a classroom (Principal only)
router.post(
  '/create',
  [
    restrictToLoginUserOnly, // middleware to ensure user is authenticated
    check('name', 'Classroom name is required').not().isEmpty(),
    check('startTime', 'Start time is required').not().isEmpty(),
    check('endTime', 'End time is required').not().isEmpty(),
    check('days', 'Days are required').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, startTime, endTime, days } = req.body;

      const newClassroom = new Classroom({
        name,
        startTime,
        endTime,
        days,
      });

      const classroom = await newClassroom.save();
      res.json(classroom);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// Assign a teacher to a classroom (Principal only)
router.put('/assign-teacher/:classroomId', restrictToLoginUserOnly, async (req, res) => {
  const { teacherId } = req.body;

  try {
    const classroom = await Classroom.findById(req.params.classroomId);
    if (!classroom) {
      return res.status(404).json({ msg: 'Classroom not found' });
    }

    const teacher = await User.findById(teacherId);
    if (!teacher || teacher.role !== 'teacher') {
      return res.status(404).json({ msg: 'Teacher not found' });
    }

    classroom.teacher = teacherId;
    await classroom.save();

    res.json(classroom);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Add students to a classroom (Principal or Teacher)
router.put('/add-students/:classroomId', restrictToLoginUserOnly, async (req, res) => {
  const { studentIds } = req.body;

  try {
    const classroom = await Classroom.findById(req.params.classroomId);
    if (!classroom) {
      return res.status(404).json({ msg: 'Classroom not found' });
    }

    studentIds.forEach(async (studentId) => {
      const student = await User.findById(studentId);
      if (student && student.role === 'student') {
        classroom.students.push(studentId);
      }
    });

    await classroom.save();
    res.json(classroom);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
