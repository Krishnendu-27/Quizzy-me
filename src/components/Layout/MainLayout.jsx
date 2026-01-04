import React, { useEffect } from "react";
import { useThemeStore } from "../../stores/useThemeStore";
import { Moon, Sun } from "lucide-react";

const MainLayout = ({ children }) => {
  const { isDarkMode, toggleDarkMode } = useThemeStore();
  const themeClasses = isDarkMode
    ? "bg-slate-950 text-white"
    : "bg-slate-50 text-slate-900";

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${themeClasses} overflow-hidden font-sans`}
    >
      <nav className="flex justify-between items-center p-6 w-full max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold tracking-tighter bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
          Quizzy
        </h1>
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full hover:bg-slate-200/20 transition-colors"
        >
          {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
        </button>
      </nav>
      <main className="w-full max-w-7xl mx-auto px-6">{children}</main>
    </div>
  );
};

export default MainLayout;
