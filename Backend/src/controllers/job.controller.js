const JobApplication = require("../models/JobApplication");


// CREATE JOB
exports.createJob = async (req, res) => {
  try {

    const { company, role, status, followUpDate, notes, salary, priority, tags, deadline, companyLogo } = req.body;

    if (!company || !role) {
      return res.status(400).json({ message: "Company and role required" });
    }

    const job = await JobApplication.create({
      user: req.user._id,
      company,
      role,
      status,
      followUpDate,
      notes,
      salary,
      priority,
      tags,
      deadline,
      companyLogo
    });

    res.status(201).json(job);

  } catch (error) {

    console.error("CREATE JOB ERROR:", error);

    res.status(500).json({
      message: "Failed to create job",
      error: error.message
    });

  }
};



// GET ALL JOBS
exports.getJobs = async (req, res) => {
  try {

    const jobs = await JobApplication.find({
      user: req.user._id
    }).sort({ createdAt: -1 });

    res.json(jobs);

  } catch (error) {

    console.error("GET JOBS ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch jobs"
    });

  }
};



// UPDATE JOB STATUS
exports.updateJob = async (req, res) => {
  try {

    const job = await JobApplication.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json(job);

  } catch (error) {

    console.error("UPDATE JOB ERROR:", error);

    res.status(500).json({
      message: "Failed to update job"
    });

  }
};

exports.getUpcomingFollowUps = async (req, res) => {
  try {

    const today = new Date();

    const jobs = await JobApplication.find({
      user: req.user._id,
      followUpDate: { $gte: today }
    })
    .sort({ followUpDate: 1 })
    .limit(5);

    res.json(jobs);

  } catch (err) {
    res.status(500).json({ message: "Failed to fetch follow-ups" });
  }
};