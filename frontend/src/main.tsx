import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.tsx";
import { AuthProvider } from "./context/AuthContext";
import { WebSocketProvider } from "./context/WebSocketContext";
import './assets/styles/main.scss';
import { PermissionsProvider } from "./context/PermissionsContext.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <WebSocketProvider>
                    <PermissionsProvider>
                        <App />
                    </PermissionsProvider>
                </WebSocketProvider>
            </AuthProvider>
        </BrowserRouter>
    </StrictMode>
);
