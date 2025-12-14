import React from "react";
import ReactDOM from "react-dom/client";

// 🤫 Silence specific third-party warnings
const originalConsoleWarn = console.warn;
console.warn = (...args) => {
  if (args[0]?.includes?.('Default export is deprecated')) return;
  originalConsoleWarn(...args);
};

// 🌸 Lovely Boutique — Global Styles
import "./styles/index.css"; // 💕 contains Tailwind + custom global styles
import "./App.css";          // 💄 app-level transitions and layout

// 💕 Root App Component
import App from "./App.jsx";

// 🚀 Mount React App (React 18)
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
