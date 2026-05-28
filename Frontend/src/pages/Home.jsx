import React from "react";
import { Link } from "react-router-dom";
import { 
  Briefcase, 
  FileText, 
  ScanLine, 
  CheckCircle, 
  ArrowRight, 
  Sparkles,
  ShieldCheck,
  TrendingUp,
  UserCheck
} from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } },
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 overflow-x-hidden font-sans relative">
      {/* Mesh Neon Backgrounds */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[130px] pointer-events-none z-0" />
      <div className="absolute top-1/3 right-10 w-[450px] h-[450px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Grid Pattern Layer */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f29370a_1px,transparent_1px),linear-gradient(to_bottom,#1f29370a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Navigation */}
      <nav className="relative z-10 max-w-7xl mx-auto flex items-center justify-between px-6 py-5 border-b border-zinc-900 bg-zinc-950/40 backdrop-blur-md">
        <div className="flex items-center gap-2.5 font-bold text-xl tracking-tight bg-gradient-to-r from-violet-400 to-indigo-300 bg-clip-text text-transparent">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center text-white font-black text-sm">
            JT
          </div>
          <span>JobTracker</span>
        </div>

        <div className="flex items-center gap-6">
          <Link 
            to="/login" 
            className="text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors"
          >
            Sign In
          </Link>
          <Link 
            to="/register" 
            className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-white rounded-lg group bg-gradient-to-br from-violet-600 to-indigo-500 group-hover:from-violet-600 group-hover:to-indigo-500 hover:text-white dark:text-white focus:ring-2 focus:outline-none focus:ring-violet-800"
          >
            <span className="relative px-4 py-2 transition-all ease-in duration-75 bg-zinc-950 rounded-md group-hover:bg-opacity-0">
              Get Started <span className="inline-block ml-1">→</span>
            </span>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative z-10 max-w-5xl mx-auto px-6 pt-20 pb-16 text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-violet-500/20 bg-violet-500/5 text-violet-300 text-xs font-semibold"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Introducing  ATS Resume Scanning</span>
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-none text-zinc-100 max-w-4xl mx-auto"
        >
          Track Applications, Perfect Resumes,
          <span className="block mt-2 bg-gradient-to-r from-violet-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent">
            Land Your Dream Job.
          </span>
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-zinc-400 text-lg sm:text-xl max-w-2xl mx-auto font-medium"
        >
          A unified premium SaaS platform offering real-time Kanban tracking, dynamic professional resume templates, and secure Gemini-driven ATS optimizations.
        </motion.p>

        <motion.div
          initial={{ y: 25, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
        >
          <Link 
            to="/register" 
            className="w-full sm:w-auto px-8 py-3.5 rounded-lg text-sm font-semibold bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-600/20 transition-all flex items-center justify-center gap-2 group"
          >
            Start Your Journey 
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link 
            to="/login" 
            className="w-full sm:w-auto px-8 py-3.5 rounded-lg text-sm font-semibold bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 transition-colors text-center"
          >
            Sign In
          </Link>
        </motion.div>
      </header>

      {/* Product Preview Card */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="p-1 rounded-2xl border border-zinc-800 bg-zinc-900/40 backdrop-blur-md shadow-2xl relative"
        >
          {/* Glass dashboard mockup content */}
          <div className="rounded-xl overflow-hidden bg-zinc-950 border border-zinc-900 aspect-[16/9] flex flex-col p-4 space-y-4">
            {/* Mock Header */}
            <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <div className="w-40 h-4 bg-zinc-900 rounded" />
              </div>
              <div className="w-24 h-6 bg-zinc-900 rounded-full" />
            </div>
            {/* Mock Grid */}
            <div className="flex-1 grid grid-cols-4 gap-4">
              {/* Left Column (Columns List) */}
              <div className="col-span-1 border-r border-zinc-900 pr-4 space-y-3">
                <div className="w-full h-8 bg-zinc-900/50 rounded flex items-center px-2">
                  <div className="w-4.5 h-4.5 bg-violet-600/20 text-violet-400 rounded mr-2" />
                  <div className="w-16 h-3 bg-zinc-800 rounded" />
                </div>
                <div className="w-full h-8 bg-zinc-900/20 rounded flex items-center px-2">
                  <div className="w-4.5 h-4.5 bg-zinc-800 text-zinc-400 rounded mr-2" />
                  <div className="w-20 h-3 bg-zinc-900 rounded" />
                </div>
                <div className="w-full h-8 bg-zinc-900/20 rounded flex items-center px-2">
                  <div className="w-4.5 h-4.5 bg-zinc-800 text-zinc-400 rounded mr-2" />
                  <div className="w-14 h-3 bg-zinc-900 rounded" />
                </div>
              </div>
              {/* Main Content Mock (Kanban columns) */}
              <div className="col-span-3 grid grid-cols-3 gap-3">
                {["Applied", "Interview", "Offer"].map((col, idx) => (
                  <div key={idx} className="bg-zinc-900/10 border border-zinc-900/40 rounded-xl p-3 space-y-3">
                    <div className="flex justify-between items-center pb-2">
                      <span className="text-xs font-semibold text-zinc-400">{col}</span>
                      <span className="text-[10px] bg-zinc-900 px-1.5 py-0.5 rounded text-zinc-500">2</span>
                    </div>
                    {/* Job Card Mock */}
                    <div className="bg-zinc-900/40 border border-zinc-800 rounded-lg p-2.5 space-y-2">
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-bold truncate">Google</span>
                        <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded">High</span>
                      </div>
                      <span className="text-[10px] text-zinc-500 block">Frontend Engineer</span>
                      <div className="flex gap-1">
                        <span className="text-[9px] bg-zinc-800 text-zinc-400 px-1 rounded">React</span>
                        <span className="text-[9px] bg-zinc-800 text-zinc-400 px-1 rounded">TS</span>
                      </div>
                    </div>
                    {/* Job Card Mock 2 */}
                    <div className="bg-zinc-900/40 border border-zinc-800 rounded-lg p-2.5 space-y-2">
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-bold truncate">Stripe</span>
                        <span className="text-[9px] bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded">Mid</span>
                      </div>
                      <span className="text-[10px] text-zinc-500 block">Fullstack Engineer</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20 border-t border-zinc-900 bg-zinc-950/20">
        <div className="text-center space-y-3 mb-16">
          <h2 className="text-3xl font-extrabold sm:text-4xl">
            Everything you need in a <span className="bg-gradient-to-r from-violet-400 to-indigo-300 bg-clip-text text-transparent">single command center</span>
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto text-sm sm:text-base font-medium">
            Stop juggling spreadsheets and document templates. Leverage modern workspace modules to automate your job tracking and resume enhancements.
          </p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Card 1: Kanban */}
          <motion.div variants={itemVariants} className="p-8 rounded-2xl border border-zinc-900 bg-zinc-900/30 hover:border-violet-500/20 transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-400 group-hover:scale-110 transition-transform">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">Kanban Job Board</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Replaces cluttered table configurations with an interactive drag-and-drop board containing stages for Applied, Screening, Interview, Offer, and Rejected.
              </p>
            </div>
            <ul className="mt-6 pt-6 border-t border-zinc-800/60 space-y-2 text-xs text-zinc-500">
              <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Dynamic company logo generators</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Custom tags, priorities, and salary ranges</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Smart follow-up warnings</li>
            </ul>
          </motion.div>

          {/* Card 2: Resume */}
          <motion.div variants={itemVariants} className="p-8 rounded-2xl border border-zinc-900 bg-zinc-900/30 hover:border-violet-500/20 transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">Dynamic Resume Builder</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Build high-fidelity professional resumes with our split sticky visual editor, collapsing custom form accordions, and printable high-res PDF generation.
              </p>
            </div>
            <ul className="mt-6 pt-6 border-t border-zinc-800/60 space-y-2 text-xs text-zinc-500">
              <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Multiple professional templates</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> AI professional bullet improvements</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> High-quality client-side PDF export</li>
            </ul>
          </motion.div>

          {/* Card 3: ATS Scan */}
          <motion.div variants={itemVariants} className="p-8 rounded-2xl border border-zinc-900 bg-zinc-900/30 hover:border-violet-500/20 transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                <ScanLine className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold"> ATS Scanner</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Audit your resume directly against targeted job specifications in real-time. Uncover missing keyword gaps, structure suggestions, and domain skill ratings.
              </p>
            </div>
            <ul className="mt-6 pt-6 border-t border-zinc-800/60 space-y-2 text-xs text-zinc-500">
              <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Drag-and-drop document uploader</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Glowing circular matching gauges</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Actionable key improvement steps</li>
            </ul>
          </motion.div>
        </motion.div>
      </section>

      {/* Trust & Review Section */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-16 border-t border-zinc-900">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          <div className="space-y-2">
            <p className="text-4xl font-extrabold text-violet-400">95%</p>
            <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">ATS Score Increase</p>
          </div>
          <div className="space-y-2">
            <p className="text-4xl font-extrabold text-indigo-400">10k+</p>
            <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Jobs Tracked</p>
          </div>
          <div className="space-y-2">
            <p className="text-4xl font-extrabold text-emerald-400">2x</p>
            <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">More Interviews</p>
          </div>
          <div className="space-y-2">
            <p className="text-4xl font-extrabold text-amber-400">100%</p>
            <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Data Privacy</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-zinc-900 bg-zinc-950 py-12 text-center text-sm text-zinc-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5 font-bold tracking-tight bg-gradient-to-r from-violet-400 to-indigo-300 bg-clip-text text-transparent">
            <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center text-white font-black text-xs">
              JT
            </div>
            <span>JobTracker</span>
          </div>
          <p>© 2026 JobTracker Command. Crafted for modern SaaS engineers.</p>
        </div>
      </footer>
    </div>
  );
}