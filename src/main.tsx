import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { applyGamePresetsFromEnv } from "./lib/applyGamePresets";
import App from "./App";
import "./index.css";

applyGamePresetsFromEnv();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
