import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Mail, Lock, User, UserPlus, ArrowLeft } from "lucide-react";
import { showToast } from "../../components/common/Toast";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  
  const { register, loading, error, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      showToast("Please fill in all fields", "warning");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      showToast("Passwords do not match", "warning");
      return;
    }

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      showToast("Account created successfully!", "success");
    } catch (err) {
      showToast(err.message || "Registration failed", "error");
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Background neon glows */}
      <div className="absolute top-1/4 left-1/3 w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-[350px] h-[350px] bg-indigo-600/10 rounded-full blur-[90px] pointer-events-none" />

      {/* Back button */}
      <div className="absolute top-6 left-6 z-10">
        <Link
          to="/"
          className="flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-zinc-100 transition-colors bg-zinc-900/50 border border-zinc-800/80 px-3.5 py-2 rounded-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="flex justify-center items-center gap-2.5 font-bold text-2xl tracking-tight bg-gradient-to-r from-violet-400 to-indigo-300 bg-clip-text text-transparent mb-6">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center text-white font-black text-sm">
            JT
          </div>
          <span>JobTracker</span>
        </div>
        <h2 className="text-center text-3xl font-extrabold text-zinc-100">Create Your Account</h2>
        <p className="mt-2 text-center text-sm text-zinc-400">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-violet-400 hover:text-violet-300 transition-colors">
            Sign in here
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10 px-4">
        <div className="glass p-8 rounded-2xl shadow-xl border border-zinc-800/50">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Full Name field */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                Full Name
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-zinc-500" />
                </div>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="John Doe"
                  className="block w-full pl-10 pr-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-lg text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Email field */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                Email Address
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-zinc-500" />
                </div>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="name@example.com"
                  className="block w-full pl-10 pr-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-lg text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                Password
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-zinc-500" />
                </div>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-lg text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Confirm Password field */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                Confirm Password
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-zinc-500" />
                </div>
                <input
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-lg text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Error notice */}
            {error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-lg font-medium">
                {error}
              </div>
            )}

            {/* Submit button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg text-sm font-semibold text-white bg-violet-600 hover:bg-violet-500 shadow-md shadow-violet-600/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-600 focus:ring-offset-zinc-950 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Create Account</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}