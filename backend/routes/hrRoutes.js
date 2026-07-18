const router = require("express").Router();
const hrController = require("../controllers/hrController");
// Routes for HR 
router.post("/apply", hrController.applyForJob);
router.patch("/status/:id", hrController.updateCandidateStatus);
router.get("/dashboard", hrController.getHRDashboard);

module.exports = router;
