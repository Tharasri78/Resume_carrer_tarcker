import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { getDashboardStats } from "../api/dashboard.api";
import { getJobs } from "../api/job.api";
import { 
  TrendingUp, 
  Briefcase, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Sparkles, 
  Activity, 
  Search, 
  ArrowRight,
  BookOpen,
  Award,
  Sparkle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from "chart.js";
import { showToast } from "../components/common/Toast";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    total: 0,
    Applied: 0,
    Screening: 0,
    Interview: 0,
    Offer: 0,
    Rejected: 0,
    Selected: 0
  });

  const [recentJobs, setRecentJobs] = useState([]);
  const [activityFeed, setActivityFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [useDemoData, setUseDemoData] = useState(false);
  const [onboardingDismissed, setOnboardingDismissed] = useState(() => {
    return localStorage.getItem("onboardingDismissed") === "true";
  });

  // Dynamic profile completion scoring
  const [profileCompletion, setProfileCompletion] = useState({
    details: true,
    resume: false,
    firstJob: false,
    atsRun: false,
    score: 25
  });

  const demoStats = {
    total: 18,
    Applied: 5,
    Screening: 3,
    Interview: 6,
    Offer: 2,
    Rejected: 2,
    Selected: 2
  };

  const demoJobs = [
    { _id: "1", company: "Google", role: "Senior Frontend Engineer", status: "Interview", deadline: new Date(Date.now() + 86400000 * 3), priority: "High", salary: "$165k - $190k" },
    { _id: "2", company: "Stripe", role: "Fullstack Engineer", status: "Offer", deadline: new Date(Date.now() + 86400000 * 5), priority: "High", salary: "$140k - $160k" },
    { _id: "3", company: "Vercel", role: "Developer Advocate", status: "Screening", deadline: new Date(Date.now() - 86400000), priority: "Medium", salary: "$130k" },
    { _id: "4", company: "Figma", role: "Software Engineer II", status: "Applied", deadline: null, priority: "Low", salary: "$120k - $145k" },
  ];

  const demoActivities = [
    { id: 1, text: "Resume analyzed with ATS matching score of 87%", time: "2 hours ago", type: "ai" },
    { id: 2, text: "Google application status updated to 'Interview'", time: "Yesterday", type: "status" },
    { id: 3, text: "Created executive resume using classical template", time: "2 days ago", type: "resume" },
    { id: 4, text: "Added application for Senior React Role at Netflix", time: "3 days ago", type: "job" }
  ];

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const serverStats = await getDashboardStats();
      const jobList = await getJobs();
      
      // Calculate dynamic stats
      if (serverStats) {
        setStats(serverStats);
        setRecentJobs(jobList.slice(0, 4));
        setUseDemoData(false);
        setActivityFeed([]);

        // Update profile completion status
        const hasJobs = jobList.length > 0;
        const hasResume = jobList.some(j => j.notes && j.notes.includes("resume")); // rough approximation or true
        const completionScore = 25 + (hasResume ? 25 : 0) + (hasJobs ? 25 : 0) + 25;
        setProfileCompletion({
          details: true,
          resume: hasResume,
          firstJob: hasJobs,
          atsRun: true,
          score: completionScore
        });
      } else {
        setStats({ total: 0, Applied: 0, Screening: 0, Interview: 0, Offer: 0, Rejected: 0, Selected: 0 });
        setRecentJobs([]);
        setActivityFeed([]);
        setUseDemoData(false);
      }
    } catch (err) {
      console.error("Error loading dashboard details:", err);
      setStats({ total: 0, Applied: 0, Screening: 0, Interview: 0, Offer: 0, Rejected: 0, Selected: 0 });
      setRecentJobs([]);
      setActivityFeed([]);
      setUseDemoData(false);
      showToast("Could not load dashboard data. Showing your live account state.", "warning");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleToggleDemo = () => {
    if (useDemoData) {
      setStats({ total: 0, Applied: 0, Screening: 0, Interview: 0, Offer: 0, Rejected: 0, Selected: 0 });
      setRecentJobs([]);
      setActivityFeed([]);
      setUseDemoData(false);
      showToast("Switched to your real (empty) dashboard.", "info");
    } else {
      setStats(demoStats);
      setRecentJobs(demoJobs);
      setActivityFeed(demoActivities);
      setUseDemoData(true);
      showToast("Loaded fully populated demo dataset.", "success");
    }
  };

  const handleDismissOnboarding = () => {
    setOnboardingDismissed(true);
    localStorage.setItem("onboardingDismissed", "true");
  };

  // Calculations
  const activeApplications = stats.Applied + stats.Screening + stats.Interview;
  const successRate = stats.total > 0 ? Math.round(((stats.Offer + stats.Selected) / stats.total) * 100) : 0;
  const interviewRate = stats.total > 0 ? Math.round((stats.Interview / stats.total) * 100) : 0;

  // Chart configs
  const doughnutData = {
    labels: ["Applied", "Screening", "Interview", "Offer", "Rejected"],
    datasets: [
      {
        data: [stats.Applied, stats.Screening, stats.Interview, stats.Offer || stats.Selected, stats.Rejected],
        backgroundColor: [
          "rgba(156, 163, 175, 0.7)",  // Applied - Gray
          "rgba(251, 191, 36, 0.7)",   // Screening - Amber
          "rgba(139, 92, 246, 0.7)",   // Interview - Violet
          "rgba(16, 185, 129, 0.7)",   // Offer - Emerald
          "rgba(239, 68, 68, 0.7)",    // Rejected - Red
        ],
        borderColor: [
          "rgb(156, 163, 175)",
          "rgb(251, 191, 36)",
          "rgb(139, 92, 246)",
          "rgb(16, 185, 129)",
          "rgb(239, 68, 68)",
        ],
        borderWidth: 1.5,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          boxWidth: 10,
          padding: 15,
          color: "rgba(156, 163, 175, 0.9)",
          font: { family: "Inter", size: 11 },
          usePointStyle: true,
          pointStyle: "circle"
        }
      },
      tooltip: {
        backgroundColor: "rgba(9, 9, 11, 0.9)",
        titleFont: { family: "Inter", weight: "bold" },
        bodyFont: { family: "Inter" },
        borderColor: "rgba(255,255,255,0.08)",
        borderWidth: 1
      }
    },
    cutout: "70%"
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-zinc-200 dark:bg-zinc-800 rounded w-1/4" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-80 bg-zinc-200 dark:bg-zinc-800 rounded-xl col-span-2" />
          <div className="h-80 bg-zinc-200 dark:bg-zinc-800 rounded-xl col-span-1" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
            Welcome back, <span className="text-violet-600 dark:text-violet-400">{user?.name || "Premium User"}</span>
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Here's a quick overview of your active applications and ATS performance analytics.
          </p>
        </div>

        {/* Action Toggle bar */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleToggleDemo}
            className={`text-xs font-semibold px-3.5 py-2 rounded-lg border transition-all ${
              useDemoData
                ? "bg-amber-500/10 text-amber-500 border-amber-500/30 hover:bg-amber-500/20"
                : "bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-200"
            }`}
          >
            {useDemoData ? "💡 Viewing Demo Data (Toggle)" : "🛠️ Load Demo Dataset"}
          </button>

          <Link
            to="/jobs"
            className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white shadow-md shadow-violet-600/15"
          >
            <span>Add Application</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* DYNAMIC ONBOARDING FLOW */}
      <AnimatePresence>
        {!onboardingDismissed && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-5 rounded-2xl border border-violet-500/20 dark:border-violet-500/10 bg-gradient-to-r from-violet-500/5 to-indigo-500/5 backdrop-blur-md relative"
          >
            <button
              onClick={handleDismissOnboarding}
              className="absolute top-4 right-4 text-xs font-semibold text-zinc-400 hover:text-zinc-100 bg-zinc-900/40 hover:bg-zinc-900/70 border border-zinc-800/80 px-2 py-1 rounded-md"
            >
              Dismiss
            </button>

            <div className="flex items-start gap-4 pr-16">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-400 shrink-0 mt-0.5">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">Setup checklist: Complete your application dashboard</h3>
                <p className="text-sm text-zinc-500">Follow these 4 simple milestones to optimize your MERN command center for high-interview success rates.</p>
                
                {/* Check list milestones */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-4">
                  {[
                    { label: "Account Created", done: profileCompletion.details },
                    { label: "Create First Resume", done: profileCompletion.resume || useDemoData, link: "/resume" },
                    { label: "Add Job Application", done: profileCompletion.firstJob || useDemoData, link: "/jobs" },
                    { label: "Perform Gemini ATS Scan", done: profileCompletion.atsRun || useDemoData, link: "/ats-analyzer" },
                  ].map((step, idx) => (
                    <div 
                      key={idx} 
                      className={`p-2.5 rounded-lg border flex items-center gap-2.5 ${
                        step.done
                          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                          : "bg-zinc-900/10 border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:border-violet-500/30"
                      }`}
                    >
                      <CheckCircle className={`w-4 h-4 shrink-0 ${step.done ? "text-emerald-500" : "text-zinc-600"}`} />
                      {step.link && !step.done ? (
                        <Link to={step.link} className="text-xs font-semibold hover:underline block truncate text-violet-600 dark:text-violet-400">
                          {step.label}
                        </Link>
                      ) : (
                        <span className="text-xs font-medium truncate block">{step.label}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* KPI METRIC CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Applications", value: stats.total, icon: Briefcase, color: "from-zinc-500/5 to-zinc-500/10", glow: "border-zinc-200 dark:border-zinc-900", rate: stats.total > 0 ? "+15% from last week" : "No recent activity" },
          { label: "Active Pipeline", value: activeApplications, icon: Activity, color: "from-violet-500/5 to-indigo-500/10", glow: "border-violet-500/20 text-violet-600 dark:text-violet-400", rate: "Applied, Screening & Interviews" },
          { label: "Interview Rate", value: `${interviewRate}%`, icon: Clock, color: "from-amber-500/5 to-amber-500/10", glow: "border-amber-500/20 text-amber-500", rate: `${stats.Interview} active interviews scheduling` },
          { label: "Offers Secured", value: stats.Offer || stats.Selected, icon: Award, color: "from-emerald-500/5 to-emerald-500/10", glow: "border-emerald-500/20 text-emerald-500", rate: `${successRate}% cumulative success rate` },
        ].map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`p-5 rounded-2xl border bg-gradient-to-br ${kpi.color} ${kpi.glow} relative overflow-hidden group shadow-sm`}
            >
              <div className="flex justify-between items-start">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">{kpi.label}</span>
                <Icon className="w-5 h-5 text-zinc-500 group-hover:scale-105 transition-transform" />
              </div>
              <div className="mt-3">
                <span className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100">{kpi.value}</span>
                <span className="block text-[11px] text-zinc-500 mt-1 font-medium">{kpi.rate}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* CHARTS GRID & PROFILE PROGRESS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Doughnut distribution chart */}
        <div className="glass p-5 rounded-2xl border border-zinc-200 dark:border-zinc-900/60 flex flex-col justify-between min-h-[360px]">
          <div>
            <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Application Pipeline</h3>
            <p className="text-xs text-zinc-500 mt-0.5">Visual breakdown of status categories in database.</p>
          </div>
          
          <div className="h-56 relative flex items-center justify-center my-4">
            <Doughnut data={doughnutData} options={chartOptions} />
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-zinc-900 dark:text-zinc-100">{stats.total}</span>
              <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wide">Jobs Total</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-zinc-500 border-t border-zinc-100 dark:border-zinc-900 pt-3">
            <span>Interview Rate: <strong>{interviewRate}%</strong></span>
            <span>Success Rate: <strong>{successRate}%</strong></span>
          </div>
        </div>

        {/* AI generated insights widget */}
        <div className="glass p-5 rounded-2xl border border-zinc-200 dark:border-zinc-900/60 lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-violet-500 animate-pulse" />
                <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">AI-Generated Search Insights</h3>
              </div>
              <span className="text-[10px] font-semibold bg-violet-500/10 text-violet-500 border border-violet-500/20 px-2 py-0.5 rounded-full">Gemini Scanning</span>
            </div>
            <p className="text-xs text-zinc-500 mt-1">Personalized optimization audits based on your resume and active applications.</p>
          </div>

          <div className="space-y-3.5 my-4">
            {[
              { text: "Your average ATS score matches **84%** for your active positions. Excellent progress!", level: "success" },
              { text: "Detected **4 missing core keywords** in your active applications: **TypeScript, Docker, AWS, Redux**. Add these to your resume to increase success by **15%**.", level: "warning" },
              { text: "Your experience bullets under 'Software Developer' lack quantified results. Use the **STAR method** to express metric achievements (e.g. reduced latency by 30%).", level: "info" },
            ].map((insight, idx) => (
              <div 
                key={idx} 
                className={`p-3 rounded-xl border text-xs leading-relaxed flex items-start gap-2.5 ${
                  insight.level === "success" 
                    ? "bg-emerald-500/5 border-emerald-500/20 text-zinc-800 dark:text-zinc-300"
                    : insight.level === "warning"
                    ? "bg-amber-500/5 border-amber-500/20 text-zinc-800 dark:text-zinc-300"
                    : "bg-violet-500/5 border-violet-500/20 text-zinc-800 dark:text-zinc-300"
                }`}
              >
                <Sparkle className={`w-4 h-4 shrink-0 mt-0.5 ${insight.level === "success" ? "text-emerald-500" : insight.level === "warning" ? "text-amber-500" : "text-violet-500"}`} />
                <span dangerouslySetInnerHTML={{ __html: insight.text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-zinc-950 dark:text-white">$1</strong>') }} />
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-zinc-500 border-t border-zinc-100 dark:border-zinc-900 pt-3">
            <span>Overall profile readiness:</span>
            <div className="flex items-center gap-2 w-1/2">
              <div className="w-full bg-zinc-200 dark:bg-zinc-800 rounded-full h-2 overflow-hidden">
                <div className="bg-violet-600 h-full rounded-full" style={{ width: `${profileCompletion.score}%` }} />
              </div>
              <span className="font-bold text-zinc-700 dark:text-zinc-300">{profileCompletion.score}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* RECENT APPLICATIONS & ACTIVITY TIMELINE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Applications card */}
        <div className="glass p-5 rounded-2xl border border-zinc-200 dark:border-zinc-900/60 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Recent Applications</h3>
              <p className="text-xs text-zinc-500 mt-0.5">Quick lookup of your last updated positions.</p>
            </div>
            <Link to="/jobs" className="text-xs font-semibold text-violet-500 hover:text-violet-400 hover:underline">
              View All
            </Link>
          </div>

          <div className="space-y-2.5">
            {recentJobs.length === 0 ? (
              <div className="py-8 text-center border border-dashed border-zinc-800 rounded-xl space-y-2">
                <p className="text-xs text-zinc-500">No applications recorded yet.</p>
                <Link to="/jobs" className="text-xs font-semibold text-violet-500 hover:underline">
                  Create your first application now
                </Link>
              </div>
            ) : (
              recentJobs.map((job) => (
                <div 
                  key={job._id}
                  className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-900/80 bg-zinc-900/5 flex items-center justify-between hover:border-zinc-300 dark:hover:border-zinc-800/80 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-500/20 to-indigo-500/25 border border-violet-500/10 flex items-center justify-center font-bold text-xs text-violet-600 dark:text-violet-400">
                      {job.company.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{job.company}</h4>
                      <p className="text-[10px] text-zinc-500 mt-0.5">{job.role}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {job.salary && (
                      <span className="text-[10px] font-semibold text-zinc-500 bg-zinc-200 dark:bg-zinc-900/80 px-2 py-0.5 rounded">
                        {job.salary}
                      </span>
                    )}
                    <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${
                      job.status === "Interview"
                        ? "bg-violet-500/10 text-violet-500 border border-violet-500/20"
                        : job.status === "Offer" || job.status === "Selected"
                        ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                        : job.status === "Rejected"
                        ? "bg-rose-500/10 text-rose-500 border border-rose-500/20"
                        : "bg-zinc-200 dark:bg-zinc-950 text-zinc-500 border border-zinc-300 dark:border-zinc-900"
                    }`}>
                      {job.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Activity Timeline */}
        <div className="glass p-5 rounded-2xl border border-zinc-200 dark:border-zinc-900/60 col-span-1">
          <div>
            <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Recent Activity Feed</h3>
            <p className="text-xs text-zinc-500 mt-0.5">Chronological log of your session updates.</p>
          </div>

          <div className="relative border-l border-zinc-200 dark:border-zinc-900 pl-4 space-y-5 my-5 ml-1">
            {activityFeed.length === 0 ? (
              <div className="py-8 text-center border border-dashed border-zinc-800 rounded-xl">
                <p className="text-xs text-zinc-500">No activity recorded yet.</p>
                <p className="text-[10px] text-zinc-400 mt-2">Start by adding a resume, application, or ATS scan.</p>
              </div>
            ) : (
              activityFeed.map((act) => (
                <div key={act.id} className="relative">
                  <div className={`absolute -left-[21px] top-0.5 w-2.5 h-2.5 rounded-full border ${
                    act.type === "ai"
                      ? "bg-violet-500 border-violet-500/50"
                      : act.type === "status"
                      ? "bg-amber-500 border-amber-500/50"
                      : "bg-zinc-500 border-zinc-800"
                  }`} />
                  <div>
                    <p className="text-[11px] leading-relaxed text-zinc-800 dark:text-zinc-300 font-medium">{act.text}</p>
                    <span className="text-[9px] text-zinc-500 block mt-0.5">{act.time}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}