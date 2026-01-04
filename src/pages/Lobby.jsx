// import React, { useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import { User, Crown, Clock } from "lucide-react";
// import { useQuizStore } from "../stores/useQuizstore";
// import { socket } from "../api/api";

// const Lobby = () => {
//   const { roomId } = useParams();
//   const navigate = useNavigate();
//   const { currentUser, players, setPlayers, roomName, questions } =
//     useQuizStore();

//   useEffect(() => {
//     // Determine connection logic (in case user refreshes)
//     if (!socket.connected) socket.connect();

//     // Join room event (simulated for simplicity)
//     if (currentUser.name) {
//       socket.emit("join_room", { roomId, user: currentUser });
//     }

//     // Socket Listeners
//     socket.on("player_update", (updatedPlayers) => {
//       setPlayers(updatedPlayers);
//     });

//     socket.on("game_started", () => {
//       navigate(`/game/${roomId}`);
//     });

//     // Cleanup
//     return () => {
//       socket.off("player_update");
//       socket.off("game_started");
//     };
//   }, [roomId, currentUser, navigate, setPlayers]);

//   const handleStartGame = () => {
//     socket.emit("start_game", { roomId });
//   };

//   return (
//     <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[80vh] pt-6">
//       {/* LEFT PANEL: Controls */}
//       <div className="lg:col-span-1 space-y-6">
//         <div className="p-6 border border-slate-500/20 rounded-2xl bg-white/5">
//           <h2 className="text-sm opacity-60 uppercase tracking-widest font-bold mb-2">
//             Room Code
//           </h2>
//           <div className="text-5xl font-mono font-black tracking-widest text-indigo-500">
//             {roomId}
//           </div>
//         </div>

//         <div className="p-6 border border-slate-500/20 rounded-2xl bg-white/5">
//           <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
//             <Crown size={20} className="text-yellow-500" /> Host Controls
//           </h3>
//           <div className="flex items-center gap-4 mb-6">
//             <div className="p-3 bg-indigo-500/10 rounded-lg">
//               <Clock size={24} className="text-indigo-400" />
//             </div>
//             <div>
//               <p className="text-sm opacity-60">Estimated Duration</p>
//               <p className="font-bold">{questions.length * 30} Seconds</p>
//             </div>
//           </div>

//           {currentUser.isHost ? (
//             <button
//               onClick={handleStartGame}
//               className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl font-bold text-white shadow-lg hover:shadow-indigo-500/25 transition-all hover:scale-[1.02]"
//             >
//               Start Quiz
//             </button>
//           ) : (
//             <div className="text-center p-4 bg-slate-500/10 rounded-xl animate-pulse">
//               Waiting for host to start...
//             </div>
//           )}
//         </div>
//       </div>

//       {/* RIGHT PANEL: User List */}
//       <div className="lg:col-span-2 p-8 border border-slate-500/20 rounded-2xl bg-white/5 overflow-hidden flex flex-col">
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-2xl font-bold">Lobby ({players.length})</h2>
//           <span className="flex items-center gap-2 text-sm opacity-60">
//             <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />{" "}
//             Live
//           </span>
//         </div>

//         <div className="flex-1 overflow-y-auto pr-2 space-y-3">
//           <AnimatePresence>
//             {/* Mocking players if empty for visualization */}
//             {(players.length > 0 ? players : [currentUser]).map(
//               (player, idx) => (
//                 <motion.div
//                   key={player.id || idx}
//                   initial={{ opacity: 0, x: 20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   exit={{ opacity: 0, scale: 0.9 }}
//                   transition={{ duration: 0.3 }}
//                   className="flex items-center gap-4 p-4 rounded-xl bg-slate-500/10 border border-slate-500/10"
//                 >
//                   <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold">
//                     {player.name.charAt(0).toUpperCase()}
//                   </div>
//                   <div className="flex-1">
//                     <p className="font-bold">{player.name}</p>
//                     <p className="text-xs opacity-50">
//                       {player.isHost ? "Host" : "Participant"}
//                     </p>
//                   </div>
//                   {player.isHost && (
//                     <Crown size={18} className="text-yellow-500" />
//                   )}
//                 </motion.div>
//               )
//             )}
//           </AnimatePresence>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Lobby;

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useQuizStore } from "../stores/useQuizStore";
import { useTheme } from "../theme/Theme";
import { Users, Crown, Copy, Play, AlertCircle, Check } from "lucide-react";
import { socket } from "../api/api";

