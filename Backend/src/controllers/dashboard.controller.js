const JobApplication = require("../models/JobApplication");

const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const total = await JobApplication.countDocuments({ user: userId });
    const Applied = await JobApplication.countDocuments({ user: userId, status: "Applied" });
    const Screening = await JobApplication.countDocuments({ user: userId, status: "Screening" });
    const Interview = await JobApplication.countDocuments({ user: userId, status: "Interview" });
    const Offer = await JobApplication.countDocuments({ user: userId, status: "Offer" });
    const Rejected = await JobApplication.countDocuments({ user: userId, status: "Rejected" });
    const Selected = await JobApplication.countDocuments({ user: userId, status: "Selected" });

    res.json({
      stats: { total, Applied, Screening, Interview, Offer, Rejected, Selected }
    });
  } catch (err) {
    res.status(500).json({ message: "Dashboard stats error" });
  }
};

module.exports = { getDashboardStats };