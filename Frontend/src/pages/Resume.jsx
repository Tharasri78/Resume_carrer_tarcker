import React, { useState, useEffect, useRef } from "react";
import api from "../api/axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { 
  Sparkles, 
  ChevronDown, 
  Plus, 
  Trash2, 
  Download, 
  ExternalLink, 
  Eye, 
  User, 
  BookOpen, 
  Briefcase, 
  FolderGit2, 
  Code2, 
  Check, 
  Award,
  Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { showToast } from "../components/common/Toast";

export default function Resume() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    github: "",
    summary: "",
    skills: "",
    education: [{ degree: "", institution: "", year: "", location: "", percentage: "" }],
    experiences: [{ title: "", company: "", duration: "", description: "" }],
    projects: [{ title: "", duration: "", description: "", techStack: "" }],
    certifications: [""]
  });

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState("tech"); // tech | creative | executive
  const [improvingBulletIdx, setImprovingBulletIdx] = useState(null); // { type: 'experience'|'project', index: number }
  const [activeAccordion, setActiveAccordion] = useState("personal"); // personal | education | experience | projects | skills

  const previewRef = useRef(null);

  useEffect(() => {
    const fetchResumeData = async () => {
      try {
        const res = await api.get("/resume");
        if (res.data) {
          const data = res.data;
          setFormData({
            fullName: data.fullName || "",
            email: data.email || "",
            phone: data.phone || "",
            location: data.location || "",
            linkedin: data.linkedin || "",
            github: data.github || "",
            summary: data.summary || "",
            skills: data.skills?.join(", ") || "",
            education: data.education?.length ? data.education : [{ degree: "", institution: "", year: "", location: "", percentage: "" }],
            experiences: data.experience?.length ? data.experience : [{ title: "", company: "", duration: "", description: "" }],
            projects: data.projects?.length ? data.projects : [{ title: "", duration: "", description: "", techStack: "" }],
            certifications: data.certifications?.length ? data.certifications : [""]
          });
        }
      } catch (err) {
        console.error("Failed to load resume details", err);
        showToast("Error loading saved resume data.", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchResumeData();
  }, []);

  const handleChange = (e, section = null, index = null) => {
    const { name, value } = e.target;
    if (section && index !== null) {
      setFormData((prev) => {
        const updated = { ...prev };
        updated[section][index] = { ...updated[section][index], [name]: value };
        return updated;
      });
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Section Repeatables Management
  const addBlock = (section, templateObj) => {
    setFormData((prev) => ({
      ...prev,
      [section]: [...prev[section], templateObj],
    }));
  };

  const removeBlock = (section, index) => {
    setFormData((prev) => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index),
    }));
  };

  const handleCertificationChange = (index, value) => {
    setFormData((prev) => {
      const certifications = [...prev.certifications];
      certifications[index] = value;
      return { ...prev, certifications };
    });
  };

  const addCertification = () => {
    setFormData((prev) => ({
      ...prev,
      certifications: [...prev.certifications, ""]
    }));
  };

  const removeCertification = (index) => {
    setFormData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName.trim()) {
      showToast("Full name is required to save", "warning");
      return;
    }
    setSaving(true);
    const payload = {
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      location: formData.location.trim(),
      linkedin: formData.linkedin.trim(),
      github: formData.github.trim(),
      summary: formData.summary.trim(),
      skills: formData.skills.split(",").map((s) => s.trim()).filter(Boolean),
      education: formData.education.filter((edu) => edu.degree.trim() || edu.institution.trim()),
      experience: formData.experiences.filter((exp) => exp.title.trim() || exp.company.trim()),
      projects: formData.projects.filter((proj) => proj.title.trim() || proj.techStack.trim()),
      certifications: formData.certifications.filter((cert) => cert.trim())
    };

    try {
      await api.post("/resume", payload);
      showToast("Resume saved securely!", "success");
    } catch (err) {
      console.error(err);
      const message = err.response?.data?.error || err.response?.data?.message || "Failed to save resume details";
      showToast(message, "error");
    } finally {
      setSaving(false);
    }
  };

  // Inline AI Bullet Enhancer Trigger
  const improveBulletPoint = async (type, index, currentText) => {
    if (!currentText || !currentText.trim()) {
      showToast("Please enter some text first to let Gemini improve it.", "warning");
      return;
    }
    setImprovingBulletIdx({ type, index });
    try {
      const res = await api.post("/ai/improve-bullet", {
        bulletText: currentText,
        role: formData.experiences[0]?.title || "Software Engineer"
      });

      if (res.data && res.data.improvedBullet) {
        setFormData((prev) => {
          const updated = { ...prev };
          const field = type === "experience" ? "experiences" : "projects";
          updated[field][index] = { ...updated[field][index], description: res.data.improvedBullet };
          return updated;
        });
        showToast("Bullet optimized using AI!", "success");
      }
    } catch (err) {
      console.error(err);
      showToast("AI bullet optimizer unavailable. Check Gemini key.", "error");
    } finally {
      setImprovingBulletIdx(null);
    }
  };

  // PDF Exporter using html2canvas & jsPDF for perfect high-res client-side print layout
  const handleExportPDF = async () => {
    if (!previewRef.current) return;
    setExporting(true);
    showToast("Starting PDF compilation...", "info");

    try {
      const element = previewRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
        allowTaint: true,
        logging: false
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      
      const width = imgWidth * ratio;
      const height = imgHeight * ratio;

      pdf.addImage(imgData, "PNG", (pdfWidth - width) / 2, 0, width, height);
      pdf.save(`${formData.fullName.trim() || "Resume"}_CV.pdf`);
      showToast("PDF downloaded successfully!", "success");
    } catch (err) {
      console.error("PDF generation failed:", err);
      showToast("Could not export high-res PDF. Try again.", "error");
    } finally {
      setExporting(false);
    }
  };

  const toggleAccordion = (id) => {
    setActiveAccordion((prev) => (prev === id ? null : id));
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-zinc-200 dark:bg-zinc-800 rounded w-1/4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-[500px] bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
          <div className="h-[500px] bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
        </div>
      </div>
    );
  }

  const hasContent = formData.fullName.trim() || formData.email.trim() || formData.phone.trim();

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">Resume Builder</h1>
          <p className="text-sm text-zinc-500 mt-1">Rebuild your resume instantly using professional MERN layouts.</p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Template Select */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wide">Template:</span>
            <select
              value={activeTemplate}
              onChange={(e) => setActiveTemplate(e.target.value)}
              className="bg-zinc-900/5 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-lg px-2.5 py-1.5 text-xs text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-violet-500"
            >
              <option value="tech">Modern Tech</option>
              <option value="creative">Creative Highlight</option>
              <option value="executive">Executive Elegance</option>
            </select>
          </div>

          <button
            onClick={handleExportPDF}
            disabled={exporting || !hasContent}
            className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white shadow-md shadow-violet-600/15 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            {exporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* STICKY SPLIT SCREEN CONTAINER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative">
        {/* FORM MODULE - LEFT COLUMN */}
        <div className="lg:col-span-6 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* 1. PERSONAL DETAILS ACCORDION */}
            <div className="glass rounded-xl border border-zinc-200 dark:border-zinc-900/60 overflow-hidden">
              <button
                type="button"
                onClick={() => toggleAccordion("personal")}
                className="w-full flex items-center justify-between p-4 font-bold text-xs uppercase tracking-wider text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900/40 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <User className="w-4 h-4 text-violet-500" />
                  <span>Personal Details</span>
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeAccordion === "personal" ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {activeAccordion === "personal" && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    className="overflow-hidden border-t border-zinc-200 dark:border-zinc-900/50"
                  >
                    <div className="p-4 grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Full Name</label>
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          placeholder="John Doe"
                          className="block w-full px-3 py-2 bg-zinc-900/5 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-lg text-xs focus:ring-1 focus:ring-violet-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="name@example.com"
                          className="block w-full px-3 py-2 bg-zinc-900/5 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-lg text-xs focus:ring-1 focus:ring-violet-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Phone</label>
                        <input
                          type="text"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+1 555-0199"
                          className="block w-full px-3 py-2 bg-zinc-900/5 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-lg text-xs focus:ring-1 focus:ring-violet-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Location</label>
                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                          placeholder="San Francisco, CA"
                          className="block w-full px-3 py-2 bg-zinc-900/5 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-lg text-xs focus:ring-1 focus:ring-violet-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">LinkedIn</label>
                        <input
                          type="text"
                          name="linkedin"
                          value={formData.linkedin}
                          onChange={handleChange}
                          placeholder="linkedin.com/in/username"
                          className="block w-full px-3 py-2 bg-zinc-900/5 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-lg text-xs focus:ring-1 focus:ring-violet-500 focus:outline-none"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">GitHub</label>
                        <input
                          type="text"
                          name="github"
                          value={formData.github}
                          onChange={handleChange}
                          placeholder="github.com/username"
                          className="block w-full px-3 py-2 bg-zinc-900/5 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-lg text-xs focus:ring-1 focus:ring-violet-500 focus:outline-none"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Career Objective</label>
                        <textarea
                          name="summary"
                          value={formData.summary}
                          onChange={handleChange}
                          placeholder="Detail your professional experience, key stack, and focus..."
                          rows={3}
                          className="block w-full px-3 py-2 bg-zinc-900/5 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-lg text-xs focus:ring-1 focus:ring-violet-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 2. SKILLS ACCORDION */}
            <div className="glass rounded-xl border border-zinc-200 dark:border-zinc-900/60 overflow-hidden">
              <button
                type="button"
                onClick={() => toggleAccordion("skills")}
                className="w-full flex items-center justify-between p-4 font-bold text-xs uppercase tracking-wider text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900/40 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-violet-500" />
                  <span>Technical Skills</span>
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeAccordion === "skills" ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {activeAccordion === "skills" && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    className="overflow-hidden border-t border-zinc-200 dark:border-zinc-900/50"
                  >
                    <div className="p-4 space-y-2">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Core Tech Stack (comma separated)</label>
                      <input
                        type="text"
                        name="skills"
                        value={formData.skills}
                        onChange={handleChange}
                        placeholder="React.js, Node.js, TypeScript, Docker, AWS, Git"
                        className="block w-full px-3 py-2.5 bg-zinc-900/5 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-lg text-xs focus:ring-1 focus:ring-violet-500 focus:outline-none"
                      />
                      <small className="text-[10px] text-zinc-500 block leading-tight">These will instantly map into beautiful responsive tag pills on your live preview sheet.</small>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 3. EXPERIENCE ACCORDION */}
            <div className="glass rounded-xl border border-zinc-200 dark:border-zinc-900/60 overflow-hidden">
              <button
                type="button"
                onClick={() => toggleAccordion("experience")}
                className="w-full flex items-center justify-between p-4 font-bold text-xs uppercase tracking-wider text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900/40 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-violet-500" />
                  <span>Work Experience</span>
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeAccordion === "experience" ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {activeAccordion === "experience" && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    className="overflow-hidden border-t border-zinc-200 dark:border-zinc-900/50"
                  >
                    <div className="p-4 space-y-5">
                      {formData.experiences.map((exp, idx) => (
                        <div key={idx} className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-900 bg-zinc-900/5 dark:bg-zinc-950/20 relative space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold text-violet-500">EXPERIENCE BLOCK #{idx + 1}</span>
                            <button
                              type="button"
                              onClick={() => removeBlock("experiences", idx)}
                              className="p-1 rounded text-zinc-500 hover:text-rose-500 transition-colors hover:bg-rose-500/10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[9px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Role / Title</label>
                              <input
                                type="text"
                                name="title"
                                value={exp.title}
                                onChange={(e) => handleChange(e, "experiences", idx)}
                                placeholder="Software Engineer"
                                className="block w-full px-3 py-2 bg-zinc-900/5 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-lg text-xs focus:ring-1 focus:ring-violet-500 focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Company</label>
                              <input
                                type="text"
                                name="company"
                                value={exp.company}
                                onChange={(e) => handleChange(e, "experiences", idx)}
                                placeholder="Google Inc."
                                className="block w-full px-3 py-2 bg-zinc-900/5 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-lg text-xs focus:ring-1 focus:ring-violet-500 focus:outline-none"
                              />
                            </div>
                            <div className="col-span-2">
                              <label className="block text-[9px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Duration</label>
                              <input
                                type="text"
                                name="duration"
                                value={exp.duration}
                                onChange={(e) => handleChange(e, "experiences", idx)}
                                placeholder="JAN 2024 - PRESENT"
                                className="block w-full px-3 py-2 bg-zinc-900/5 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-lg text-xs focus:ring-1 focus:ring-violet-500 focus:outline-none"
                              />
                            </div>
                            <div className="col-span-2">
                              <div className="flex justify-between items-center mb-1">
                                <label className="block text-[9px] font-bold uppercase tracking-wider text-zinc-500">Achievements / Description</label>
                                <button
                                  type="button"
                                  disabled={improvingBulletIdx !== null}
                                  onClick={() => improveBulletPoint("experience", idx, exp.description)}
                                  className="flex items-center gap-1 text-[9px] font-semibold text-violet-600 dark:text-violet-400 hover:underline"
                                >
                                  {improvingBulletIdx?.type === "experience" && improvingBulletIdx?.index === idx ? (
                                    <>
                                      <Loader2 className="w-2.5 h-2.5 animate-spin" />
                                      <span>Gemini Optimizing...</span>
                                    </>
                                  ) : (
                                    <>
                                      <Sparkles className="w-2.5 h-2.5" />
                                      <span>Gemini STAR Method</span>
                                    </>
                                  )}
                                </button>
                              </div>
                              <textarea
                                name="description"
                                value={exp.description}
                                onChange={(e) => handleChange(e, "experiences", idx)}
                                placeholder="• Spearheaded React migration, slashing bundle sizes by 32%..."
                                rows={4}
                                className="block w-full px-3 py-2 bg-zinc-900/5 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-lg text-xs focus:ring-1 focus:ring-violet-500 focus:outline-none"
                              />
                            </div>
                          </div>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={() => addBlock("experiences", { title: "", company: "", duration: "", description: "" })}
                        className="w-full flex items-center justify-center gap-1.5 py-2.5 border border-dashed border-zinc-200 dark:border-zinc-900 rounded-lg text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:border-zinc-300 dark:hover:border-zinc-800 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Work Block</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 4. PROJECTS ACCORDION */}
            <div className="glass rounded-xl border border-zinc-200 dark:border-zinc-900/60 overflow-hidden">
              <button
                type="button"
                onClick={() => toggleAccordion("projects")}
                className="w-full flex items-center justify-between p-4 font-bold text-xs uppercase tracking-wider text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900/40 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <FolderGit2 className="w-4 h-4 text-violet-500" />
                  <span>Projects Showcase</span>
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeAccordion === "projects" ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {activeAccordion === "projects" && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    className="overflow-hidden border-t border-zinc-200 dark:border-zinc-900/50"
                  >
                    <div className="p-4 space-y-5">
                      {formData.projects.map((proj, idx) => (
                        <div key={idx} className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-900 bg-zinc-900/5 dark:bg-zinc-950/20 relative space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold text-violet-500">PROJECT BLOCK #{idx + 1}</span>
                            <button
                              type="button"
                              onClick={() => removeBlock("projects", idx)}
                              className="p-1 rounded text-zinc-500 hover:text-rose-500 transition-colors hover:bg-rose-500/10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[9px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Project Title</label>
                              <input
                                type="text"
                                name="title"
                                value={proj.title}
                                onChange={(e) => handleChange(e, "projects", idx)}
                                placeholder="E-Commerce API"
                                className="block w-full px-3 py-2 bg-zinc-900/5 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-lg text-xs focus:ring-1 focus:ring-violet-500 focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Tech Stack Used</label>
                              <input
                                type="text"
                                name="techStack"
                                value={proj.techStack}
                                onChange={(e) => handleChange(e, "projects", idx)}
                                placeholder="React, Node, Express"
                                className="block w-full px-3 py-2 bg-zinc-900/5 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-lg text-xs focus:ring-1 focus:ring-violet-500 focus:outline-none"
                              />
                            </div>
                            <div className="col-span-2">
                              <label className="block text-[9px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Duration</label>
                              <input
                                type="text"
                                name="duration"
                                value={proj.duration}
                                onChange={(e) => handleChange(e, "projects", idx)}
                                placeholder="2 Weeks"
                                className="block w-full px-3 py-2 bg-zinc-900/5 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-lg text-xs focus:ring-1 focus:ring-violet-500 focus:outline-none"
                              />
                            </div>
                            <div className="col-span-2">
                              <div className="flex justify-between items-center mb-1">
                                <label className="block text-[9px] font-bold uppercase tracking-wider text-zinc-500">Project Description</label>
                                <button
                                  type="button"
                                  disabled={improvingBulletIdx !== null}
                                  onClick={() => improveBulletPoint("project", idx, proj.description)}
                                  className="flex items-center gap-1 text-[9px] font-semibold text-violet-600 dark:text-violet-400 hover:underline"
                                >
                                  {improvingBulletIdx?.type === "project" && improvingBulletIdx?.index === idx ? (
                                    <>
                                      <Loader2 className="w-2.5 h-2.5 animate-spin" />
                                      <span>Gemini Optimizing...</span>
                                    </>
                                  ) : (
                                    <>
                                      <Sparkles className="w-2.5 h-2.5" />
                                      <span>Gemini STAR Method</span>
                                    </>
                                  )}
                                </button>
                              </div>
                              <textarea
                                name="description"
                                value={proj.description}
                                onChange={(e) => handleChange(e, "projects", idx)}
                                placeholder="• Engineered robust scalable API endpoint models..."
                                rows={3}
                                className="block w-full px-3 py-2 bg-zinc-900/5 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-lg text-xs focus:ring-1 focus:ring-violet-500 focus:outline-none"
                              />
                            </div>
                          </div>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={() => addBlock("projects", { title: "", duration: "", description: "", techStack: "" })}
                        className="w-full flex items-center justify-center gap-1.5 py-2.5 border border-dashed border-zinc-200 dark:border-zinc-900 rounded-lg text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:border-zinc-300 dark:hover:border-zinc-800 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Project Block</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 5. EDUCATION ACCORDION */}
            <div className="glass rounded-xl border border-zinc-200 dark:border-zinc-900/60 overflow-hidden">
              <button
                type="button"
                onClick={() => toggleAccordion("education")}
                className="w-full flex items-center justify-between p-4 font-bold text-xs uppercase tracking-wider text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900/40 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-violet-500" />
                  <span>Education Profile</span>
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeAccordion === "education" ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {activeAccordion === "education" && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    className="overflow-hidden border-t border-zinc-200 dark:border-zinc-900/50"
                  >
                    <div className="p-4 space-y-5">
                      {formData.education.map((edu, idx) => (
                        <div key={idx} className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-900 bg-zinc-900/5 dark:bg-zinc-950/20 relative space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold text-violet-500">EDUCATION BLOCK #{idx + 1}</span>
                            <button
                              type="button"
                              onClick={() => removeBlock("education", idx)}
                              className="p-1 rounded text-zinc-500 hover:text-rose-500 transition-colors hover:bg-rose-500/10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[9px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Degree / Course</label>
                              <input
                                type="text"
                                name="degree"
                                value={edu.degree}
                                onChange={(e) => handleChange(e, "education", idx)}
                                placeholder="B.Tech Computer Science"
                                className="block w-full px-3 py-2 bg-zinc-900/5 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-lg text-xs focus:ring-1 focus:ring-violet-500 focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Institution</label>
                              <input
                                type="text"
                                name="institution"
                                value={edu.institution}
                                onChange={(e) => handleChange(e, "education", idx)}
                                placeholder="IIT Madras"
                                className="block w-full px-3 py-2 bg-zinc-900/5 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-lg text-xs focus:ring-1 focus:ring-violet-500 focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Passing Year</label>
                              <input
                                type="text"
                                name="year"
                                value={edu.year}
                                onChange={(e) => handleChange(e, "education", idx)}
                                placeholder="2020 - 2024"
                                className="block w-full px-3 py-2 bg-zinc-900/5 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-lg text-xs focus:ring-1 focus:ring-violet-500 focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Grade / Score</label>
                              <input
                                type="text"
                                name="percentage"
                                value={edu.percentage}
                                onChange={(e) => handleChange(e, "education", idx)}
                                placeholder="e.g. 92% or 9.1 CGPA"
                                className="block w-full px-3 py-2 bg-zinc-900/5 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-lg text-xs focus:ring-1 focus:ring-violet-500 focus:outline-none"
                              />
                            </div>
                          </div>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={() => addBlock("education", { degree: "", institution: "", year: "", location: "", percentage: "" })}
                        className="w-full flex items-center justify-center gap-1.5 py-2.5 border border-dashed border-zinc-200 dark:border-zinc-900 rounded-lg text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:border-zinc-300 dark:hover:border-zinc-800 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Education Block</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 6. CERTIFICATIONS ACCORDION */}
            <div className="glass rounded-xl border border-zinc-200 dark:border-zinc-900/60 overflow-hidden">
              <button
                type="button"
                onClick={() => toggleAccordion("certifications")}
                className="w-full flex items-center justify-between p-4 font-bold text-xs uppercase tracking-wider text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900/40 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-violet-500" />
                  <span>Certifications</span>
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeAccordion === "certifications" ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {activeAccordion === "certifications" && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    className="overflow-hidden border-t border-zinc-200 dark:border-zinc-900/50"
                  >
                    <div className="p-4 space-y-4">
                      {formData.certifications.map((cert, idx) => (
                        <div key={idx} className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-900 bg-zinc-900/5 dark:bg-zinc-950/20 relative space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold text-violet-500">CERTIFICATION #{idx + 1}</span>
                            <button
                              type="button"
                              onClick={() => removeCertification(idx)}
                              className="p-1 rounded text-zinc-500 hover:text-rose-500 transition-colors hover:bg-rose-500/10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div>
                            <label className="block text-[9px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Certification / Course</label>
                            <input
                              type="text"
                              value={cert}
                              onChange={(e) => handleCertificationChange(idx, e.target.value)}
                              placeholder="AWS Certified Developer or PMP"
                              className="block w-full px-3 py-2 bg-zinc-900/5 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-lg text-xs focus:ring-1 focus:ring-violet-500 focus:outline-none"
                            />
                          </div>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={addCertification}
                        className="w-full flex items-center justify-center gap-1.5 py-2.5 border border-dashed border-zinc-200 dark:border-zinc-900 rounded-lg text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:border-zinc-300 dark:hover:border-zinc-800 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Certification</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* SAVE BUTTON */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={saving}
                className="w-full py-3 px-4 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-violet-600/15 disabled:opacity-50 transition-colors"
              >
                {saving ? "Saving configurations..." : "Save"}
              </button>
            </div>
          </form>
        </div>

        {/* LIVE VISUAL PREVIEW - RIGHT COLUMN */}
        <div className="lg:col-span-6 sticky top-24 max-h-[85vh] overflow-y-auto border border-zinc-200 dark:border-zinc-900 rounded-2xl shadow-xl bg-white text-zinc-900 no-print">
          
          <div className="p-3 border-b border-zinc-100 bg-zinc-50 flex items-center justify-between text-xs text-zinc-500 font-semibold no-print">
            <span className="flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-violet-500 animate-pulse" />
              <span>Real-Time Sticky Sheet Preview</span>
            </span>
            <span className="text-[10px] bg-zinc-200 px-2 py-0.5 rounded font-bold uppercase tracking-wider text-zinc-600">A4 Printable</span>
          </div>

          <div 
            ref={previewRef}
            className={`p-10 min-h-[297mm] bg-white text-zinc-950 font-sans shadow-inner selection:bg-violet-200 w-full ${
              activeTemplate === "tech" 
                ? "font-sans border-t-[8px] border-t-violet-600" 
                : activeTemplate === "creative"
                ? "font-serif border-l-[8px] border-l-rose-500"
                : "font-serif"
            }`}
          >
            {/* Header section depending on template */}
            {activeTemplate === "executive" ? (
              <div className="text-center space-y-2 border-b-2 border-zinc-800 pb-5">
                <h1 className="text-3xl font-extrabold tracking-wide uppercase">{formData.fullName || "YOUR FULL NAME"}</h1>
                <div className="text-[10px] text-zinc-600 flex justify-center gap-2 flex-wrap font-medium">
                  {formData.email && <span>{formData.email}</span>}
                  {formData.phone && <span>• {formData.phone}</span>}
                  {formData.location && <span>• {formData.location}</span>}
                </div>
                <div className="text-[9px] text-zinc-600 flex justify-center gap-2.5 flex-wrap font-bold">
                  {formData.linkedin && <span className="underline">{formData.linkedin}</span>}
                  {formData.github && <span className="underline">{formData.github}</span>}
                </div>
              </div>
            ) : activeTemplate === "creative" ? (
              <div className="grid grid-cols-3 gap-6 border-b border-rose-100 pb-5">
                <div className="col-span-2 space-y-1">
                  <h1 className="text-3xl font-black tracking-tight text-zinc-900">{formData.fullName || "YOUR FULL NAME"}</h1>
                  <p className="text-[10px] text-rose-500 font-bold uppercase tracking-widest">Creative Specialist</p>
                </div>
                <div className="col-span-1 text-[9px] text-zinc-500 space-y-0.5 font-medium">
                  {formData.email && <p>{formData.email}</p>}
                  {formData.phone && <p>{formData.phone}</p>}
                  {formData.location && <p>{formData.location}</p>}
                  {formData.linkedin && <p className="text-rose-500 underline truncate">{formData.linkedin}</p>}
                </div>
              </div>
            ) : (
              <div className="space-y-2 border-b border-zinc-150 pb-5">
                <h1 className="text-3xl font-black tracking-tight text-zinc-900 uppercase">{formData.fullName || "YOUR FULL NAME"}</h1>
                <div className="text-[10px] text-zinc-600 flex gap-3 flex-wrap font-semibold">
                  {formData.email && <span>{formData.email}</span>}
                  {formData.phone && <span>| {formData.phone}</span>}
                  {formData.location && <span>| {formData.location}</span>}
                </div>
                <div className="text-[9px] text-zinc-500 flex gap-3.5 flex-wrap">
                  {formData.linkedin && <span className="text-violet-600 font-bold underline flex items-center gap-0.5">{formData.linkedin}</span>}
                  {formData.github && <span className="text-violet-600 font-bold underline flex items-center gap-0.5">{formData.github}</span>}
                </div>
              </div>
            )}

            {/* Profile summary */}
            {formData.summary.trim() && (
              <div className="mt-5">
                <h3 className={`text-xs font-black uppercase tracking-wider mb-2 ${
                  activeTemplate === "tech" ? "text-violet-600" : activeTemplate === "creative" ? "text-rose-500" : "text-zinc-900 border-b border-zinc-400 pb-0.5"
                }`}>
                  Career Profile
                </h3>
                <p className="text-[11px] leading-relaxed text-zinc-700 text-justify">{formData.summary}</p>
              </div>
            )}

            {/* Technical skills */}
            {formData.skills.trim() && (
              <div className="mt-5">
                <h3 className={`text-xs font-black uppercase tracking-wider mb-2.5 ${
                  activeTemplate === "tech" ? "text-violet-600" : activeTemplate === "creative" ? "text-rose-500" : "text-zinc-900 border-b border-zinc-400 pb-0.5"
                }`}>
                  Technical Expertise
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {formData.skills.split(",").map((skill) => skill.trim()).filter(Boolean).map((skill, i) => (
                    <span key={i} className="text-[9px] font-bold bg-zinc-100 text-zinc-800 px-2 py-0.5 rounded border border-zinc-200/50">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Experience list */}
            {formData.experiences.some((exp) => exp.title.trim() || exp.company.trim()) && (
              <div className="mt-5">
                <h3 className={`text-xs font-black uppercase tracking-wider mb-3.5 ${
                  activeTemplate === "tech" ? "text-violet-600" : activeTemplate === "creative" ? "text-rose-500" : "text-zinc-900 border-b border-zinc-400 pb-0.5"
                }`}>
                  Professional Experience
                </h3>
                <div className="space-y-4">
                  {formData.experiences.map((exp, i) => (exp.title.trim() || exp.company.trim()) && (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between items-start text-[11px] font-bold text-zinc-900">
                        <span>{exp.title.toUpperCase()} at <span className="text-zinc-600">{exp.company.toUpperCase()}</span></span>
                        <span className="text-[10px] text-zinc-500 shrink-0">{exp.duration}</span>
                      </div>
                      <p className="text-[10px] leading-relaxed text-zinc-700 whitespace-pre-line text-justify pl-1">
                        {exp.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects list */}
            {formData.projects.some((proj) => proj.title.trim() || proj.techStack.trim()) && (
              <div className="mt-5">
                <h3 className={`text-xs font-black uppercase tracking-wider mb-3.5 ${
                  activeTemplate === "tech" ? "text-violet-600" : activeTemplate === "creative" ? "text-rose-500" : "text-zinc-900 border-b border-zinc-400 pb-0.5"
                }`}>
                  Projects Showcase
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {formData.projects.map((proj, i) => (proj.title.trim() || proj.techStack.trim()) && (
                    <div key={i} className="p-3 border border-zinc-100 rounded-lg bg-zinc-50/50 space-y-1">
                      <div className="flex justify-between items-center text-[10.5px] font-bold">
                        <span>{proj.title}</span>
                        <span className="text-[9.5px] text-zinc-500">{proj.duration}</span>
                      </div>
                      <p className="text-[8.5px] font-bold text-violet-600 uppercase tracking-wider">{proj.techStack}</p>
                      <p className="text-[10px] text-zinc-600 leading-relaxed pl-0.5 text-justify">{proj.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education list */}
            {formData.education.some((edu) => edu.degree.trim() || edu.institution.trim()) && (
              <div className="mt-5">
                <h3 className={`text-xs font-black uppercase tracking-wider mb-2.5 ${
                  activeTemplate === "tech" ? "text-violet-600" : activeTemplate === "creative" ? "text-rose-500" : "text-zinc-900 border-b border-zinc-400 pb-0.5"
                }`}>
                  Academic Profile
                </h3>
                <div className="space-y-3">
                  {formData.education.map((edu, i) => (edu.degree.trim() || edu.institution.trim()) && (
                    <div key={i} className="text-[10px] leading-relaxed flex justify-between items-start">
                      <div>
                        <span className="font-bold text-zinc-900">{edu.degree}</span>
                        <span className="text-zinc-500 block">{edu.institution}</span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-semibold text-zinc-700 block">{edu.year}</span>
                        {edu.percentage && <span className="text-[9.5px] bg-zinc-100 px-1.5 py-0.5 rounded font-bold">{edu.percentage}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {formData.certifications.some((cert) => cert.trim()) && (
              <div className="mt-5">
                <h3 className={`text-xs font-black uppercase tracking-wider mb-2.5 ${
                  activeTemplate === "tech" ? "text-violet-600" : activeTemplate === "creative" ? "text-rose-500" : "text-zinc-900 border-b border-zinc-400 pb-0.5"
                }`}>
                  Certifications
                </h3>
                <ul className="list-disc list-inside space-y-2 text-[10px] text-zinc-700 leading-relaxed">
                  {formData.certifications.filter((cert) => cert.trim()).map((cert, idx) => (
                    <li key={idx}>{cert}</li>
                  ))}
                </ul>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}