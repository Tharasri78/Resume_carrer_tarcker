import React, { useState, useEffect } from "react";
import { CheckCircle, AlertTriangle, XCircle, Info, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export const showToast = (message, type = "success") => {
  const event = new CustomEvent("toast", { detail: { message, type } });
  window.dispatchEvent(event);
};

export default function Toast() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handleToastEvent = (e) => {
      const { message, type } = e.detail;
      const id = Date.now();
      setToasts((prev) => [...prev, { id, message, type }]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    };

    window.addEventListener("toast", handleToastEvent);
    return () => window.removeEventListener("toast", handleToastEvent);
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const getIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case "error":
        return <XCircle className="w-5 h-5 text-rose-500" />;
      default:
        return <Info className="w-5 h-5 text-violet-500" />;
    }
  };

  const getBorderColor = (type) => {
    switch (type) {
      case "success":
        return "border-emerald-500/30 dark:border-emerald-500/20";
      case "warning":
        return "border-amber-500/30 dark:border-amber-500/20";
      case "error":
        return "border-rose-500/30 dark:border-rose-500/20";
      default:
        return "border-violet-500/30 dark:border-violet-500/20";
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`flex items-start gap-3 p-4 rounded-xl border glass shadow-lg ${getBorderColor(
              t.type
            )} transition-all duration-300`}
          >
            <div className="mt-0.5 shrink-0">{getIcon(t.type)}</div>
            <div className="flex-1 text-sm font-medium text-zinc-800 dark:text-zinc-100">
              {t.message}
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 shrink-0 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
