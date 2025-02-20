"use client";

import React from 'react';
import { FaSuitcase, FaUser, FaUsers, FaStore, FaFolderOpen, FaIdBadge } from "react-icons/fa6";
import Header from '../components/header/header';
import withAdmin from '../auth/withAdmin';
import Block from './components/block';

const HomeAdmin = () => {
    const blocksForms = [
        {
            text: "Categorias de Formulário",
            icon: <FaFolderOpen />,
            link: "/admin/formscategory",
            description: "Gerenciar Categorias"
        },
    ];

    const blocksCadastro = [
        {
            text: "Usuários",
            icon: <FaUser />,
            link: "/admin/users",
            description: "Gerenciar usuários"
        },
        {
            text: "Perfis",
            icon: <FaIdBadge />,
            link: "/admin/profiles",
            description: "Gerenciar perfis."
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
    ];

    return (
        <main>
            <Header pageName="Administração" />
            <div className="container mt-4">
                <div className="d-block pt-4">
                    <h5 className='border-bottom fw-semibold pb-1 ps-3'>Cadastros</h5>
                </div>
                <div className="d-flex align-items-start flex-wrap">
                    {blocksCadastro.map((block, index) => (
                        <Block key={index} text={block.text} icon={block.icon} link={block.link} description={block.description} />
                    ))}
                </div>
                <div className="d-block pt-4">
                    <h5 className='border-bottom fw-semibold pb-1 ps-3'>Formulários</h5>
                </div>
                <div className="d-flex align-items-start flex-wrap">
                    {blocksForms.map((block, index) => (
                        <Block key={index} text={block.text} icon={block.icon} link={block.link} description={block.description} />
                    ))}
                </div>
            </div>
        </main>
    );
};

export default withAdmin(HomeAdmin);
