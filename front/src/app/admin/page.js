"use client";

import React from 'react';
import { FaUser } from 'react-icons/fa';
import { SiHomeassistantcommunitystore } from 'react-icons/si';
import { IoMdPeople } from 'react-icons/io'; // Corrigindo a importação
import Header from '../header';
import withAuth from '../auth/withAuth';
import Block from './components/block';

const HomeAdmin = () => {
    const blocks = [
        {
            text: "Usuários",
            icon: <FaUser />,
            link: "/admin/users"
        },
        {
            text: "Unidades",
            icon: <SiHomeassistantcommunitystore />, 
            link: "/branches"
        },
        {
            text: "Setores",
            icon: <IoMdPeople />,
            link: "/sectors"
        }
    ];

    return (
        <main>
            <Header pageName="Administração" />
            <div className="container d-flex align-items-start justify-content-start">
                {blocks.map((block, index) => (
                    <Block key={index} text={block.text} icon={block.icon} link={block.link} />
                ))}
            </div>
        </main>
    );
};

export default withAuth(HomeAdmin);
