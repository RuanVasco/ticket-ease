"use client";

import React, { useEffect, useState } from "react";
import axiosInstance from "../../components/axiosConfig";
import Header from "../../components/header/header";
import Table from "../../components/table/table";
import ActionBar from "../../components/actionBar/actionBar";
import Pagination from "../../components/pagination/pagination";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const columns = [{ value: "name", label: "Nome" }];

const Profiles = () => {
	const [filterText, setFilterText] = useState("");
	const [modeModal, setModeModal] = useState("");
	const [modalTitle, setModalTitle] = useState("");
	const [data, setData] = useState([]);
	const [submitType, setSubmitType] = useState("");
	const [currentPage, setCurrentPage] = useState(0);
	const [totalPages, setTotalPages] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const [currentProfile, setCurrentProfile] = useState({
		id: "",
		name: "",
	});

	const [permissions, setPermissions] = useState({
		ticket: {
			create: false,
			edit: false,
			view: false,
			delete: false
		},
		ticketCategory: {
			create: false,
			edit: false,
			view: false,
			delete: false
		},
		unit: {
			create: false,
			edit: false,
			view: false,
			delete: false
		},
		department: {
			create: false,
			edit: false,
			view: false,
			delete: false
		},
		message: {
			create: false,
			view: false,
		},
		user: {
			create: false,
			edit: false,
			view: false,
			delete: false
		},
		profile: {
			create: false,
			edit: false,
			view: false,
			delete: false
		}
	});

	const mapPermissions = (apiPermissions) => {
		const defaultPermissions = {
			ticket: { create: false, edit: false, view: false, delete: false },
			ticketCategory: { create: false, edit: false, view: false, delete: false },
			unit: { create: false, edit: false, view: false, delete: false },
			department: { create: false, edit: false, view: false, delete: false },
			message: { create: false, edit: false, view: false, delete: false },
			user: { create: false, edit: false, view: false, delete: false },
			profile: { create: false, edit: false, view: false, delete: false }
		};

		apiPermissions.forEach((perm) => {
			const parts = perm.name.split('_');

			if (parts.length > 1) {
				const action = parts[0].toLowerCase();
				const entity = parts.slice(1)
					.map((word, index) => index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
					.join('');

				if (defaultPermissions[entity] && defaultPermissions[entity][action] !== undefined) {
					defaultPermissions[entity][action] = true;
				}
			}
		});

		return defaultPermissions;
	};

	const reverseMapPermissions = (permissions) => {
		const apiPermissions = [];
	
		Object.entries(permissions).forEach(([entity, actions]) => {
			Object.entries(actions).forEach(([action, allowed]) => {
				if (allowed) {
					const formattedEntity = entity.replace(/([A-Z])/g, "_$1").toUpperCase(); 
					apiPermissions.push({ name: `${action.toUpperCase()}_${formattedEntity}` });
				}
			});
		});
	
		return apiPermissions;
	};

	useEffect(() => {
		const fetchData = async () => {
			try {
				const res = await axiosInstance.get(
					`${API_BASE_URL}/profiles/pageable?page=${currentPage}&size=${pageSize}`
				);
				if (res.status === 200) {
					setData(res.data.content);
					setTotalPages(res.data.totalPages);
				} else {
					console.error("Error", res.status);
				}
			} catch (error) {
				console.error(error);
			}
		};

		fetchData();
	}, [currentPage, pageSize]);

	const handleModalOpen = async (action, mode, id) => {
		setModalTitle(`${action} Perfil`);
		setModeModal(mode);

		if (mode != "add") {
			try {
				const res = await axiosInstance.get(
					`${API_BASE_URL}/profiles/${id}`
				);

				console.log(res.data.permissions);

				if (res.status === 200) {
					setCurrentProfile({
						id: res.data.id,
						name: res.data.name,
					});

					if (res.data.permissions) {
						setPermissions(mapPermissions(res.data.permissions));
					}
				} else {
					console.error("Error", res.status);
				}
			} catch (error) {
				console.error(error);
			}
		} else {
			setCurrentProfile({
				id: "",
				name: "",
			});
		}
	};

	const handleCheckboxChange = (entity, permission) => {
		setPermissions(prevPermissions => ({
			...prevPermissions,
			[entity]: {
				...prevPermissions[entity],
				[permission]: !prevPermissions[entity][permission]
			}
		}));
	};

	const handleFilterChange = (e) => {
		setFilterText(e.target.value);
	};

	const handlePageChange = (page) => setCurrentPage(page);

	const handlePageSizeChange = (size) => {
		setPageSize(size);
		setCurrentPage(0);
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setCurrentProfile({
			...currentProfile,
			[name]: value,
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
	
		try {
			let res;
			const formattedPermissions = reverseMapPermissions(permissions);
			const payload = { ...currentProfile, permissions: formattedPermissions };
	
			if (submitType === "delete") {
				res = await axiosInstance.delete(
					`${API_BASE_URL}/profiles/${currentProfile.id}`
				);
			} else if (submitType === "add") {
				res = await axiosInstance.post(`${API_BASE_URL}/profiles/`, payload);
			} else if (submitType === "update") {
				res = await axiosInstance.put(
					`${API_BASE_URL}/profiles/${currentProfile.id}`,
					payload
				);
			} else {
				console.error("Invalid submit type");
				return;
			}
	
			if (res.status === 200 || res.status === 201) {
				setCurrentProfile({ id: "", name: "" });
			} else {
				console.error("Error", res.status);
			}
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<main>
			<Header pageName="Gerenciar Perfis" />
			<div className="container">
				<ActionBar
					modalTargetId="modal"
					delEntityEndPoint={`${API_BASE_URL}/profiles`}
					onCreate={() => handleModalOpen("Criar", "add")}
					onFilterChange={handleFilterChange}
					filterText={filterText}
					onPageSizeChange={handlePageSizeChange}
					pageSize={pageSize}
				/>
				<Table
					columns={columns}
					data={data}
					modalID="modal"
					mode="admin"
					handleModalOpen={handleModalOpen}
					filterText={filterText}
				/>
				<Pagination
					currentPage={currentPage}
					totalPages={totalPages}
					onPageChange={handlePageChange}
				/>
			</div>

			<div
				className="modal fade"
				id="modal"
				tabIndex="-1"
				aria-hidden="true"
			>
				<div className="modal-dialog modal-xl">
					<div className="modal-content">
						<div className="modal-header">
							<h1 className="modal-title fs-5" id="title_modal">
								{modalTitle}
							</h1>
							<button
								type="button"
								className="btn-close"
								data-bs-dismiss="modal"
								aria-label="Close"
							></button>
						</div>
						<form onSubmit={handleSubmit}>
							<div className="modal-body">
								{modeModal != "delete" && (
									<>
										<div>
											<label
												htmlFor="name"
												className="form-label"
											>
												Nome
											</label>
											<input
												name="name"
												className="form-control"
												readOnly={
													modeModal === "readonly"
												}
												value={currentProfile.name}
												onChange={handleInputChange}
												required
											/>
											<table border="1">
												<thead>
													<tr>
														<th>Entidade</th>
														<th>Criar</th>
														<th>Editar</th>
														<th>Ver</th>
														<th>Deletar</th>
													</tr>
												</thead>
												<tbody style={{color: "black"}}>
													{Object.keys(permissions).map(entity => (
														<tr key={entity}>
															<td>{entity.replace(/([A-Z])/g, ' $1').toUpperCase()}</td>
															{["create", "edit", "view", "delete"].map(permission => (
																<td key={permission}>
																	<input
																		type="checkbox"
																		checked={permissions[entity][permission]}
																		onChange={() => handleCheckboxChange(entity, permission)}
																		disabled={
																			modeModal === "readonly"
																		}
																	/>
																</td>
															))}
														</tr>
													))}
												</tbody>
											</table>
										</div>
									</>
								)}

								{modeModal === "delete" && (
									<>
										Deseja excluir o perfil{" "}
										{currentProfile.name}?
									</>
								)}
							</div>
							<div className="modal-footer">
								{modeModal === "update" && (
									<button
										type="submit"
										className="btn btn-primary"
										onClick={() => setSubmitType("update")}
									>
										Atualizar
									</button>
								)}
								{modeModal === "add" && (
									<button
										type="submit"
										className="btn btn-primary"
										onClick={() => setSubmitType("add")}
									>
										Criar
									</button>
								)}
								{modeModal === "delete" && (
									<button
										type="submit"
										className="btn btn-danger"
										onClick={() => setSubmitType("delete")}
									>
										Excluir
									</button>
								)}
								<button
									type="button"
									className="btn btn-secondary"
									data-bs-dismiss="modal"
								>
									Cancelar
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</main>
	);
};

export default Profiles;
