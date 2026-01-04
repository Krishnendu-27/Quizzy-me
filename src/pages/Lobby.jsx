import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { User, Crown, Clock } from "lucide-react";
import { useQuizStore } from "../stores/useQuizstore";
import { socket } from "../api/api";

const Lobby = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { currentUser, players, setPlayers, roomName, questions } =
    useQuizStore();

  useEffect(() => {
    // Determine connection logic (in case user refreshes)
    if (!socket.connected) socket.connect();

    // Join room event (simulated for simplicity)
    if (currentUser.name) {
      socket.emit("join_room", { roomId, user: currentUser });
    }

    // Socket Listeners
    socket.on("player_update", (updatedPlayers) => {
      setPlayers(updatedPlayers);
    });

    socket.on("game_started", () => {
      navigate(`/game/${roomId}`);
    });

    // Cleanup
    return () => {
      socket.off("player_update");
      socket.off("game_started");
    };
  }, [roomId, currentUser, navigate, setPlayers]);

  const handleStartGame = () => {
    socket.emit("start_game", { roomId });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[80vh] pt-6">
      {/* LEFT PANEL: Controls */}
      <div className="lg:col-span-1 space-y-6">
        <div className="p-6 border border-slate-500/20 rounded-2xl bg-white/5">
          <h2 className="text-sm opacity-60 uppercase tracking-widest font-bold mb-2">
            Room Code
          </h2>
          <div className="text-5xl font-mono font-black tracking-widest text-indigo-500">
            {roomId}
          </div>
        </div>

        <div className="p-6 border border-slate-500/20 rounded-2xl bg-white/5">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Crown size={20} className="text-yellow-500" /> Host Controls
          </h3>
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-indigo-500/10 rounded-lg">
              <Clock size={24} className="text-indigo-400" />
            </div>
            <div>
              <p className="text-sm opacity-60">Estimated Duration</p>
              <p className="font-bold">{questions.length * 30} Seconds</p>
            </div>
          </div>

          {currentUser.isHost ? (
            <button
              onClick={handleStartGame}
              className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl font-bold text-white shadow-lg hover:shadow-indigo-500/25 transition-all hover:scale-[1.02]"
            >
              Start Quiz
            </button>
          ) : (
            <div className="text-center p-4 bg-slate-500/10 rounded-xl animate-pulse">
              Waiting for host to start...
            </div>
          )}
        </div>
      </div>

      {/* RIGHT PANEL: User List */}
      <div className="lg:col-span-2 p-8 border border-slate-500/20 rounded-2xl bg-white/5 overflow-hidden flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Lobby ({players.length})</h2>
          <span className="flex items-center gap-2 text-sm opacity-60">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />{" "}
            Live
          </span>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 space-y-3">
          <AnimatePresence>
            {/* Mocking players if empty for visualization */}
            {(players.length > 0 ? players : [currentUser]).map(
              (player, idx) => (
                <motion.div
                  key={player.id || idx}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-slate-500/10 border border-slate-500/10"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold">
                    {player.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold">{player.name}</p>
                    <p className="text-xs opacity-50">
                      {player.isHost ? "Host" : "Participant"}
                    </p>
                  </div>
                  {player.isHost && (
                    <Crown size={18} className="text-yellow-500" />
                  )}
                </motion.div>
              )
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Lobby;
