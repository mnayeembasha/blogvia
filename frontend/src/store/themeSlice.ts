import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type Theme = 'light' | 'dark';

interface ThemeState {
  theme: Theme;
}

const getInitialTheme = (): Theme => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('theme') as Theme;
    if (stored && ['light', 'dark'].includes(stored)) {
      return stored;
    }
    // If no stored theme, check system preference
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    return systemTheme;
  }
  return 'light'; // Default fallback for SSR
};

const applyTheme = (theme: Theme) => {
  if (typeof window === 'undefined') return;

  const root = window.document.documentElement;
  root.classList.remove('light', 'dark');
  root.classList.add(theme);

  localStorage.setItem('theme', theme);
};

// Apply theme immediately to prevent flash
if (typeof window !== 'undefined') {
  const storedTheme = localStorage.getItem('theme') as Theme;
  if (storedTheme && ['light', 'dark'].includes(storedTheme)) {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(storedTheme);
  } else {
    // Apply system theme immediately
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(systemTheme);
  }
}

const initialState: ThemeState = {
  theme: getInitialTheme(),
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload;
      applyTheme(action.payload);
    },
    initializeTheme: (state) => {
      applyTheme(state.theme);
    },
    toggleTheme: (state) => {
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      state.theme = newTheme;
      applyTheme(newTheme);
    },
  },
});

export const { setTheme, initializeTheme, toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;