const express = require("express");
const protect = require("../middleware/auth.middleware");
const {
  analyzeResume,
  improveBullet,
} = require("../controllers/ai.controller");
const router = express.Router();

router.post("/analyze", protect, analyzeResume);
router.post("/improve-bullet", protect, improveBullet);

module.exports = router;
