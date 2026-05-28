const express = require("express");
const protect = require("../middleware/auth.middleware");
const {
  getResume,
  saveResume,
} = require("../controllers/resume.controller");
const router = express.Router();

router.get("/", protect, getResume);

router.post("/", protect, saveResume);

module.exports = router;
