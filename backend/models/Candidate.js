const mongoose = require("mongoose");
// Define the Candidate scheme
const CandidateSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
  name: { type: String, required: true },
  email: { type: String, required: true },
  resumeText: String,
  status: {
    type: String,
    enum: ["Applied", "Interview", "Rejected", "Hired"],
    default: "Applied",
  },
  aiScore: { type: Number, default: 0 },
  aiAnalysis: String,
  appliedDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Candidate", CandidateSchema);
