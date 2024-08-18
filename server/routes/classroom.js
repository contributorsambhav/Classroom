const express = require('express');
const { check, validationResult } = require('express-validator');
const { restrictToLoginUserOnly } = require('../middleware/auth');
const Classroom = require('../models/Classroom');
const User = require('../models/User');
const router = express.Router();

// Middleware to check if user is a principal
const restrictToPrincipal = (req, res, next) => {
  if (req.user.role !== 'principal') {
    return res.status(403).json({ msg: 'User not authorized' });
  }
  next();
};

// Middleware to check if user is a principal or the assigned teacher
const restrictToPrincipalOrTeacher = async (req, res, next) => {
  const classroom = await Classroom.findById(req.params.classroomId);
  if (!classroom) {
    return res.status(404).json({ msg: 'Classroom not found' });
  }

  if (req.user.role !== 'principal' && classroom.teacher.toString() !== req.user.id) {
    return res.status(403).json({ msg: 'User not authorized' });
  }

  next();
};

// Create a classroom (Principal only)
router.post(
  '/create',
  [
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
router.put('/assign-teacher/:classroomId', async (req, res) => {
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

// Remove a teacher from a classroom (Principal only)

// Edit classroom details (Principal only)
router.put(
  '/edit/:classroomId',
  [
  
    check('name', 'Classroom name is required').optional().not().isEmpty(),
    check('startTime', 'Start time is required').optional().not().isEmpty(),
    check('endTime', 'End time is required').optional().not().isEmpty(),
    check('days', 'Days are required').optional().not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const classroom = await Classroom.findById(req.params.classroomId);
      if (!classroom) {
        return res.status(404).json({ msg: 'Classroom not found' });
      }

      const { name, startTime, endTime, days, teacher } = req.body;

      if (name) classroom.name = name;
      if (startTime) classroom.startTime = startTime;
      if (endTime) classroom.endTime = endTime;
      if (days) classroom.days = days;
      if (teacher) classroom.teacher = teacher


      await classroom.save();

      res.json({ msg: 'Classroom details updated', classroom });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// Add students to a classroom (Principal or Teacher)
router.put('/add-students/:classroomId',  async (req, res) => {
  const { studentIds } = req.body;

  try {
    const classroom = await Classroom.findById(req.params.classroomId);
    if (!classroom) {
      return res.status(404).json({ msg: 'Classroom not found' });
    }

    for (let studentId of studentIds) {
      const student = await User.findById(studentId);
      if (student && student.role === 'student' && !classroom.students.includes(studentId)) {
        classroom.students.push(studentId);
      }
    }

    await classroom.save();
    res.json(classroom);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Remove students from a classroom (Principal or Teacher)
router.put('/remove-students/:classroomId', async (req, res) => {
  const { studentIds } = req.body;

  try {
    const classroom = await Classroom.findById(req.params.classroomId);
    if (!classroom) {
      return res.status(404).json({ msg: 'Classroom not found' });
    }

    classroom.students = classroom.students.filter(studentId => !studentIds.includes(studentId.toString()));

    await classroom.save();
    res.json({ msg: 'Students removed from classroom', classroom });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Delete a classroom (Principal only)
router.delete('/:classroomId', async (req, res) => {
  try {
    const classroom = await Classroom.findByIdAndDelete(req.params.classroomId);
    if (!classroom) {
      return res.status(404).json({ msg: 'Classroom not found' });
    }

    res.json({ msg: 'Classroom deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});



router.delete('/users/:userId', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json({ msg: 'User deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


module.exports = router;
