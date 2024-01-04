import { create } from "zustand";

interface UseOpenAuthProp {
  isOpen: boolean;
  setIsOpen: () => void;
  setIsClose: () => void;
}

export const useOpenAuth = create<UseOpenAuthProp>((set) => ({
  isOpen: false,
  setIsOpen: () => set((state) => ({ isOpen: true })),
  setIsClose: () => set((state) => ({ isOpen: false })),
}));
