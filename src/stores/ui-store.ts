"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserRole } from "@/types/common";
import type { ThemePreference } from "@/types/company";

interface UiState {
  theme: ThemePreference;
  role: UserRole;
  sidebarCollapsed: boolean;
  onboardingComplete: boolean;
  moreOpen: boolean;
  searchOpen: boolean;
  setTheme: (theme: ThemePreference) => void;
  setRole: (role: UserRole) => void;
  toggleSidebar: () => void;
  completeOnboarding: () => void;
  setMoreOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
  resetOnboarding: () => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      theme: "light",
      role: "owner",
      sidebarCollapsed: false,
      onboardingComplete: false,
      moreOpen: false,
      searchOpen: false,
      setTheme: (theme) => set({ theme }),
      setRole: (role) => set({ role }),
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      completeOnboarding: () => set({ onboardingComplete: true }),
      setMoreOpen: (moreOpen) => set({ moreOpen }),
      setSearchOpen: (searchOpen) => set({ searchOpen }),
      resetOnboarding: () => set({ onboardingComplete: false }),
    }),
    {
      name: "siteflow-ui",
      skipHydration: true,
      partialize: (state) => ({
        theme: state.theme,
        role: state.role,
        sidebarCollapsed: state.sidebarCollapsed,
        onboardingComplete: state.onboardingComplete,
      }),
    },
  ),
);
