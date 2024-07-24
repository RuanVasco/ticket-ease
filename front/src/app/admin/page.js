"use client";

import React from 'react';
import { FaSuitcase, FaUser, FaUsers, FaStore } from "react-icons/fa6";
import { SiHomeassistantcommunitystore } from 'react-icons/si';
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
        }
    ];

    return (
        <main>
            <Header pageName="Administração" />
            <div className="container">
                <div className="d-block pt-4">
                    <h4 className='border-bottom text-center fw-semibold pb-2'>Cadastros</h4>
                </div>
                <div className="d-flex align-items-start justify-content-center">
                    {blocks.map((block, index) => (
                        <Block key={index} text={block.text} icon={block.icon} link={block.link} description={block.description} />
                    ))}
                </div>
            </div>
        </main>
    );
};

export default HomeAdmin;
