// import { Inter } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css";
import ImportBsJS from "./components/importBsJS";
import "./globals.css";


// const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {

  return (
    <html lang="pt-br">
      <ImportBsJS />
      <body>
        {children}
      </body>
    </html>
  );
}
