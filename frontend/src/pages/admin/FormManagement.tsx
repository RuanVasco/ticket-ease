import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";

import ActionBar from "../../components/ActionBar";
import axiosInstance from "../../components/AxiosConfig";
import Pagination from "../../components/Pagination";
import Table from "../../components/Table";
import { Form } from "../../types/Form";
import FormBuilder from "../../components/FormBuilder";
import { FaArrowLeft } from "react-icons/fa6";
import FormPreview from "../../components/FormPreview";
import { TicketCategory } from "../../types/TicketCategory";
import { User } from "../../types/User";
import { toast } from "react-toastify";
import { closeModal } from "../../components/Util/CloseModal";
import { ApprovalModeEnum } from "../../enums/ApprovalModeEnum";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

const columns = [
	{ value: "id", label: "ID" },
	{ value: "title", label: "Título" },
	{ value: "description", label: "Descrição" },
	{ value: "ticketCategory.name", label: "Categoria" },
	{ value: "creator.name", label: "Criador" },
];

const FormManagement: React.FC = () => {
	const [filterText, setFilterText] = useState<string>("");
	const [data, setData] = useState<Form[]>([]);
	const [currentPage, setCurrentPage] = useState<number>(0);
	const [totalPages, setTotalPages] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(10);
	const [screenType, setScreenType] = useState<string>("view");
	const [form, setForm] = useState<Form>({
		id: "",
		title: "",
		ticketCategory: {} as TicketCategory,
		approvers: [],
		approvalMode: ApprovalModeEnum.AND,
		description: "",
		creator: {} as User,
		fields: [],
	});

	const fetchData = async () => {
		try {
			const res = await axiosInstance.get(
				`${API_BASE_URL}/forms/pageable?page=${currentPage}&size=${pageSize}`
			);
			if (res.status === 200) {
				setData(res.data?.content);
				setTotalPages(res.data.totalPages);
			}
		} catch (error) {
			console.error("Error fetching forms:", error);
		}
	};

	useEffect(() => {
		fetchData();
	}, [currentPage, pageSize, screenType]);

	const handleFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
		setFilterText(e.target.value);
	};

	const handlePageChange = (page: number) => setCurrentPage(page);

	const handlePageSizeChange = (size: number) => {
		setPageSize(size);
		setCurrentPage(0);
	};

	const handleEditScreen = async (_action: string, _mode: string, id: string) => {
		try {
			const res = await axiosInstance.get(`${API_BASE_URL}/forms/${id}`);
			if (res.status === 200) {
				setForm(res.data);
				setScreenType("edit");
			}
		} catch (error) {
			console.error("Erro ao buscar formulário:", error);
		}
	};

	const handleDeleteSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		try {
			const res = await axiosInstance.delete(`${API_BASE_URL}/forms/${form.id}`);

			if (res.status === 200 || res.status === 201 || res.status === 204) {
				setForm({
					id: "",
					title: "",
					ticketCategory: {} as TicketCategory,
					approvers: [],
					approvalMode: ApprovalModeEnum.AND,
					description: "",
					creator: {} as User,
					fields: [],
				});

				fetchData();
				toast.success("Formulário removido com sucesso!");

				closeModal("modal");
			}
		} catch (error) {
			console.error("Error submitting form:", error);
		}
	};

	return (
		<main>
			<div className="container-xxl">
				{screenType === "view" ? (
					<ActionBar
						delEntityEndPoint={`${API_BASE_URL}/departments`}
						onCreate={() => {
							setScreenType("create");
						}}
						onFilterChange={handleFilterChange}
						filterText={filterText}
						onPageSizeChange={handlePageSizeChange}
						pageSize={pageSize}
						canCreate={true}
						canDelete={false}
					/>
				) : (
					<div className="mt-4 mb-3 container-xxl">
						<button
							className="btn_common"
							onClick={() => {
								setScreenType("view");
							}}
						>
							<FaArrowLeft /> Voltar
						</button>
					</div>
				)}
			</div>
			{screenType === "view" ? (
				<div className="container-xxl">
					<Table
						columns={columns}
						data={data}
						modalID="modal"
						mode="admin"
						filterText={filterText}
						canDelete={true}
						canEdit={true}
						showView={false}
						onDeleteClick={(row) => setForm(row)}
						onEditClick={(row) => handleEditScreen("Editar", "update", row.id)}
					/>
					<Pagination
						currentPage={currentPage}
						totalPages={totalPages}
						onPageChange={handlePageChange}
					/>
				</div>
			) : (
				<div className="row container-fluid ">
					<div className="col-7 pb-5" style={{ height: "80vh", overflowY: "auto" }}>
						<FormBuilder
							screenType={screenType}
							setScreenType={setScreenType}
							form={form}
							setForm={setForm}
						/>
					</div>
					<div className="col-5" style={{ height: "80vh", overflowY: "auto" }}>
						<FormPreview form={form} />
					</div>
				</div>
			)}

			<div className="modal fade" id="modal" tabIndex={-1} aria-hidden="true">
				<div className="modal-dialog">
					<div className="modal-content">
						<div className="modal-header">
							<h1 className="modal-title fs-5">
								Deseja excluir o formulário {form.title} - {form.id}?
							</h1>
							<button
								type="button"
								className="btn-close"
								data-bs-dismiss="modal"
								aria-label="Close"
							></button>
						</div>
						<form onSubmit={handleDeleteSubmit}>
							<div className="modal-footer">
								<button type="submit" className="btn btn-danger">
									Excluir
								</button>
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

export default FormManagement;
