import express from "express";
import multer from "multer";
import { Application } from "../models/Application.js";
import { Job } from "../models/Job.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// 📂 Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/resumes"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_")),
});
const upload = multer({ storage });

// 📌 Apply for a job
router.post("/", authMiddleware, upload.single("resume"), async (req, res) => {
  try {
    const { jobId, fullName, email, phone, coverLetter } = req.body;

    if (!jobId || !req.file) {
      return res.status(400).json({ message: "Missing jobId or resume file" });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const application = new Application({
      job: jobId,
      user: req.user._id,
      fullName,
      email,
      coverLetter,
      resume: req.file.filename, // store filename
    });

    await application.save();
    res.json({ message: "✅ Application submitted successfully", application });
  } catch (err) {
    console.error("❌ Error while applying:", err);
    res.status(500).json({ message: "Failed to apply" });
  }
});

// 📌 Fetch all my applications
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const apps = await Application.find({ user: req.user._id })
      .populate("job", "title company location")
      .sort({ createdAt: -1 });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch applications" });
  }
});

export default router;
