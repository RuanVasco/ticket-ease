"use client";

import React, { useState, useEffect } from "react";
import {
	FaSuitcase,
	FaUser,
	FaUsers,
	FaStore,
	FaFolderOpen,
	FaIdBadge,
} from "react-icons/fa6";
import Header from "../components/header/header";
import Block from "./components/block";
import { checkPermission } from "../components/checkPermission";

const HomeAdmin = () => {
	const blocksForms = [
		{
			text: "Categorias de Formulário",
			icon: <FaFolderOpen />,
			link: "/admin/ticket_category",
			description: "Gerenciar Categorias",
		},
	];

	const blocksCadastro = [
		{
			text: "Usuários",
			icon: <FaUser />,
			link: "/admin/users",
			description: "Gerenciar usuários",
		},
		{
			text: "Perfis",
			icon: <FaIdBadge />,
			link: "/admin/profiles",
			description: "Gerenciar perfis.",
		},
		{
			text: "Setores",
			icon: <FaUsers />,
			link: "/admin/departments",
			description: "Gerenciar Setores",
		},
		{
			text: "Unidades",
			icon: <FaStore />,
			link: "/admin/units",
			description: "Gerenciar Unidades",
		},
		{
			text: "Cargos",
			icon: <FaSuitcase />,
			link: "/admin/cargos",
			description: "Gerenciar Cargos",
		},
	];

	const [permissions, setPermissions] = useState({});

	useEffect(() => {
		const fetchPermissions = async () => {
			const permissionResults = {};
			const allBlocks = [...blocksCadastro, ...blocksForms];

			const removePlural = (word) => (word.endsWith("S") ? word.slice(0, -1) : word);

			for (const block of allBlocks) {
				let entity = block.link.split("/").pop().toUpperCase();
				entity = removePlural(entity);
				const response = checkPermission("VIEW", entity);
				permissionResults[block.link] = response;
			}

			setPermissions(permissionResults);
		};

		fetchPermissions();
	}, []);

	return (
		<main>
			<Header pageName="Administração" />
			<div className="container mt-4">
				<div className="d-block pt-4">
					<h5 className="border-bottom fw-semibold pb-1 ps-3">Cadastros</h5>
				</div>
				<div className="d-flex align-items-start flex-wrap">
					{blocksCadastro.map((block, index) =>
						permissions[block.link] ? (
							<Block
								key={index}
								text={block.text}
								icon={block.icon}
								link={block.link}
								description={block.description}
							/>
						) : null
					)}
				</div>
				<div className="d-block pt-4">
					<h5 className="border-bottom fw-semibold pb-1 ps-3">Formulários</h5>
				</div>
				<div className="d-flex align-items-start flex-wrap">
					{blocksForms.map((block, index) =>
						permissions[block.link] ? (
							<Block
								key={index}
								text={block.text}
								icon={block.icon}
								link={block.link}
								description={block.description}
							/>
						) : null
					)}
				</div>
			</div>
		</main>
	);
};

export default HomeAdmin;
