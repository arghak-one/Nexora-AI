import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { applyStoredSettingsOnBoot } from "@/lib/settings";

applyStoredSettingsOnBoot();

createRoot(document.getElementById("root")!).render(<App />);
