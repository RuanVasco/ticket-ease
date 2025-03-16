import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { WebSocketProvider } from "./context/WebSocketContext";
import App from "./App.tsx";
import "./assets/styles/global.css";
import { PermissionsProvider } from "./context/PermissionsContext.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <WebSocketProvider>
            <BrowserRouter>
                <PermissionsProvider>
                    <AuthProvider>
                        <App />
                    </AuthProvider>
                </PermissionsProvider>
            </BrowserRouter>
        </WebSocketProvider>
    </StrictMode>
);
