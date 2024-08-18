const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const classroomRoutes = require('./routes/classroom');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { restrictToLoginUserOnly } = require("./middleware/auth.js");
const profileRoutes = require("./routes/profileRoutes.js");
const User = require('./models/User'); // Import the User model
const Classroom = require('./models/Classroom.js'); 

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173',
  methods : ["GET","POST","PUT","PATCH","DELETE"],
  credentials : true

}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/classroom', classroomRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Test Route
app.get("/", (req, res) => {
  res.send("yes api works");
});

app.use('/profile', restrictToLoginUserOnly, profileRoutes);

// Fetch and return list of users
app.get("/list", async (req, res) => {
  try {
    const users = await User.find(); // Fetch all users from MongoDB
    console.log(users);
    res.json(users); // Return the users as a JSON object
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

app.get("/list-classroom", async (req, res) => {
  try {
    const classrooms = await Classroom.find(); // Fetch all users from MongoDB
    console.log(classrooms);
    res.json(classrooms); // Return the users as a JSON object
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
