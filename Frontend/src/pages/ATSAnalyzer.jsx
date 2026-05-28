import React, { useState } from "react";
import api from "../api/axios";
import { 
  Sparkles, 
  Upload, 
  FileText, 
  AlertCircle, 
  BookOpen, 
  Award, 
  X, 
  CheckCircle, 
  Tag, 
  RefreshCw,
  FileUp,
  BrainCircuit,
  ArrowRight,
  Sparkle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { showToast } from "../components/common/Toast";
import confetti from "canvas-confetti";

export default function ATSAnalyzer() {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [fileDetails, setFileDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [activeTab, setActiveTab] = useState("keywords"); // keywords | suggestions | skills
  const [isDragOver, setIsDragOver] = useState(false);

  // Parse TXT, PDF metadata, or similar uploaded files
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    processFile(file);
  };

  const processFile = (file) => {
    setFileDetails({ name: file.name, size: (file.size / 1024).toFixed(1) + " KB" });

    // Use FileReader for TXT / DOCX plain text or PDF text fallbacks
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      if (text) {
        setResumeText(text);
        showToast("Resume document parsed successfully!", "success");
      }
    };
    reader.readAsText(file);
  };

  // Drag-and-drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  };

  const handleClearFile = () => {
    setFileDetails(null);
    setResumeText("");
    showToast("Cleared uploaded file details.", "info");
  };

  const triggerATSAudit = async (e) => {
    e.preventDefault();
    if (!resumeText.trim()) {
      showToast("Please upload a resume to perform an audit.", "warning");
      return;
    }
    if (!jobDescription.trim()) {
      showToast("Please paste the job description to match against.", "warning");
      return;
    }

    setLoading(true);
    setResults(null);

    try {
      const res = await api.post("/ai/analyze", {
        resumeText,
        jobDescription
      });

      if (res.data) {
        setResults(res.data);
        showToast("Gemini scan complete! Review matching indices.", "success");
        
        // Trigger celebration confetti on high match score!
        if (res.data.atsScore >= 80) {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ["#8b5cf6", "#6366f1", "#10b981"]
          });
        }
      }
    } catch (err) {
      console.error(err);
      const message =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        "Failed to connect to ATS scanner. Ensure Gemini key is correct.";
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-emerald-500 stroke-emerald-500";
    if (score >= 60) return "text-amber-500 stroke-amber-500";
    return "text-rose-500 stroke-rose-500";
  };

  const getScoreBg = (score) => {
    if (score >= 80) return "bg-emerald-500/10 border-emerald-500/25";
    if (score >= 60) return "bg-amber-500/10 border-amber-500/25";
    return "bg-rose-500/10 border-rose-500/25";
  };

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <BrainCircuit className="w-8 h-8 text-violet-500 animate-pulse" />
          <span>ATS Resume Analyzer</span>
        </h1>
        <p className="text-sm text-zinc-500 mt-1">Audit resume alignment against job requirements instantly using Google Gemini API.</p>
      </div>

      {/* DUAL INPUT PANEL */}
      {!results && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          
          {/* LEFT: Resume uploader & Plain text uploader */}
          <div className="glass p-5 rounded-2xl border border-zinc-200 dark:border-zinc-900/60 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">1. Provide Your Resume</h3>
                <p className="text-xs text-zinc-500 mt-0.5">Drag-and-drop a resume document to upload it for analysis.</p>
              </div>

              {/* Drag Drop Area */}
              {!fileDetails ? (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
                    isDragOver
                      ? "border-violet-500 bg-violet-500/5 text-violet-400"
                      : "border-zinc-200 dark:border-zinc-800 hover:border-violet-500/35"
                  }`}
                >
                  <input
                    type="file"
                    id="resume-file"
                    accept=".txt,.pdf,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <label htmlFor="resume-file" className="cursor-pointer space-y-3 block">
                    <FileUp className="w-10 h-10 mx-auto text-zinc-400 animate-bounce" />
                    <div>
                      <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-300">Click to upload or drag & drop</p>
                      <p className="text-[10px] text-zinc-500 mt-1">Supports PDF, DOCX, TXT documents</p>
                    </div>
                  </label>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-850 bg-zinc-900/10 flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileText className="w-5 h-5 text-violet-500 shrink-0" />
                    <div className="truncate">
                      <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">{fileDetails.name}</p>
                      <p className="text-[9px] text-zinc-500 mt-0.5">{fileDetails.size}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleClearFile}
                    className="p-1 rounded bg-zinc-200 dark:bg-zinc-950 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 border border-zinc-300 dark:border-zinc-800 shadow"
                  >
                    <X className="w-4.5 h-4.5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Job Description Paste field */}
          <div className="glass p-5 rounded-2xl border border-zinc-200 dark:border-zinc-900/60 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">2. Target Position Details</h3>
                <p className="text-xs text-zinc-500 mt-0.5">Paste the exact job description guidelines from recruitment boards.</p>
              </div>

              <textarea
                placeholder="Paste Job Description requirements here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={11}
                className="block w-full px-3 py-2 bg-zinc-900/5 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-lg text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Audit Trigger */}
            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-900/60 mt-4">
              <button
                onClick={triggerATSAudit}
                disabled={loading || !resumeText.trim() || !jobDescription.trim()}
                className="w-full py-3 px-4 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-violet-600/15 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Gemini Running AI Audits...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Perform Compatibility Scan</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </div>
      )}

      {/* DYNAMIC LOADING SCREEN */}
      {loading && (
        <div className="py-20 text-center space-y-4 max-w-md mx-auto">
          <div className="relative w-16 h-16 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-violet-500/20" />
            <div className="absolute inset-0 rounded-full border-4 border-violet-600 border-t-transparent animate-spin" />
            <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-violet-500 animate-pulse" />
          </div>
          <div className="space-y-1 animate-pulse">
            <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">Comparing compatibility matrices</h3>
            <p className="text-xs text-zinc-500">Gemini is scanning missing keywords, formatting structures, and computing skill matching percentages...</p>
          </div>
        </div>
      )}

      {/* DYNAMIC RESULTS SCREEN */}
      <AnimatePresence>
        {results && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch"
          >
            {/* LEFT: Matching score circular gauge */}
            <div className="lg:col-span-4 glass p-6 rounded-2xl border border-zinc-200 dark:border-zinc-900/60 flex flex-col items-center justify-between text-center min-h-[380px]">
              <div className="w-full text-left">
                <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">ATS Audit Summary</h3>
                <p className="text-[10px] text-zinc-500 mt-0.5">Automated computation based on overlap ratios.</p>
              </div>

              {/* Circular Gauge */}
              <div className="relative w-44 h-44 my-4 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="88" cy="88" r="76" stroke="rgba(255,255,255,0.04)" strokeWidth="12" fill="transparent" />
                  <motion.circle
                    cx="88"
                    cy="88"
                    r="76"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="transparent"
                    strokeDasharray={477.5}
                    initial={{ strokeDashoffset: 477.5 }}
                    animate={{ strokeDashoffset: 477.5 - (477.5 * results.atsScore) / 100 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className={getScoreColor(results.atsScore)}
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-4xl font-black text-zinc-900 dark:text-zinc-100">{results.atsScore}%</span>
                  <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider mt-1">Match Index</span>
                </div>
              </div>

              {/* Metric level descriptor */}
              <div className={`p-3.5 rounded-xl border text-xs font-semibold w-full leading-normal ${getScoreBg(results.atsScore)}`}>
                {results.atsScore >= 80 ? (
                  <p className="text-emerald-500">🎉 Outstanding Compatibility! Ready to submit.</p>
                ) : results.atsScore >= 60 ? (
                  <p className="text-amber-500">⚠️ Moderate Compatibility. Improve keywords to boost score.</p>
                ) : (
                  <p className="text-rose-500">❌ High risk of ATS rejection. Complete revision advised.</p>
                )}
              </div>

              {/* Reset analyzer */}
              <button
                onClick={() => setResults(null)}
                className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 mt-4 underline decoration-dotted uppercase tracking-wider"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Audit another application</span>
              </button>
            </div>

            {/* RIGHT: Detailed analysis tabs */}
            <div className="lg:col-span-8 glass p-6 rounded-2xl border border-zinc-200 dark:border-zinc-900/60 flex flex-col justify-between min-h-[380px]">
              <div>
                {/* Tabs bar */}
                <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-2 mb-4">
                  {[
                    { id: "keywords", label: "Missing Keywords" },
                    { id: "suggestions", label: "Optimization Steps" },
                    { id: "skills", label: "Skills Overlap Matrix" }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all ${
                        activeTab === tab.id
                          ? "bg-violet-500/10 text-violet-500 border-violet-500/30 font-extrabold shadow-sm"
                          : "bg-transparent text-zinc-500 border-transparent hover:text-zinc-800 dark:hover:text-zinc-200"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* TAB DETAILS */}
                <div className="space-y-4 min-h-[220px]">
                  
                  {/* Tab 1: Missing keywords */}
                  {activeTab === "keywords" && (
                    <div className="space-y-3.5">
                      <p className="text-xs text-zinc-500 leading-normal">
                        Gemini compared nouns in the job description to find critical technology tags missing or weakly detailed in your resume:
                      </p>
                      <div className="flex flex-wrap gap-2 pt-2">
                        {results.missingKeywords && results.missingKeywords.length > 0 ? (
                          results.missingKeywords.map((kw, i) => (
                            <span 
                              key={i} 
                              className="text-xs font-bold px-3 py-1.5 rounded-xl bg-rose-500/5 dark:bg-rose-500/10 text-rose-500 border border-rose-500/20 flex items-center gap-1 shadow-sm"
                            >
                              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                              <span>{kw}</span>
                            </span>
                          ))
                        ) : (
                          <div className="flex items-center gap-1.5 text-xs text-emerald-500 bg-emerald-500/10 px-3 py-2 rounded-xl font-bold border border-emerald-500/20 shadow-sm">
                            <CheckCircle className="w-4 h-4" />
                            <span>Zero missing keywords detected! Outstanding match.</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Tab 2: Optimization suggestions */}
                  {activeTab === "suggestions" && (
                    <div className="space-y-3.5">
                      <p className="text-xs text-zinc-500 leading-normal">
                        Actionable recommendations to restructure descriptions, highlight metrics, or align layout styling:
                      </p>
                      <div className="space-y-2 pt-1.5">
                        {results.suggestions?.map((item, i) => (
                          <div key={i} className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-900 bg-zinc-900/5 dark:bg-zinc-950/20 text-xs leading-relaxed flex items-start gap-2.5 text-zinc-800 dark:text-zinc-300">
                            <Sparkle className="w-4 h-4 text-violet-500 shrink-0 mt-0.5 animate-pulse" />
                            <span dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-zinc-950 dark:text-white">$1</strong>') }} />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tab 3: Skill match matrix */}
                  {activeTab === "skills" && (
                    <div className="space-y-4">
                      <p className="text-xs text-zinc-500 leading-normal">
                        Matching indices computed across operational skill domains:
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1.5">
                        {Object.entries(results.skillsMatch || {}).map(([category, match]) => (
                          <div key={category} className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-900 bg-zinc-900/5 dark:bg-zinc-950/20 space-y-2">
                            <div className="flex justify-between text-xs font-semibold text-zinc-800 dark:text-zinc-300">
                              <span>{category} Alignment</span>
                              <span className="font-bold">{match}%</span>
                            </div>
                            <div className="w-full bg-zinc-200 dark:bg-zinc-800/80 rounded-full h-2.5 overflow-hidden">
                              <div 
                                className={`h-full rounded-full transition-all duration-1000 ${
                                  match >= 80
                                    ? "bg-emerald-500"
                                    : match >= 60
                                    ? "bg-amber-500"
                                    : "bg-rose-500"
                                }`}
                                style={{ width: `${match}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              </div>

              {/* Direct call to action linking back to edit resume */}
              <div className="flex justify-between items-center border-t border-zinc-200 dark:border-zinc-900/60 pt-4 mt-6 text-xs text-zinc-500">
                <span>Need improvements? Return to the Resume Builder.</span>
                <motion.div whileHover={{ x: 3 }}>
                  <a href="/resume" className="font-bold text-violet-500 hover:text-violet-400 flex items-center gap-1 select-none">
                    <span>Edit Resume</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </motion.div>
              </div>

            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
