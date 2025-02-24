"use client";

import { FaPlus, FaEye, FaListCheck } from "react-icons/fa6";
import { useEffect, useState } from "react";
import Link from "next/link";
import "./home.css";
import Header from "./components/header/header";
import withAuth from "./auth/withAuth";
import { checkPermission } from "./components/checkPermission";

const Home = () => {
	const [canViewChamados, setCanViewChamados] = useState(false);

	useEffect(() => {
		const checkUserPermission = async () => {
			const hasPermission = await checkPermission("VIEW", "TICKET");
			setCanViewChamados(hasPermission);
		};

		checkUserPermission();
	}, []);

	return (
		<main>
			<Header pageName="Chamados" />
			<div className="d-flex justify-content-center align-items-center div_main_content">
				<div className="d-flex align-items-top">
					<Link
						href="abrir"
						className="main_menu_item d-flex flex-column justify-content-between align-items-center py-3 mx-2 rounded"
					>
						<FaPlus className="icon_main_menu_item" />
						<div className="text_main_menu_item fw-semibold">
							Abrir
						</div>
					</Link>
					<Link
						href="ver"
						className="main_menu_item d-flex flex-column justify-content-between align-items-center py-3 mx-2 rounded"
					>
						<FaEye className="icon_main_menu_item" />
						<div className="text_main_menu_item fw-semibold">
							Acompanhar
						</div>
					</Link>
					{canViewChamados && (
						<Link
							href="gerenciar"
							className="main_menu_item d-flex flex-column justify-content-between align-items-center py-3 mx-2 rounded"
						>
							<FaListCheck className="icon_main_menu_item" />
							<div className="text_main_menu_item fw-semibold">
								Gerenciar
							</div>
						</Link>
					)}
				</div>
			</div>
		</main>
	);
};

export default withAuth(Home);
