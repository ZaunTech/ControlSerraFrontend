import React from "react";
import ReactDOM from "react-dom/client";
import Routes from "./routes.tsx";
import { AppThemeProvider } from "./data/contexts/";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppThemeProvider>
      <Routes />
    </AppThemeProvider>
  </React.StrictMode>
);
