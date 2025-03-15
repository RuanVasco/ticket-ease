import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../components/AxiosConfig";
import Header from "../components/Header";
import AttachmentsForm from "../components/AttachmentsForm";
import { FaAngleRight, FaAngleLeft, FaFolderOpen, FaClipboardList, FaPlus } from "react-icons/fa6";
import { v4 as uuidv4 } from "uuid";
import "../assets/styles/create_ticket.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

interface Category {
    id: string;
    name: string;
    path: string;
    father?: { id: string };
    department?: { id: string; name: string };
    receiveTickets?: boolean;
    children: Category[];
}

interface Ticket {
    ticketCategory_id: string;
    name: string;
    description: string;
    observation?: string;
    urgency: string;
    receiveEmail: boolean;
}

const CreateTicket = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState<Category[]>([]);
    const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
    const [categoryPath, setCategoryPath] = useState<Category[]>([]);
    const [category, setCategory] = useState<Category | null>(null);
    const [ticket, setTicket] = useState<Ticket>({
        ticketCategory_id: "",
        name: "",
        description: "",
        observation: "",
        urgency: "Média",
        receiveEmail: false,
    });
    const [attachments, setAttachments] = useState<File[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axiosInstance.get(`${API_BASE_URL}/tickets-category/`);
                if (res.status === 200) {
                    setCategories(res.data);
                } else {
                    console.error("Erro ao buscar categorias:", res.status);
                }
            } catch (error) {
                console.error("Erro ao buscar categorias:", error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (categories.length > 0) {
            const data = organizeData();
            setCurrentCategory(data);
        }
    }, [categories]);

    const organizeData = (): Category => {
        const categoryMap = new Map<string, Category>();
        const departmentMap = new Map<string, Category>();
        let root: Category = { id: "root", name: "Categorias", path: "", children: [] };

        categories.forEach((category) => {
            categoryMap.set(category.id, { ...category, children: [] });
            if (category.department) {
                let departmentId = category.department.id;
                if (!departmentMap.has(departmentId)) {
                    departmentMap.set(departmentId, {
                        ...category.department,
                        path: "",
                        children: [],
                    });
                }
            }
        });

        categories.forEach((category) => {
            if (category.father) {
                let parentCategory = categoryMap.get(category.father.id);
                if (parentCategory) {
                    parentCategory.children.push(categoryMap.get(category.id)!);
                }
            } else {
                if (category.department) {
                    let department = departmentMap.get(category.department.id);
                    if (department) {
                        department.children.push(categoryMap.get(category.id)!);
                    }
                }
            }
        });

        departmentMap.forEach((department) => {
            root.children.push(department);
        });

        return root;
    };

    const handleCategoryClick = (cat: Category) => {
        if (cat.receiveTickets) {
            setCategory(cat);
        }

        if (cat.children.length > 0) {
            setCurrentCategory(cat);
            setCategoryPath([...categoryPath, cat]);
        }
    };

    const handleBack = () => {
        const newPath = [...categoryPath];
        newPath.pop();
        setCurrentCategory(newPath.length > 0 ? newPath[newPath.length - 1] : organizeData());
        setCategoryPath(newPath);
    };

    const renderTreeNavigation = (data: Category) => {
        return (
            <div>
                <div className="nav_forms_cat_head">
                    {categoryPath.length > 0 ? (
                        <button onClick={handleBack} className="nav_forms_cat_btn_back">
                            <FaAngleLeft />
                            <span className="ms-2">
                                {categoryPath[categoryPath.length - 1]?.name}
                            </span>
                        </button>
                    ) : (
                        <span>Departamentos</span>
                    )}
                </div>

                <ul className="mt-2 nav_forms_cat_list">
                    {data.children.map((item) => (
                        <li
                            key={uuidv4()}
                            className={`nav_forms_cat_item${category === item ? " item_selected" : ""}`}
                        >
                            <div>
                                <a
                                    onClick={() => handleCategoryClick(item)}
                                    className="d-flex align-items-center"
                                    role="button"
                                    style={{ cursor: "pointer" }}
                                >
                                    {item.receiveTickets ? <FaClipboardList /> : <FaFolderOpen />}
                                    <span className="ms-2">{item.name}</span>
                                    {item.children.length > 0 && (
                                        <FaAngleRight className="ms-auto" />
                                    )}
                                </a>
                                {currentCategory === item && (
                                    <div>{renderTreeNavigation(item)}</div>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    const handleInputChange = (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const target = event.target as HTMLInputElement;
        const { name, value, type } = target;
        const checked = target.checked;

        setTicket({
            ...ticket,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleFilesChange = (files: File[]) => {
        setAttachments(files);
    };

    const handleSubmitForm = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!category) {
            console.error("Formulário não carregado.");
            return;
        }

        const formData = new FormData();

        const ticketDTO = {
            ticketCategory_id: category.id,
            name: ticket.name,
            description: ticket.description,
            observation: ticket.observation || "",
            urgency: ticket.urgency,
            receiveEmail: ticket.receiveEmail,
        };

        formData.append(
            "ticketInputDTO",
            new Blob([JSON.stringify(ticketDTO)], { type: "application/json" })
        );

        attachments.forEach((file) => formData.append("files", file));

        try {
            const res = await axiosInstance.post(`${API_BASE_URL}/tickets/`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (res.status === 200 || res.status === 201) {
                navigate(`/chamado/${res.data}`);
            } else {
                console.error("Erro:", res.status);
            }
        } catch (error) {
            console.error("Erro ao enviar formulário:", error);
        }
    };

    return (
        <main>
            <Header pageName="Abrir Chamado" />
            <div className="container">
                <div className="row mt-3">
                    <div className="col-3">
                        {currentCategory ? renderTreeNavigation(currentCategory) : null}
                    </div>
                    <div className="col border-start ps-4 form_box">
                        {category ? (
                            <form onSubmit={handleSubmitForm}>
                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label">
                                        Assunto *
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="name"
                                        name="name"
                                        value={ticket.name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="description" className="form-label">
                                        Descrição *
                                    </label>
                                    <textarea
                                        className="form-control"
                                        id="description"
                                        name="description"
                                        rows={3}
                                        value={ticket.description}
                                        onChange={handleInputChange}
                                        required
                                    ></textarea>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="observation" className="form-label">
                                        Observações
                                    </label>
                                    <textarea
                                        className="form-control"
                                        id="observation"
                                        name="observation"
                                        rows={3}
                                        value={ticket.observation}
                                        onChange={handleInputChange}
                                    ></textarea>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="urgency" className="form-label">
                                        Urgência *
                                    </label>
                                    <select
                                        className="form-select"
                                        id="urgency"
                                        name="urgency"
                                        value={ticket.urgency}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="Baixa">Baixa</option>
                                        <option value="Média">Média</option>
                                        <option value="Alta">Alta</option>
                                    </select>
                                </div>
                                <div className="mb-3 form-check">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id="receiveEmail"
                                        name="receiveEmail"
                                        checked={ticket.receiveEmail}
                                        onChange={handleInputChange}
                                    />
                                    <label className="form-check-label" htmlFor="receiveEmail">
                                        Receber E-mail
                                    </label>
                                </div>
                                <label className="form-label">Anexos</label>
                                <AttachmentsForm onFilesChange={handleFilesChange} />
                                <button type="submit" className="btn btn-send mt-3 d-block mx-auto">
                                    <FaPlus /> Enviar
                                </button>
                            </form>
                        ) : (
                            <div>Selecione um formulário</div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
};

export default CreateTicket;
