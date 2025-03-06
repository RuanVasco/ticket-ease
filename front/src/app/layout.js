"use client"
// import { Inter } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css";
import WebSocketProvider from "./components/webSocketContext";
import Notifications from "./components/notifications";
import ImportBsJS from "./components/importBsJS";
import "./globals.css";
import { useEffect } from "react";

// const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
    return (
        <html lang="pt-br">
            <ImportBsJS />
            <body>
                <WebSocketProvider>                    
                    {children}
					<Notifications />
                </WebSocketProvider>
            </body>
        </html>
    );
}
