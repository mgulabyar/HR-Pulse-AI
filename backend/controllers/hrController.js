const Job = require("../models/Job");
const Candidate = require("../models/Candidate");
const { screenCandidate } = require("../services/aiScreening.js");

// 1. Process Application (Trigger AI Analysis)
exports.applyForJob = async (req, res) => {
  try {
    const { jobId, name, email, resumeText } = req.body;

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job post not found" });

    // AI Logic Trigger
    const analysis = await screenCandidate(job.description, resumeText);

    // Extract score from text (simple logic for portfolio)
    const scoreMatch = analysis.match(/MATCH SCORE:\s*(\d+)/);
    const aiScore = scoreMatch ? parseInt(scoreMatch[1]) : 0;

    const candidate = await Candidate.create({
      jobId,
      name,
      email,
      resumeText,
      aiScore,
      aiAnalysis: analysis,
    });

    res.json({ status: "Application Processed", candidate });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 2. Update Kanban Status
exports.updateCandidateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updated = await Candidate.findByIdAndUpdate(
      id,
      { status },
      { new: true },
    );
    res.json({ message: "Kanban State Synchronized", updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. Get Dashboard Data
exports.getHRDashboard = async (req, res) => {
  try {
    const candidates = await Candidate.find().populate("jobId");
    res.json({ candidates });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
