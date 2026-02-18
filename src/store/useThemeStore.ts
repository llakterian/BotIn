import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeState {
  isDarkMode: boolean;
  toggleTheme: () => void;
  setDarkMode: (value: boolean) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      isDarkMode: true, // Default to dark mode
      toggleTheme: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      setDarkMode: (value) => set({ isDarkMode: value }),
    }),
    {
      name: 'botin-theme',
    }
  )
);

// x.com Color Scheme
export const colors = {
  // Dark Mode (x.com style)
  dark: {
    bg: '#000000',
    bgSecondary: '#16181c',
    bgTertiary: '#202327',
    bgHover: '#080808',
    border: '#2f3336',
    borderHover: '#536471',
    text: '#e7e9ea',
    textSecondary: '#71767b',
    primary: '#1d9bf0',
    primaryHover: '#1a8cd8',
    primaryLight: 'rgba(29, 155, 240, 0.1)',
    danger: '#f4212e',
    success: '#00ba7c',
    warning: '#ffad1f',
  },
  // Light Mode (x.com style)
  light: {
    bg: '#ffffff',
    bgSecondary: '#f7f9f9',
    bgTertiary: '#eff3f4',
    bgHover: '#f7f7f7',
    border: '#eff3f4',
    borderHover: '#cfd9de',
    text: '#0f1419',
    textSecondary: '#536471',
    primary: '#1d9bf0',
    primaryHover: '#1a8cd8',
    primaryLight: 'rgba(29, 155, 240, 0.1)',
    danger: '#f4212e',
    success: '#00ba7c',
    warning: '#ffad1f',
  },
};
