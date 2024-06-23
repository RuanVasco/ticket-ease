"use client"

import { Inter } from "next/font/google";
import { useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  useEffect(() => {  
    import('bootstrap/dist/js/bootstrap.bundle.min.js');  
  }, []);

  return (
    <html lang="pt-br">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
