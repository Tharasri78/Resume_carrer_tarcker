const fetch = require("node-fetch");

// System Prompt for ATS Scan
const ATS_PROMPT = `
You are an expert technical recruiter and ATS (Applicant Tracking System) scanner. 
Analyze the provided RESUME text and compare it with the provided JOB DESCRIPTION.
Deliver your analysis in STRICT JSON format. Do not return any Markdown wrapper, backticks, or extra text.

The JSON object MUST contain the following properties:
1. "atsScore": An integer between 0 and 100 representing the match percentage.
2. "missingKeywords": An array of important technical or soft skill keywords found in the job description but missing/weak in the resume.
3. "suggestions": An array of 3-5 specific, actionable bullet points to improve the resume (formatting, metrics, achievements, STAR method).
4. "skillsMatch": An object with categories "Frontend", "Backend", "DevOps", "Soft Skills" mapped to match scores (integers 0-100) based on the skill profiles.

Format of requested JSON:
{
  "atsScore": 75,
  "missingKeywords": ["Docker", "TypeScript", "System Design"],
  "suggestions": ["Add metrics like performance improvements to projects", "Mention state management tools in the React section"],
  "skillsMatch": {
    "Frontend": 85,
    "Backend": 60,
    "DevOps": 30,
    "Soft Skills": 90
  }
}
`;

// System Prompt for Bullet Improver
const BULLET_IMPROVER_PROMPT = `
You are an elite career coach. 
Improve the following resume bullet point using the STAR method (Situation, Task, Action, Result). 
Ensure the improved bullet starts with a strong action verb, includes a specific technical context, and states a quantified metric/business impact (make a realistic estimation if none is provided).

Deliver your response in STRICT JSON format:
{
  "improvedBullet": "Enhanced rewritten bullet point here"
}
`;

const MAX_GEMINI_BODY_BYTES = 48000;

const getByteLength = (str) => Buffer.byteLength(str || "", "utf8");

const truncateText = (text, maxBytes) => {
  if (!text) return "";
  let bytes = 0;
  let result = "";
  for (const char of text) {
    const charBytes = Buffer.byteLength(char, "utf8");
    if (bytes + charBytes > maxBytes) break;
    bytes += charBytes;
    result += char;
  }
  return result;
};

const buildGeminiRequestBody = (promptText) =>
  JSON.stringify({
    contents: [{ parts: [{ text: promptText }] }],
    generationConfig: {
      responseMimeType: "application/json"
    }
  });

const shouldUseFallback = (responseText) =>
  responseText?.includes("payload size exceeds limit") ||
  responseText?.includes("INVALID_ARGUMENT");

