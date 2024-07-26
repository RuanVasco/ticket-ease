"use client";

import React from 'react';
import { FaSuitcase, FaUser, FaUsers, FaStore, FaFolderOpen, FaClipboardList } from "react-icons/fa6";
import Header from '../components/header/header';
import withAuth from '../auth/withAuth';
import Block from './components/block';

const HomeAdmin = () => {
    const blocks = [
        {
            text: "Usuários",
            icon: <FaUser />,
            link: "/admin/users",
            description: "Gerenciar usuários"
        },
        {
            text: "Setores",
            icon: <FaUsers />,
            link: "/admin/departments",
            description: "Gerenciar Setores"
        },
        {
            text: "Unidades",
            icon: <FaStore />,
            link: "/admin/units",
            description: "Gerenciar Unidades"
        },
        {
            text: "Cargos",
            icon: <FaSuitcase />,
            link: "/admin/cargos",
            description: "Gerenciar Cargos"
        },
        {
            text: "Categorias de Formulário",
            icon: <FaFolderOpen />,
            link: "/admin/formscategory",
            description: "Gerenciar Categorias"
        },
        {
            text: "Formulários",
            icon: <FaClipboardList />,
            link: "/admin/forms",
            description: "Gerenciar Formulários"
        },
    ];

    return (
        <main>
            <Header pageName="Administração" />
            <div className="container mt-4">
                {/* <div className="d-block pt-4">
                    <h4 className='border-bottom text-center fw-semibold pb-2'>Cadastros</h4>
                </div> */}
                <div className="d-flex align-items-start justify-content-center flex-wrap">
                    {blocks.map((block, index) => (
                        <Block key={index} text={block.text} icon={block.icon} link={block.link} description={block.description} />
                    ))}
                </div>
            </div>
        </main>
    );
};

export default HomeAdmin;
