const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const classroomRoutes = require('./routes/classroom');

dotenv.config();

const app = express();

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/classroom', classroomRoutes);

console.log(process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

const PORT = process.env.PORT || 5000;

app.get("/",(req,res)=>{
  res.send("yes api works")
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
