import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { 
  LayoutDashboard, 
  Briefcase, 
  FileText, 
  ScanLine, 
  LogOut, 
  User, 
  ChevronLeft, 
  ChevronRight,
  Sun,
  Moon
} from "lucide-react";
import { motion } from "framer-motion";

export default function Sidebar({ isCollapsed, setIsCollapsed }) {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Job Tracker", path: "/jobs", icon: Briefcase },
    { name: "Resume Builder", path: "/resume", icon: FileText },
    { name: "ATS Analyzer", path: "/ats-analyzer", icon: ScanLine },
  ];

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <motion.aside
      animate={{ width: isCollapsed ? 72 : 260 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="hidden md:flex flex-col h-screen sticky top-0 bg-zinc-50 dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-900 text-zinc-900 dark:text-zinc-100 overflow-hidden z-20 shrink-0"
    >
      {/* HEADER / LOGO */}
      <div className="flex items-center justify-between p-5 h-16 border-b border-zinc-200 dark:border-zinc-900">
        {!isCollapsed && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 font-bold text-xl tracking-tight bg-gradient-to-r from-violet-600 to-indigo-500 bg-clip-text text-transparent"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center text-white font-black text-sm">
              JT
            </div>
            <span>JobTracker</span>
          </motion.div>
        )}
        {isCollapsed && (
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center text-white font-black text-sm mx-auto">
            JT
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-900 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors ml-auto no-print"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group relative ${
                isActive
                  ? "bg-violet-500/10 text-violet-600 dark:text-violet-400 font-semibold"
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100"
              }`}
            >
              <Icon className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-105 ${isActive ? "text-violet-600 dark:text-violet-400" : ""}`} />
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {item.name}
                </motion.span>
              )}
              {/* Tooltip on collapse */}
              {isCollapsed && (
                <div className="absolute left-16 hidden group-hover:block bg-zinc-900 text-zinc-100 text-xs px-2.5 py-1.5 rounded-md border border-zinc-800 shadow-xl whitespace-nowrap z-50">
                  {item.name}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* FOOTER / USER & THEME TOGGLE */}
      <div className="p-3 border-t border-zinc-200 dark:border-zinc-900 space-y-3 no-print">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
        >
          <div className="flex items-center gap-3">
            {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            {!isCollapsed && <span>{isDark ? "Dark Mode" : "Light Mode"}</span>}
          </div>
          {!isCollapsed && (
            <div className="w-7 h-4 rounded-full bg-zinc-200 dark:bg-zinc-800 p-0.5 transition-colors">
              <div className={`w-3 h-3 rounded-full bg-zinc-500 dark:bg-violet-400 transform transition-transform ${isDark ? "translate-x-3" : "translate-x-0"}`} />
            </div>
          )}
        </button>

        {/* User Card */}
        <div className={`flex items-center gap-3 p-2 rounded-lg ${isCollapsed ? "justify-center" : "bg-zinc-100/50 dark:bg-zinc-900/40"}`}>
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center text-white font-bold shrink-0">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate text-zinc-900 dark:text-zinc-100">{user?.name || "Premium User"}</p>
              <p className="text-xs truncate text-zinc-500">{user?.email || "user@example.com"}</p>
            </div>
          )}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-rose-600 hover:bg-rose-500/10 dark:hover:bg-rose-500/5 transition-colors group relative"
        >
          <LogOut className="w-5 h-5 shrink-0 transition-transform group-hover:translate-x-0.5" />
          {!isCollapsed && <span>Logout</span>}
          {isCollapsed && (
            <div className="absolute left-16 hidden group-hover:block bg-zinc-900 text-rose-400 text-xs px-2.5 py-1.5 rounded-md border border-zinc-800 shadow-xl whitespace-nowrap z-50">
              Logout
            </div>
          )}
        </button>
      </div>
    </motion.aside>
  );
}