import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Toast from "../common/Toast";

export default function Layout() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300 relative overflow-x-hidden">
      {/* Dynamic Mesh Neon Glow in Background */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-violet-600/10 dark:bg-violet-600/5 rounded-full blur-[100px] pointer-events-none z-0" />
      <div className="absolute bottom-10 left-1/3 w-[350px] h-[350px] bg-indigo-600/10 dark:bg-indigo-600/5 rounded-full blur-[90px] pointer-events-none z-0" />

      {/* Collapsible Sidebar */}
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0 z-10">
        <Navbar />

        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto w-full max-w-7xl mx-auto">
          <div className="animate-slide-up">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Central Toast Listener */}
      <Toast />
    </div>
  );
}