const Lobby = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();

  // Store State
  const { currentUser, players, setPlayers, setLiveQuestion } = useQuizStore();

  // Local UI State
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    // 1. Connection & Join Logic
    if (!socket.connected) socket.connect();

    // If user has no name (e.g., direct link access), redirect to join/home
    if (!currentUser.name) {
      navigate("/");
      return;
    }

    // Emit Join Event
    socket.emit("join-room", { roomCode: roomId, name: currentUser.name });

    // 2. Event Listeners
    const handlePlayerList = (updatedPlayers) => {
      setPlayers(updatedPlayers);
    };

    const handleNewQuestion = (data) => {
      // Backend sends: { index, question, options, time }
      setLiveQuestion(data);
      navigate(`/game/${roomId}`);
    };

    const handleError = (msg) => setErrorMsg(msg);

    // specific backend error objects
    const handleBlock = (data) => setErrorMsg(data.message);

    socket.on("player-list", handlePlayerList);
    socket.on("new-question", handleNewQuestion); // This triggers the start
    socket.on("error", handleError);
    socket.on("join-blocked", handleBlock);
    socket.on("quiz-ended-message", handleBlock);

    // Cleanup
    return () => {
      socket.off("player-list", handlePlayerList);
      socket.off("new-question", handleNewQuestion);
      socket.off("error", handleError);
      socket.off("join-blocked", handleBlock);
      socket.off("quiz-ended-message", handleBlock);
    };
  }, [roomId, currentUser.name, navigate, setPlayers, setLiveQuestion]);

  const handleStartGame = () => {
    // Only host emits this
    socket.emit("start-quiz", { roomCode: roomId });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(roomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (errorMsg) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${theme.bg}`}
      >
        <div
          className={`p-8 rounded-2xl border text-center max-w-md ${theme.cardBg} ${theme.text}`}
        >
          <AlertCircle size={48} className="mx-auto mb-4 text-red-500" />
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="opacity-70 mb-6">{errorMsg}</p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-indigo-600 rounded-xl text-white font-bold"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-[90vh] p-6 lg:p-12 ${theme.bg} ${theme.text}`}>
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN: Room Info & Actions */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1 space-y-6"
        >
          {/* Room Code Card */}
          <div
            className={`p-6 rounded-2xl border ${theme.container} shadow-lg relative overflow-hidden`}
          >
            <div
              className={`absolute top-0 right-0 p-32 ${theme.blobPurple} rounded-full blur-3xl -mr-16 -mt-16 opacity-50 pointer-events-none`}
            ></div>

            <h3
              className={`text-xs font-bold uppercase tracking-widest mb-2 ${theme.textMuted}`}
            >
              Room Code
            </h3>

            <div className="flex items-center justify-between gap-4">
              <span className="text-5xl font-black tracking-wider font-mono text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
                {roomId}
              </span>
              <button
                onClick={copyToClipboard}
                className={`p-3 rounded-xl transition-all ${
                  copied
                    ? "bg-green-500/20 text-green-500"
                    : "bg-slate-500/10 hover:bg-slate-500/20"
                }`}
              >
                {copied ? <Check size={24} /> : <Copy size={24} />}
              </button>
            </div>
            <p className="mt-4 text-sm opacity-60">
              Share this code with your friends to join.
            </p>
          </div>

          {/* Host Controls */}
          <div className={`p-6 rounded-2xl border ${theme.cardBg}`}>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Crown size={20} className="text-yellow-500" />
              {currentUser.isHost ? "Host Controls" : "Waiting Area"}
            </h3>

            {currentUser.isHost ? (
              <div className="space-y-4">
                <p className="text-sm opacity-70">
                  You are the host. Once everyone is here, click start to begin
                  the quiz immediately.
                </p>
                <button
                  onClick={handleStartGame}
                  className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/25 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                  <Play size={20} fill="currentColor" /> Start Quiz
                </button>
              </div>
            ) : (
              <div className="text-center py-6 bg-slate-500/5 rounded-xl border border-dashed border-slate-500/30">
                <div className="flex justify-center mb-3">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                  </span>
                </div>
                <p className="font-medium animate-pulse">
                  Waiting for host to start...
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* RIGHT COLUMN: Player List */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`lg:col-span-2 p-6 rounded-2xl border flex flex-col h-[600px] ${theme.container} shadow-xl`}
        >
          <div className="flex justify-between items-center mb-6 border-b border-slate-500/10 pb-4">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <Users className="text-indigo-500" />
              Players
              <span
                className={`px-3 py-1 rounded-full text-sm ${theme.inputBg}`}
              >
                {players.length} joined
              </span>
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
            <AnimatePresence>
              {players.map((player) => (
                <motion.div
                  key={player.socketId || player.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className={`flex items-center gap-4 p-4 rounded-xl border transition-colors ${theme.cardBg}`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-md
                    ${
                      player.name === currentUser.name
                        ? "bg-gradient-to-br from-indigo-500 to-purple-500"
                        : "bg-gradient-to-br from-slate-400 to-slate-500"
                    }`}
                  >
                    {player.name.charAt(0).toUpperCase()}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-lg">{player.name}</p>
                      {player.name === currentUser.name && (
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-indigo-500/20 text-indigo-400 rounded">
                          You
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {players.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center opacity-40">
                <Users size={48} className="mb-2" />
                <p>Waiting for players to join...</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Lobby;
