import { useState, useEffect } from "react";
import {
	FaAngleRight,
	FaAngleLeft,
	FaFolderOpen,
	FaClipboardList,
	FaClockRotateLeft,
	FaRegHeart,
} from "react-icons/fa6";

import "../assets/styles/pages/_createticket.scss";
import axiosInstance from "../components/AxiosConfig";
import { TicketCategory } from "../types/TicketCategory";
import { Form } from "../types/Form";
import { DynamicForm } from "../components/DynamicForm";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { defaultProperties, TicketProperties } from "../types/TicketProperties";
import { FaSearch } from "react-icons/fa";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

const CreateTicket: React.FC = () => {
	const [categories, setCategories] = useState<TicketCategory[]>([]);
	const [forms, setForms] = useState<Form[]>([]);
	const [formData, setFormData] = useState<Record<string, any>>({});
	const [categoryPath, setCategoryPath] = useState<TicketCategory[]>([]);
	const [currentForm, setCurrentForm] = useState<Form>({} as Form);
	const [properties, setProperties] = useState<TicketProperties>(defaultProperties);

	const navigate = useNavigate();

	const fetchCategories = async (fatherId: string | null = null) => {
		try {
			const url = fatherId
				? `${API_BASE_URL}/ticket-category/with-form?fatherId=${fatherId}`
				: `${API_BASE_URL}/ticket-category/with-form`;

			const res = await axiosInstance.get(url);
			if (res.status === 200) {
				setCategories(res.data);
			}
		} catch (error) {
			console.error("Erro ao buscar categorias:", error);
		}
	};

	const fetchForms = async (categoryId: string) => {
		try {
			const res = await axiosInstance.get(
				`${API_BASE_URL}/ticket-category/forms/${categoryId}`
			);
			if (res.status === 200) {
				setForms(res.data);
			}
		} catch (error) {
			console.error("Erro ao buscar formulários:", error);
		}
	};

	useEffect(() => {
		fetchCategories(null);
	}, []);

	const handleCategoryClick = (category: TicketCategory) => {
		setCategories([]);
		setForms([]);

		setCategoryPath([...categoryPath, category]);
		fetchCategories(category.id);
		fetchForms(category.id);
		setCurrentForm({} as Form);
	};

	const handleFormClick = (form: Form) => {
		setCurrentForm(form);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const files: { fieldId: number; files: any[] }[] = [];

		const ticketData = {
			formId: currentForm.id,
			responses: [] as { fieldId: number; value: any }[],
			properties: {
				observersId: properties.observers,
				urgency: properties.urgency,
				receiveEmail: properties.receiveEmail,
			},
		};

		Object.entries(formData).forEach(([fieldId, value]) => {
			if (!(value instanceof File) && !(Array.isArray(value) && value[0] instanceof File)) {
				ticketData.responses.push({
					fieldId: Number(fieldId),
					value,
				});
			} else {
				files.push({
					fieldId: Number(fieldId),
					files: Array.isArray(value) ? value : [value],
				});
			}
		});

		try {
			const res = await axiosInstance.post(`${API_BASE_URL}/ticket`, ticketData);

			if (res.status === 200 || res.status === 201) {
				files.length > 0 && handleSubmitFiles(res.data, files);

				toast.success("Ticket criado");
				navigate(`/ticket/${res.data}`);
			}
		} catch (error) {
			toast.error("Erro ao criar ticket");
			console.error(error);
		}
	};

	const handleSubmitFiles = async (
		ticketId: number,
		files: { fieldId: number; files: File[] }[]
	) => {
		const formData = new FormData();

		files.forEach((entry, index) => {
			formData.append(`fileAnswers[${index}].fieldId`, entry.fieldId.toString());
			entry.files.forEach((file: File) => {
				formData.append(`fileAnswers[${index}].files`, file);
			});
		});

		try {
			const res = await axiosInstance.post(
				`${API_BASE_URL}/ticket/${ticketId}/attachments`,
				formData
			);

			if (res.status === 200 || res.status === 201) {
				toast.success("Arquivos enviados!");
			}
		} catch (error) {
			toast.error("Erro ao enviar arquivos");
			console.error(error);
		}
	};

	const handleBack = () => {
		const newPath = [...categoryPath];
		newPath.pop();
		const previous = newPath.length > 0 ? newPath[newPath.length - 1] : null;

		setCategoryPath(newPath);
		fetchCategories(previous?.id ?? null);
		if (previous?.id) {
			fetchForms(previous.id);
		} else {
			setForms([]);
		}

		setCurrentForm({} as Form);
	};

	return (
		<main className="container-fluid">
			<div className="row">
				<div className="categories_box col-3 pt-3 px-4">
					<div className="categories_head d-flex align-items-center">
						{categoryPath.length > 0 ? (
							<button onClick={handleBack} className="btn_none">
								<FaAngleLeft />
								<span className="ms-3">
									{categoryPath[categoryPath.length - 1]?.name}
								</span>
							</button>
						) : (
							<span>Selecione um categoria abaixo</span>
						)}
					</div>

					<ul className="mt-2">
						{forms.map((item) => (
							<li
								key={item.id}
								className={`categories_item${currentForm.id === item.id ? " categories_item_selected" : ""}`}
							>
								<div>
									<a
										onClick={() => handleFormClick(item)}
										className="d-flex align-items-center"
										role="button"
										style={{ cursor: "pointer" }}
									>
										<FaClipboardList />
										<span className="ms-3">{item.title}</span>
									</a>
								</div>
							</li>
						))}
						{categories.map((item) => (
							<li key={item.id} className="categories_item">
								<div>
									<a
										onClick={() => handleCategoryClick(item)}
										className="d-flex align-items-center"
										role="button"
										style={{ cursor: "pointer" }}
									>
										<FaFolderOpen />
										<span className="ms-3">{item.name}</span>
										<FaAngleRight className="ms-auto" />
									</a>
								</div>
							</li>
						))}
					</ul>
				</div>
				<div className="col">
					{currentForm.fields && currentForm.fields.length != 0 ? (
						<DynamicForm
							form={currentForm}
							formData={formData}
							setFormData={setFormData}
							preview={false}
							handleSubmit={handleSubmit}
							properties={properties}
							setProperties={setProperties}
						/>
					) : (
						<div className="d-flex flex-column justify-content-center align-items-center p-4">
							<div className="search_wrapper">
								<input
									type="text"
									className="search_bar"
									placeholder="Pesquisar por ajuda"
								/>
								<FaSearch className="search_icon" />
							</div>
							<div className="forms_shortcut mt-4">
								<div className="shortcut_title">
									<FaClockRotateLeft />
									Recentes
								</div>
								<div className="row justify-content-between g-4 mt-1">
									<div className="shortcut_item col-auto">
										<span>formulario 1</span>
										<p>
											Descrição longa de teste para verificar quebra de linha
											e alinhamento dos itens com wrap.
										</p>
									</div>
									<div className="shortcut_item col-auto">
										<span>formulario 2</span>
										<p>
											Texto exemplo com mais de uma linha para garantir que o
											layout se comporte corretamente.
										</p>
									</div>
									<div className="shortcut_item col-auto">
										<span>formulario 3</span>
										<p>
											Outro texto, vamos ver como isso se adapta em diferentes
											larguras de tela e colunas.
										</p>
									</div>
									<div className="shortcut_item col-auto">
										<span>formulario 4</span>
										<p>
											Mais um formulário com conteúdo, a ideia é forçar o wrap
											no container.
										</p>
									</div>
									<div className="shortcut_item col-auto">
										<span>formulario 5</span>
										<p>
											Testando limites de grid e comportamento do Bootstrap
											com colunas automáticas.
										</p>
									</div>
									<div className="shortcut_item col-auto">
										<span>formulario 6</span>
										<p>
											Verificando se os itens mantêm espaçamento e alinhamento
											ao quebrar linha.
										</p>
									</div>
									<div className="shortcut_item col-auto">
										<span>formulario 7</span>
										<p>
											Será que todos os elementos mantêm altura e padding
											uniforme?
										</p>
									</div>
									<div className="shortcut_item col-auto">
										<span>formulario 8</span>
										<p>
											Simulação realista de conteúdo dentro de cada item do
											grid para layout final.
										</p>
									</div>
									<div className="shortcut_item col-auto">
										<span>formulario 9</span>
										<p>
											Item extra para empurrar o conteúdo para nova linha,
											forçando wrap.
										</p>
									</div>
									<div className="shortcut_item col-auto">
										<span>formulario 10</span>
										<p>
											Visualização responsiva e teste de agrupamento até no
											máximo 3 por linha.
										</p>
									</div>
									<div className="shortcut_item col-auto">
										<span>formulario 11</span>
										<p>
											Item com conteúdo extenso para ver se afeta a
											distribuição ou quebra.
										</p>
									</div>
									<div className="shortcut_item col-auto">
										<span>formulario 12</span>
										<p>
											Último item da lista. Aqui termina a visualização de
											exemplo.
										</p>
									</div>
								</div>
								<div className="shortcut_title mt-5">
									<FaRegHeart />
									Favoritos
								</div>
								<div className="row justify-content-between g-4 mt-1">
									<div className="shortcut_item col-auto">
										<span>formulario 1</span>
										<p>
											Descrição longa de teste para verificar quebra de linha
											e alinhamento dos itens com wrap.
										</p>
									</div>
									<div className="shortcut_item col-auto">
										<span>formulario 2</span>
										<p>
											Texto exemplo com mais de uma linha para garantir que o
											layout se comporte corretamente.
										</p>
									</div>
									<div className="shortcut_item col-auto">
										<span>formulario 3</span>
										<p>
											Outro texto, vamos ver como isso se adapta em diferentes
											larguras de tela e colunas.
										</p>
									</div>
									<div className="shortcut_item col-auto">
										<span>formulario 4</span>
										<p>
											Mais um formulário com conteúdo, a ideia é forçar o wrap
											no container.
										</p>
									</div>
									<div className="shortcut_item col-auto">
										<span>formulario 5</span>
										<p>
											Testando limites de grid e comportamento do Bootstrap
											com colunas automáticas.
										</p>
									</div>
									<div className="shortcut_item col-auto">
										<span>formulario 6</span>
										<p>
											Verificando se os itens mantêm espaçamento e alinhamento
											ao quebrar linha.
										</p>
									</div>
									<div className="shortcut_item col-auto">
										<span>formulario 7</span>
										<p>
											Será que todos os elementos mantêm altura e padding
											uniforme?
										</p>
									</div>
									<div className="shortcut_item col-auto">
										<span>formulario 8</span>
										<p>
											Simulação realista de conteúdo dentro de cada item do
											grid para layout final.
										</p>
									</div>
									<div className="shortcut_item col-auto">
										<span>formulario 9</span>
										<p>
											Item extra para empurrar o conteúdo para nova linha,
											forçando wrap.
										</p>
									</div>
									<div className="shortcut_item col-auto">
										<span>formulario 10</span>
										<p>
											Visualização responsiva e teste de agrupamento até no
											máximo 3 por linha.
										</p>
									</div>
									<div className="shortcut_item col-auto">
										<span>formulario 11</span>
										<p>
											Item com conteúdo extenso para ver se afeta a
											distribuição ou quebra.
										</p>
									</div>
									<div className="shortcut_item col-auto">
										<span>formulario 12</span>
										<p>
											Último item da lista. Aqui termina a visualização de
											exemplo.
										</p>
									</div>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</main>
	);
};

export default CreateTicket;
