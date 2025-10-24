import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App.tsx";
import { ScriptsProvider } from "../providers";
import "../app.scss";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ScriptsProvider>
      <App />
    </ScriptsProvider>
  </React.StrictMode>
);
