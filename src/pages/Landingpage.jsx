import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Users } from "lucide-react";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-[80vh] text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-6">
          Real-time <br />
          <span className="text-indigo-500">Knowledge.</span>
        </h1>
        <p className="text-lg md:text-xl opacity-70 mb-10 max-w-2xl mx-auto">
          Create custom quizzes, invite friends via room codes, and battle in
          real-time. No lag, just pure competitive fun.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <button
          onClick={() => navigate("/create")}
          className="group relative px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-indigo-500/30 transition-all hover:scale-105 flex items-center gap-2"
        >
          Create Room{" "}
          <ArrowRight
            size={20}
            className="group-hover:translate-x-1 transition-transform"
          />
        </button>

        <button
          onClick={() => navigate("/join")} // Assuming join route exists
          className="px-8 py-4 bg-slate-200/10 border border-slate-500/30 hover:bg-slate-200/20 backdrop-blur-sm rounded-xl font-bold text-lg transition-all hover:scale-105 flex items-center gap-2"
        >
          Join Room <Users size={20} />
        </button>
      </motion.div>
    </div>
  );
};

export default LandingPage;
