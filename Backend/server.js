const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const classroomRoutes = require('./routes/classroom');
const cors = require('cors');
dotenv.config();

const app = express();

// Apply middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend origin
  methods: ['GET', 'POST'], // Allowed methods
  credentials: true // Allow credentials (cookies, authorization headers)
}));

// Define routes
app.use('/api/auth', authRoutes);
app.use('/api/classroom', classroomRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Define a simple route
app.get("/", (req, res) => {
  res.send("yes api works");
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
