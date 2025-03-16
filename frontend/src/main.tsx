import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.tsx";
import { AuthProvider } from "./context/AuthContext";
import { WebSocketProvider } from "./context/WebSocketContext";
import "./assets/styles/global.css";
import { ThemeProvider } from "./context/ThemeContext";
import { PermissionsProvider } from "./context/PermissionsContext.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <WebSocketProvider>
            <BrowserRouter>
                <PermissionsProvider>
                    <AuthProvider>
                        <ThemeProvider>
                            <App />
                        </ThemeProvider>
                    </AuthProvider>
                </PermissionsProvider>
            </BrowserRouter>
        </WebSocketProvider>
    </StrictMode>
);
