"use client"
// import { Inter } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css";
import { WebSocketProvider } from "./components/webSocketContext";
import ImportBsJS from "./components/importBsJS";
import "./globals.css";
import { useEffect } from "react";

// const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
    return (
        <html lang="pt-br">
            <WebSocketProvider>
                <ImportBsJS />
                <body>
                    {children}
                </body>
            </WebSocketProvider>

        </html>
    );
}
