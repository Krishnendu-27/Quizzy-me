import { create } from "zustand";

export const useQuizStore = create((set) => ({
  currentUser: { name: "", isHost: false },
  roomCode: null,
  roomName: "",
  players: [],
  questions: [],

  currentQuestion: null,

  setUser: (user) => set({ currentUser: user }),
  setRoomInfo: (code) => set({ roomCode: code }),
  setQuestions: (question) =>
    set((state) => ({
      questions: [...state.questions, question],
    })),
  setLiveQuestion: (questionData) => set({ currentQuestion: questionData }),

  setPlayers: (players) => set({ players }),
  addPlayer: (player) =>
    set((state) => ({
      players: [...state.players, player],
    })),
  removePlayer: (playerId) =>
    set((state) => ({
      players: state.players.filter((p) => p.id !== playerId),
    })),
}));
