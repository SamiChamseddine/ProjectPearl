// src/context/PerformanceContext.js
import { createContext, useContext, useState, useEffect } from "react";

const PerformanceContext = createContext();

export const PerformanceProvider = ({ children }) => {
  const [performanceMode, setPerformanceMode] = useState(() => {
    const saved = localStorage.getItem("performanceMode");
    return saved || "high";
  });
  useEffect(() => {
    localStorage.setItem("performanceMode", performanceMode);
  }, [performanceMode]);

  return (
    <PerformanceContext.Provider
      value={{ performanceMode, setPerformanceMode }}
    >
      {children}
    </PerformanceContext.Provider>
  );
};

export const usePerformance = () => useContext(PerformanceContext);
