import React from "react";
import ReactDOM from "react-dom/client";
import Routes from "./routes.tsx";
import { AppThemeProvider } from "./data/contexts";
import { CssBaseline } from "@mui/material";
import { AppDrawerProvider } from "./data/contexts";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppDrawerProvider>
      <AppThemeProvider>
        <CssBaseline />
        <Routes />
      </AppThemeProvider>
    </AppDrawerProvider>
  </React.StrictMode>
);
