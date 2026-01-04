import { create } from "zustand";

export const useQuizStore = create((set) => ({
  currentUser: { name: "", isHost: false },
  roomCode: null,
  roomName: "",
  players: [],
  questions: [],

  setUser: (user) => set({ currentUser: user }),
  setRoomInfo: (code, name) => set({ roomCode: code, roomName: name }),
  addQuestion: (question) =>
    set((state) => ({
      questions: [...state.questions, question],
    })),
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
