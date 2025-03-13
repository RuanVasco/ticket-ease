"use client";

import React, { useEffect, useState } from "react";
import axiosInstance from "../../components/axiosConfig";
import Select from 'react-select';
import Header from "../../components/header/header";
import Table from "../../components/table/table";
import ActionBar from "../../components/actionBar/actionBar";
import Pagination from "../../components/pagination/pagination";
import { FaUserMinus, FaUserPlus } from "react-icons/fa6";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const columns = [
	{ value: "name", label: "Nome" },
	{ value: "email", label: "E-mail" },
	{ value: "department.name", label: "Setor" },
	{ value: "cargo.name", label: "Cargo" },
];

const User = () => {
	const [filterText, setFilterText] = useState("");
	const [modeModal, setModeModal] = useState("");
	const [modalTitle, setModalTitle] = useState("");
	const [data, setData] = useState([]);
	const [currentPage, setCurrentPage] = useState(0);
	const [pageSize, setPageSize] = useState(10);
	const [totalPages, setTotalPages] = useState(1);
	const [currentUser, setCurrentUser] = useState({
		id: "",
		name: "",
		email: "",
		phone: "",
		department: { id: "", name: "" },
		cargo: { id: "", name: "" },
		profiles: [],
		password: "",
	});

	const [cargos, setCargos] = useState([]);
	const [departments, setDepartments] = useState([]);
	const [profiles, setProfiles] = useState([]);

	const [submitType, setSubmitType] = useState("");
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);
		const fetchUsersData = async () => {
			try {
				const res = await axiosInstance.get(
					`${API_BASE_URL}/users/pageable?page=${currentPage}&size=${pageSize}`
				);
				if (res.status === 200) {
					setData(res.data.content);
					setTotalPages(res.data.totalPages);
				} else {
					console.error("Error", res.status);
				}
			} catch (error) {
				console.log(error);
			}
		};

		const fetchCargosData = async () => {
			try {
				const res = await axiosInstance.get(`${API_BASE_URL}/cargos/`);
				if (res.status === 200) {
					setCargos(res.data);
				} else {
					console.error("Error", res.status);
				}
			} catch (error) {
				console.error(error);
			}
		};

		const fetchProfilesData = async () => {
			try {
				const res = await axiosInstance.get(`${API_BASE_URL}/profiles/`);
				if (res.status === 200) {
					setProfiles(res.data);
				} else {
					console.error("Error", res.status);
				}
			} catch (error) {
				console.error(error);
			}
		};

		const fetchDepartmentsData = async () => {
			try {
				const res = await axiosInstance.get(
					`${API_BASE_URL}/departments/`
				);
				if (res.status === 200) {
					setDepartments(res.data);
				} else {
					console.error("Error", res.status);
				}
			} catch (error) {
				console.error(error);
			}
		};

		fetchUsersData();
		fetchCargosData();
		fetchDepartmentsData();
		fetchProfilesData();
	}, [currentPage, pageSize]);

	const handleModalOpen = async (action, mode, idUser) => {
		setModalTitle(`${action} Usuário`);
		setModeModal(mode);
		if (mode != "add") {
			try {
				const res = await axiosInstance.get(
					`${API_BASE_URL}/users/${idUser}`
				);
				if (res.status === 200) {
					const department = {
						id: res.data.department?.id ?? -1,
						name: res.data.department?.name ?? "",
					};
					const cargos = {
						id: res.data.cargo?.id ?? -1,
						name: res.data.cargo?.name ?? "",
					};

					setCurrentUser({
						id: res.data.id,
						name: res.data.name,
						email: res.data.email,
						phone: res.data.phone,
						department: department,
						cargo: cargos,
						profiles: res.data.roles,
						password: "",
					});
				} else {
					console.error("Error", res.status);
				}
			} catch (error) {
				console.error(error);
			}
		} else {
			setCurrentUser({
				id: "",
				name: "",
				email: "",
				phone: "",
				department: { id: "", name: "" },
				cargo: { id: "", name: "" },
				profiles: [],
				password: "",
			});
		}
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
		if (name === "department") {
			setCurrentUser({
				...currentUser,
				department: {
					...currentUser.department,
					id: parseInt(value, 10),
				},
			});
		} else if (name === "cargo") {
			setCurrentUser({
				...currentUser,
				cargo: { ...currentUser.cargo, id: parseInt(value, 10) },
			});
		} else {
			setCurrentUser({
				...currentUser,
				[name]: value,
			});
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			let res;
			const { department, cargo, profiles, ...postData } = currentUser;

			if (submitType === "delete") {
				res = await axiosInstance.delete(
					`${API_BASE_URL}/users/${currentUser.id}`
				);
			} else {
				const postDataWithIds = {
					...postData,
					departmentId: department.id,
					cargoId: cargo.id,
					profiles: profiles.map(profile => profile.id),
				};

				switch (submitType) {
					case "add":
						if (!department) {
							console.error("Department is null");
							return;
						}

						res = await axiosInstance.post(
							`${API_BASE_URL}/users/register`,
							postDataWithIds
						);
						break;
					case "update":
						if (!department) {
							console.error("Department is null");
							return;
						}

						res = await axiosInstance.put(
							`${API_BASE_URL}/users/${currentUser.id}`,
							postDataWithIds
						);
						break;
					default:
						console.error("Invalid submit type");
						return;
				}
			}

			if (res.status === 200 || res.status === 201) {
				setCurrentUser({
					id: "",
					name: "",
					email: "",
					phone: "",
					department: { id: "", name: "" },
					cargo: { id: "", name: "" },
					profiles: [],
					password: "",
				});

				window.location.reload();
			} else {
				console.error("Error", res.status);
			}
		} catch (error) {
			console.error(error);
		}
	};

	if (!isClient) {
		return null;
	}

	return (
		<main>
			<Header pageName="Gerenciar Usuários" />
			<div className="container">
				<ActionBar
					modalTargetId="modal"
					delEntityEndPoint={`${API_BASE_URL}/users`}
					addIcon={FaUserPlus}
					removeIcon={FaUserMinus}
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
				<div className="modal-dialog">
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
						<form
							onSubmit={handleSubmit}
							disabled={modeModal === "readonly"}
						>
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
												value={currentUser.name}
												onChange={handleInputChange}
												required
											/>
										</div>
										<div className="mt-2">
											<label
												htmlFor="email"
												className="form-label"
											>
												E-mail
											</label>
											<input
												name="email"
												className="form-control"
												readOnly={
													modeModal === "readonly"
												}
												value={currentUser.email}
												onChange={handleInputChange}
												required
											/>
										</div>

										<div className="mt-2">
											<label
												htmlFor="phone"
												className="form-label"
											>
												Telefone
											</label>
											<input
												name="phone"
												className="form-control"
												readOnly={
													modeModal === "readonly"
												}
												value={currentUser.phone ?? ""}
												onChange={handleInputChange}
											/>
										</div>

										<div className="mt-2">
											<label
												htmlFor="department"
												className="form-label"
											>
												Setor
											</label>
											<select
												className="form-select"
												name="department"
												id="department"
												value={
													currentUser.department
														?.id || ""
												}
												onChange={handleInputChange}
												disabled={
													modeModal === "readonly"
												}
												required
											>
												<option value="">----</option>
												{departments.map(
													(department) => (
														<option
															key={department.id}
															value={
																department.id
															}
														>
															{department.name}
														</option>
													)
												)}
											</select>
										</div>

										<div className="mt-2">
											<label
												htmlFor="cargo"
												className="form-label"
											>
												Cargo
											</label>
											<select
												className="form-select"
												name="cargo"
												id="cargo"
												value={
													currentUser.cargo?.id ?? ""
												}
												onChange={handleInputChange}
												disabled={
													modeModal === "readonly"
												}
											>
												<option value="">----</option>
												{cargos.map((cargo) => (
													<option
														key={cargo.id}
														value={cargo.id}
													>
														{cargo.name}
													</option>
												))}
											</select>
										</div>

										<div className="mt-2">
											<label htmlFor="profile" className="form-label">
												Perfis
											</label>
											<Select
												isMulti
												name="profile"
												id="profile"
												value={currentUser.profiles.map(profile => ({
													value: profile.id,
													label: profile.name
												})) || []} 
												onChange={(selectedProfiles) => {
													const updatedProfiles = selectedProfiles.map(profile => ({
														value: profile.id,
														label: profile.name
													}));

													setCurrentUser({
														...currentUser,
														profiles: updatedProfiles,
													});
												}}
												options={profiles.map((profile) => ({
													value: profile.id,
													label: profile.name,
												}))}
												className="basic-multi-select"
												classNamePrefix="select"
											/>
										</div>
										{modeModal !== "readonly" && (
											<div className="mt-2">
												<label
													htmlFor="password"
													className="form-label"
												>
													Senha
												</label>
												<input
													type="password"
													name="password"
													className="form-control"
													readOnly={
														modeModal === "readonly"
													}
													value={currentUser.password}
													onChange={handleInputChange}
													required={
														modeModal === "add"
													}
												/>
											</div>
										)}
									</>
								)}

								{modeModal === "delete" && (
									<>
										Deseja excluir o usuário{" "}
										{currentUser.name}?
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

export default User;
