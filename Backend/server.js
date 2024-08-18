const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const classroomRoutes = require('./routes/classroom');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { restrictToLoginUserOnly } = require("./middleware/auth.js");
const profileRoutes = require("./routes/profileRoutes.js");

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser()); // Add this line to use cookie-parser
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  methods: ['GET', 'POST'],
  credentials: true // Enable cookies to be sent
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

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
