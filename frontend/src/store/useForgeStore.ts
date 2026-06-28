import { create } from 'zustand';

interface ForgeState {
  context: any | null;
  setContext: (context: any | null) => void;
  addNotification: (message: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
  removeNotification: (id: string) => void;
  
  // Guest Mode Local Storage
  guestXp: number;
  guestQuizzesTaken: number;
  addGuestXp: (amount: number) => void;
  incrementGuestQuizzes: () => void;
}

export const useForgeStore = create<ForgeState>((set) => ({
  context: null,
  setContext: (context) => set({ context }),
  addNotification: () => {},
  removeNotification: () => {},
  guestXp: parseInt(localStorage.getItem('guest_xp') || '0', 10),
  guestQuizzesTaken: parseInt(localStorage.getItem('guest_quizzes') || '0', 10),
  addGuestXp: (amount) => set((state) => {
    const newXp = state.guestXp + amount;
    localStorage.setItem('guest_xp', newXp.toString());
    return { guestXp: newXp };
  }),
  incrementGuestQuizzes: () => set((state) => {
    const newCount = state.guestQuizzesTaken + 1;
    localStorage.setItem('guest_quizzes', newCount.toString());
    return { guestQuizzesTaken: newCount };
  }),
}));
