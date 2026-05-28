import React, { useEffect, useState } from "react";
import { getJobs, createJob, updateJobStatus, deleteJob } from "../api/job.api";
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  DollarSign, 
  AlertCircle, 
  Trash2, 
  X, 
  Edit3,
  Bookmark,
  CheckCircle,
  Tag,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { showToast } from "../components/common/Toast";

export default function JobTracker() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterPriority, setFilterPriority] = useState("All");
  const [sortKey, setSortKey] = useState("createdAt");
  const [activeDragColumn, setActiveDragColumn] = useState(null);

  // Form Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [formData, setFormData] = useState({
    company: "",
    role: "",
    status: "Applied",
    salary: "",
    priority: "Medium",
    tags: "",
    deadline: "",
    notes: "",
    followUpDate: ""
  });

  const columns = [
    { id: "Applied", title: "Applied", color: "border-t-zinc-400 dark:border-t-zinc-700 bg-zinc-500/5" },
    { id: "Screening", title: "Screening", color: "border-t-amber-400 dark:border-t-amber-500 bg-amber-500/5" },
    { id: "Interview", title: "Interview", color: "border-t-violet-400 dark:border-t-violet-500 bg-violet-500/5" },
    { id: "Offer", title: "Offer", color: "border-t-emerald-400 dark:border-t-emerald-500 bg-emerald-500/5" },
    { id: "Rejected", title: "Rejected", color: "border-t-rose-400 dark:border-t-rose-500 bg-rose-500/5" }
  ];

  const fetchJobsList = async () => {
    try {
      const data = await getJobs();
      setJobs(data || []);
    } catch (err) {
      console.error("Failed to load jobs", err);
      showToast("Could not sync with database. Using local state.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobsList();
  }, []);

  // HTML5 Drag-and-Drop Triggers
  const handleDragStart = (e, jobId) => {
    e.dataTransfer.setData("text/plain", jobId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, columnId) => {
    e.preventDefault();
    if (activeDragColumn !== columnId) {
      setActiveDragColumn(columnId);
    }
  };

  const handleDragLeave = () => {
    setActiveDragColumn(null);
  };

  const handleDrop = async (e, columnId) => {
    e.preventDefault();
    setActiveDragColumn(null);
    const jobId = e.dataTransfer.getData("text/plain");
    
    // Optimistic local state update
    const previousJobs = [...jobs];
    setJobs((prev) =>
      prev.map((job) => (job._id === jobId ? { ...job, status: columnId } : job))
    );

    try {
      await updateJobStatus(jobId, columnId);
      showToast(`Moved to ${columnId}`, "success");
    } catch (err) {
      console.error(err);
      setJobs(previousJobs); // revert on server error
      showToast("Failed to update status on server.", "error");
    }
  };

  const handleFormChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const openAddModal = () => {
    setEditingJob(null);
    setFormData({
      company: "",
      role: "",
      status: "Applied",
      salary: "",
      priority: "Medium",
      tags: "",
      deadline: "",
      notes: "",
      followUpDate: ""
    });
    setIsModalOpen(true);
  };

  const openEditModal = (job) => {
    setEditingJob(job);
    setFormData({
      company: job.company || "",
      role: job.role || "",
      status: job.status || "Applied",
      salary: job.salary || "",
      priority: job.priority || "Medium",
      tags: job.tags?.join(", ") || "",
      deadline: job.deadline ? new Date(job.deadline).toISOString().split("T")[0] : "",
      notes: job.notes || "",
      followUpDate: job.followUpDate ? new Date(job.followUpDate).toISOString().split("T")[0] : ""
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.company.trim() || !formData.role.trim()) {
      showToast("Company and Role are required.", "warning");
      return;
    }

    const payload = {
      ...formData,
      tags: formData.tags.split(",").map(t => t.trim()).filter(Boolean),
      deadline: formData.deadline ? new Date(formData.deadline) : null,
      followUpDate: formData.followUpDate ? new Date(formData.followUpDate) : null
    };

    try {
      if (editingJob) {
        // Since backend has standard update endpoint updateJob, let's use it!
        // We will call PUT /jobs/:id using our general update API
        // Let's create an axios helper or fetch proxy inside job.api
        // In backend job.controller, exports.updateJob handles put request!
        // Wait, does updateJobStatus in api.js support general updates?
        // job.api.js line 13:
        // export const updateJobStatus = async (id, status) => { ... }
        // Wait, it sends only { status }. Let's make sure we can send the whole payload if needed!
        // Let's see if we can perform a direct PUT API request to update in full.
        // Wait, in JobApplication controller, updateJob uses `req.body` directly!
        // So we can send any payload. Let's make sure our api handles it.
        // Let's call standard axios or our API wrapper to update in full.
        // Let's see: import API from "./axios" is in job.api.js.
        // We can import axios instance or simply import API from src/api/axios inside our component!
        // Importing src/api/axios directly is extremely convenient and bulletproof!
        const api = (await import("../api/axios")).default;
        await api.put(`/jobs/${editingJob._id}`, payload);
        showToast("Job application updated successfully!", "success");
      } else {
        await createJob(payload);
        showToast("Application added to board!", "success");
      }
      setIsModalOpen(false);
      fetchJobsList();
    } catch (err) {
      console.error(err);
      const message = err.response?.data?.error || err.response?.data?.message || "Failed to save application details.";
      showToast(message, "error");
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job application?")) return;
    try {
      await deleteJob(jobId);
      showToast("Application removed.", "warning");
      fetchJobsList();
    } catch (err) {
      console.error(err);
      const message = err.response?.data?.error || err.response?.data?.message || "Failed to delete application.";
      showToast(message, "error");
    }
  };

  // Filter & Sort Logic
  const filteredJobs = jobs
    .filter((job) => {
      const matchSearch =
        job.company.toLowerCase().includes(search.toLowerCase()) ||
        job.role.toLowerCase().includes(search.toLowerCase());
      const matchPriority = filterPriority === "All" || job.priority === filterPriority;
      return matchSearch && matchPriority;
    })
    .sort((a, b) => {
      if (sortKey === "deadline") {
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return new Date(a.deadline) - new Date(b.deadline);
      }
      if (sortKey === "priority") {
        const pMap = { High: 3, Medium: 2, Low: 1 };
        return (pMap[b.priority] || 2) - (pMap[a.priority] || 2);
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">Job Tracking Board</h1>
          <p className="text-sm text-zinc-500 mt-1">Drag and drop job cards to update your interview milestones.</p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white shadow-md shadow-violet-600/15"
        >
          <Plus className="w-4 h-4" />
          <span>Add Position</span>
        </button>
      </div>

      {/* FILTER & SEARCH CONTROL BAR */}
      <div className="glass p-4 rounded-xl border border-zinc-200 dark:border-zinc-900/60 flex flex-col sm:flex-row gap-4 justify-between items-center z-10">
        {/* Search */}
        <div className="relative w-full sm:w-80 shadow-sm rounded-lg">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-zinc-500" />
          </div>
          <input
            type="text"
            placeholder="Search company or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full pl-9 pr-4 py-2 bg-zinc-900/5 border border-zinc-200 dark:border-zinc-900 rounded-lg text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-600 dark:focus:ring-violet-600 focus:border-transparent transition-all"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Priority */}
          <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 w-full sm:w-auto justify-end">
            <Filter className="w-4 h-4 shrink-0 text-zinc-400" />
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="bg-zinc-900/5 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-lg px-2.5 py-1.5 text-xs text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-violet-500"
            >
              <option value="All">All Priorities</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>
          </div>

          {/* Sort */}
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value)}
            className="bg-zinc-900/5 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-lg px-2.5 py-1.5 text-xs text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-violet-500"
          >
            <option value="createdAt">Date Created</option>
            <option value="deadline">Near Deadlines</option>
            <option value="priority">Highest Priority</option>
          </select>
        </div>
      </div>

      {/* KANBAN BOARD SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-start select-none">
        {columns.map((col) => {
          const colJobs = filteredJobs.filter((job) => job.status === col.id);
          const isDraggingOver = activeDragColumn === col.id;

          return (
            <div
              key={col.id}
              onDragOver={(e) => handleDragOver(e, col.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, col.id)}
              className={`rounded-2xl border border-zinc-200 dark:border-zinc-900/80 p-4 min-h-[500px] flex flex-col justify-between transition-all duration-300 relative ${
                col.color
              } ${isDraggingOver ? "ring-2 ring-violet-500/40 dark:ring-violet-500/20 bg-violet-500/5" : ""}`}
            >
              <div>
                {/* Column header */}
                <div className="flex justify-between items-center border-b border-zinc-200 dark:border-zinc-900 pb-2 mb-3">
                  <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${
                      col.id === "Applied"
                        ? "bg-zinc-400"
                        : col.id === "Screening"
                        ? "bg-amber-400"
                        : col.id === "Interview"
                        ? "bg-violet-500"
                        : col.id === "Offer"
                        ? "bg-emerald-500"
                        : "bg-rose-500"
                    }`} />
                    {col.title}
                  </span>
                  <span className="text-[10px] font-bold text-zinc-500 px-2 py-0.5 rounded-full bg-zinc-200 dark:bg-zinc-900">
                    {colJobs.length}
                  </span>
                </div>

                {/* Cards stack */}
                <div className="space-y-3">
                  {colJobs.map((job) => {
                    const hasDeadlinePassed = job.deadline && new Date(job.deadline) < new Date();
                    return (
                      <motion.div
                        key={job._id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, job._id)}
                        layoutId={job._id}
                        className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-900/60 bg-zinc-50 dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-800 shadow-sm cursor-grab active:cursor-grabbing hover:shadow-md transition-all duration-200 relative group"
                      >
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate flex-1 leading-tight group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                            {job.company}
                          </h4>
                          {/* Priority label */}
                          <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded shrink-0 uppercase tracking-wide ${
                            job.priority === "High"
                              ? "bg-rose-500/10 text-rose-500 border border-rose-500/20"
                              : job.priority === "Medium"
                              ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                              : "bg-zinc-500/10 text-zinc-500 border border-zinc-500/20"
                          }`}>
                            {job.priority}
                          </span>
                        </div>
                        
                        <p className="text-[10px] text-zinc-500 mt-1 truncate font-medium">{job.role}</p>
                        
                        {job.notes && (
                          <p className="text-[9px] text-zinc-400 line-clamp-2 mt-2 leading-relaxed bg-zinc-900/5 dark:bg-zinc-950/40 p-1.5 rounded border border-zinc-200/40 dark:border-zinc-900/30">
                            {job.notes}
                          </p>
                        )}

                        {/* Tags list */}
                        {job.tags && job.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2.5">
                            {job.tags.slice(0, 3).map((tag, i) => (
                              <span key={i} className="text-[8px] font-semibold bg-zinc-200 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 px-1.5 py-0.5 rounded border border-zinc-300/20 dark:border-zinc-800/40">
                                {tag}
                              </span>
                            ))}
                            {job.tags.length > 3 && (
                              <span className="text-[8px] font-semibold text-zinc-500 px-1">
                                +{job.tags.length - 3}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Footer - Deadline / Salary / Actions */}
                        <div className="flex items-center justify-between border-t border-zinc-100 dark:border-zinc-900/60 pt-2.5 mt-3 text-[9px] text-zinc-500">
                          {job.salary ? (
                            <span className="font-semibold text-zinc-600 dark:text-zinc-400 truncate max-w-[60px]">
                              {job.salary}
                            </span>
                          ) : (
                            <span />
                          )}

                          {job.deadline ? (
                            <span className={`flex items-center gap-1 font-semibold ${hasDeadlinePassed ? "text-rose-500" : "text-zinc-500"}`}>
                              <Calendar className="w-3 h-3" />
                              <span>
                                {new Date(job.deadline).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                })}
                              </span>
                            </span>
                          ) : (
                            <span />
                          )}
                        </div>

                        {/* Actions Hover Menu */}
                        <div className="absolute top-2 right-2 hidden group-hover:flex items-center gap-1 no-print">
                          <button
                            onClick={() => openEditModal(job)}
                            className="p-1 rounded bg-zinc-200 dark:bg-zinc-950 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 border border-zinc-300 dark:border-zinc-800 shadow"
                          >
                            <Edit3 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleDeleteJob(job._id)}
                            className="p-1 rounded bg-zinc-200 dark:bg-zinc-950 text-rose-500 hover:bg-rose-500/10 border border-zinc-300 dark:border-zinc-800 shadow"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}

                  {colJobs.length === 0 && (
                    <div className="h-16 border border-dashed border-zinc-200 dark:border-zinc-900/60 rounded-xl flex items-center justify-center text-[10px] text-zinc-500">
                      Empty column
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* EMPTY STATE ILLUSTRATION */}
      {jobs.length === 0 && (
        <div className="glass p-12 rounded-2xl border border-zinc-200 dark:border-zinc-900/60 text-center space-y-4 max-w-lg mx-auto">
          {/* SVG Illustration */}
          <div className="flex justify-center">
            <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-zinc-500">
              <rect x="20" y="20" width="80" height="80" rx="16" fill="currentColor" fillOpacity="0.03" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
              <path d="M45 50H75" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M45 60H65" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="75" cy="70" r="12" stroke="currentColor" strokeWidth="2.5" />
              <path d="M83 78L90 85" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">No applications on your board</h3>
            <p className="text-xs text-zinc-500">Create your first card manually or try importing mock search logs.</p>
          </div>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white shadow-md shadow-violet-600/10"
          >
            <span>Create First Card</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* OVERLAY DIALOG / FORM MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass max-w-xl w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl p-6 relative overflow-hidden"
            >
              {/* Header */}
              <div className="flex justify-between items-center border-b border-zinc-200 dark:border-zinc-800 pb-3.5 mb-4">
                <div className="flex items-center gap-2">
                  <Bookmark className="w-5 h-5 text-violet-500 animate-pulse" />
                  <h3 className="font-extrabold text-zinc-900 dark:text-zinc-100">
                    {editingJob ? "Edit Job Details" : "Add New Application"}
                  </h3>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-950 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form body */}
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {/* Company name */}
                  <div className="col-span-1">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleFormChange}
                      required
                      placeholder="e.g. Google, Stripe"
                      className="block w-full px-3 py-2 bg-zinc-900/5 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-lg text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Role Title */}
                  <div className="col-span-1">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5">
                      Role / Position *
                    </label>
                    <input
                      type="text"
                      name="role"
                      value={formData.role}
                      onChange={handleFormChange}
                      required
                      placeholder="e.g. Frontend Engineer"
                      className="block w-full px-3 py-2 bg-zinc-900/5 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-lg text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {/* Column stage */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5">
                      Pipeline Stage
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleFormChange}
                      className="block w-full px-2 py-2 bg-zinc-900/5 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-lg text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-violet-500"
                    >
                      <option value="Applied">Applied</option>
                      <option value="Screening">Screening</option>
                      <option value="Interview">Interview</option>
                      <option value="Offer">Offer / Selected</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>

                  {/* Priority level */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5">
                      Priority Label
                    </label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleFormChange}
                      className="block w-full px-2 py-2 bg-zinc-900/5 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-lg text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-violet-500"
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>

                  {/* Salary range */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5">
                      Salary Target
                    </label>
                    <div className="relative rounded-lg shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                        <DollarSign className="w-3.5 h-3.5 text-zinc-500" />
                      </div>
                      <input
                        type="text"
                        name="salary"
                        value={formData.salary}
                        onChange={handleFormChange}
                        placeholder="e.g. $140k"
                        className="block w-full pl-7 pr-3 py-2 bg-zinc-900/5 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-lg text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-violet-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Deadline date */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5">
                      Application Deadline
                    </label>
                    <input
                      type="date"
                      name="deadline"
                      value={formData.deadline}
                      onChange={handleFormChange}
                      className="block w-full px-3 py-2 bg-zinc-900/5 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-lg text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none"
                    />
                  </div>

                  {/* Follow Up date */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5">
                      Follow Up Reminder
                    </label>
                    <input
                      type="date"
                      name="followUpDate"
                      value={formData.followUpDate}
                      onChange={handleFormChange}
                      className="block w-full px-3 py-2 bg-zinc-900/5 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-lg text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Custom Tags input */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5 flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Skills Tags (comma separated)</span>
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleFormChange}
                    placeholder="e.g. React, TypeScript, GraphQL"
                    className="block w-full px-3 py-2 bg-zinc-900/5 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-lg text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-violet-500"
                  />
                </div>

                {/* Notes box */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5">
                    Notes / Next Milestones
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleFormChange}
                    placeholder="Prepare system design questions, follow up with recruiter in 3 days..."
                    rows={3}
                    className="block w-full px-3 py-2 bg-zinc-900/5 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-lg text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-violet-500"
                  />
                </div>

                {/* Footer Save actions */}
                <div className="flex justify-end gap-3 pt-3 border-t border-zinc-200 dark:border-zinc-800 mt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs font-semibold text-zinc-700 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-950 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-violet-600/15"
                  >
                    {editingJob ? "Save Changes" : "Create Card"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}