// ThemeContext.js
import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved || "neon";
  });

  const toggleTheme = () => {
    setTheme(prev => prev === "neon" ? "flashbang" : "neon");
  };

  useEffect(() => {
      localStorage.setItem("theme", theme);
    }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);