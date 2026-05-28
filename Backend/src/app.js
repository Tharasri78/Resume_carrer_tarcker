const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const resumeRoutes = require("./routes/resume.routes");
const userRoutes = require("./routes/user.routes");
const jobRoutes = require("./routes/job.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const notificationRoutes = require("./routes/notification.routes");
const aiRoutes = require("./routes/ai.routes");

const app = express();


// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true, limit: "100mb" }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/users", userRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/ai", aiRoutes);
// Test route
app.get("/", (req, res) => {
  res.json({ 
    message: "API is running...",
    endpoints: {
      register: "POST /api/auth/register",
      login: "POST /api/auth/login"
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({ 
    message: "Internal server error",
    error: err.message 
  });
});

module.exports = app;