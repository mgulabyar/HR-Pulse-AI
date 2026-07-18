require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/hr', require('./routes/hrRoutes'));

// SEED DATA FOR TESTING
app.post('/api/hr/seed-job', async (req, res) => {
  const Job = require('./models/Job');
  await Job.deleteMany({});
  const newJob = await Job.create({
    title: "Senior Full Stack Developer",
    department: "Engineering",
    requirements: ["React", "Node.js", "MongoDB", "AI Integration"],
    description: "Looking for an expert developer with 5+ years experience in MERN stack and OpenAI APIs."
  });
  res.json({ message: "Job Created", jobId: newJob._id });
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => app.listen(5000, () => console.log('HR-Pulse AI Node Active on Port 5000')))
  .catch(err => console.log(err));