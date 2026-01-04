import { useEffect, useState } from "react";
import useAuthStore from "./stores/useAuthStore";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { ProtectedRoute } from "./Routes/Route";
import { PublicRoute } from "./Routes/Route";
import { ThemeProvider } from "./providers/ThemeProvider";
import LandingPage from "./pages/Landingpage";
import CreateRoom from "./pages/CreateRoom";
import Lobby from "./pages/Lobby";
import MainLayout from "./components/Layout/MainLayout";
import { io } from "socket.io-client";

import { socket } from "./api/api";

const App = () => {
  const userId = "USER_ID_123";
  useEffect(() => {
    socket.connect();

    socket.emit("setup", userId);

    socket.on("connected", () => {
      console.log("✅ Socket connected to server");
    });

    socket.on("typing", (chatId) => {
      console.log("✍️ Someone is typing in chat:", chatId);
    });

    socket.on("stop typing", () => {
      console.log("❌ Stop typing");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <ThemeProvider>
      <BrowserRouter>
        <Toaster />
        <MainLayout>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/create" element={<CreateRoom />} />
            <Route path="/lobby/:roomId" element={<Lobby />} />
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </MainLayout>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;

// import React from 'react';
// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import MainLayout from './components/layout/MainLayout';
// import LandingPage from './pages/LandingPage';
// import CreateRoom from './pages/CreateRoom';
// import Lobby from './pages/Lobby';
// // import Game from './pages/Game'; // Implied existence

// const App = () => {
//   return (
//     <BrowserRouter>

//     </BrowserRouter>
//   );
// };

// export default App;