// 🔎 ATS ANALYZER CONTROLLER
exports.analyzeResume = async (req, res) => {
  try {
    const { resumeText, jobDescription } = req.body;

    if (!resumeText || !jobDescription) {
      return res.status(400).json({ message: "Resume text and Job Description are required." });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey === "YOUR_GEMINI_API_KEY_HERE" || apiKey.trim() === "") {
      console.warn("⚠️ GEMINI_API_KEY is not configured. Running with high-fidelity Mock Analyzer.");
      const mockResult = generateMockATS(resumeText, jobDescription);
      return res.json(mockResult);
    }

    let trimmedResume = resumeText;
    let trimmedJobDescription = jobDescription;

    const buildPrompt = (resume, jd) => `
${ATS_PROMPT}

[RESUME]
${resume}

[JOB DESCRIPTION]
${jd}
`;

    let promptText = buildPrompt(trimmedResume, trimmedJobDescription);
    let body = buildGeminiRequestBody(promptText);

    if (getByteLength(body) > MAX_GEMINI_BODY_BYTES) {
      console.warn("Gemini request payload too large, truncating resume/job description.");
      const wrapperOverhead = getByteLength(buildGeminiRequestBody(""));
      const availableBytes = Math.max(0, MAX_GEMINI_BODY_BYTES - wrapperOverhead);
      const resumeQuota = Math.floor(availableBytes * 0.65);
      const jobQuota = Math.floor(availableBytes * 0.35);

      trimmedResume = truncateText(resumeText, resumeQuota);
      trimmedJobDescription = truncateText(jobDescription, jobQuota);
      promptText = buildPrompt(trimmedResume, trimmedJobDescription);
      body = buildGeminiRequestBody(promptText);
    }

    if (getByteLength(body) > MAX_GEMINI_BODY_BYTES) {
      console.warn("Gemini request still too large after truncation, using fallback analyzer.");
      const mockResult = generateMockATS(trimmedResume, trimmedJobDescription);
      return res.json({
        ...mockResult,
        fallback: true,
        message: "Input exceeded Gemini payload limit; using fallback analyzer."
      });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta2/models/gemini-1.5-flash:generateText?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error response:", response.status, errorText);
      if (shouldUseFallback(errorText)) {
        const mockResult = generateMockATS(trimmedResume, trimmedJobDescription);
        return res.json({
          ...mockResult,
          fallback: true,
          message: "Gemini payload exceeded limit; using fallback analyzer."
        });
      }
      throw new Error(`Gemini API returned status ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    const responseText = result.candidates?.[0]?.content?.parts?.[0]?.text;

    try {
      const jsonResponse = JSON.parse(responseText.trim());
      res.json(jsonResponse);
    } catch (parseErr) {
      console.error("JSON Parse Error from Gemini:", responseText);
      // Fallback in case Gemini returns malformed JSON
      res.json({
        atsScore: 68,
        missingKeywords: ["Problem Solving", "Collaboration"],
        suggestions: ["Incorporate stronger action verbs", "Re-parse formatting constraints"],
        skillsMatch: { Frontend: 70, Backend: 50, DevOps: 30, "Soft Skills": 80 }
      });
    }

  } catch (error) {
    console.error("ATS ANALYZER ERROR:", error);
    res.status(500).json({
      message: "Failed to perform ATS analysis",
      error: error.message || "Unknown Gemini failure"
    });
  }
};

// ✍️ BULLET IMPROVER CONTROLLER
exports.improveBullet = async (req, res) => {
  try {
    const { bulletText, role = "Software Engineer" } = req.body;

    if (!bulletText) {
      return res.status(400).json({ message: "Bullet point text is required" });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey === "YOUR_GEMINI_API_KEY_HERE" || apiKey.trim() === "") {
      console.warn("⚠️ GEMINI_API_KEY is not configured. Running with mock bullet point improver.");
      const mockBullet = getMockBulletImprovement(bulletText, role);
      return res.json({ improvedBullet: mockBullet });
    }

    const promptText = `
${BULLET_IMPROVER_PROMPT}

[CURRENT BULLET]
${bulletText}

[ROLE CONTEXT]
${role}
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta2/models/gemini-1.5-flash:generateText?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: promptText }] }],
          generationConfig: {
            responseMimeType: "application/json"
          }
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error response:", response.status, errorText);
      const mockBullet = getMockBulletImprovement(bulletText, role);
      return res.json({
        improvedBullet: mockBullet,
        fallback: true,
        message: "Gemini unavailable, using fallback bullet improver."
      });
    }

    const result = await response.json();
    const responseText = result.candidates?.[0]?.content?.parts?.[0]?.text;

    try {
      const jsonResponse = JSON.parse(responseText.trim());
      return res.json(jsonResponse);
    } catch (parseErr) {
      console.error("JSON Parse Error from Gemini:", responseText);
      const mockBullet = getMockBulletImprovement(bulletText, role);
      return res.json({
        improvedBullet: mockBullet,
        fallback: true,
        message: "Gemini returned invalid JSON, using fallback bullet improver."
      });
    }

  } catch (error) {
    console.error("BULLET IMPROVER ERROR:", error);
    const mockBullet = getMockBulletImprovement(bulletText, role);
    return res.json({
      improvedBullet: mockBullet,
      fallback: true,
      message: "Gemini request failed, using fallback bullet improver."
    });
  }
};

