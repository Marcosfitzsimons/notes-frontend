import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import { Toaster } from "sonner";
import { AuthProvider } from "./context/auth-context.tsx";
import { NotesProvider } from "./context/notes-context.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <NotesProvider>
        <BrowserRouter>
          <App />
          <Toaster position="top-center" richColors />
        </BrowserRouter>
      </NotesProvider>
    </AuthProvider>
  </React.StrictMode>
);
