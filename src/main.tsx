import React from "react";
import ReactDOM from "react-dom/client";
import Routes from "./routes.tsx";
import { AppThemeProvider, AuthProvider } from "./data/contexts";
import { CssBaseline } from "@mui/material";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppThemeProvider>
      <AuthProvider>
        <CssBaseline />
        <Routes />
      </AuthProvider>
    </AppThemeProvider>
  </React.StrictMode>
);
