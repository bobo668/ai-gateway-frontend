import { create } from 'zustand'

interface AppState {
  sidebarCollapsed: boolean
  currentLocale: string
  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
  setLocale: (locale: string) => void
}

export const useAppStore = create<AppState>((set) => ({
  sidebarCollapsed: false,
  currentLocale: 'zh-CN',

  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSidebarCollapsed: (collapsed: boolean) => set({ sidebarCollapsed: collapsed }),
  setLocale: (locale: string) => set({ currentLocale: locale }),
}))
