"use client"
// import { Inter } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css";
import webSocketConnection from "./components/webSocketConnection";
import ImportBsJS from "./components/importBsJS";
import "./globals.css";
import { useEffect } from "react";

// const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
	const messages = webSocketConnection();

	useEffect(() => {
        if (messages.length > 0) {
            console.log("Nova notificação:", messages[messages.length - 1]);
        }
    }, [messages]);


	return (
		<html lang="pt-br">
			<ImportBsJS />
			<body>
				{children}
			</body>
		</html>
	);
}
