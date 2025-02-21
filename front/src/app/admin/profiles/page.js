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

	const handleModalOpen = async (action, mode, idUnit) => {
		setModalTitle(`${action} Perfil`);
		setModeModal(mode);

		if (mode != "add") {
			try {
				const res = await axiosInstance.get(
					`${API_BASE_URL}/profiles/${idUnit}`
				);
				if (res.status === 200) {
					setCurrentProfile({
						id: res.data.id,
						name: res.data.name,
					});
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

			if (submitType === "delete") {
				res = await axiosInstance.delete(
					`${API_BASE_URL}/profiles/${currentProfile.id}`
				);
			} else if (submitType === "add") {
				res = await axiosInstance.post(
					`${API_BASE_URL}/profiles/`,
					currentProfile
				);
			} else if (submitType === "update") {
				res = await axiosInstance.put(
					`${API_BASE_URL}/profiles/${currentProfile.id}`,
					currentProfile
				);
			} else {
				console.error("Invalid submit type");
				return;
			}

			if (res.status === 200 || res.status === 201) {
				setCurrentProfile({
					id: "",
					name: "",
				});

				window.location.reload();
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
										</div>
									</>
								)}

								{modeModal === "delete" && (
									<>
										Deseja excluir a unidade{" "}
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
