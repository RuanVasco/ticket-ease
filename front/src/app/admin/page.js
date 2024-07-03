"use client";

import React from 'react';
import { FaUser } from 'react-icons/fa';
import { SiHomeassistantcommunitystore } from 'react-icons/si';
import { IoMdPeople } from 'react-icons/io';
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
            text: "Unidades",
            icon: <SiHomeassistantcommunitystore />, 
            link: "/admin/units",
            description: ""
        },
        {
            text: "Setores",
            icon: <IoMdPeople />,
            link: "/sectors",
            description: ""
        }
    ];

    return (
        <main>
            <Header pageName="Administração" />
            <div className="container d-flex align-items-start justify-content-center pt-4">
                {blocks.map((block, index) => (
                    <Block key={index} text={block.text} icon={block.icon} link={block.link} description={block.description} />
                ))}
            </div>
        </main>
    );
};

export default withAuth(HomeAdmin);
