import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthContext } from "./context/AuthContext";
import "./index.css";
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthContext.Provider value={{
      isAdmin: true,
      login: () => {},
      logout: () => {}
    }}>
      <App />
    </AuthContext.Provider>
  </React.StrictMode>
);
