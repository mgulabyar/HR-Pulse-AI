const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  department: String,
  requirements: [String],  
  description: String,
  postedDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Job", JobSchema);
