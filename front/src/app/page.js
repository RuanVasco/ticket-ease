"use client";

import { FaPlus, FaEye } from "react-icons/fa6";
import withAuth from './auth/withAuth';
import Link from "next/link";
import "./home.css";
import Header from "./components/header/header";

const Home = () => {
  return (
    <main>
      <Header pageName="Chamados" />
      <div className='d-flex justify-content-center align-items-center div_main_content'>
        <div className="d-flex align-items-top">
          <Link href="chamados/abrir" className="main_menu_item d-flex flex-column justify-content-between align-items-center py-3 mx-2 rounded">
            <FaPlus className="icon_main_menu_item" />
            <div className="text_main_menu_item">
              Abrir chamado
            </div>
          </Link>
          <Link href="chamados/ver" className="main_menu_item d-flex flex-column justify-content-between align-items-center py-3 mx-2 rounded">
            <FaEye className="icon_main_menu_item" />
            <div className="text_main_menu_item">
              Ver chamados
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
};

export default withAuth(Home);
