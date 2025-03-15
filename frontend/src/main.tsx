import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { WebSocketProvider } from "./context/WebSocketContext";
import App from "./App.tsx";
import "./assets/styles/global.css";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <WebSocketProvider>
            <BrowserRouter>
                <AuthProvider>
                    <App />
                </AuthProvider>
            </BrowserRouter>
        </WebSocketProvider>
    </StrictMode>
);
