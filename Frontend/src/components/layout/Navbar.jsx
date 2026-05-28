import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import NotificationBell from "../common/NotificationBell";
import { 
  Menu, 
  X, 
  Sun, 
  Moon, 
  LayoutDashboard, 
  Briefcase, 
  FileText, 
  ScanLine, 
  LogOut,
  User
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Job Tracker", path: "/jobs", icon: Briefcase },
    { name: "Resume Builder", path: "/resume", icon: FileText },
    { name: "ATS Analyzer", path: "/ats-analyzer", icon: ScanLine },
  ];

  return (
    <nav className="h-16 border-b border-zinc-200 dark:border-zinc-900 bg-zinc-50/80 dark:bg-zinc-950/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-6 text-zinc-900 dark:text-zinc-100 no-print">
      {/* LEFT: Branding for Mobile, Page Title for Desktop */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 rounded-md md:hidden hover:bg-zinc-200 dark:hover:bg-zinc-900 transition-colors"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <div className="flex md:hidden items-center gap-2 font-bold text-lg bg-gradient-to-r from-violet-600 to-indigo-500 bg-clip-text text-transparent">
          <div className="w-7 h-7 rounded-md bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center text-white font-black text-xs">
            JT
          </div>
          <span>JobTracker</span>
        </div>

        <div className="hidden md:flex items-center gap-2 text-sm text-zinc-500">
          <span className="font-semibold text-zinc-900 dark:text-zinc-100">
            {location.pathname === "/dashboard" && "Dashboard"}
            {location.pathname === "/jobs" && "Job Applications"}
            {location.pathname === "/resume" && "Resume Builder"}
            {location.pathname === "/ats-analyzer" && "ATS Analyzer"}
          </span>
          <span>•</span>
          <span className="text-xs">
            {new Date().toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
      </div>

      {/* RIGHT: Notifications, Profile, Toggle */}
      <div className="flex items-center gap-4">
        {/* Theme Toggle (Mobile only) */}
        <button
          onClick={toggleTheme}
          className="md:hidden p-2 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-900 text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications */}
        <NotificationBell />

        {/* User initials bubble & Name */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-zinc-200 dark:border-zinc-900">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center text-white font-bold text-sm">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <span className="hidden sm:inline text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {user?.name || "Premium User"}
          </span>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-16 bg-zinc-950/40 backdrop-blur-sm z-40 md:hidden animate-fade-in" onClick={() => setMobileMenuOpen(false)}>
          <div 
            className="w-64 h-full bg-zinc-50 dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-900 p-5 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-violet-500/10 text-violet-600 dark:text-violet-400"
                        : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>

            <div className="pt-4 border-t border-zinc-200 dark:border-zinc-900 space-y-3">
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-rose-600 hover:bg-rose-500/10 dark:hover:bg-rose-500/5 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}