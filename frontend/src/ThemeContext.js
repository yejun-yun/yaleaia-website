import React, { createContext, useContext, useEffect, useState } from 'react';

/*
 * Theme state lives on <html data-theme="...">, which the inline script in
 * public/index.html sets before first paint (saved preference, else the OS
 * preference) so the page never flashes the wrong ground. This provider
 * adopts that value, persists changes, and hands the canvas components
 * (HeroLines, WaveRule) a reactive theme value they can redraw against.
 */
const ThemeContext = createContext({ theme: 'light', toggleTheme: () => {} });

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() =>
    document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem('yaia-theme', theme);
    } catch (e) {
      // private browsing; the choice just won't persist
    }
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
