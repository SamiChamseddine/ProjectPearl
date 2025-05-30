import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { PerformanceProvider } from "./context/PerformanceContext";
import { ThemeProvider } from "./context/ThemeContext.";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <PerformanceProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </PerformanceProvider>
  </React.StrictMode>
);
