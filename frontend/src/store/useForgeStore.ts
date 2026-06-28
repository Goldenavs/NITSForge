import { create } from 'zustand';

interface ForgeState {
  context: any | null;
  setContext: (context: any | null) => void;
}

export const useForgeStore = create<ForgeState>((set) => ({
  context: null,
  setContext: (context) => set({ context }),
}));