// 🧪 DYNAMIC MOCK GENERATOR FOR ATS
function generateMockATS(resume, jd) {
  const resumeLower = resume.toLowerCase();
  const jdLower = jd.toLowerCase();

  // Standard tech skills to scan
  const potentialSkills = [
    "react", "angular", "vue", "typescript", "javascript", "html", "css", "tailwind",
    "node", "express", "mongodb", "postgresql", "mysql", "redis", "graphql", "rest api",
    "docker", "kubernetes", "aws", "gcp", "azure", "git", "ci/cd", "jest", "cypress",
    "python", "java", "c++", "go", "ruby", "django", "spring boot", "next.js", "nest.js",
    "system design", "microservices", "unit testing", "scrum", "agile", "typescript"
  ];

  const jdSkills = potentialSkills.filter(skill => jdLower.includes(skill));
  const resumeSkills = potentialSkills.filter(skill => resumeLower.includes(skill));

  const matchedSkills = jdSkills.filter(skill => resumeSkills.includes(skill));
  const missingSkills = jdSkills.filter(skill => !resumeSkills.includes(skill));

  // Compute a realistic matching score based on overlaps
  let matchRatio = jdSkills.length > 0 ? (matchedSkills.length / jdSkills.length) : 0.5;
  let score = Math.round(45 + (matchRatio * 45)); // Scale score between 45 and 90

  // Fallback missing keywords if none detected
  const missingKeywords = missingSkills.length > 0 
    ? missingSkills.map(s => s.charAt(0).toUpperCase() + s.slice(1))
    : ["TypeScript", "System Design", "AWS Deployment"];

  // Skills Breakdown
  const frontendMatch = Math.round(50 + (resumeLower.includes("react") || resumeLower.includes("tailwind") ? 35 : 10));
  const backendMatch = Math.round(40 + (resumeLower.includes("node") || resumeLower.includes("mongodb") ? 45 : 15));
  const devopsMatch = Math.round(30 + (resumeLower.includes("docker") || resumeLower.includes("aws") ? 50 : 10));
  const softMatch = Math.round(75 + (resumeLower.includes("collaborate") || resumeLower.includes("led") ? 15 : 5));

  const suggestions = [
    `Incorporate missing core skills: **${missingKeywords.slice(0, 3).join(", ")}** directly into your skill sections.`,
    "Quantify achievements in your professional experiences using the STAR method (e.g., 'Reduced load times by 40% using Webpack code splitting').",
    "Reorganize skill list categories into 'Frontend', 'Backend', and 'Tools/DevOps' for clean automatic parsing.",
    "Add at least one responsive web project showcasing deep CSS grid or Tailwind implementation details."
  ];

  return {
    atsScore: score > 98 ? 98 : score,
    missingKeywords: missingKeywords.slice(0, 5),
    suggestions,
    skillsMatch: {
      Frontend: frontendMatch > 100 ? 100 : frontendMatch,
      Backend: backendMatch > 100 ? 100 : backendMatch,
      DevOps: devopsMatch > 100 ? 100 : devopsMatch,
      "Soft Skills": softMatch > 100 ? 100 : softMatch
    }
  };
}

// 🧪 MOCK BULLET IMPROVER
function getMockBulletImprovement(bullet, role) {
  const verbs = ["Engineered", "Architected", "Spearheaded", "Optimized", "Redesigned", "Streamlined"];
  const selectedVerb = verbs[Math.floor(Math.random() * verbs.length)];
  
  if (bullet.toLowerCase().includes("made") || bullet.toLowerCase().includes("worked on") || bullet.toLowerCase().includes("developed")) {
    return `${selectedVerb} key core modules for the application, improving rendering latency by 35% and enhancing multi-user responsiveness using optimized caching strategies.`;
  }
  
  return `${selectedVerb} a state-of-the-art implementation of key services, cutting server compute costs by 22% and securing high-availability operations for over 10k active users.`;
}
